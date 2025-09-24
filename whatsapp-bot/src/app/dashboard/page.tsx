'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Event } from '@/lib/supabase'

export default function DashboardPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [phoneNumber, setPhoneNumber] = useState('')

  useEffect(() => {
    // Get phone number from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search)
    const phone = urlParams.get('phone') || localStorage.getItem('whatsapp_phone') || ''
    setPhoneNumber(phone)
    
    if (phone) {
      fetchEvents(phone)
    }
  }, [])

  const fetchEvents = async (phone: string) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('whatsapp_number', phone)
        .order('start_date', { ascending: false })
        .limit(20)

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Dashboard</h1>
          <p className="text-gray-600">
            WhatsApp: {phoneNumber || 'Not specified'}
          </p>
        </div>

        {events.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Events Yet</h2>
            <p className="text-gray-600 mb-4">
              Send event images to your WhatsApp bot to get started!
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-blue-800 mb-2">How to use:</h3>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. Send an image of an event invitation to your WhatsApp bot</li>
                <li>2. Review the extracted event details</li>
                <li>3. Reply with "CONFIRM" to create the calendar event</li>
                <li>4. Your events will appear here</li>
              </ol>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Events ({events.length})
            </h2>
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.calendar_event_id 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {event.calendar_event_id ? 'Created' : 'Pending'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Start:</span>
                    <p className="text-gray-600">{formatDate(event.start_date)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">End:</span>
                    <p className="text-gray-600">{formatDate(event.end_date)}</p>
                  </div>
                  {event.location && (
                    <div>
                      <span className="font-medium text-gray-700">Location:</span>
                      <p className="text-gray-600">{event.location}</p>
                    </div>
                  )}
                  {event.invitees && event.invitees.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-700">Invitees:</span>
                      <p className="text-gray-600">{event.invitees.join(', ')}</p>
                    </div>
                  )}
                </div>
                
                {event.description && (
                  <div className="mt-3">
                    <span className="font-medium text-gray-700">Description:</span>
                    <p className="text-gray-600 mt-1">{event.description}</p>
                  </div>
                )}
                
                {event.calendar_event_id && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <span className="text-xs text-gray-500">
                      Calendar ID: {event.calendar_event_id}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
