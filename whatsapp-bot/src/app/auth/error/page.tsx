export default async function AuthErrorPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const params = await searchParams
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h1>
          <p className="text-gray-600 mb-4">
            {params.message || 'An error occurred during authentication.'}
          </p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-red-800 mb-2">What to do:</h2>
          <ul className="text-sm text-red-700 space-y-1">
            <li>• Make sure you granted all required permissions</li>
            <li>• Try the authentication process again</li>
            <li>• Contact support if the problem persists</li>
          </ul>
        </div>
        
        <button 
          onClick={() => window.close()}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
        >
          Close Window
        </button>
      </div>
    </div>
  )
}
