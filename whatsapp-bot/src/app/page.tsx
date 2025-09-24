export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            WhatsApp Event Bot
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform event images into Google Calendar events with AI-powered extraction
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered Extraction</h2>
            <p className="text-gray-600">
              Send event invitation images to WhatsApp and our AI will automatically extract:
              event title, date, time, location, and description.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Google Calendar Integration</h2>
            <p className="text-gray-600">
              Seamlessly create events in your Google Calendar with optional invitees.
              All events are stored for audit and history tracking.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Authenticate</h3>
              <p className="text-sm text-gray-600">
                Link your WhatsApp number with Google Calendar via OAuth
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Send Image</h3>
              <p className="text-sm text-gray-600">
                Send event invitation images to your WhatsApp bot
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Review & Edit</h3>
              <p className="text-sm text-gray-600">
                Review extracted details and make any necessary edits
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Create Event</h3>
              <p className="text-sm text-gray-600">
                Confirm to create the event in your Google Calendar
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg shadow-lg p-8 text-white text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
          <p className="mb-6">
            Send an image of an event invitation to your WhatsApp bot to begin!
          </p>
          <div className="bg-white/20 rounded-lg p-4 text-left max-w-md mx-auto">
            <h3 className="font-semibold mb-2">WhatsApp Commands:</h3>
            <ul className="text-sm space-y-1">
              <li>• Send event image → Extract details</li>
              <li>• Reply "CONFIRM" → Create event</li>
              <li>• Reply "CANCEL" → Cancel event</li>
              <li>• Reply "EDIT" → Modify details</li>
              <li>• Reply "HELP" → Show commands</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}