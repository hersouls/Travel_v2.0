import { Timestamp } from 'firebase/firestore';

export interface Trip {
  id: string;
  user_id: string;
  title: string;
  country: string;
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
  cover_image?: string; // Firebase Storage URL
  plans_count?: number;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface CreateTripData {
  title: string;
  country: string;
  start_date: string;
  end_date: string;
  cover_file?: File | null;
}