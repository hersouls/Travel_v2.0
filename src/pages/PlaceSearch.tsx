import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts';
import { GlassCard } from '../components/GlassCard';
import { WaveButton } from '../components/WaveButton';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { 
  Search, 
  Plus, 
  Heart, 
  MapPin, 
  Star,
  Utensils,
  Bed,
  Car,
  Filter,
  Clock,

} from 'lucide-react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  increment,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Place } from '../types/place';
import { Plan } from '../types/plan';

interface PlaceCardProps {
  place: Place;
  onSelect: (place: Place) => void;
  onToggleFavorite: (place: Place) => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place, onSelect, onToggleFavorite }) => {
  const getTypeIcon = (type: Plan['type']) => {
    switch (type) {
      case 'attraction':
        return <Star className="w-5 h-5 text-travel-orange" />;
      case 'restaurant':
        return <Utensils className="w-5 h-5 text-travel-green" />;
      case 'hotel':
        return <Bed className="w-5 h-5 text-travel-purple" />;
      case 'transport':
        return <Car className="w-5 h-5 text-travel-blue" />;
      default:
        return <MapPin className="w-5 h-5 text-white/80" />;
    }
  };

  const getTypeLabel = (type: Plan['type']) => {
    switch (type) {
      case 'attraction':
        return '관광지';
      case 'restaurant':
        return '음식점';
      case 'hotel':
        return '숙소';
      case 'transport':
        return '교통';
      default:
        return '기타';
    }
  };

  return (
    <GlassCard variant="light" hoverable className="cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0" onClick={() => onSelect(place)}>
          <div className="flex items-center space-x-2 mb-2">
            {getTypeIcon(place.type)}
            <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full">
              {getTypeLabel(place.type)}
            </span>
            {place.favorite && (
              <Heart className="w-4 h-4 text-red-400 fill-current" />
            )}
          </div>
          
          <h3 className="text-lg font-semibold text-white mb-1 truncate">
            {place.name}
          </h3>
          
          {place.address && (
            <div className="flex items-center space-x-1 text-white/60 text-sm mb-2">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{place.address}</span>
            </div>
          )}
          
          {place.rating && place.rating > 0 && (
            <div className="flex items-center space-x-1 mb-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-white/80 text-sm">{place.rating}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between text-xs text-white/50">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{place.usage_count || 0}번 사용</span>
            </div>
            {place.created_at && (
              <span>
                {place.created_at.toDate().toLocaleDateString('ko-KR')}
              </span>
            )}
          </div>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(place);
          }}
          className="ml-2 p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <Heart 
            className={`w-5 h-5 ${
              place.favorite ? 'text-red-400 fill-current' : 'text-white/40'
            }`} 
          />
        </button>
      </div>
    </GlassCard>
  );
};

