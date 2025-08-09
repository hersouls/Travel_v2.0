import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const USER_ID = 'f3NaO0zcLNWLJ7iSAFdKrEStRDx2';

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

async function updatePlansWithUserId() {
  try {
    console.log('🔄 Plans 컬렉션에 user_id 추가 시작...');
    
    // Plans 컬렉션의 모든 문서 가져오기
    const querySnapshot = await getDocs(collection(db, 'plans'));
    
    console.log(`📋 총 ${querySnapshot.size}개의 plan 문서 발견`);
    
    // 각 plan 문서에 user_id 추가
    for (const docSnapshot of querySnapshot.docs) {
      const planRef = doc(db, 'plans', docSnapshot.id);
      await updateDoc(planRef, {
        user_id: USER_ID
      });
      console.log(`✅ Plan 업데이트됨: ${docSnapshot.data().place_name} (ID: ${docSnapshot.id})`);
    }
    
    console.log('🎉 모든 Plans에 user_id 추가 완료!');
    
  } catch (error) {
    console.error('❌ Plans 업데이트 실패:', error);
  }
}

// 스크립트 실행
updatePlansWithUserId().then(() => {
  console.log('✅ 스크립트 실행 완료');
  process.exit(0);
}).catch((error) => {
  console.error('❌ 스크립트 실행 실패:', error);
  process.exit(1);
});