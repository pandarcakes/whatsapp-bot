-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for storing WhatsApp users and their Google OAuth tokens
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_number TEXT UNIQUE NOT NULL,
  google_oauth_token JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table for storing confirmed/created events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  whatsapp_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  calendar_event_id TEXT,
  invitees TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_whatsapp_number ON users(whatsapp_number);
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_whatsapp_number ON events(whatsapp_number);
CREATE INDEX idx_events_start_date ON events(start_date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (whatsapp_number = current_setting('app.current_whatsapp_number', true));

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (whatsapp_number = current_setting('app.current_whatsapp_number', true));

CREATE POLICY "Users can insert their own data" ON users
    FOR INSERT WITH CHECK (whatsapp_number = current_setting('app.current_whatsapp_number', true));

-- Create policies for events table
CREATE POLICY "Users can view their own events" ON events
    FOR SELECT USING (whatsapp_number = current_setting('app.current_whatsapp_number', true));

CREATE POLICY "Users can insert their own events" ON events
    FOR INSERT WITH CHECK (whatsapp_number = current_setting('app.current_whatsapp_number', true));

CREATE POLICY "Users can update their own events" ON events
    FOR UPDATE USING (whatsapp_number = current_setting('app.current_whatsapp_number', true));

CREATE POLICY "Users can delete their own events" ON events
    FOR DELETE USING (whatsapp_number = current_setting('app.current_whatsapp_number', true));
