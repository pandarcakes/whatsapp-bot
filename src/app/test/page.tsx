export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">WhatsApp Bot Test Page</h1>
          <p className="text-gray-600">
            If you can see this page, your Vercel deployment is working!
          </p>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Environment Check:</h3>
            <p className="text-sm text-gray-600">
              Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
            </p>
            <p className="text-sm text-gray-600">
              Gemini API: {process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Missing'}
            </p>
            <p className="text-sm text-gray-600">
              WhatsApp Token: {process.env.WHATSAPP_ACCESS_TOKEN ? '✅ Set' : '❌ Missing'}
            </p>
          </div>
          <a 
            href="/api/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=whatsapp_bot_secure_token_2024&hub.challenge=test123"
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Test Webhook
          </a>
        </div>
      </div>
    </div>
  )
}
