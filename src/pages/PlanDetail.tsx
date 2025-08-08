import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts';
import { GlassCard } from '../components/GlassCard';
import { WaveButton } from '../components/WaveButton';
import { 
  ArrowLeft, 
  Save,
  Trash2,
  Upload,
  X,
  Star,
  MapPin,
  Clock,
  Camera,
  Youtube,
  Map,
  Search
} from 'lucide-react';
import { 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  Timestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { Trip } from '../types/trip';
import { Plan } from '../types/plan';

export const PlanDetail: React.FC = () => {
  const { tripId, planId } = useParams<{ tripId: string; planId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    day: parseInt(searchParams.get('day') || '1'),
    place_name: '',
    start_time: '09:00',
    end_time: '10:00',
    type: 'attraction' as Plan['type'],
    address: '',
    rating: 0,
    memo: '',
    youtube_link: '',
    map_url: '',
    latitude: '',
    longitude: '',
  });

  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);

  const planTypes = [
    { value: 'attraction', label: '관광지', icon: '🏛️' },
    { value: 'restaurant', label: '음식점', icon: '🍽️' },
    { value: 'hotel', label: '숙소', icon: '🏨' },
    { value: 'transport', label: '교통', icon: '🚗' },
    { value: 'other', label: '기타', icon: '📍' },
  ];

  useEffect(() => {
    if (!tripId || !user) return;

    const loadData = async () => {
      try {
        // Trip 데이터 로드
        const tripDoc = await getDoc(doc(db, 'trips', tripId));
        if (!tripDoc.exists()) {
          setError('여행을 찾을 수 없습니다.');
          setLoading(false);
          return;
        }

        const tripData = { id: tripDoc.id, ...tripDoc.data() } as Trip;
        if (tripData.user_id !== user.uid) {
          setError('접근 권한이 없습니다.');
          setLoading(false);
          return;
        }
        setTrip(tripData);

        // Plan 데이터 로드 (편집 모드일 때)
        if (planId) {
          setIsEdit(true);
          const planDoc = await getDoc(doc(db, 'trips', tripId, 'plans', planId));
          if (planDoc.exists()) {
            const planData = { id: planDoc.id, ...planDoc.data() } as Plan;
            setPlan(planData);
            setFormData({
              day: planData.day,
              place_name: planData.place_name,
              start_time: planData.start_time,
              end_time: planData.end_time || '',
              type: planData.type,
              address: planData.address || '',
              rating: planData.rating || 0,
              memo: planData.memo || '',
              youtube_link: planData.youtube_link || '',
              map_url: planData.map_url || '',
              latitude: planData.latitude?.toString() || '',
              longitude: planData.longitude?.toString() || '',
            });
            setExistingPhotos(planData.photos || []);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
        setError('데이터를 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    loadData();
  }, [tripId, planId, user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalPhotos = photos.length + existingPhotos.length + files.length;
    
    if (totalPhotos > 5) {
      setError('사진은 최대 5장까지 업로드할 수 있습니다.');
      return;
    }

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        setError('각 이미지는 5MB를 초과할 수 없습니다.');
        return;
      }
    });

    setPhotos(prev => [...prev, ...files]);
    
    // 미리보기 생성
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setError(null);
  };

  const removePhoto = (index: number, isExisting: boolean = false) => {
    if (isExisting) {
      setExistingPhotos(prev => prev.filter((_, i) => i !== index));
    } else {
      setPhotos(prev => prev.filter((_, i) => i !== index));
      setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    if (!formData.place_name.trim()) {
      setError('장소명을 입력해주세요.');
      return false;
    }
    if (!formData.start_time) {
      setError('시작 시간을 선택해주세요.');
      return false;
    }
    if (formData.end_time && formData.start_time >= formData.end_time) {
      setError('종료 시간은 시작 시간보다 늦어야 합니다.');
      return false;
    }
    if (formData.memo.length > 1000) {
      setError('메모는 1000자를 초과할 수 없습니다.');
      return false;
    }
    if (formData.latitude && (isNaN(Number(formData.latitude)) || 
        Number(formData.latitude) < -90 || Number(formData.latitude) > 90)) {
      setError('위도는 -90에서 90 사이의 숫자여야 합니다.');
      return false;
    }
    if (formData.longitude && (isNaN(Number(formData.longitude)) || 
        Number(formData.longitude) < -180 || Number(formData.longitude) > 180)) {
      setError('경도는 -180에서 180 사이의 숫자여야 합니다.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !trip || !validateForm()) return;

    setSaving(true);
    setError(null);

    try {
      // 새 사진 업로드
      const uploadedPhotoUrls: string[] = [];
      for (const photo of photos) {
        const photoRef = ref(storage, `plan-photos/${user.uid}/${Date.now()}_${photo.name}`);
        const snapshot = await uploadBytes(photoRef, photo);
        const url = await getDownloadURL(snapshot.ref);
        uploadedPhotoUrls.push(url);
      }

      // Plan 데이터 생성
      const planData: Omit<Plan, 'id'> = {
        trip_id: tripId!,
        day: formData.day,
        place_name: formData.place_name.trim(),
        start_time: formData.start_time,
        end_time: formData.end_time || undefined,
        type: formData.type,
        address: formData.address.trim() || undefined,
        rating: formData.rating || undefined,
        memo: formData.memo.trim() || undefined,
        photos: [...existingPhotos, ...uploadedPhotoUrls],
        youtube_link: formData.youtube_link.trim() || undefined,
        map_url: formData.map_url.trim() || undefined,
        latitude: formData.latitude ? Number(formData.latitude) : undefined,
        longitude: formData.longitude ? Number(formData.longitude) : undefined,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
      };

      if (isEdit && planId) {
        // 수정
        await updateDoc(doc(db, 'trips', tripId!, 'plans', planId), {
          ...planData,
          updated_at: Timestamp.now(),
        });
      } else {
        // 생성
        await addDoc(collection(db, 'trips', tripId!, 'plans'), planData);
      }

      // 성공 시 TripDetail로 이동
      navigate(`/trips/${tripId}`);
    } catch (error) {
      console.error('일정 저장 실패:', error);
      setError('일정 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEdit || !planId || !window.confirm('정말 이 일정을 삭제하시겠습니까?')) return;

    setSaving(true);
    try {
      await deleteDoc(doc(db, 'trips', tripId!, 'plans', planId));
      navigate(`/trips/${tripId}`);
    } catch (error) {
      console.error('일정 삭제 실패:', error);
      setError('일정 삭제에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 flex items-center justify-center">
        <div className="text-white text-lg">로딩 중...</div>
      </div>
    );
  }

  if (error && !trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 flex items-center justify-center p-6">
        <GlassCard variant="travel" className="text-center">
          <p className="text-white mb-4">{error}</p>
          <WaveButton onClick={() => navigate('/')}>
            홈으로 돌아가기
          </WaveButton>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-primary-900/90 to-secondary-900/90 backdrop-blur-sm z-10">
        <div className="flex items-center justify-between p-6">
          <WaveButton
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/trips/${tripId}`)}
            className="!p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </WaveButton>
          
          <h1 className="text-lg font-bold text-white">
            {isEdit ? '일정 편집' : '새 일정 추가'}
          </h1>
          
          {isEdit && (
            <WaveButton
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="!p-2 text-red-400"
            >
              <Trash2 className="w-5 h-5" />
            </WaveButton>
          )}
        </div>
      </div>

      <div className="px-6 pb-6">
        {/* Trip Info */}
        {trip && (
          <GlassCard variant="light" className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">{trip.title}</h3>
            <p className="text-white/60">Day {formData.day} 일정</p>
          </GlassCard>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <GlassCard variant="travel">
            <h3 className="text-lg font-semibold text-white mb-4">기본 정보</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Day *
                  </label>
                  <select
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-primary-300 focus:ring-1 focus:ring-primary-300"
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(day => (
                      <option key={day} value={day} className="bg-primary-800">
                        Day {day}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    유형 *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Plan['type'] })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-primary-300 focus:ring-1 focus:ring-primary-300"
                  >
                    {planTypes.map(type => (
                      <option key={type.value} value={type.value} className="bg-primary-800">
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  장소명 *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={formData.place_name}
                    onChange={(e) => setFormData({ ...formData, place_name: e.target.value })}
                    placeholder="예: 도쿄 스카이트리"
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-primary-300 focus:ring-1 focus:ring-primary-300"
                  />
                  <WaveButton
                    type="button"
                    variant="ghost"
                    onClick={() => navigate(`/places/search?trip=${tripId}`)}
                    className="!p-3"
                  >
                    <Search className="w-5 h-5" />
                  </WaveButton>
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  주소
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="예: 도쿄도 스미다구 오시아게 1-1-2"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-primary-300 focus:ring-1 focus:ring-primary-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    시작 시간 *
                  </label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-primary-300 focus:ring-1 focus:ring-primary-300"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    종료 시간
                  </label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-primary-300 focus:ring-1 focus:ring-primary-300"
                  />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Rating */}
          <GlassCard variant="travel">
            <h3 className="text-lg font-semibold text-white mb-4">평점</h3>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className={`w-8 h-8 ${
                    star <= formData.rating ? 'text-yellow-400' : 'text-white/30'
                  }`}
                >
                  <Star className="w-8 h-8 fill-current" />
                </button>
              ))}
              <span className="text-white/60 ml-4">
                {formData.rating > 0 ? `${formData.rating}점` : '평점 없음'}
              </span>
            </div>
          </GlassCard>

          {/* Photos */}
          <GlassCard variant="travel">
            <h3 className="text-lg font-semibold text-white mb-4">
              <Camera className="w-5 h-5 inline mr-2" />
              사진 ({existingPhotos.length + photos.length}/5)
            </h3>
            
            {/* Existing Photos */}
            {existingPhotos.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-4">
                {existingPhotos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo}
                      alt={`사진 ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index, true)}
                      className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* New Photos */}
            {photoPreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-4">
                {photoPreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`새 사진 ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            {(existingPhotos.length + photos.length) < 5 && (
              <label className="block w-full h-20 border-2 border-dashed border-white/30 rounded-lg cursor-pointer hover:border-white/50 transition-colors">
                <div className="flex flex-col items-center justify-center h-full text-white/60 hover:text-white/80">
                  <Upload className="w-6 h-6 mb-1" />
                  <span className="text-sm">사진 추가</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </GlassCard>

          {/* Location */}
          <GlassCard variant="travel">
            <h3 className="text-lg font-semibold text-white mb-4">
              <MapPin className="w-5 h-5 inline mr-2" />
              위치 정보
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  위도 (Latitude)
                </label>
                <input
                  type="text"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  placeholder="예: 35.710063"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-primary-300 focus:ring-1 focus:ring-primary-300"
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  경도 (Longitude)
                </label>
                <input
                  type="text"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  placeholder="예: 139.810700"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-primary-300 focus:ring-1 focus:ring-primary-300"
                />
              </div>
            </div>
          </GlassCard>

          {/* Links */}
          <GlassCard variant="travel">
            <h3 className="text-lg font-semibold text-white mb-4">링크</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  <Youtube className="w-4 h-4 inline mr-1" />
                  YouTube 링크
                </label>
                <input
                  type="url"
                  value={formData.youtube_link}
                  onChange={(e) => setFormData({ ...formData, youtube_link: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-primary-300 focus:ring-1 focus:ring-primary-300"
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  <Map className="w-4 h-4 inline mr-1" />
                  지도 링크
                </label>
                <input
                  type="url"
                  value={formData.map_url}
                  onChange={(e) => setFormData({ ...formData, map_url: e.target.value })}
                  placeholder="https://maps.google.com/..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-primary-300 focus:ring-1 focus:ring-primary-300"
                />
              </div>
            </div>
          </GlassCard>

          {/* Memo */}
          <GlassCard variant="travel">
            <h3 className="text-lg font-semibold text-white mb-4">메모</h3>
            <textarea
              value={formData.memo}
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
              placeholder="이 장소에 대한 메모를 작성해주세요..."
              maxLength={1000}
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-primary-300 focus:ring-1 focus:ring-primary-300 resize-none"
            />
            <div className="text-xs text-white/60 mt-1 text-right">
              {formData.memo.length}/1000자
            </div>
          </GlassCard>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4">
              <p className="text-red-200 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <WaveButton
            type="submit"
            variant="travel"
            size="lg"
            className="w-full"
            disabled={saving}
          >
            <Save className="w-5 h-5 mr-2" />
            {saving ? '저장 중...' : (isEdit ? '수정하기' : '추가하기')}
          </WaveButton>
        </form>
      </div>
    </div>
  );
};