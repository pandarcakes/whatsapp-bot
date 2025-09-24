import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { extractEventDetailsFromImage } from '@/lib/gemini-ai'
import { refreshAccessToken } from '@/lib/google-auth'
import sharp from 'sharp'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }

  return new NextResponse('Forbidden', { status: 403 })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Handle WhatsApp webhook events
    if (body.object === 'whatsapp_business_account') {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.field === 'messages') {
            await handleMessages(change.value)
          }
        }
      }
    }

    return new NextResponse('OK', { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return new NextResponse('Error', { status: 500 })
  }
}

async function handleMessages(value: any) {
  const messages = value.messages || []
  
  for (const message of messages) {
    const phoneNumber = message.from
    const messageType = message.type
    
    if (messageType === 'image') {
      await handleImageMessage(phoneNumber, message)
    } else if (messageType === 'text') {
      await handleTextMessage(phoneNumber, message)
    }
  }
}

async function handleImageMessage(phoneNumber: string, message: any) {
  try {
    // Get image from WhatsApp
    const imageUrl = message.image.id
    const imageResponse = await fetch(
      `https://graph.facebook.com/v18.0/${imageUrl}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`
        }
      }
    )
    
    if (!imageResponse.ok) {
      throw new Error('Failed to fetch image')
    }
    
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer())
    
    // Process image with Sharp to optimize
    const processedImage = await sharp(imageBuffer)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer()
    
    // Extract event details using Gemini
    const eventDetails = await extractEventDetailsFromImage(processedImage)
    
    // Check if user exists and has Google OAuth
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('whatsapp_number', phoneNumber)
      .single()
    
    if (!user) {
      await sendWhatsAppMessage(phoneNumber, 
        "Welcome! To use this bot, you need to authenticate with Google Calendar. Please visit: " + 
        `${process.env.NEXTAUTH_URL}/auth/google?phone=${phoneNumber}`
      )
      return
    }
    
    // Check if tokens are expired and refresh if needed
    let tokens = user.google_oauth_token
    if (tokens.expires_at < Date.now()) {
      tokens = await refreshAccessToken(tokens.refresh_token)
      
      // Update tokens in database
      await supabaseAdmin
        .from('users')
        .update({ google_oauth_token: tokens })
        .eq('whatsapp_number', phoneNumber)
    }
    
    // Store pending event for user confirmation
    const { data: pendingEvent } = await supabaseAdmin
      .from('events')
      .insert({
        user_id: user.id,
        whatsapp_number: phoneNumber,
        title: eventDetails.title,
        description: eventDetails.description,
        start_date: eventDetails.startDate,
        end_date: eventDetails.endDate,
        location: eventDetails.location,
        calendar_event_id: null // Will be set after confirmation
      })
      .select()
      .single()
    
    // Send confirmation message with event details
    const confirmationMessage = `
📅 *Event Details Extracted:*

*Title:* ${eventDetails.title}
*Date:* ${new Date(eventDetails.startDate).toLocaleDateString()}
*Time:* ${new Date(eventDetails.startDate).toLocaleTimeString()} - ${new Date(eventDetails.endDate).toLocaleTimeString()}
*Location:* ${eventDetails.location || 'Not specified'}
*Description:* ${eventDetails.description || 'None'}

*Confidence:* ${Math.round(eventDetails.confidence * 100)}%

Reply with:
✅ *CONFIRM* - to create the event
❌ *CANCEL* - to cancel
✏️ *EDIT* - to modify details

Or send specific changes like:
"Change title to: New Event Name"
"Change time to: 2:00 PM"
"Add location: Conference Room A"
    `
    
    await sendWhatsAppMessage(phoneNumber, confirmationMessage)
    
  } catch (error) {
    console.error('Error handling image message:', error)
    await sendWhatsAppMessage(phoneNumber, 
      "Sorry, I couldn't process the image. Please try again with a clearer image of an event invitation."
    )
  }
}

