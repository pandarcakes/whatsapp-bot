export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            WhatsApp Event Bot
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Send event images to your WhatsApp bot and it will automatically extract event details, 
            confirm with you, and create Google Calendar events.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your WhatsApp Bot Number</h2>
          <p className="text-3xl font-bold text-green-600 mb-4">+6580407448</p>
          <p className="text-gray-600">Send a message to this number to get started!</p>
        </div>

        <div className="space-y-4">
          <a 
            href="/test"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors mr-4"
          >
            Test Page
          </a>
          <a 
            href="/dashboard?phone=1234567890"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Dashboard
          </a>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Environment Status:</p>
          <p>Supabase: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌'}</p>
          <p>Gemini AI: {process.env.GEMINI_API_KEY ? '✅' : '❌'}</p>
          <p>WhatsApp: {process.env.WHATSAPP_ACCESS_TOKEN ? '✅' : '❌'}</p>
        </div>
      </div>
    </div>
  )
}