import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  profileService,
  expertService,
  serviceService,
  bookingService,
  reviewService,
  categoryService,
  messageService,
  notificationService,
  paymentService,
  availabilityService,
} from '../services/database';
import {
  Profile,
  Expert,
  Service,
  Booking,
  Review,
  Category,
  Message,
  Notification,
  Availability,
  Payment,
} from '../types/database';

// --- Generic Hook Factory ---
const useDataFetching = <T, P>(fetcher: (params: P) => Promise<T>, params: P, enabled = true) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const result = await fetcher(params);
      setData(result);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params), fetcher, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// --- Hooks ---
export const useProfile = (id?: string) => useDataFetching(profileService.getProfile, id, !!id);
export const useExperts = (filters?: any) => useDataFetching(expertService.getExperts, filters);
export const useExpert = (id?: string) => useDataFetching(expertService.getExpert, id, !!id);
export const useServices = (expertId?: string) => useDataFetching(serviceService.getServices, expertId, !!expertId);
export const useBookings = (userId?: string) => {
  const { data, loading, error, refetch } = useDataFetching(bookingService.getBookingsForUser, userId, !!userId);
  
  const { mutate: createBooking, loading: creating } = useMutation(bookingService.createBooking);
  const { mutate: updateBooking, loading: updating } = useMutation((params: { id: string; updates: Partial<Booking> }) => bookingService.updateBooking(params.id, params.updates));

  return {
    data,
    loading,
    error,
    refetch,
    createBooking,
    updateBooking,
    loadingCreate: creating,
    loadingUpdate: updating,
  };
};
export const useReviews = (expertId?: string) => useDataFetching(reviewService.getReviewsForExpert, expertId, !!expertId);
export const useCategories = () => useDataFetching(categoryService.getCategories, undefined);
export const useMessages = (bookingId?: string) => useDataFetching(messageService.getMessages, bookingId, !!bookingId);
export const useNotifications = (userId?: string) => useDataFetching(notificationService.getNotifications, userId, !!userId);
export const useAvailability = (expertId?: string) => useDataFetching(availabilityService.getAvailability, expertId, !!expertId);

// Auth Hook
export const useAuth = () => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const data = await profileService.getProfile(userId);
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

    const signUp = async (email: string, password: string, userData: { full_name: string; role: 'user' | 'expert' }) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (data.user) {
      // This is a temporary solution until createProfile is added back to profileService
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id, // Ensure the profile ID matches the user ID
        user_id: data.user.id,
        email,
        full_name: userData.full_name,
        role: userData.role,
      });
      if (profileError) throw profileError;
    }
    return data;
  };

  const signIn = (email: string, password: string) => supabase.auth.signInWithPassword({ email, password });
  const signOut = () => supabase.auth.signOut();

  return { user, profile, loading, signUp, signIn, signOut };
};

// Mutation Hooks
const useMutation = <T, P>(mutator: (params: P) => Promise<T>) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (params: P) => {
    try {
      setLoading(true);
      const result = await mutator(params);
      setError(null);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
};

export const useCreateService = () => useMutation(serviceService.createService);
export const useUpdateService = () => useMutation((params: { id: string; updates: Partial<Service> }) => serviceService.updateService(params.id, params.updates));
export const useDeleteService = () => useMutation(serviceService.deleteService);



export const useCreateReview = () => useMutation(reviewService.createReview);

export const useCreateMessage = () => useMutation(messageService.createMessage);

export const useUpdateProfile = () => useMutation((params: { id: string; updates: Partial<Profile> }) => profileService.updateProfile(params.id, params.updates));

export const useMarkNotificationAsRead = () => useMutation(notificationService.markAsRead);

export const useCreatePayment = () => useMutation(paymentService.createPayment);
export const useUpdatePayment = () => useMutation((params: { id: string; updates: Partial<Payment> }) => paymentService.updatePayment(params.id, params.updates));

export const useSearchExperts = () => useMutation(expertService.searchExperts);