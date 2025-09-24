import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export interface ExtractedEventDetails {
  title: string
  description?: string
  startDate: string
  endDate: string
  location?: string
  confidence: number
}

export async function extractEventDetailsFromImage(imageBuffer: Buffer): Promise<ExtractedEventDetails> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
  
  // Convert buffer to base64
  const base64Image = imageBuffer.toString('base64')
  
  const prompt = `
    Analyze this image and extract event details. Look for:
    - Event title/name
    - Date and time (start and end)
    - Location/venue
    - Description or additional details
    
    Return the information in this exact JSON format:
    {
      "title": "Event title",
      "description": "Event description if available",
      "startDate": "2024-01-01T10:00:00Z",
      "endDate": "2024-01-01T12:00:00Z",
      "location": "Event location if available",
      "confidence": 0.95
    }
    
    Use ISO 8601 format for dates. If no end time is specified, assume 2 hours duration.
    Confidence should be between 0 and 1 based on how clear the information is.
    If any field is not found, use null or empty string.
  `

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: 'image/jpeg'
        }
      }
    ])

    const response = await result.response
    const text = response.text()
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response')
    }
    
    const extractedData = JSON.parse(jsonMatch[0])
    
    // Validate and clean the data
    return {
      title: extractedData.title || 'Untitled Event',
      description: extractedData.description || '',
      startDate: extractedData.startDate || new Date().toISOString(),
      endDate: extractedData.endDate || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      location: extractedData.location || '',
      confidence: Math.max(0, Math.min(1, extractedData.confidence || 0.5))
    }
  } catch (error) {
    console.error('Error extracting event details:', error)
    throw new Error('Failed to extract event details from image')
  }
}

export async function validateEventDetails(details: ExtractedEventDetails): Promise<boolean> {
  // Basic validation
  if (!details.title || details.title.trim().length === 0) {
    return false
  }
  
  if (!details.startDate || !details.endDate) {
    return false
  }
  
  const startDate = new Date(details.startDate)
  const endDate = new Date(details.endDate)
  
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return false
  }
  
  if (startDate >= endDate) {
    return false
  }
  
  return true
}
