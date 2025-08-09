// Firebase 데이터베이스 마이그레이션 스크립트
// 기존 plans 컬렉션의 type 필드를 새로운 형식으로 업데이트

import admin from 'firebase-admin';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, 'service-account-key.json'), 'utf-8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'travel-v2-e5507'
});

const db = admin.firestore();

// 기존 type 값을 새로운 값으로 매핑
const typeMapping = {
  'transport': 'transport', // 대중교통으로 유지
  'car': 'car',            // 자동차 (새로 추가된 타입)
  'plane': 'plane',        // 비행기 (새로 추가된 타입)
  'airport': 'airport',    // 공항 (새로 추가된 타입)
  'attraction': 'attraction',
  'restaurant': 'restaurant', 
  'hotel': 'hotel',
  'other': 'other'
};

async function migratePlansCollection() {
  try {
    console.log('Plans 컬렉션 마이그레이션 시작...');
    
    // 모든 plans 문서 가져오기
    const plansRef = db.collection('plans');
    const snapshot = await plansRef.get();
    
    if (snapshot.empty) {
      console.log('마이그레이션할 plans 문서가 없습니다.');
      return;
    }
    
    const batch = db.batch();
    let updateCount = 0;
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      const currentType = data.type;
      
      // 기존 타입이 유효한 경우에만 처리
      if (currentType && Object.prototype.hasOwnProperty.call(typeMapping, currentType)) {
        // 새로운 타입으로 변경이 필요한 경우
        const newType = typeMapping[currentType];
        
        if (currentType !== newType) {
          batch.update(doc.ref, {
            type: newType,
            updated_at: admin.firestore.FieldValue.serverTimestamp()
          });
          updateCount++;
          console.log(`문서 ${doc.id}: ${currentType} -> ${newType}`);
        }
      } else {
        console.log(`문서 ${doc.id}: 알 수 없는 타입 '${currentType}' 발견`);
      }
    });
    
    if (updateCount > 0) {
      await batch.commit();
      console.log(`${updateCount}개 문서가 성공적으로 업데이트되었습니다.`);
    } else {
      console.log('업데이트할 문서가 없습니다.');
    }
    
    // 마이그레이션 후 타입별 통계
    console.log('\n=== 마이그레이션 후 타입별 통계 ===');
    const afterSnapshot = await plansRef.get();
    const typeStats = {};
    
    afterSnapshot.forEach((doc) => {
      const type = doc.data().type;
      typeStats[type] = (typeStats[type] || 0) + 1;
    });
    
    Object.entries(typeStats).forEach(([type, count]) => {
      console.log(`${type}: ${count}개`);
    });
    
  } catch (error) {
    console.error('마이그레이션 실패:', error);
  }
}

// 스크립트 실행
migratePlansCollection().then(() => {
  console.log('마이그레이션 완료');
  process.exit(0);
}).catch((error) => {
  console.error('스크립트 실행 실패:', error);
  process.exit(1);
});