import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts';
import { GlassCard } from '../components/GlassCard';
import { WaveButton } from '../components/WaveButton';
import { TripCard } from '../components/TripCard';
import { Trip } from '../types/trip';
import { Plus, Plane, MapPin, Calendar } from 'lucide-react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const Home: React.FC = () => {
  const { user, signInAnonymously, loading: authLoading } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
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
  }, [user]);

  const handleCreateTrip = () => {
    window.location.href = '/trips/new';
  };

  const handleTripClick = (trip: Trip) => {
    window.location.href = `/trips/${trip.id}`;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 flex items-center justify-center">
        <div className="text-white text-lg">로딩 중...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 flex items-center justify-center p-6">
        <GlassCard variant="travel" className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <Plane className="w-20 h-20 text-travel-blue mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Moonwave Travel</h1>
            <p className="text-white/80">여행의 모든 순간을 담다</p>
          </div>
          
          <WaveButton
            variant="travel"
            size="lg"
            onClick={signInAnonymously}
            className="w-full"
          >
            여행 시작하기
          </WaveButton>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900">
      {/* Header */}
      <div className="p-6 pb-0">
        <GlassCard variant="light" className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">안녕하세요! 👋</h1>
              <p className="text-white/80">어떤 여행을 계획하고 계신가요?</p>
            </div>
            <Plane className="w-12 h-12 text-travel-blue" />
          </div>
        </GlassCard>
      </div>

      {/* Stats Cards */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <GlassCard variant="light" className="text-center p-4">
            <MapPin className="w-8 h-8 text-travel-green mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{trips.length}</div>
            <div className="text-white/60 text-sm">여행</div>
          </GlassCard>
          
          <GlassCard variant="light" className="text-center p-4">
            <Calendar className="w-8 h-8 text-travel-orange mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {trips.reduce((sum, trip) => sum + (trip.plans_count || 0), 0)}
            </div>
            <div className="text-white/60 text-sm">일정</div>
          </GlassCard>
          
          <GlassCard variant="light" className="text-center p-4">
            <Plane className="w-8 h-8 text-travel-purple mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {trips.filter(trip => new Date(trip.end_date) < new Date()).length}
            </div>
            <div className="text-white/60 text-sm">완료</div>
          </GlassCard>
        </div>
      </div>

      {/* Create Trip Button */}
      <div className="px-6 mb-6">
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
      <div className="px-6 pb-6">
        <h2 className="text-xl font-bold text-white mb-4">내 여행</h2>
        
        {loading ? (
          <div className="text-center text-white/60 py-8">
            여행 목록을 불러오는 중...
          </div>
        ) : trips.length === 0 ? (
          <GlassCard variant="light" className="text-center py-8">
            <Plane className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <p className="text-white/60 mb-4">아직 여행이 없어요</p>
            <WaveButton variant="ghost" onClick={handleCreateTrip}>
              첫 번째 여행 만들기
            </WaveButton>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onClick={() => handleTripClick(trip)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};