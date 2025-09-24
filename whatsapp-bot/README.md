# WhatsApp Event Bot

A multi-user WhatsApp bot that extracts event details from images using OCR + AI, confirms details with the user, and creates Google Calendar events with optional invites.

## Features

- 🤖 **AI-Powered Extraction**: Uses Gemini 2.5 Flash to extract event details from images
- 📅 **Google Calendar Integration**: Creates events directly in your Google Calendar
- 👥 **Multi-user Support**: Each WhatsApp user can link their own Google account
- ✏️ **Event Editing**: Review and modify extracted details before creating events
- 📧 **Invite Management**: Add Gmail addresses as event invitees
- 📊 **Audit Trail**: All confirmed events are stored in Supabase for history

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Google OAuth 2.0
- **AI/OCR**: Google Gemini 2.5 Flash
- **Calendar**: Google Calendar API
- **WhatsApp**: WhatsApp Business API

## Prerequisites

Before setting up the bot, you'll need:

1. **Supabase Account**: Create a project at [supabase.com](https://supabase.com)
2. **Google Cloud Console**: Set up OAuth and Calendar API
3. **WhatsApp Business Account**: Get access to WhatsApp Business API
4. **Gemini API Key**: Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd whatsapp-bot
npm install
```

### 2. Environment Variables

Copy `.env.local` and fill in your credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# Google Calendar API
GOOGLE_CALENDAR_API_KEY=your_google_calendar_api_key

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key

# WhatsApp Webhook Configuration
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_PHONE_NUMBER_ID=your_whatsapp_phone_number_id

# App Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

### 3. Database Setup

Run the SQL schema in your Supabase SQL editor:

```sql
-- Copy and paste the contents of supabase-schema.sql
```

### 4. Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google Calendar API and Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/api/auth/google/callback`
5. Get your Client ID and Client Secret

### 5. WhatsApp Business Setup

1. Set up WhatsApp Business Account
2. Get your Phone Number ID and Access Token
3. Configure webhook URL: `https://yourdomain.com/api/webhook/whatsapp`
4. Set webhook verify token

### 6. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

### For End Users

1. **First Time Setup**: Send any message to the WhatsApp bot
2. **Authentication**: Click the Google OAuth link to link your calendar
3. **Send Event Image**: Send an image of an event invitation
4. **Review Details**: Check the extracted event information
5. **Confirm or Edit**: Reply with "CONFIRM" or "EDIT" commands
6. **Event Created**: The event will be added to your Google Calendar

### WhatsApp Commands

- Send event image → Extract details automatically
- Reply "CONFIRM" → Create the calendar event
- Reply "CANCEL" → Cancel the event creation
- Reply "EDIT" → Get instructions for editing details
- Reply "HELP" → Show available commands

### Editing Event Details

Send messages like:
- "Change title to: [New Title]"
- "Change time to: [New Time]"
- "Add location: [Location]"
- "Add description: [Description]"

## API Endpoints

- `GET /api/webhook/whatsapp` - WhatsApp webhook verification
- `POST /api/webhook/whatsapp` - WhatsApp webhook handler
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - OAuth callback handler

## Database Schema

### Users Table
- `id`: UUID primary key
- `whatsapp_number`: Unique WhatsApp phone number
- `google_oauth_token`: JSONB with OAuth tokens
- `created_at`, `updated_at`: Timestamps

### Events Table
- `id`: UUID primary key
- `user_id`: Foreign key to users table
- `whatsapp_number`: WhatsApp phone number
- `title`, `description`: Event details
- `start_date`, `end_date`: Event timing
- `location`: Event location
- `calendar_event_id`: Google Calendar event ID
- `invitees`: Array of email addresses
- `created_at`, `updated_at`: Timestamps

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Update these URLs for production:
- `GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback`
- `NEXTAUTH_URL=https://yourdomain.com`
- WhatsApp webhook URL: `https://yourdomain.com/api/webhook/whatsapp`

## Security Considerations

- All API keys are stored as environment variables
- Row Level Security (RLS) is enabled on Supabase tables
- OAuth tokens are encrypted and stored securely
- WhatsApp webhook verification prevents unauthorized access

## Troubleshooting

### Common Issues

1. **OAuth Error**: Check redirect URI matches exactly
2. **Calendar API Error**: Ensure Calendar API is enabled
3. **WhatsApp Webhook Error**: Verify webhook URL and tokens
4. **Image Processing Error**: Check Gemini API key and quotas

### Debug Mode

Set `NODE_ENV=development` to enable detailed error logging.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details