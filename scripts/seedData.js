import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { config } from 'dotenv';
config();

const USER_ID = 'f3NaO0zcLNWLJ7iSAFdKrEStRDx2';

// Firebase 설정
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 샘플 데이터
const sampleTrips = [
  {
    title: '제주도 힐링 여행',
    description: '아름다운 제주의 자연을 만끽하는 3박 4일 힐링 여행',
    start_date: new Date('2024-03-15'),
    end_date: new Date('2024-03-18'),
    cover_image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800',
    status: 'completed',
    user_id: USER_ID,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now()
  },
  {
    title: '도쿄 벚꽃 여행',
    description: '봄의 도쿄에서 벚꽃과 함께하는 로맨틱한 5일간의 여행',
    start_date: new Date('2024-04-05'),
    end_date: new Date('2024-04-09'),
    cover_image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
    status: 'completed',
    user_id: USER_ID,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now()
  },
  {
    title: '부산 바다 여행',
    description: '시원한 바닷바람과 함께하는 부산 2박 3일 여행',
    start_date: new Date('2024-05-20'),
    end_date: new Date('2024-05-22'),
    cover_image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    status: 'ongoing',
    user_id: USER_ID,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now()
  },
  {
    title: '강원도 산악 트레킹',
    description: '설악산과 속초의 자연을 만끽하는 트레킹 여행',
    start_date: new Date('2024-06-10'),
    end_date: new Date('2024-06-13'),
    cover_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    status: 'planned',
    user_id: USER_ID,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now()
  },
  {
    title: '오사카 미식 탐방',
    description: '오사카의 맛있는 음식을 찾아 떠나는 미식 여행',
    start_date: new Date('2024-07-01'),
    end_date: new Date('2024-07-04'),
    cover_image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800',
    status: 'planned',
    user_id: USER_ID,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now()
  },
  {
    title: '경주 역사 문화 여행',
    description: '천년 고도 경주의 역사와 문화를 체험하는 여행',
    start_date: new Date('2024-08-15'),
    end_date: new Date('2024-08-17'),
    cover_image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    status: 'planned',
    user_id: USER_ID,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now()
  },
  {
    title: '전주 한옥마을 여행',
    description: '전통 한옥마을에서의 특별한 하루',
    start_date: new Date('2024-09-05'),
    end_date: new Date('2024-09-06'),
    cover_image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    status: 'planned',
    user_id: USER_ID,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now()
  },
  {
    title: '태국 방콕 & 파타야',
    description: '동남아의 매력을 만끽하는 방콕과 파타야 7일 여행',
    start_date: new Date('2024-10-10'),
    end_date: new Date('2024-10-16'),
    cover_image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800',
    status: 'planned',
    user_id: USER_ID,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now()
  },
  {
    title: '유럽 3개국 배낭여행',
    description: '프랑스, 독일, 체코를 도는 배낭여행',
    start_date: new Date('2024-11-01'),
    end_date: new Date('2024-11-14'),
    cover_image: 'https://images.unsplash.com/photo-1520637836862-4d197d17c15a?w=800',
    status: 'planned',
    user_id: USER_ID,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now()
  },
  {
    title: '홍콩 & 마카오 여행',
    description: '동양과 서양이 만나는 홍콩과 마카오 4일 여행',
    start_date: new Date('2024-12-20'),
    end_date: new Date('2024-12-23'),
    cover_image: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=800',
    status: 'planned',
    user_id: USER_ID,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now()
  }
];

