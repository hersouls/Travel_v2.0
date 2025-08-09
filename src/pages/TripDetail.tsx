import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts';
import { GlassCard } from '../components/GlassCard';
import { WaveButton } from '../components/WaveButton';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { PlanCard } from '../components/PlanCard';
import { 
  Plus, 
  MapPin, 
  Calendar, 
  Image,
  ArrowLeft,
  Edit
} from 'lucide-react';
import { doc, deleteDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
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

    // Plans 데이터 구독 (인덱스 불필요하도록 단순화)
    const plansQuery = query(
      collection(db, 'plans'),
      where('trip_id', '==', id)
    );

    const plansUnsubscribe = onSnapshot(
      plansQuery,
      (snapshot) => {
        const plansData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Plan[];
        
        // 클라이언트 사이드에서 정렬
        const sortedPlans = plansData.sort((a, b) => {
          if (a.day !== b.day) {
            return a.day - b.day;
          }
          return a.start_time.localeCompare(b.start_time);
        });
        
        setPlans(sortedPlans);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-lg">로딩 중...</div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <GlassCard variant="travel" className="text-center">
          <p className="text-white mb-4">{error || '여행을 찾을 수 없습니다.'}</p>
          <WaveButton onClick={() => navigate('/')}>
            Back
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
    // 카드 클릭 시 편집 모드로 이동
    navigate(`/trips/${id}/plans/${plan.id}`);
  };

  const handlePlanEdit = (plan: Plan) => {
    // 편집 버튼 클릭 시 편집 모드로 이동
    navigate(`/trips/${id}/plans/${plan.id}`);
  };

  const handlePlanDelete = async (plan: Plan) => {
    if (!plan.id) return;

    try {
      await deleteDoc(doc(db, 'plans', plan.id));
    } catch (error) {
      console.error('일정 삭제 실패:', error);
      alert('일정 삭제에 실패했습니다.');
    }
  };



  return (
    <div className="min-h-screen">
      <Header />
      {/* Main Content */}
      <div className="pt-20 px-4 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <div className="mb-4">
            <WaveButton
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </WaveButton>
          </div>
          
          {/* Trip Info Card */}
          <GlassCard 
            variant="travel" 
            withWaveEffect={true}
            hoverable={true}
            className="mb-6 animate-fade-in wave-optimized"
            style={{ animationDelay: '0.1s' }}
          >
            {/* Header with Title and Edit Button */}
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white moonwave-glow break-words">
                {trip.title}
              </h1>
              <WaveButton
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/trips/${trip.id}/edit`)}
                className="flex items-center gap-2 hover:bg-white/10"
                ariaLabel="여행 수정"
              >
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">수정</span>
              </WaveButton>
            </div>

            {/* Cover Image */}
            <div className="relative w-full h-48 md:h-56 lg:h-64 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-travel-blue/20 to-travel-purple/20">
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
              
              {/* Edit Image Button Overlay */}
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 opacity-80 sm:opacity-60 hover:opacity-100 transition-opacity">
                <WaveButton
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/trips/${trip.id}/edit`)}
                  className="p-2 rounded-lg bg-black/30 hover:bg-black/50 backdrop-blur-sm"
                  ariaLabel="이미지 수정"
                >
                  <Edit className="w-3 h-3 text-white" />
                </WaveButton>
              </div>
            </div>

            {/* Trip Details */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-white/80">
                <MapPin className="w-4 h-4" />
                <span className="text-sm md:text-base">{trip.country}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-white/80">
                <Calendar className="w-4 h-4" />
                <span className="text-sm md:text-base">
                  {formatDate(trip.start_date)} ~ {formatDate(trip.end_date)}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm md:text-base">총 기간</span>
                  <span className="text-travel-blue font-semibold text-sm md:text-base">{getTripDuration()}일</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm md:text-base">일정 개수</span>
                  <span className="text-travel-orange font-semibold text-sm md:text-base">{plans.length}개</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Day Navigation */}
          <div className="mb-6">
            <GlassCard 
              variant="light" 
              withWaveEffect={true}
              hoverable={false}
              className="mb-4 animate-fade-in"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">일정</h2>
                  <p className="text-white/60 text-sm mt-1">일정 카드를 클릭하거나 편집 버튼으로 수정할 수 있습니다</p>
                </div>
                <WaveButton
                  variant="travel"
                  size="sm"
                  onClick={handleAddPlan}
                  className="wave-optimized"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  추가
                </WaveButton>
              </div>
            </GlassCard>

            {/* Day Tabs */}
            <GlassCard 
              variant="light" 
              className="animate-fade-in"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {days.map((day) => {
                  const dayPlans = getDayPlans(day);
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`flex-shrink-0 px-3 md:px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-all wave-float ${
                        selectedDay === day
                          ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                          : 'bg-white/10 text-white/70 hover:bg-white/20 hover:scale-105'
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
            </GlassCard>
          </div>

          {/* Plans List */}
          <div className="space-y-4">
            {getDayPlans(selectedDay).length === 0 ? (
              <GlassCard 
                variant="light" 
                withWaveEffect={true}
                className="text-center py-8 animate-fade-in wave-optimized"
                style={{ animationDelay: '0.4s' }}
              >
                <Calendar className="w-16 h-16 text-white/40 mx-auto mb-4 wave-pulse" />
                <p className="text-white/60 mb-4">Day {selectedDay}에 일정이 없어요</p>
                <WaveButton 
                  variant="travel" 
                  onClick={handleAddPlan}
                  className="wave-optimized"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  첫 번째 일정 추가
                </WaveButton>
              </GlassCard>
            ) : (
              getDayPlans(selectedDay).map((plan, index) => {
                return (
                  <div
                    key={plan.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                  >
                    <PlanCard
                      plan={plan}
                      onClick={() => handlePlanClick(plan)}
                      onEdit={() => handlePlanEdit(plan)}
                      onDelete={() => handlePlanDelete(plan)}
                      showActions={true}
                      className="wave-optimized"
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};