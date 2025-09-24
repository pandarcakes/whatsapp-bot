import { NextRequest, NextResponse } from 'next/server'
import { oauth2Client } from '@/lib/google-auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const phone = searchParams.get('phone')
    const state = searchParams.get('state')
    
    if (!code || !phone) {
      return NextResponse.redirect(new URL('/auth/error?message=Missing parameters', request.url))
    }
    
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code)
    
    if (!tokens.access_token || !tokens.refresh_token) {
      return NextResponse.redirect(new URL('/auth/error?message=Failed to get tokens', request.url))
    }
    
    // Store tokens in database
    const { error } = await supabaseAdmin
      .from('users')
      .upsert({
        whatsapp_number: phone,
        google_oauth_token: {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: tokens.expiry_date || Date.now() + 3600000
        }
      })
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.redirect(new URL('/auth/error?message=Database error', request.url))
    }
    
    // Redirect to success page
    return NextResponse.redirect(new URL(`/auth/success?phone=${phone}`, request.url))
    
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(new URL('/auth/error?message=Authentication failed', request.url))
  }
}
