/*
  # Complete ExpertConnect Database Schema

  1. New Tables
    - `profiles` - User profile information
    - `expert_profiles` - Expert-specific data and credentials
    - `categories` - Service categories for organization
    - `services` - Expert services and offerings
    - `availability` - Expert availability schedules
    - `bookings` - Session bookings and appointments
    - `payments` - Payment transactions and records
    - `reviews` - Client reviews and ratings
    - `messages` - Communication between users
    - `digital_products` - Digital content and downloads
    - `notifications` - System notifications
    - `admin_settings` - Platform configuration

  2. Security
    - Enable RLS on all tables
    - Comprehensive policies for data access
    - Role-based permissions

  3. Performance
    - Strategic indexes for query optimization
    - Automatic timestamp updates
*/

-- Create custom types (only if they don't exist)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'expert', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'rescheduled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE service_type AS ENUM ('1on1', 'package', 'webinar', 'digital');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('booking', 'payment', 'message', 'review', 'system');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  avatar_url text,
  role user_role DEFAULT 'user',
  bio text,
  location text,
  timezone text DEFAULT 'UTC',
  phone text,
  is_verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create expert_profiles table
CREATE TABLE IF NOT EXISTS expert_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  expertise_areas text[],
  years_experience integer DEFAULT 0,
  hourly_rate numeric(10,2) DEFAULT 0,
  currency text DEFAULT 'USD',
  response_time_hours integer DEFAULT 24,
  languages text[] DEFAULT ARRAY['English'],
  education text,
  certifications text[],
  website_url text,
  linkedin_url text,
  twitter_url text,
  is_featured boolean DEFAULT false,
  is_approved boolean DEFAULT false,
  total_sessions integer DEFAULT 0,
  total_earnings numeric(12,2) DEFAULT 0,
  average_rating numeric(3,2) DEFAULT 0,
  total_reviews integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  icon text,
  color text DEFAULT '#3B82F6',
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id uuid REFERENCES expert_profiles(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id),
  name text NOT NULL,
  description text,
  service_type service_type NOT NULL,
  duration_minutes integer,
  price numeric(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  max_participants integer DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create availability table
CREATE TABLE IF NOT EXISTS availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id uuid REFERENCES expert_profiles(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  expert_id uuid REFERENCES expert_profiles(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer NOT NULL,
  status booking_status DEFAULT 'pending',
  total_amount numeric(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  meeting_url text,
  client_notes text,
  expert_notes text,
  cancellation_reason text,
  rescheduled_from uuid REFERENCES bookings(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  payer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  payment_method text,
  cashfree_order_id text,
  cashfree_payment_id text,
  status payment_status DEFAULT 'pending',
  platform_fee numeric(10,2) DEFAULT 0,
  expert_earnings numeric(10,2) NOT NULL,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  reviewer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  expert_id uuid REFERENCES expert_profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  subject text,
  content text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create digital_products table
CREATE TABLE IF NOT EXISTS digital_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id uuid REFERENCES expert_profiles(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id),
  title text NOT NULL,
  description text,
  content_type text,
  file_url text,
  preview_url text,
  price numeric(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  download_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create admin_settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  updated_by uuid REFERENCES profiles(id),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_expert_profiles_profile_id ON expert_profiles(profile_id);
CREATE INDEX IF NOT EXISTS idx_expert_profiles_featured ON expert_profiles(is_featured);
CREATE INDEX IF NOT EXISTS idx_services_expert_id ON services(expert_id);
CREATE INDEX IF NOT EXISTS idx_services_category_id ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_bookings_client_id ON bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_expert_id ON bookings(expert_id);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_at ON bookings(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_reviews_expert_id ON reviews(expert_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- Add triggers for updated_at columns (only if they don't exist)
DO $$ BEGIN
    CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TRIGGER update_expert_profiles_updated_at BEFORE UPDATE ON expert_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TRIGGER update_digital_products_updated_at BEFORE UPDATE ON digital_products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (with IF NOT EXISTS equivalent using DO blocks)

-- Profiles policies
DO $$ BEGIN
    CREATE POLICY "Users can read all profiles" ON profiles FOR SELECT TO authenticated USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Expert profiles policies
DO $$ BEGIN
    CREATE POLICY "Anyone can read approved expert profiles" ON expert_profiles FOR SELECT TO authenticated USING (is_approved = true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Experts can manage own profile" ON expert_profiles FOR ALL TO authenticated USING (
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = expert_profiles.profile_id 
        AND profiles.user_id = auth.uid()
      )
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Categories policies
DO $$ BEGIN
    CREATE POLICY "Anyone can read active categories" ON categories FOR SELECT TO authenticated USING (is_active = true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Services policies
DO $$ BEGIN
    CREATE POLICY "Anyone can read active services" ON services FOR SELECT TO authenticated USING (is_active = true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Experts can manage own services" ON services FOR ALL TO authenticated USING (
      EXISTS (
        SELECT 1 FROM expert_profiles ep
        JOIN profiles p ON p.id = ep.profile_id
        WHERE ep.id = services.expert_id 
        AND p.user_id = auth.uid()
      )
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Availability policies
DO $$ BEGIN
    CREATE POLICY "Anyone can read availability" ON availability FOR SELECT TO authenticated USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Experts can manage own availability" ON availability FOR ALL TO authenticated USING (
      EXISTS (
        SELECT 1 FROM expert_profiles ep
        JOIN profiles p ON p.id = ep.profile_id
        WHERE ep.id = availability.expert_id 
        AND p.user_id = auth.uid()
      )
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Bookings policies
DO $$ BEGIN
    CREATE POLICY "Users can read own bookings" ON bookings FOR SELECT TO authenticated USING (
      EXISTS (
        SELECT 1 FROM profiles p1 
        WHERE p1.id = bookings.client_id 
        AND p1.user_id = auth.uid()
      ) OR EXISTS (
        SELECT 1 FROM expert_profiles ep
        JOIN profiles p2 ON p2.id = ep.profile_id
        WHERE ep.id = bookings.expert_id 
        AND p2.user_id = auth.uid()
      )
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can create bookings" ON bookings FOR INSERT TO authenticated WITH CHECK (
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = bookings.client_id 
        AND profiles.user_id = auth.uid()
      )
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update own bookings" ON bookings FOR UPDATE TO authenticated USING (
      EXISTS (
        SELECT 1 FROM profiles p1 
        WHERE p1.id = bookings.client_id 
        AND p1.user_id = auth.uid()
      ) OR EXISTS (
        SELECT 1 FROM expert_profiles ep
        JOIN profiles p2 ON p2.id = ep.profile_id
        WHERE ep.id = bookings.expert_id 
        AND p2.user_id = auth.uid()
      )
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Payments policies
DO $$ BEGIN
    CREATE POLICY "Users can read own payments" ON payments FOR SELECT TO authenticated USING (
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE (profiles.id = payments.payer_id OR profiles.id = payments.recipient_id)
        AND profiles.user_id = auth.uid()
      )
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Reviews policies
DO $$ BEGIN
    CREATE POLICY "Anyone can read public reviews" ON reviews FOR SELECT TO authenticated USING (is_public = true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can create reviews for their bookings" ON reviews FOR INSERT TO authenticated WITH CHECK (
      EXISTS (
        SELECT 1 FROM bookings b
        JOIN profiles p ON p.id = b.client_id
        WHERE b.id = reviews.booking_id 
        AND p.user_id = auth.uid()
        AND b.status = 'completed'
      )
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Messages policies
DO $$ BEGIN
    CREATE POLICY "Users can read own messages" ON messages FOR SELECT TO authenticated USING (
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE (profiles.id = messages.sender_id OR profiles.id = messages.recipient_id)
        AND profiles.user_id = auth.uid()
      )
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can send messages" ON messages FOR INSERT TO authenticated WITH CHECK (
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = messages.sender_id 
        AND profiles.user_id = auth.uid()
      )
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Digital products policies
DO $$ BEGIN
    CREATE POLICY "Anyone can read active digital products" ON digital_products FOR SELECT TO authenticated USING (is_active = true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Experts can manage own digital products" ON digital_products FOR ALL TO authenticated USING (
      EXISTS (
        SELECT 1 FROM expert_profiles ep
        JOIN profiles p ON p.id = ep.profile_id
        WHERE ep.id = digital_products.expert_id 
        AND p.user_id = auth.uid()
      )
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Notifications policies
DO $$ BEGIN
    CREATE POLICY "Users can read own notifications" ON notifications FOR SELECT TO authenticated USING (
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = notifications.user_id 
        AND profiles.user_id = auth.uid()
      )
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE TO authenticated USING (
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = notifications.user_id 
        AND profiles.user_id = auth.uid()
      )
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Admin settings policies
DO $$ BEGIN
    CREATE POLICY "Only admins can manage settings" ON admin_settings FOR ALL TO authenticated USING (
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.user_id = auth.uid() 
        AND profiles.role = 'admin'
      )
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Insert sample data

-- Insert categories
INSERT INTO categories (name, description, icon, color, sort_order) VALUES
('Product Management', 'Product strategy, roadmaps, and user research', 'Package', '#3B82F6', 1),
('Design', 'UI/UX design, design systems, and user experience', 'Palette', '#8B5CF6', 2),
('Marketing', 'Digital marketing, growth strategies, and brand building', 'TrendingUp', '#10B981', 3),
('Technology', 'Software development, architecture, and technical leadership', 'Code', '#F59E0B', 4),
('Business', 'Strategy, operations, and entrepreneurship', 'Briefcase', '#EF4444', 5),
('Finance', 'Financial planning, investment, and business finance', 'DollarSign', '#6366F1', 6)
ON CONFLICT (name) DO NOTHING;

-- Insert sample admin settings
INSERT INTO admin_settings (key, value, description) VALUES
('platform_fee_percentage', '10', 'Platform fee percentage for transactions'),
('min_booking_hours', '24', 'Minimum hours before booking can be made'),
('max_cancellation_hours', '24', 'Maximum hours before session for free cancellation'),
('default_session_duration', '60', 'Default session duration in minutes')
ON CONFLICT (key) DO NOTHING;