import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts';
import { GlassCard } from '../components/GlassCard';
import { WaveButton } from '../components/WaveButton';
import { TravelMap } from '../components/TravelMap';
import { PlanCard } from '../components/PlanCard';
import { 
  ArrowLeft, 
  Filter, 
  MapPin, 
  Calendar,
  Navigation,
  Edit3
} from 'lucide-react';
import { 
  doc, 
  onSnapshot, 
  collection, 
  query, 
  where, 
  orderBy,
  updateDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Trip } from '../types/trip';
import { Plan } from '../types/plan';

export const TripMap: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all');
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  
  // 좌표 입력 모달
  const [showCoordinateModal, setShowCoordinateModal] = useState(false);
  const [coordinateInput, setCoordinateInput] = useState({
    planId: '',
    latitude: '',
    longitude: '',
  });

  useEffect(() => {
    if (!id || !user) return;

    // Trip 데이터 구독
    const tripUnsubscribe = onSnapshot(
      doc(db, 'trips', id),
      (doc) => {
        if (doc.exists()) {
          const tripData = { id: doc.id, ...doc.data() } as Trip;
          if (tripData.user_id !== user.uid) {
            setError('접근 권한이 없습니다.');
            setLoading(false);
            return;
          }
          setTrip(tripData);
        } else {
          setError('여행을 찾을 수 없습니다.');
        }
        setLoading(false);
      },
      (error) => {
        console.error('Trip 로딩 실패:', error);
        setError('여행 데이터를 불러오는데 실패했습니다.');
        setLoading(false);
      }
    );

    // Plans 데이터 구독
    const plansQuery = query(
      collection(db, 'trips', id, 'plans'),
      orderBy('day', 'asc'),
      orderBy('start_time', 'asc')
    );

    const plansUnsubscribe = onSnapshot(
      plansQuery,
      (snapshot) => {
        const plansData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Plan[];
        setPlans(plansData);
      },
      (error) => {
        console.error('Plans 로딩 실패:', error);
      }
    );

    return () => {
      tripUnsubscribe();
      plansUnsubscribe();
    };
  }, [id, user]);

  // Filter plans based on selected day
  useEffect(() => {
    if (selectedDay === 'all') {
      setFilteredPlans(plans);
    } else {
      setFilteredPlans(plans.filter(plan => plan.day === selectedDay));
    }
  }, [plans, selectedDay]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 flex items-center justify-center">
        <div className="text-white text-lg">지도를 불러오는 중...</div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 flex items-center justify-center p-6">
        <GlassCard variant="travel" className="text-center">
          <p className="text-white mb-4">{error || '여행을 찾을 수 없습니다.'}</p>
          <WaveButton onClick={() => navigate('/')}>
            홈으로 돌아가기
          </WaveButton>
        </GlassCard>
      </div>
    );
  }

  const getTripDuration = () => {
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const days = Array.from({ length: getTripDuration() }, (_, i) => i + 1);
  const plansWithCoordinates = filteredPlans.filter(plan => plan.latitude && plan.longitude);

  const handlePlanClick = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowSidebar(true);
  };

  const handleEditPlan = (plan: Plan) => {
    navigate(`/trips/${id}/plans/${plan.id}`);
  };

  const handleAddCoordinates = (plan: Plan) => {
    setCoordinateInput({
      planId: plan.id!,
      latitude: plan.latitude?.toString() || '',
      longitude: plan.longitude?.toString() || '',
    });
    setShowCoordinateModal(true);
  };

  const handleSaveCoordinates = async () => {
    if (!coordinateInput.planId || !coordinateInput.latitude || !coordinateInput.longitude) return;
    
    const lat = parseFloat(coordinateInput.latitude);
    const lng = parseFloat(coordinateInput.longitude);
    
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      alert('올바른 좌표를 입력해주세요. (위도: -90~90, 경도: -180~180)');
      return;
    }

    try {
      await updateDoc(doc(db, 'trips', id!, 'plans', coordinateInput.planId), {
        latitude: lat,
        longitude: lng,
        updated_at: new Date(),
      });
      
      setShowCoordinateModal(false);
      setCoordinateInput({ planId: '', latitude: '', longitude: '' });
    } catch (error) {
      console.error('좌표 저장 실패:', error);
      alert('좌표 저장에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-primary-900/90 to-secondary-900/90 backdrop-blur-sm">
          <WaveButton
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/trips/${id}`)}
            className="!p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </WaveButton>
          
          <h1 className="text-lg font-bold text-white">{trip.title} 지도</h1>
          
          <WaveButton
            variant="ghost"
            size="sm"
            onClick={() => setShowSidebar(!showSidebar)}
            className="!p-2"
          >
            <Filter className="w-5 h-5" />
          </WaveButton>
        </div>
      </div>

      {/* Map */}
      <div className="h-screen pt-20">
        <TravelMap
          plans={filteredPlans}
          onPlanClick={handlePlanClick}
          className="h-full"
        />
      </div>

      {/* Day Filter - Bottom */}
      <div className="absolute bottom-6 left-6 right-6 z-10">
        <GlassCard variant="light" className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Calendar className="w-4 h-4 text-white/60" />
            <span className="text-white/60 text-sm">Day 필터</span>
          </div>
          
          <div className="flex space-x-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedDay('all')}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedDay === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              전체
              <span className="ml-1 text-xs bg-white/20 rounded-full px-1">
                {plansWithCoordinates.length}
              </span>
            </button>
            
            {days.map((day) => {
              const dayPlansWithCoords = plans.filter(p => p.day === day && p.latitude && p.longitude);
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedDay === day
                      ? 'bg-primary-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  Day {day}
                  {dayPlansWithCoords.length > 0 && (
                    <span className="ml-1 text-xs bg-white/20 rounded-full px-1">
                      {dayPlansWithCoords.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Sidebar */}
      {showSidebar && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setShowSidebar(false)}
          />
          <div className="fixed right-0 top-0 h-full w-80 bg-gradient-to-b from-primary-900 to-secondary-900 z-40 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">일정 목록</h2>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              {selectedPlan && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">선택된 일정</h3>
                  <PlanCard plan={selectedPlan} />
                  <div className="mt-3 space-y-2">
                    <WaveButton
                      variant="travel"
                      size="sm"
                      onClick={() => handleEditPlan(selectedPlan)}
                      className="w-full"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      일정 편집
                    </WaveButton>
                    {(!selectedPlan.latitude || !selectedPlan.longitude) && (
                      <WaveButton
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAddCoordinates(selectedPlan)}
                        className="w-full"
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        위치 추가
                      </WaveButton>
                    )}
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  {selectedDay === 'all' ? '전체 일정' : `Day ${selectedDay} 일정`}
                </h3>
                
                {filteredPlans.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60">일정이 없습니다</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredPlans.map((plan) => (
                      <div key={plan.id} className="relative">
                        <PlanCard 
                          plan={plan} 
                          onClick={() => setSelectedPlan(plan)}
                        />
                        {(!plan.latitude || !plan.longitude) && (
                          <div className="absolute top-2 right-2">
                            <button
                              onClick={() => handleAddCoordinates(plan)}
                              className="w-6 h-6 bg-red-500/80 rounded-full flex items-center justify-center text-white text-xs"
                              title="위치 정보 없음"
                            >
                              !
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Coordinate Input Modal */}
      {showCoordinateModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowCoordinateModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-6">
            <GlassCard variant="travel" className="w-full max-w-md">
              <h3 className="text-lg font-semibold text-white mb-4">
                <Navigation className="w-5 h-5 inline mr-2" />
                좌표 입력
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    위도 (Latitude) *
                  </label>
                  <input
                    type="text"
                    value={coordinateInput.latitude}
                    onChange={(e) => setCoordinateInput({ ...coordinateInput, latitude: e.target.value })}
                    placeholder="예: 35.710063"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-primary-300 focus:ring-1 focus:ring-primary-300"
                  />
                </div>
                
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    경도 (Longitude) *
                  </label>
                  <input
                    type="text"
                    value={coordinateInput.longitude}
                    onChange={(e) => setCoordinateInput({ ...coordinateInput, longitude: e.target.value })}
                    placeholder="예: 139.810700"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-primary-300 focus:ring-1 focus:ring-primary-300"
                  />
                </div>
                
                <div className="bg-travel-blue/20 border border-travel-blue/30 rounded-xl p-3">
                  <p className="text-white/80 text-sm">
                    💡 <strong>좌표 찾는 방법:</strong><br/>
                    1. Google Maps에서 장소 검색<br/>
                    2. 장소를 우클릭 → 좌표 복사<br/>
                    3. 위도, 경도 순서로 입력
                  </p>
                </div>
                
                <div className="flex space-x-3">
                  <WaveButton
                    variant="travel"
                    onClick={handleSaveCoordinates}
                    className="flex-1"
                  >
                    저장
                  </WaveButton>
                  <WaveButton
                    variant="ghost"
                    onClick={() => setShowCoordinateModal(false)}
                    className="flex-1"
                  >
                    취소
                  </WaveButton>
                </div>
              </div>
            </GlassCard>
          </div>
        </>
      )}

      {/* No coordinates warning */}
      {plansWithCoordinates.length === 0 && (
        <div className="absolute top-32 left-6 right-6 z-10">
          <GlassCard variant="light" className="text-center">
            <Navigation className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/60 mb-2">지도에 표시할 일정이 없습니다</p>
            <p className="text-white/50 text-sm">일정에 위치 정보를 추가해보세요</p>
          </GlassCard>
        </div>
      )}
    </div>
  );
};