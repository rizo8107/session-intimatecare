-- Supabase Seed Script
-- This script creates the necessary tables and populates them with mock data.

-- 1. Custom Types
CREATE TYPE public.user_role AS ENUM ('user', 'expert', 'admin');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'rescheduled');
CREATE TYPE public.payment_status AS ENUM ('pending', 'succeeded', 'failed', 'refunded');
CREATE TYPE public.notification_type AS ENUM ('booking_request', 'booking_confirmed', 'booking_cancelled', 'review_received', 'message_received', 'payment_processed');
CREATE TYPE public.service_type AS ENUM ('one_on_one', 'group_session', 'webinar');

-- 2. Tables

-- Profiles Table (Users & Experts)
CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE, -- Can be nullable if profile is created before auth user
  email text NOT NULL UNIQUE,
  full_name text NOT NULL,
  avatar_url text,
  role user_role DEFAULT 'user'::user_role,
  bio text,
  location text,
  timezone text DEFAULT 'UTC'::text,
  phone text,
  is_verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Categories Table
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  icon text,
  color text DEFAULT '#3B82F6'::text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);

-- Expert Profiles Table
CREATE TABLE public.expert_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  profile_id uuid UNIQUE NOT NULL,
  title text NOT NULL,
  expertise_areas uuid[],
  years_experience integer DEFAULT 0,
  hourly_rate numeric DEFAULT 0,
  currency text DEFAULT 'USD'::text,
  response_time_hours integer DEFAULT 24,
  languages text[] DEFAULT ARRAY['English'::text],
  education text,
  certifications text[],
  website_url text,
  linkedin_url text,
  twitter_url text,
  is_featured boolean DEFAULT false,
  is_approved boolean DEFAULT true,
  total_sessions integer DEFAULT 0,
  total_earnings numeric DEFAULT 0,
  average_rating numeric DEFAULT 0,
  total_reviews integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT expert_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT expert_profiles_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Services Table
CREATE TABLE public.services (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  expert_id uuid NOT NULL,
  category_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  service_type service_type NOT NULL,
  duration_minutes integer,
  price numeric NOT NULL,
  currency text DEFAULT 'USD'::text,
  max_participants integer DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT services_pkey PRIMARY KEY (id),
  CONSTRAINT services_expert_id_fkey FOREIGN KEY (expert_id) REFERENCES public.expert_profiles(id) ON DELETE CASCADE,
  CONSTRAINT services_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id)
);

-- Bookings Table
CREATE TABLE public.bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  expert_id uuid NOT NULL,
  service_id uuid NOT NULL,
  scheduled_at timestamp with time zone NOT NULL,
  duration_minutes integer NOT NULL,
  status booking_status DEFAULT 'pending'::booking_status,
  total_amount numeric NOT NULL,
  currency text DEFAULT 'USD'::text,
  meeting_url text,
  client_notes text,
  expert_notes text,
  cancellation_reason text,
  rescheduled_from uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT bookings_pkey PRIMARY KEY (id),
  CONSTRAINT bookings_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT bookings_expert_id_fkey FOREIGN KEY (expert_id) REFERENCES public.expert_profiles(id) ON DELETE CASCADE,
  CONSTRAINT bookings_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE,
  CONSTRAINT bookings_rescheduled_from_fkey FOREIGN KEY (rescheduled_from) REFERENCES public.bookings(id) ON DELETE SET NULL
);

-- Reviews Table
CREATE TABLE public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL UNIQUE,
  reviewer_id uuid NOT NULL,
  expert_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  is_public boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE,
  CONSTRAINT reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT reviews_expert_id_fkey FOREIGN KEY (expert_id) REFERENCES public.expert_profiles(id) ON DELETE CASCADE
);

-- 3. Mock Data

-- Declare variables for IDs to use in subsequent inserts
DO $$
DECLARE
  cat_tech_id uuid;
  cat_marketing_id uuid;
  cat_finance_id uuid;
  user1_id uuid;
  user2_id uuid;
  expert1_id uuid;
  expert2_id uuid;
  expert1_profile_id uuid;
  expert2_profile_id uuid;
  service1_id uuid;
  service2_id uuid;
  booking1_id uuid;
BEGIN

-- Insert Categories
INSERT INTO public.categories (name, description, icon, color, sort_order) VALUES
('Technology', 'Software development, architecture, and more.', 'Code', '#1F2937', 1),
('Marketing', 'Digital marketing, growth strategies, and branding.', 'TrendingUp', '#DC2626', 2),
('Finance', 'Financial planning, investment, and business finance.', 'DollarSign', '#16A34A', 3)
RETURNING id INTO cat_tech_id, cat_marketing_id, cat_finance_id;

-- Insert Profiles (Users)
INSERT INTO public.profiles (email, full_name, role, bio)
VALUES ('user1@example.com', 'Alex Johnson', 'user', 'A passionate learner exploring new technologies.'),
       ('user2@example.com', 'Maria Garcia', 'user', 'Startup founder looking for marketing advice.')
RETURNING id INTO user1_id, user2_id;

-- Insert Profiles (Experts)
INSERT INTO public.profiles (email, full_name, role, bio, is_verified)
VALUES ('expert.jane@example.com', 'Dr. Jane Doe', 'expert', '20+ years in software engineering, specializing in scalable systems.', true),
       ('expert.john@example.com', 'John Smith', 'expert', 'Growth marketer with a track record of scaling startups to millions of users.', true)
RETURNING id INTO expert1_id, expert2_id;

-- Insert Expert Profiles
INSERT INTO public.expert_profiles (profile_id, title, expertise_areas, years_experience, hourly_rate, average_rating, total_reviews)
VALUES (expert1_id, 'Principal Software Engineer', ARRAY[cat_tech_id], 15, 250, 4.9, 85),
       (expert2_id, 'Head of Growth Marketing', ARRAY[cat_marketing_id], 10, 200, 4.8, 120)
RETURNING id INTO expert1_profile_id, expert2_profile_id;

-- Insert Services
INSERT INTO public.services (expert_id, category_id, name, description, service_type, duration_minutes, price)
VALUES (expert1_profile_id, cat_tech_id, 'System Architecture Review', 'In-depth review of your system architecture.', 'one_on_one', 90, 375),
       (expert2_profile_id, cat_marketing_id, 'Marketing Strategy Session', 'A session to define your growth marketing strategy.', 'one_on_one', 60, 200)
RETURNING id INTO service1_id, service2_id;

-- Insert Bookings
INSERT INTO public.bookings (client_id, expert_id, service_id, scheduled_at, duration_minutes, status, total_amount)
VALUES (user1_id, expert1_profile_id, service1_id, NOW() + INTERVAL '3 days', 90, 'confirmed', 375)
RETURNING id INTO booking1_id;

-- Insert Reviews
INSERT INTO public.reviews (booking_id, reviewer_id, expert_id, rating, comment)
VALUES (booking1_id, user1_id, expert1_profile_id, 5, 'Jane was incredibly insightful. Her feedback on our architecture was invaluable!');

END $$;