const samplePlaces = [
  {
    name: '경복궁',
    category: 'attraction',
    address: '서울특별시 종로구 사직로 161',
    rating: 4.6,
    memo: '조선 왕조의 정궁, 수문장 교대식 볼거리',
    is_favorite: true,
    usage_count: 3,
    latitude: 37.5796,
    longitude: 126.9770,
    user_id: USER_ID,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now()
  },
  {
    name: '명동 교자',
    category: 'restaurant',
    address: '서울특별시 중구 명동10길 29',
    rating: 4.4,
    memo: '명동의 유명한 만두 전문점',
    is_favorite: true,
    usage_count: 2,
    latitude: 37.5636,
    longitude: 126.9834,
    user_id: USER_ID,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now()
  },
  {
    name: '부산 해운대',
    category: 'attraction',
    address: '부산광역시 해운대구 해운대해변로 264',
    rating: 4.5,
    memo: '부산의 대표적인 해수욕장',
    is_favorite: true,
    usage_count: 2,
    latitude: 35.1587,
    longitude: 129.1603,
    user_id: USER_ID,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now()
  },
  {
    name: '롯데월드타워',
    category: 'attraction',
    address: '서울특별시 송파구 올림픽로 300',
    rating: 4.3,
    memo: '서울의 랜드마크, 스카이데크 전망대',
    is_favorite: false,
    usage_count: 1,
    latitude: 37.5125,
    longitude: 127.1025,
    user_id: USER_ID,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now()
  },
  {
    name: '여의도 한강공원',
    category: 'attraction',
    address: '서울특별시 영등포구 여의동로 330',
    rating: 4.2,
    memo: '한강에서 즐기는 피크닉과 야경',
    is_favorite: false,
    usage_count: 1,
    latitude: 37.5279,
    longitude: 126.9349,
    user_id: USER_ID,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now()
  },
  {
    name: '홍대 걸거리',
    category: 'attraction',
    address: '서울특별시 마포구 와우산로',
    rating: 4.1,
    memo: '젊음의 거리, 다양한 클럽과 카페',
    is_favorite: false,
    usage_count: 2,
    latitude: 37.5563,
    longitude: 126.9236,
    user_id: USER_ID,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now()
  },
  {
    name: '광장시장',
    category: 'restaurant',
    address: '서울특별시 종로구 창경궁로 88',
    rating: 4.4,
    memo: '전통 시장의 다양한 먹거리',
    is_favorite: true,
    usage_count: 1,
    latitude: 37.5707,
    longitude: 126.9996,
    user_id: USER_ID,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now()
  },
  {
    name: '남산 서울타워',
    category: 'attraction',
    address: '서울특별시 용산구 남산공원길 105',
    rating: 4.3,
    memo: '서울 시내 전망을 한눈에',
    is_favorite: false,
    usage_count: 1,
    latitude: 37.5512,
    longitude: 126.9882,
    user_id: USER_ID,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now()
  },
  {
    name: '인사동 쌈지길',
    category: 'attraction',
    address: '서울특별시 종로구 인사동길 44',
    rating: 4.2,
    memo: '전통과 현대가 공존하는 문화거리',
    is_favorite: false,
    usage_count: 1,
    latitude: 37.5717,
    longitude: 126.9856,
    user_id: USER_ID,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now()
  },
  {
    name: '강남역 지하상가',
    category: 'other',
    address: '서울특별시 강남구 강남대로 지하',
    rating: 3.9,
    memo: '쇼핑과 먹거리가 풍부한 지하상가',
    is_favorite: false,
    usage_count: 1,
    latitude: 37.4979,
    longitude: 127.0276,
    user_id: USER_ID,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now()
  }
];

