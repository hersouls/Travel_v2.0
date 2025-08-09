import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts';
import { GlassCard } from '../components/GlassCard';
import { WaveButton } from '../components/WaveButton';
import { TripCard } from '../components/TripCard';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Trip } from '../types/trip';
import { Plus, Plane, MapPin, Calendar } from 'lucide-react';
import { collection, query, where, onSnapshot, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const Home: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;


    const loadUserTrips = async () => {
      setLoading(true);
      
      try {
        // 사용자의 여행 데이터 로드
        const tripsQuery = query(
          collection(db, 'trips'),
          where('user_id', '==', user.uid),
          orderBy('created_at', 'desc')
        );

        const unsubscribe = onSnapshot(tripsQuery, (snapshot) => {
          const tripsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Trip[];
          
          setTrips(tripsData);
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error('여행 데이터 로드 실패:', error);
        setLoading(false);
      }
    };

    const unsubscribe = loadUserTrips();
    return () => {
      if (unsubscribe instanceof Function) {
        unsubscribe();
      }
    };
  }, [user]);

  const handleCreateTrip = () => {
    navigate('/trips/new');
  };

  const handleTripClick = (trip: Trip) => {
    navigate(`/trips/${trip.id}`);
  };

  const handleTripEdit = (trip: Trip) => {
    // TripEdit 페이지로 이동 (TripCreate를 재사용하여 편집 모드로)
    navigate(`/trips/${trip.id}/edit`);
  };

  const handleTripDelete = async (trip: Trip) => {
    if (!trip.id) return;

    try {
      await deleteDoc(doc(db, 'trips', trip.id));
      // 성공 메시지는 실시간 구독으로 자동 업데이트됨
    } catch (error) {
      console.error('여행 삭제 실패:', error);
      alert('여행 삭제에 실패했습니다.');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-lg">로딩 중...</div>
      </div>
    );
  }

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen">
      <Header />
      {/* Main Content */}
      <div className="pt-20 px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <GlassCard variant="light" className="text-center p-4 animate-fade-in">
                <MapPin className="w-8 h-8 text-travel-green mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{trips.length}</div>
                <div className="text-white/60 text-sm">여행</div>
              </GlassCard>
              
              <GlassCard variant="light" className="text-center p-4 animate-fade-in">
                <Calendar className="w-8 h-8 text-travel-orange mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {trips.reduce((sum, trip) => sum + (trip.plans_count || 0), 0)}
                </div>
                <div className="text-white/60 text-sm">일정</div>
              </GlassCard>
              
              <GlassCard variant="light" className="text-center p-4 animate-fade-in">
                <Plane className="w-8 h-8 text-travel-purple mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {trips.filter(trip => new Date(trip.end_date) < new Date()).length}
                </div>
                <div className="text-white/60 text-sm">완료</div>
              </GlassCard>
            </div>
          </div>


          {/* Create Trip Button */}
          <div className="mb-6">
            <WaveButton
              variant="travel"
              size="lg"
              onClick={handleCreateTrip}
              className="w-full"
            >
              <Plus className="w-5 h-5 mr-2" />
              새 여행 만들기
            </WaveButton>
          </div>

          {/* Trips List */}
          <div className="pb-6">
            <h2 className="text-xl font-bold text-white mb-4">내 여행</h2>
            
            {loading ? (
              <div className="text-center text-white/60 py-8">
                여행 목록을 불러오는 중...
              </div>
            ) : trips.length === 0 ? (
              <GlassCard variant="light" className="text-center py-8 animate-fade-in">
                <Plane className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <p className="text-white/60 mb-4">아직 여행이 없어요</p>
                <WaveButton variant="ghost" onClick={handleCreateTrip}>
                  첫 번째 여행 만들기
                </WaveButton>
              </GlassCard>
            ) : (
              <div className="space-y-4">
                {trips.map((trip, index) => (
                  <div key={trip.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <TripCard
                      trip={trip}
                      onClick={() => handleTripClick(trip)}
                      onEdit={() => handleTripEdit(trip)}
                      onDelete={() => handleTripDelete(trip)}
                      showActions={true}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};