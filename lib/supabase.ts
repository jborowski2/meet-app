import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Meeting = {
  id: string;
  unique_link: string;
  title: string;
  description: string;
  organizer_name: string;
  created_at: string;
  updated_at: string;
};

export type TimeOption = {
  id: string;
  meeting_id: string;
  datetime: string;
  created_at: string;
};

export type LocationOption = {
  id: string;
  meeting_id: string;
  location: string;
  created_at: string;
};

export type Vote = {
  id: string;
  meeting_id: string;
  participant_name: string;
  time_option_id: string | null;
  location_option_id: string | null;
  vote_type: 'yes' | 'no' | 'maybe';
  created_at: string;
  updated_at: string;
};
