export default async function AuthSuccessPage({ searchParams }: { searchParams: Promise<{ phone?: string }> }) {
  const params = await searchParams
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Successful!</h1>
          <p className="text-gray-600">
            Your WhatsApp number {params.phone} has been successfully linked to Google Calendar.
          </p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-green-800 mb-2">What's Next?</h2>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Send event images to your WhatsApp bot</li>
            <li>• Review extracted event details</li>
            <li>• Confirm to create calendar events</li>
            <li>• Add invitees to your events</li>
          </ul>
        </div>
        
        <div className="text-sm text-gray-500">
          You can now close this window and return to WhatsApp to start using the bot.
        </div>
      </div>
    </div>
  )
}
