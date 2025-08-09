import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyC7FbIWC863CPOLAgHBSjh63lcZtmbftxc",
  authDomain: "travel-v2-e5507.firebaseapp.com",
  projectId: "travel-v2-e5507",
  storageBucket: "travel-v2-e5507.firebasestorage.app",
  messagingSenderId: "355011873482",
  appId: "1:355011873482:web:28e2975436f93b85a60233",
  measurementId: "G-VVVXYDFB1B"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 실제 작동하는 이미지 URL들
const workingImageUrls = [
  'https://picsum.photos/800/600?random=1', // 제주도
  'https://picsum.photos/800/600?random=2', // 도쿄
  'https://picsum.photos/800/600?random=3', // 부산
  'https://picsum.photos/800/600?random=4', // 강원도
  'https://picsum.photos/800/600?random=5', // 오사카
  'https://picsum.photos/800/600?random=6', // 경주
  'https://picsum.photos/800/600?random=7', // 전주
  'https://picsum.photos/800/600?random=8', // 태국
  'https://picsum.photos/800/600?random=9', // 유럽
  'https://picsum.photos/800/600?random=10' // 홍콩
];

async function updateTripImages() {
  try {
    console.log('🔄 Trip 이미지 URL 업데이트 시작...');
    
    // Trips 컬렉션의 모든 문서 가져오기
    const querySnapshot = await getDocs(collection(db, 'trips'));
    
    console.log(`🖼️ 총 ${querySnapshot.size}개의 trip 이미지 업데이트`);
    
    // 각 trip 문서의 이미지 URL 업데이트
    let index = 0;
    for (const docSnapshot of querySnapshot.docs) {
      const tripRef = doc(db, 'trips', docSnapshot.id);
      const newImageUrl = workingImageUrls[index % workingImageUrls.length];
      
      await updateDoc(tripRef, {
        cover_image: newImageUrl
      });
      
      console.log(`✅ Trip 이미지 업데이트됨: ${docSnapshot.data().title} -> ${newImageUrl}`);
      index++;
    }
    
    console.log('🎉 모든 Trip 이미지 URL 업데이트 완료!');
    
  } catch (error) {
    console.error('❌ 이미지 URL 업데이트 실패:', error);
  }
}

// 스크립트 실행
updateTripImages().then(() => {
  console.log('✅ 스크립트 실행 완료');
  process.exit(0);
}).catch((error) => {
  console.error('❌ 스크립트 실행 실패:', error);
  process.exit(1);
});