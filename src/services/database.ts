import { supabase } from '../lib/supabase';
import { Profile, Expert, Service, Booking, Review, Category, Message, Notification, Payment, Availability } from '../types/database';

// Helper to handle Supabase query errors
const handleSupabaseError = (error: any, context: string) => {
  if (error) {
    console.error(`Error in ${context}:`, error);
    throw new Error(`Supabase error in ${context}: ${error.message}`);
  }
};

// Generic fetch function
const fetchData = async <T>(query: any, context: string): Promise<T> => {
  const { data, error } = await query;
  handleSupabaseError(error, context);
  return data as T;
};

// Profile Service
export const profileService = {
  async getProfile(id: string): Promise<Profile | null> {
    return fetchData(supabase.from('profiles').select('*').eq('id', id).single(), 'getProfile');
  },
  async updateProfile(id: string, updates: Partial<Profile>): Promise<Profile[]> {
    return fetchData(supabase.from('profiles').update(updates).eq('id', id).select(), 'updateProfile');
  },
};

// Expert Service
export const expertService = {
  async getExperts(filters?: any): Promise<Expert[]> {
    let query = supabase.from('expert_profiles').select(`
      id, title, is_featured, is_approved,
      profile:profiles(*),
      services(*, category:categories(*)),
      reviews(*, reviewer:profiles(*)),
      availability(*)
    `);

    if (filters?.featured) {
      query = query.eq('is_featured', true);
    }
    if (filters?.approved) {
      query = query.eq('is_approved', true);
    }

    return fetchData(query, 'getExperts');
  },

  async getExpert(id: string): Promise<Expert | null> {
    return fetchData(supabase.from('expert_profiles').select(`
      id, title, is_featured, is_approved,
      profile:profiles(*),
      services(*, category:categories(*)),
      reviews(*, reviewer:profiles(*)),
      availability(*)
    `).eq('id', id).single(), 'getExpert');
  },

  async searchExperts(searchTerm: string): Promise<Expert[]> {
    return fetchData(supabase.from('expert_profiles').select(`
      id, title, is_featured, is_approved,
      profile:profiles(*),
      services(*, category:categories(*)),
      reviews(*, reviewer:profiles(*)),
      availability(*)
    `).ilike('title', `%${searchTerm}%`), 'searchExperts');
  },
};

// Service Service
export const serviceService = {
  async getServices(expertId: string): Promise<Service[]> {
    return fetchData(supabase.from('services').select('*, category:categories(*)').eq('expert_id', expertId), 'getServices');
  },

  async getService(id: string): Promise<Service | null> {
    return fetchData(supabase.from('services').select('*, category:categories(*)').eq('id', id).single(), 'getService');
  },

  async createService(serviceData: Partial<Service>): Promise<Service[]> {
    return fetchData(supabase.from('services').insert([serviceData]).select(), 'createService');
  },

  async updateService(id: string, updates: Partial<Service>): Promise<Service[]> {
    return fetchData(supabase.from('services').update(updates).eq('id', id).select(), 'updateService');
  },

  async deleteService(id: string): Promise<void> {
    const { error } = await supabase.from('services').delete().eq('id', id);
    handleSupabaseError(error, 'deleteService');
  },
};

// Booking Service
export const bookingService = {
  async getBookingsForUser(userId: string): Promise<Booking[]> {
    return fetchData(supabase.from('bookings').select(`
      *,
      client:profiles(*),
      expert:experts(*, profile:profiles(*)),
      service:services(*, category:categories(*))
    `).eq('client_id', userId), 'getBookingsForUser');
  },

  async getBooking(id: string): Promise<Booking | null> {
    return fetchData(supabase.from('bookings').select(`
      *,
      client:profiles(*),
      expert:experts(*, profile:profiles(*)),
      service:services(*, category:categories(*))
    `).eq('id', id).single(), 'getBooking');
  },

  async createBooking(bookingData: Partial<Booking>): Promise<Booking[]> {
    return fetchData(supabase.from('bookings').insert([bookingData]).select(), 'createBooking');
  },

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking[]> {
    return fetchData(supabase.from('bookings').update(updates).eq('id', id).select(), 'updateBooking');
  },
};

// Payment Service
export const paymentService = {
    async getPayment(bookingId: string): Promise<Payment | null> {
        return fetchData(supabase.from('payments').select('*').eq('booking_id', bookingId).single(), 'getPayment');
    },

    async createPayment(paymentData: Partial<Payment>): Promise<Payment[]> {
        return fetchData(supabase.from('payments').insert([paymentData]).select(), 'createPayment');
    },

    async updatePayment(id: string, updates: Partial<Payment>): Promise<Payment[]> {
        return fetchData(supabase.from('payments').update(updates).eq('id', id).select(), 'updatePayment');
    },
};

// Review Service
export const reviewService = {
  async getReviewsForExpert(expertId: string): Promise<Review[]> {
    return fetchData(supabase.from('reviews').select('*, reviewer:profiles(*)').eq('expert_id', expertId), 'getReviewsForExpert');
  },

  async createReview(reviewData: Partial<Review>): Promise<Review[]> {
    return fetchData(supabase.from('reviews').insert([reviewData]).select(), 'createReview');
  },
};

// Category Service
export const categoryService = {
  async getCategories(): Promise<Category[]> {
    return fetchData(supabase.from('categories').select('*'), 'getCategories');
  },
};

// Message Service
export const messageService = {
  async getMessages(bookingId: string): Promise<Message[]> {
    return fetchData(supabase.from('messages').select('*').eq('booking_id', bookingId).order('created_at'), 'getMessages');
  },

  async createMessage(messageData: Partial<Message>): Promise<Message[]> {
    return fetchData(supabase.from('messages').insert([messageData]).select(), 'createMessage');
  },
};

// Notification Service
export const notificationService = {
  async getNotifications(userId: string): Promise<Notification[]> {
    return fetchData(supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }), 'getNotifications');
  },

  async markAsRead(notificationId: string): Promise<Notification[]> {
    return fetchData(supabase.from('notifications').update({ is_read: true }).eq('id', notificationId).select(), 'markAsRead');
  },
};

// Availability Service
export const availabilityService = {
  async getAvailability(expertId: string): Promise<Availability[]> {
    return fetchData(supabase.from('availability').select('*').eq('expert_id', expertId), 'getAvailability');
  },
};