async function seedData() {
  try {
    console.log('🔄 Firebase에 샘플 데이터 추가 시작...');
    
    // 1. Trips 데이터 추가
    console.log('📝 Trips 컬렉션 추가 중...');
    const tripIds = [];
    for (let i = 0; i < sampleTrips.length; i++) {
      const docRef = await addDoc(collection(db, 'trips'), sampleTrips[i]);
      tripIds.push(docRef.id);
      console.log(`✅ Trip ${i+1}/10: ${sampleTrips[i].title} (ID: ${docRef.id})`);
    }
    
    // 2. Places 데이터 추가
    console.log('📍 Places 컬렉션 추가 중...');
    for (let i = 0; i < samplePlaces.length; i++) {
      const docRef = await addDoc(collection(db, 'places'), samplePlaces[i]);
      console.log(`✅ Place ${i+1}/10: ${samplePlaces[i].name} (ID: ${docRef.id})`);
    }
    
    // 3. Plans 데이터 추가 (첫 번째 trip에 대한 계획들)
    console.log('📋 Plans 컬렉션 추가 중...');
    const samplePlans = [
      {
        day: 1,
        place_name: '제주공항',
        start_time: '10:00',
        end_time: '11:00',
        type: 'transport',
        address: '제주특별자치도 제주시 공항로 2',
        rating: 4.0,
        memo: '항공편 도착 후 렌터카 픽업',
        trip_id: tripIds[0],
        user_id: USER_ID,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now()
      },
      {
        day: 1,
        place_name: '성산일출봉',
        start_time: '14:00',
        end_time: '16:00',
        type: 'attraction',
        address: '제주특별자치도 서귀포시 성산읍 일출로 284-12',
        rating: 4.8,
        memo: '일출봉 등반 및 경관 감상',
        latitude: 33.4603,
        longitude: 126.9420,
        trip_id: tripIds[0],
        created_at: Timestamp.now(),
        updated_at: Timestamp.now()
      },
      {
        day: 1,
        place_name: '섭지코지',
        start_time: '16:30',
        end_time: '18:00',
        type: 'attraction',
        address: '제주특별자치도 서귀포시 성산읍 고성리',
        rating: 4.5,
        memo: '아름다운 해안 절경 감상',
        latitude: 33.4238,
        longitude: 126.9292,
        trip_id: tripIds[0],
        created_at: Timestamp.now(),
        updated_at: Timestamp.now()
      },
      {
        day: 2,
        place_name: '한라산 국립공원',
        start_time: '08:00',
        end_time: '15:00',
        type: 'attraction',
        address: '제주특별자치도 제주시 1100로',
        rating: 4.7,
        memo: '한라산 등반 - 성판악 코스',
        latitude: 33.3617,
        longitude: 126.5292,
        trip_id: tripIds[0],
        created_at: Timestamp.now(),
        updated_at: Timestamp.now()
      },
      {
        day: 2,
        place_name: '흑돼지 맛집',
        start_time: '18:00',
        end_time: '20:00',
        type: 'restaurant',
        address: '제주시 중앙로',
        rating: 4.3,
        memo: '제주 흑돼지 구이 맛집',
        trip_id: tripIds[0],
        created_at: Timestamp.now(),
        updated_at: Timestamp.now()
      },
      {
        day: 3,
        place_name: '우도',
        start_time: '09:00',
        end_time: '17:00',
        type: 'attraction',
        address: '제주특별자치도 제주시 우도면',
        rating: 4.6,
        memo: '우도 일주 및 해수욕',
        latitude: 33.5009,
        longitude: 126.9502,
        trip_id: tripIds[0],
        created_at: Timestamp.now(),
        updated_at: Timestamp.now()
      },
      {
        day: 3,
        place_name: '제주 민속촌',
        start_time: '10:00',
        end_time: '13:00',
        type: 'attraction',
        address: '제주특별자치도 서귀포시 표선면 민속해안로 631-34',
        rating: 4.2,
        memo: '제주 전통 문화 체험',
        latitude: 33.3189,
        longitude: 126.7919,
        trip_id: tripIds[0],
        created_at: Timestamp.now(),
        updated_at: Timestamp.now()
      },
      {
        day: 4,
        place_name: '중문 관광단지',
        start_time: '10:00',
        end_time: '14:00',
        type: 'attraction',
        address: '제주특별자치도 서귀포시 중문동',
        rating: 4.4,
        memo: '중문 해수욕장과 쇼핑',
        latitude: 33.2394,
        longitude: 126.4108,
        trip_id: tripIds[0],
        created_at: Timestamp.now(),
        updated_at: Timestamp.now()
      },
      {
        day: 4,
        place_name: '제주공항',
        start_time: '16:00',
        end_time: '18:00',
        type: 'transport',
        address: '제주특별자치도 제주시 공항로 2',
        rating: 4.0,
        memo: '귀환 항공편',
        trip_id: tripIds[0],
        created_at: Timestamp.now(),
        updated_at: Timestamp.now()
      },
      {
        day: 1,
        place_name: '도쿄역',
        start_time: '09:00',
        end_time: '10:00',
        type: 'transport',
        address: '일본 도쿄도 치요다구 마루노우치 1초메',
        rating: 4.5,
        memo: '도쿄 도착 후 JR 패스 수령',
        trip_id: tripIds[1],
        created_at: Timestamp.now(),
        updated_at: Timestamp.now()
      }
    ];

    for (let i = 0; i < samplePlans.length; i++) {
      const docRef = await addDoc(collection(db, 'plans'), samplePlans[i]);
      console.log(`✅ Plan ${i+1}/10: ${samplePlans[i].place_name} (ID: ${docRef.id})`);
    }
    
    console.log('🎉 모든 샘플 데이터가 Firebase에 성공적으로 추가되었습니다!');
    console.log(`📊 추가된 데이터: Trips(${sampleTrips.length}개), Plans(${samplePlans.length}개), Places(${samplePlaces.length}개)`);
    
  } catch (error) {
    console.error('❌ 데이터 추가 실패:', error);
  }
}

// 스크립트 실행
seedData().then(() => {
  console.log('✅ 스크립트 실행 완료');
  process.exit(0);
}).catch((error) => {
  console.error('❌ 스크립트 실행 실패:', error);
  process.exit(1);
});