async function handleTextMessage(phoneNumber: string, message: any) {
  const text = message.text.body.toLowerCase().trim()
  
  if (text === 'confirm' || text === '✅ confirm') {
    await confirmEvent(phoneNumber)
  } else if (text === 'cancel' || text === '❌ cancel') {
    await cancelEvent(phoneNumber)
  } else if (text === 'edit' || text === '✏️ edit') {
    await sendEditInstructions(phoneNumber)
  } else if (text.startsWith('change') || text.startsWith('add')) {
    await handleEventEdit(phoneNumber, message.text.body)
  } else {
    await sendHelpMessage(phoneNumber)
  }
}

async function confirmEvent(phoneNumber: string) {
  try {
    // Get the most recent pending event
    const { data: event } = await supabaseAdmin
      .from('events')
      .select('*')
      .eq('whatsapp_number', phoneNumber)
      .is('calendar_event_id', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    if (!event) {
      await sendWhatsAppMessage(phoneNumber, "No pending event found. Please send an image first.")
      return
    }
    
    // Get user tokens
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('google_oauth_token')
      .eq('whatsapp_number', phoneNumber)
      .single()
    
    if (!user) {
      await sendWhatsAppMessage(phoneNumber, "User not found. Please authenticate first.")
      return
    }
    
    // Create Google Calendar event
    const { createCalendarEvent } = await import('@/lib/google-auth')
    const calendarEvent = await createCalendarEvent(user.google_oauth_token, {
      title: event.title,
      description: event.description,
      startDate: event.start_date,
      endDate: event.end_date,
      location: event.location,
      invitees: event.invitees
    })
    
    // Update event with calendar ID
    await supabaseAdmin
      .from('events')
      .update({ calendar_event_id: calendarEvent.id })
      .eq('id', event.id)
    
    await sendWhatsAppMessage(phoneNumber, 
      `✅ Event created successfully! Calendar event ID: ${calendarEvent.id}`
    )
    
  } catch (error) {
    console.error('Error confirming event:', error)
    await sendWhatsAppMessage(phoneNumber, 
      "Sorry, I couldn't create the calendar event. Please try again."
    )
  }
}

async function cancelEvent(phoneNumber: string) {
  // Delete the most recent pending event
  await supabaseAdmin
    .from('events')
    .delete()
    .eq('whatsapp_number', phoneNumber)
    .is('calendar_event_id', null)
  
  await sendWhatsAppMessage(phoneNumber, "Event cancelled. Send another image to create a new event.")
}

async function sendEditInstructions(phoneNumber: string) {
  const message = `
✏️ *How to edit event details:*

Send messages like:
• "Change title to: [New Title]"
• "Change time to: [New Time]"
• "Change date to: [New Date]"
• "Add location: [Location]"
• "Add description: [Description]"

When done editing, reply with *CONFIRM* to create the event.
  `
  
  await sendWhatsAppMessage(phoneNumber, message)
}

async function handleEventEdit(phoneNumber: string, editText: string) {
  // This would implement the edit logic
  // For now, just acknowledge the edit request
  await sendWhatsAppMessage(phoneNumber, 
    "Edit functionality coming soon! For now, please send a new image with the corrected details."
  )
}

async function sendHelpMessage(phoneNumber: string) {
  const message = `
🤖 *WhatsApp Event Bot Help*

*How to use:*
1. Send an image of an event invitation
2. Review the extracted details
3. Reply with *CONFIRM* to create the event

*Commands:*
• *CONFIRM* - Create the event
• *CANCEL* - Cancel the event
• *EDIT* - Modify event details
• *HELP* - Show this message

*Requirements:*
You need to authenticate with Google Calendar first.
  `
  
  await sendWhatsAppMessage(phoneNumber, message)
}

async function sendWhatsAppMessage(phoneNumber: string, message: string) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type: 'text',
          text: { body: message }
        })
      }
    )
    
    if (!response.ok) {
      console.error('Failed to send WhatsApp message:', await response.text())
    }
  } catch (error) {
    console.error('Error sending WhatsApp message:', error)
  }
}
