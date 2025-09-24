import { NextRequest, NextResponse } from 'next/server'
import { oauth2Client } from '@/lib/google-auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get('phone')
    
    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
    }
    
    // Generate OAuth URL
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
      ],
      state: phone,
      prompt: 'consent'
    })
    
    return NextResponse.redirect(authUrl)
    
  } catch (error) {
    console.error('OAuth initiation error:', error)
    return NextResponse.json({ error: 'Failed to initiate OAuth' }, { status: 500 })
  }
}
