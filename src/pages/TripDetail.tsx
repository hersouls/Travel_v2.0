import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts';
import { GlassCard } from '../components/GlassCard';
import { WaveButton } from '../components/WaveButton';
import { PlanCard } from '../components/PlanCard';
import { 
  ArrowLeft, 
  Plus, 
  MapPin, 
  Calendar, 
  Map,
  Image,
  MoreVertical 
} from 'lucide-react';
import { doc, onSnapshot, collection, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Trip } from '../types/trip';
import { Plan } from '../types/plan';

export const TripDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(1);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 flex items-center justify-center">
        <div className="text-white text-lg">로딩 중...</div>
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTripDuration = () => {
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const getDayPlans = (day: number) => {
    return plans.filter(plan => plan.day === day);
  };

  const days = Array.from({ length: getTripDuration() }, (_, i) => i + 1);

  const handleAddPlan = () => {
    navigate(`/trips/${id}/plans/new?day=${selectedDay}`);
  };

  const handlePlanClick = (plan: Plan) => {
    navigate(`/trips/${id}/plans/${plan.id}`);
  };

  const handleMapView = () => {
    navigate(`/trips/${id}/map`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-primary-900/90 to-secondary-900/90 backdrop-blur-sm z-10">
        <div className="flex items-center justify-between p-6">
          <WaveButton
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="!p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </WaveButton>
          
          <h1 className="text-lg font-bold text-white truncate mx-4">
            {trip.title}
          </h1>
          
          <WaveButton
            variant="ghost"
            size="sm"
            onClick={handleMapView}
            className="!p-2"
          >
            <Map className="w-5 h-5" />
          </WaveButton>
        </div>
      </div>

      <div className="px-6 pb-6">
        {/* Trip Info Card */}
        <GlassCard variant="travel" className="mb-6">
          {/* Cover Image */}
          <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-travel-blue/20 to-travel-purple/20">
            {trip.cover_image ? (
              <img 
                src={trip.cover_image} 
                alt={trip.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Image className="w-16 h-16 text-white/60" />
              </div>
            )}
          </div>

          {/* Trip Details */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white/80">
              <MapPin className="w-4 h-4" />
              <span>{trip.country}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-white/80">
              <Calendar className="w-4 h-4" />
              <span>
                {formatDate(trip.start_date)} ~ {formatDate(trip.end_date)}
              </span>
            </div>
            
            <div className="flex justify-between items-center pt-2 border-t border-white/10">
              <span className="text-white/60">총 기간</span>
              <span className="text-travel-blue font-semibold">{getTripDuration()}일</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-white/60">일정 개수</span>
              <span className="text-travel-orange font-semibold">{plans.length}개</span>
            </div>
          </div>
        </GlassCard>

        {/* Day Navigation */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">일정</h2>
            <WaveButton
              variant="travel"
              size="sm"
              onClick={handleAddPlan}
            >
              <Plus className="w-4 h-4 mr-1" />
              추가
            </WaveButton>
          </div>

          {/* Day Tabs */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {days.map((day) => {
              const dayPlans = getDayPlans(day);
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedDay === day
                      ? 'bg-primary-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  Day {day}
                  {dayPlans.length > 0 && (
                    <span className="ml-1 text-xs bg-white/20 rounded-full px-1">
                      {dayPlans.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Plans List */}
        <div className="space-y-4">
          {getDayPlans(selectedDay).length === 0 ? (
            <GlassCard variant="light" className="text-center py-8">
              <Calendar className="w-16 h-16 text-white/40 mx-auto mb-4" />
              <p className="text-white/60 mb-4">Day {selectedDay}에 일정이 없어요</p>
              <WaveButton variant="travel" onClick={handleAddPlan}>
                <Plus className="w-4 h-4 mr-2" />
                첫 번째 일정 추가
              </WaveButton>
            </GlassCard>
          ) : (
            getDayPlans(selectedDay).map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onClick={() => handlePlanClick(plan)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};