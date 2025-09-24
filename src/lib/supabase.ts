import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Database types
export interface User {
  id: string
  whatsapp_number: string
  google_oauth_token: {
    access_token: string
    refresh_token: string
    expires_at: number
  }
  created_at: string
}

export interface Event {
  id: string
  user_id: string
  whatsapp_number: string
  title: string
  description?: string
  start_date: string
  end_date: string
  location?: string
  calendar_event_id?: string
  invitees?: string[]
  created_at: string
  updated_at: string
}
