# WhatsApp Event Bot - Setup Guide

## Quick Start Checklist

### ✅ 1. Project Setup
- [x] Next.js 15 project created with TypeScript and Tailwind
- [x] All dependencies installed
- [x] Environment variables template created

### 🔧 2. Required Services Setup

#### Supabase Setup
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to Settings → API to get your project URL and anon key
3. Go to Settings → Database to get your service role key
4. Run the SQL schema from `supabase-schema.sql` in the SQL editor

#### Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable these APIs:
   - Google Calendar API
   - Google+ API
4. Create OAuth 2.0 credentials:
   - Go to Credentials → Create Credentials → OAuth 2.0 Client ID
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/api/auth/google/callback`
5. Get your Client ID and Client Secret

#### Gemini AI Setup
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the API key

#### WhatsApp Business Setup
1. Set up WhatsApp Business Account
2. Get your Phone Number ID and Access Token
3. Configure webhook URL: `https://yourdomain.com/api/webhook/whatsapp`
4. Set webhook verify token (use a secure random string)

### 🔑 3. Environment Variables

Update your `.env.local` file with real values:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# Google Calendar API
GOOGLE_CALENDAR_API_KEY=your_google_calendar_api_key

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key

# WhatsApp Webhook Configuration
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_secure_random_token
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_PHONE_NUMBER_ID=your_whatsapp_phone_number_id

# App Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

### 🚀 4. Run the Application

```bash
# Start development server
npm run dev

# Test webhook (optional)
./test-webhook.sh
```

### 🧪 5. Testing

1. **Test Webhook**: Visit `http://localhost:3000/api/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=test`
2. **Test OAuth**: Visit `http://localhost:3000/api/auth/google?phone=1234567890`
3. **Test Dashboard**: Visit `http://localhost:3000/dashboard?phone=1234567890`

### 📱 6. WhatsApp Bot Usage

1. Send any message to your WhatsApp bot
2. Bot will respond with Google OAuth link
3. Complete authentication
4. Send event invitation images
5. Review and confirm extracted details
6. Event gets created in Google Calendar

### 🔍 7. Troubleshooting

#### Common Issues:

**OAuth Error**: 
- Check redirect URI matches exactly
- Ensure Google+ API is enabled
- Verify client ID and secret

**Calendar API Error**:
- Enable Google Calendar API
- Check API quotas
- Verify OAuth scopes

**WhatsApp Webhook Error**:
- Verify webhook URL is accessible
- Check verify token matches
- Ensure HTTPS in production

**Image Processing Error**:
- Check Gemini API key
- Verify API quotas
- Test with different image formats

#### Debug Commands:

```bash
# Check TypeScript types
npm run type-check

# Fix linting issues
npm run lint:fix

# Test webhook locally
npm run test:webhook
```

### 🌐 8. Production Deployment

#### Vercel Deployment:
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Update URLs for production:
   - `GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback`
   - `NEXTAUTH_URL=https://yourdomain.com`
   - WhatsApp webhook: `https://yourdomain.com/api/webhook/whatsapp`

#### Environment Variables for Production:
- Use production Supabase URL
- Use production Google OAuth redirect URI
- Use production WhatsApp webhook URL
- Generate secure random tokens

### 📊 9. Monitoring

- Check Supabase dashboard for user and event data
- Monitor Google Cloud Console for API usage
- Check WhatsApp Business API logs
- Review application logs for errors

### 🔒 10. Security Checklist

- [ ] All API keys stored as environment variables
- [ ] Row Level Security enabled on Supabase tables
- [ ] OAuth tokens encrypted and stored securely
- [ ] WhatsApp webhook verification implemented
- [ ] HTTPS enabled in production
- [ ] Input validation on all endpoints
- [ ] Rate limiting implemented (recommended)

### 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review application logs
3. Verify all environment variables are set correctly
4. Test each service individually
5. Check API quotas and limits

---

**Happy coding! 🎉**
