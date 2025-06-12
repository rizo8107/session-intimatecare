import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const auth = supabase.auth;

// Database helpers
export const db = supabase;

// Helper function to get current user profile
export const getCurrentUserProfile = async () => {
  const { data: { user } } = await auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return profile;
};

// Helper function to get expert profile
export const getExpertProfile = async (profileId: string) => {
  const { data } = await supabase
    .from('expert_profiles')
    .select(`
      *,
      profile:profiles(*),
      services(
        *,
        category:categories(*)
      )
    `)
    .eq('profile_id', profileId)
    .single();

  return data;
};