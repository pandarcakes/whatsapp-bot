#!/bin/bash

# WhatsApp Webhook Test Script
# This script helps test the WhatsApp webhook setup

echo "🤖 WhatsApp Event Bot - Webhook Test"
echo "=================================="

# Check if environment variables are set
if [ -z "$WHATSAPP_WEBHOOK_VERIFY_TOKEN" ]; then
    echo "❌ WHATSAPP_WEBHOOK_VERIFY_TOKEN not set in environment"
    echo "Please set it in your .env.local file"
    exit 1
fi

# Test webhook verification
echo "Testing webhook verification..."
WEBHOOK_URL="http://localhost:3000/api/webhook/whatsapp"
VERIFY_TOKEN="$WHATSAPP_WEBHOOK_VERIFY_TOKEN"
CHALLENGE="test-challenge-123"

curl -X GET \
  "$WEBHOOK_URL?hub.mode=subscribe&hub.verify_token=$VERIFY_TOKEN&hub.challenge=$CHALLENGE" \
  -H "Content-Type: application/json"

echo ""
echo "✅ Webhook test completed!"
echo ""
echo "Next steps:"
echo "1. Make sure your WhatsApp Business API webhook is configured to:"
echo "   URL: $WEBHOOK_URL"
echo "   Verify Token: $VERIFY_TOKEN"
echo "2. Start your Next.js server: npm run dev"
echo "3. Send a test message to your WhatsApp bot"
