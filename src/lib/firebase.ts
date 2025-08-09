// Firebase v9+ SDK
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { getPerformance } from 'firebase/performance';

// Firebase 설정 객체
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Firebase 서비스 초기화
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Analytics 및 Performance 초기화 (브라우저 환경에서만)
export let analytics: ReturnType<typeof getAnalytics> | null = null;
export let performance: ReturnType<typeof getPerformance> | null = null;

if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
    performance = getPerformance(app);
    console.log('📊 Firebase Analytics & Performance 초기화됨');
  } catch (error) {
    console.warn('⚠️ Analytics/Performance 초기화 실패:', error);
  }
}

// 개발 환경에서 Firebase Emulator 사용 (선택사항) - 현재 비활성화
// if (import.meta.env.VITE_APP_ENV === 'development' && import.meta.env.DEV) {
//   // Emulator 연결 (한 번만 실행)
//   if (!auth.config.emulator) {
//     try {
//       connectAuthEmulator(auth, 'http://localhost:9099');
//       connectFirestoreEmulator(db, 'localhost', 8080);
//       connectStorageEmulator(storage, 'localhost', 9199);
//       console.log('🔧 Firebase Emulator 연결됨');
//     } catch (error) {
//       console.log('⚠️ Firebase Emulator 연결 실패 (이미 연결되어 있을 수 있음)');
//     }
//   }
// }

export default app;