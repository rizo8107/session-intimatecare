export interface Profile {
  id: string;
  updated_at?: string | null;
  username?: string | null;
  full_name?: string;
  avatar_url?: string | null;
  website?: string | null;
  role?: 'expert' | 'user' | 'admin' | null;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
}

export interface Service {
  id: string;
  expert_id: string;
  category_id: string;
  name: string;
  description?: string | null;
  price: number;
  duration_minutes: number;
  service_type: '1on1' | 'package' | 'webinar' | 'digital';
  category?: Category;
  currency?: string | null;
  is_active?: boolean;
  created_at?: string;
}

export interface Review {
  id: string;
  booking_id: string;
  reviewer_id: string;
  expert_id: string;
  rating: number;
  comment?: string | null;
  created_at: string;
  reviewer?: Profile;
}

export interface Availability {
  id: string;
  expert_id: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
  created_at: string;
}

export interface Expert {
  id: string;
  title: string;
  profile: Profile | null;
  services: Service[];
  reviews: Review[];
  availability: Availability[];
  is_featured: boolean | null;
  is_approved: boolean | null;
}

export interface Booking {
  id: string;
  client_id: string;
  expert_id: string;
  service_id: string;
  availability_id: string;
  scheduled_at?: string;
  duration_minutes: number;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled' | null;
  total_amount?: number;
  payment_intent_id?: string | null;
  created_at?: string;
  client?: Profile;
  expert?: Expert;
  service?: Service;
}

export interface Message {
  id: string;
  booking_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  link?: string | null;
}

export interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  expert_earnings: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  provider: 'stripe' | 'paypal' | string;
  transaction_id: string;
  created_at: string;
}
