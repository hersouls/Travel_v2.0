import { Timestamp } from 'firebase/firestore';
import { PlanType } from './plan';

export interface Place {
  id: string;
  name: string;
  type: PlanType;
  address?: string;
  rating?: number;       // 0.0~5.0
  map_url?: string;
  memo?: string;
  latitude?: number;     // 위도 (지도 표시용)
  longitude?: number;    // 경도 (지도 표시용)
  favorite: boolean;     // 즐겨찾기 여부
  usage_count: number;   // 사용 횟수
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface CreatePlaceData {
  name: string;
  type: PlanType;
  address?: string;
  rating?: number;
  map_url?: string;
  memo?: string;
  latitude?: number;
  longitude?: number;
}