export const PlaceSearch: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get('trip');
  
  const [places, setPlaces] = useState<Place[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<Plan['type'] | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'favorite' | 'usage'>('recent');
  const [loading, setLoading] = useState(true);
  const [showNewPlaceForm, setShowNewPlaceForm] = useState(false);
  
  // New Place Form
  const [newPlace, setNewPlace] = useState({
    name: '',
    address: '',
    type: 'attraction' as Plan['type'],
    rating: 0,
  });

  const placeTypes = [
    { value: 'all' as const, label: '전체', icon: '📍' },
    { value: 'attraction' as const, label: '관광지', icon: '🏛️' },
    { value: 'restaurant' as const, label: '음식점', icon: '🍽️' },
    { value: 'hotel' as const, label: '숙소', icon: '🏨' },
    { value: 'transport' as const, label: '교통', icon: '🚗' },
    { value: 'other' as const, label: '기타', icon: '📍' },
  ];

  const sortOptions = [
    { value: 'recent' as const, label: '최근 추가순' },
    { value: 'favorite' as const, label: '즐겨찾기' },
    { value: 'usage' as const, label: '자주 사용' },
  ];

  useEffect(() => {
    if (!user) return;

    const placesQuery = query(
      collection(db, 'users', user.uid, 'places'),
      where('user_id', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      placesQuery,
      (snapshot) => {
        const placesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Place[];
        setPlaces(placesData);
        setLoading(false);
      },
      (error) => {
        console.error('Places 로딩 실패:', error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  // Filter and sort places
  const filteredAndSortedPlaces = useMemo(() => {
    let filtered = places;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(place => 
        place.name.toLowerCase().includes(query) ||
        (place.address && place.address.toLowerCase().includes(query))
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(place => place.type === selectedType);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'favorite':
          if (a.favorite && !b.favorite) return -1;
          if (!a.favorite && b.favorite) return 1;
          return (b.usage_count || 0) - (a.usage_count || 0);
        case 'usage':
          return (b.usage_count || 0) - (a.usage_count || 0);
        case 'recent':
        default:
          return b.created_at.toMillis() - a.created_at.toMillis();
      }
    });

    return filtered;
  }, [places, searchQuery, selectedType, sortBy]);

  const handleSelectPlace = async (place: Place) => {
    try {
      // Usage count 증가
      await updateDoc(doc(db, 'users', user!.uid, 'places', place.id), {
        usage_count: increment(1),
        last_used: Timestamp.now(),
      });

      // TripDetail로 돌아가면서 선택된 장소 정보 전달
      if (tripId) {
        // URL을 통해 데이터 전달 (간단한 방법)
        const params = new URLSearchParams({
          place_name: place.name,
          address: place.address || '',
          type: place.type,
          rating: place.rating?.toString() || '0',
          latitude: place.latitude?.toString() || '',
          longitude: place.longitude?.toString() || '',
        });
        navigate(`/trips/${tripId}/plans/new?${params.toString()}`);
      } else {
        navigate(-1);
      }
    } catch (error) {
      console.error('장소 선택 실패:', error);
      // 에러가 있어도 네비게이션은 진행
      navigate(-1);
    }
  };

  const handleToggleFavorite = async (place: Place) => {
    try {
      await updateDoc(doc(db, 'users', user!.uid, 'places', place.id), {
        favorite: !place.favorite,
        updated_at: Timestamp.now(),
      });
    } catch (error) {
      console.error('즐겨찾기 토글 실패:', error);
    }
  };

  const handleAddNewPlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newPlace.name.trim()) return;

    try {
      const placeData: Omit<Place, 'id'> = {

        name: newPlace.name.trim(),
        address: newPlace.address.trim() || undefined,
        type: newPlace.type,
        rating: newPlace.rating || undefined,
        latitude: undefined,
        longitude: undefined,
        favorite: false,
        usage_count: 0,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
      };

      await addDoc(collection(db, 'users', user.uid, 'places'), placeData);
      
      // Form reset
      setNewPlace({
        name: '',
        address: '',
        type: 'attraction',
        rating: 0,
      });
      setShowNewPlaceForm(false);
    } catch (error) {
      console.error('새 장소 추가 실패:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-lg">장소 목록을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      {/* Main Content */}
      <div className="pt-20 px-4 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white text-center flex-1 text-glow">
              장소 검색
            </h1>
            <WaveButton
              variant="ghost"
              size="sm"
              onClick={() => setShowNewPlaceForm(!showNewPlaceForm)}
              className="!p-2"
            >
              <Plus className="w-5 h-5" />
            </WaveButton>
          </div>
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="장소명이나 주소로 검색..."
                className="w-full pl-12 pr-4 py-3 bg-glass-light backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-primary-300 focus:ring-1 focus:ring-primary-300"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 space-y-4">
            {/* Type Filter */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Filter className="w-4 h-4 text-white/60" />
                <span className="text-white/60 text-sm">유형</span>
              </div>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {placeTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedType === type.value
                        ? 'bg-primary-500 text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {type.icon} {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-white/60 text-sm">정렬</span>
              </div>
              <div className="flex space-x-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={`px-3 py-2 rounded-lg text-sm transition-all ${
                      sortBy === option.value
                        ? 'bg-primary-500 text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* New Place Form */}
          {showNewPlaceForm && (
            <GlassCard variant="travel" className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">새 장소 추가</h3>
              <form onSubmit={handleAddNewPlace} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={newPlace.name}
                    onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
                    placeholder="장소명 *"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-primary-300 focus:ring-1 focus:ring-primary-300"
                    required
                  />
                </div>
                
                <div>
                  <input
                    type="text"
                    value={newPlace.address}
                    onChange={(e) => setNewPlace({ ...newPlace, address: e.target.value })}
                    placeholder="주소"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-primary-300 focus:ring-1 focus:ring-primary-300"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select
                    value={newPlace.type}
                    onChange={(e) => setNewPlace({ ...newPlace, type: e.target.value as Plan['type'] })}
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-primary-300 focus:ring-1 focus:ring-primary-300"
                  >
                    {placeTypes.filter(t => t.value !== 'all').map(type => (
                      <option key={type.value} value={type.value} className="bg-primary-800">
                        {type.label}
                      </option>
                    ))}
                  </select>
                  
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewPlace({ ...newPlace, rating: star })}
                        className={`w-6 h-6 ${
                          star <= newPlace.rating ? 'text-yellow-400' : 'text-white/30'
                        }`}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <WaveButton
                    type="submit"
                    variant="travel"
                    size="sm"
                    className="flex-1"
                  >
                    추가
                  </WaveButton>
                  <WaveButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNewPlaceForm(false)}
                  >
                    취소
                  </WaveButton>
                </div>
              </form>
            </GlassCard>
          )}

          {/* Places List */}
          <div className="space-y-4">
            {filteredAndSortedPlaces.length === 0 ? (
              <GlassCard variant="light" className="text-center py-8">
                {searchQuery.trim() ? (
                  <>
                    <Search className="w-16 h-16 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60 mb-4">
                      '{searchQuery}'에 대한 검색 결과가 없습니다
                    </p>
                    <WaveButton 
                      variant="travel" 
                      onClick={() => setShowNewPlaceForm(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      새 장소 추가
                    </WaveButton>
                  </>
                ) : (
                  <>
                    <MapPin className="w-16 h-16 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60 mb-4">저장된 장소가 없어요</p>
                    <WaveButton 
                      variant="travel" 
                      onClick={() => setShowNewPlaceForm(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      첫 번째 장소 추가
                    </WaveButton>
                  </>
                )}
              </GlassCard>
            ) : (
              <>
                <div className="text-white/60 text-sm mb-2">
                  {filteredAndSortedPlaces.length}개의 장소
                </div>
                {filteredAndSortedPlaces.map((place) => (
                  <PlaceCard
                    key={place.id}
                    place={place}
                    onSelect={handleSelectPlace}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};