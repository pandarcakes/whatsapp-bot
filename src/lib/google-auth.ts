import { GoogleAuth } from 'google-auth-library'
import { google } from 'googleapis'

export const googleAuth = new GoogleAuth({
  credentials: {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET
  }
})

export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
)

export const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

export interface GoogleTokens {
  access_token: string
  refresh_token: string
  expires_at: number
}

export async function refreshAccessToken(refreshToken: string): Promise<GoogleTokens> {
  oauth2Client.setCredentials({
    refresh_token: refreshToken
  })

  const { credentials } = await oauth2Client.refreshAccessToken()
  
  return {
    access_token: credentials.access_token!,
    refresh_token: credentials.refresh_token || refreshToken,
    expires_at: credentials.expiry_date!
  }
}

export async function createCalendarEvent(
  tokens: GoogleTokens,
  eventDetails: {
    title: string
    description?: string
    startDate: string
    endDate: string
    location?: string
    invitees?: string[]
  }
) {
  oauth2Client.setCredentials({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token
  })

  const event = {
    summary: eventDetails.title,
    description: eventDetails.description,
    start: {
      dateTime: eventDetails.startDate,
      timeZone: 'UTC'
    },
    end: {
      dateTime: eventDetails.endDate,
      timeZone: 'UTC'
    },
    location: eventDetails.location,
    attendees: eventDetails.invitees?.map(email => ({ email }))
  }

  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event
  })

  return response.data
}
