import { Timestamp } from 'firebase/firestore';

export type PlanType = 'attraction' | 'restaurant' | 'hotel' | 'transport' | 'other';

export interface Plan {
  id: string;
  day: number;
  place_name: string;
  start_time: string;    // HH:mm
  end_time?: string;     // HH:mm
  type: PlanType;
  address?: string;
  rating?: number;       // 0.0~5.0
  memo?: string;
  photos?: string[];     // Firebase Storage URLs
  youtube_link?: string;
  map_url?: string;      // 외부 지도 링크
  latitude?: number;     // 위도 (지도 표시용)
  longitude?: number;    // 경도 (지도 표시용)
  trip_id: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface CreatePlanData {
  day: number;
  place_name: string;
  start_time: string;
  end_time?: string;
  type: PlanType;
  address?: string;
  rating?: number;
  memo?: string;
  photos?: File[];
  youtube_link?: string;
  map_url?: string;
  latitude?: number;
  longitude?: number;
}