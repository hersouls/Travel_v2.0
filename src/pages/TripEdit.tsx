import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts';
import { GlassCard } from '../components/GlassCard';
import { WaveButton } from '../components/WaveButton';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Calendar, MapPin, Upload, X, Trash2, Edit2 } from 'lucide-react';
import { doc, updateDoc, getDoc, Timestamp, deleteField } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { Trip } from '../types/trip';

export const TripEdit: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [formData, setFormData] = useState({
    title: '',
    country: '',
    start_date: '',
    end_date: '',
  });
  const [originalTrip, setOriginalTrip] = useState<Trip | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [imageToDelete, setImageToDelete] = useState(false); // 이미지 삭제 플래그
  const [loading, setLoading] = useState(false);
  const [loadingTrip, setLoadingTrip] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const countries = [
    '대한민국', '일본', '중국', '미국', '영국', '프랑스', '독일', '이탈리아',
    '스페인', '캐나다', '호주', '태국', '베트남', '싱가포르', '말레이시아',
    '인도네시아', '필리핀', '인도', '브라질', '아르헨티나', '기타'
  ];

  // 기존 여행 데이터 로드
  useEffect(() => {
    const loadTrip = async () => {
      if (!id || !user) return;

      try {
        const tripDoc = await getDoc(doc(db, 'trips', id));
        if (tripDoc.exists()) {
          const tripData = { id: tripDoc.id, ...tripDoc.data() } as Trip;
          
          // 권한 확인
          if (tripData.user_id !== user.uid) {
            setError('접근 권한이 없습니다.');
            setLoadingTrip(false);
            return;
          }

          setOriginalTrip(tripData);
          setFormData({
            title: tripData.title,
            country: tripData.country,
            start_date: tripData.start_date,
            end_date: tripData.end_date,
          });
          
          if (tripData.cover_image) {
            setCoverImagePreview(tripData.cover_image);
          }
        } else {
          setError('여행을 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('여행 로드 실패:', error);
        setError('여행 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoadingTrip(false);
      }
    };

    loadTrip();
  }, [id, user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB 제한
        setError('이미지 크기는 5MB를 초과할 수 없습니다.');
        return;
      }
      
      setCoverImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setImageToDelete(false); // 새 이미지 업로드 시 삭제 플래그 리셋
      setError(null);
    }
  };

  const removeNewImage = () => {
    setCoverImage(null);
    setCoverImagePreview(originalTrip?.cover_image || null);
    setImageToDelete(false);
  };

  const deleteCurrentImage = () => {
    setCoverImage(null);
    setCoverImagePreview(null);
    setImageToDelete(true); // 기존 이미지 삭제 플래그 설정
  };

  const resetToOriginalImage = () => {
    setCoverImage(null);
    setCoverImagePreview(originalTrip?.cover_image || null);
    setImageToDelete(false);
  };

  const calculateDuration = () => {
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('여행 제목을 입력해주세요.');
      return false;
    }
    if (formData.title.length < 2 || formData.title.length > 60) {
      setError('여행 제목은 2-60자 사이여야 합니다.');
      return false;
    }
    if (!formData.country) {
      setError('국가를 선택해주세요.');
      return false;
    }
    if (!formData.start_date || !formData.end_date) {
      setError('여행 날짜를 선택해주세요.');
      return false;
    }
    if (new Date(formData.start_date) > new Date(formData.end_date)) {
      setError('시작 날짜가 종료 날짜보다 늦을 수 없습니다.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !originalTrip || !validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      let cover_image_url = originalTrip.cover_image || '';
      
      // 새 이미지가 업로드된 경우
      if (coverImage) {
        const imageRef = ref(storage, `trip-covers/${user.uid}/${Date.now()}_${coverImage.name}`);
        const snapshot = await uploadBytes(imageRef, coverImage);
        cover_image_url = await getDownloadURL(snapshot.ref);
      }

      // Trip 데이터 업데이트
      const tripData: any = {
        title: formData.title.trim(),
        country: formData.country,
        start_date: formData.start_date,
        end_date: formData.end_date,
        updated_at: Timestamp.now(),
      };

      // 이미지 처리
      if (imageToDelete) {
        // 기존 이미지 삭제
        tripData.cover_image = deleteField();
      } else if (coverImage) {
        // 새 이미지로 교체
        tripData.cover_image = cover_image_url;
      }
      // imageToDelete가 false이고 coverImage가 null이면 기존 이미지 유지 (업데이트 안함)

      // Firestore에서 업데이트
      await updateDoc(doc(db, 'trips', originalTrip.id), tripData);
      
      // 성공 시 해당 여행의 상세 페이지로 이동
      navigate(`/trips/${originalTrip.id}`);
    } catch (error) {
      console.error('여행 수정 실패:', error);
      setError('여행 수정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingTrip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-lg">여행 정보 로딩 중...</div>
      </div>
    );
  }

  if (error && !originalTrip) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
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
    <div className="min-h-screen">
      <Header />
      {/* Main Content */}
      <div className="pt-20 px-4 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-6 animate-fade-in">
            <h1 className="text-2xl-ko md:text-3xl-ko lg:text-4xl-ko xl:text-5xl-ko font-bold text-white moonwave-glow break-keep-ko">여행 수정하기</h1>
            <p className="text-sm-ko md:text-base-ko lg:text-lg-ko xl:text-xl-ko text-white/60 mt-2 tracking-ko-normal">여행 정보를 업데이트하세요</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
        {/* Cover Image Upload */}
        <GlassCard 
          variant="travel" 
          withWaveEffect={true}
          hoverable={true}
          className="animate-fade-in wave-optimized" 
          style={{ animationDelay: '0.1s' }}
        >
          <h3 className="text-lg-ko font-semibold text-white mb-4 tracking-ko-normal">커버 이미지</h3>
          
          {coverImagePreview ? (
            <div className="relative">
              <img
                src={coverImagePreview}
                alt="커버 이미지 미리보기"
                className="w-full h-40 md:h-48 lg:h-56 object-cover rounded-xl"
              />
              
              {/* Image Action Buttons */}
              <div className="absolute top-2 right-2 flex gap-2">
                {/* Replace Image Button */}
                <label className="cursor-pointer">
                  <div className="inline-flex items-center justify-center p-2 rounded-full bg-blue-500/20 hover:bg-blue-500/40 backdrop-blur-sm transition-all duration-300 wave-float">
                    <Edit2 className="w-4 h-4 text-blue-300" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {/* Delete Image Button */}
                <WaveButton
                  type="button"
                  onClick={deleteCurrentImage}
                  variant="secondary"
                  size="sm"
                  className="!p-2 !px-2 !py-2 rounded-full bg-red-500/20 hover:bg-red-500/40 backdrop-blur-sm"
                  ariaLabel="이미지 삭제"
                >
                  <Trash2 className="w-4 h-4 text-red-300" />
                </WaveButton>

                {/* Remove New Image / Reset Button */}
                {(coverImage || imageToDelete) && (
                  <WaveButton
                    type="button"
                    onClick={coverImage ? removeNewImage : resetToOriginalImage}
                    variant="secondary"
                    size="sm"
                    className="!p-2 !px-2 !py-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm"
                    ariaLabel={coverImage ? "새 이미지 취소" : "원본으로 복원"}
                  >
                    <X className="w-4 h-4 text-white" />
                  </WaveButton>
                )}
              </div>

              {/* Status Indicator */}
              <div className="absolute bottom-2 left-2">
                {coverImage && (
                  <div className="bg-green-500/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-green-300">
                    새 이미지
                  </div>
                )}
                {imageToDelete && !coverImage && (
                  <div className="bg-red-500/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-red-300">
                    삭제 예정
                  </div>
                )}
                {!coverImage && !imageToDelete && originalTrip?.cover_image && (
                  <div className="bg-blue-500/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-blue-300">
                    기존 이미지
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {imageToDelete && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                  <Trash2 className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <p className="text-red-300 text-sm">커버 이미지가 삭제됩니다</p>
                  <WaveButton
                    type="button"
                    onClick={resetToOriginalImage}
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-red-300 hover:text-red-200"
                  >
                    삭제 취소
                  </WaveButton>
                </div>
              )}
              
              <label className="block w-full h-40 md:h-48 lg:h-56 border-2 border-dashed border-white/30 rounded-xl cursor-pointer hover:border-white/50 transition-colors touch-optimized wave-float">
                <div className="flex flex-col items-center justify-center h-full text-white/60 hover:text-white/80">
                  <Upload className="w-8 h-8 mb-2 wave-pulse" />
                  <span className="text-sm-ko tracking-ko-normal">
                    {imageToDelete ? '새 이미지 업로드' : '이미지 업로드'}
                  </span>
                  <span className="text-xs-ko mt-1 text-white/40">최대 5MB</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </GlassCard>

        {/* Basic Info */}
        <GlassCard 
          variant="travel" 
          withWaveEffect={true}
          hoverable={true}
          className="animate-fade-in wave-optimized" 
          style={{ animationDelay: '0.2s' }}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm-ko font-medium mb-2 tracking-ko-normal">
                  여행 제목 *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="예: 도쿄 벚꽃 여행"
                  maxLength={60}
                  className="w-full px-4 py-3 bg-glass-light backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-primary-300 focus:ring-1 focus:ring-primary-300 touch-optimized transition-all"
                />
                <div className="text-xs-ko text-white/60 mt-1 text-numeric">
                  {formData.title.length}/60자
                </div>
              </div>

              <div>
                <label className="block text-white text-sm-ko font-medium mb-2 tracking-ko-normal">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  국가 *
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-3 bg-glass-light backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:border-primary-300 focus:ring-1 focus:ring-primary-300 touch-optimized transition-all"
                >
                  <option value="" disabled>국가를 선택해주세요</option>
                  {countries.map((country) => (
                    <option key={country} value={country} className="bg-primary-800 text-base-ko">
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm-ko font-medium mb-2 tracking-ko-normal">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  시작일 *
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-4 py-3 bg-glass-light backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:border-primary-300 focus:ring-1 focus:ring-primary-300 touch-optimized transition-all text-numeric"
                />
              </div>
              <div>
                <label className="block text-white text-sm-ko font-medium mb-2 tracking-ko-normal">
                  종료일 *
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  min={formData.start_date}
                  className="w-full px-4 py-3 bg-glass-light backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:border-primary-300 focus:ring-1 focus:ring-primary-300 touch-optimized transition-all text-numeric"
                />
              </div>
            </div>

            {/* Duration Display */}
            {formData.start_date && formData.end_date && (
              <GlassCard 
                variant="light" 
                className="animate-fade-in moonwave-glow"
              >
                <p className="text-white text-sm-ko text-center tracking-ko-normal">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  총 <span className="font-bold text-travel-blue text-numeric">{calculateDuration()}일</span> 여행
                </p>
              </GlassCard>
            )}
          </div>
        </GlassCard>

        {/* Error Message */}
        {error && (
          <GlassCard 
            variant="strong" 
            className="animate-fade-in wave-pulse"
          >
            <p className="text-error-foreground text-sm-ko text-center tracking-ko-normal break-keep-ko">{error}</p>
          </GlassCard>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <WaveButton
            type="button"
            variant="ghost"
            size="lg"
            onClick={() => navigate(`/trips/${originalTrip?.id}`)}
            className="flex-1 animate-fade-in touch-optimized"
            style={{ animationDelay: '0.3s' }}
            ariaLabel="취소"
          >
            취소
          </WaveButton>

          <WaveButton
            type="submit"
            variant="travel"
            size="lg"
            className="flex-1 animate-fade-in touch-optimized wave-optimized group relative overflow-hidden"
            style={{ animationDelay: '0.3s' }}
            disabled={loading}
            ariaLabel={loading ? '여행 수정 중' : '여행 수정하기'}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div>
                <span className="text-base-ko tracking-ko-normal">수정 중...</span>
              </div>
            ) : (
              <span className="text-base-ko tracking-ko-normal flex items-center justify-center space-x-2 group-hover:scale-105 transition-transform">
                <span>수정하기</span>
                <Calendar className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              </span>
            )}
          </WaveButton>
        </div>
      </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};