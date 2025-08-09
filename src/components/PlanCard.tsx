import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { GlassCard } from './GlassCard';
import { PhotoModal } from './PhotoModal';
import { YouTubeEmbed } from './YouTubeEmbed';
import { Plan } from '../types/plan';
import { 
  MapPin, 
  Clock, 
  Camera, 
  Utensils, 
  Bed, 
  Car, 
  Star,
  Edit,
  Trash2,
  ExternalLink,
  Globe,
  Plane,
  Navigation

} from 'lucide-react';

interface PlanCardProps extends React.HTMLAttributes<HTMLDivElement> {
  plan: Plan;
  onClick?: (e: React.MouseEvent) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
  showActions?: boolean;
}

const getTypeIcon = (type: Plan['type']) => {
  switch (type) {
    case 'attraction':
      return <Star className="w-5 h-5" />;
    case 'restaurant':
      return <Utensils className="w-5 h-5" />;
    case 'hotel':
      return <Bed className="w-5 h-5" />;
    case 'transport':
      return <Car className="w-5 h-5" />;
    case 'car':
      return <Car className="w-5 h-5" />;
    case 'plane':
      return <Plane className="w-5 h-5" />;
    case 'airport':
      return <Navigation className="w-5 h-5" />;
    case 'other':
      return <MapPin className="w-5 h-5" />;
    default:
      return <MapPin className="w-5 h-5" />;
  }
};

const getTypeColor = (type: Plan['type']) => {
  switch (type) {
    case 'attraction':
      return 'text-travel-orange';
    case 'restaurant':
      return 'text-travel-green';
    case 'hotel':
      return 'text-travel-purple';
    case 'transport':
      return 'text-travel-blue';
    case 'car':
      return 'text-travel-blue';
    case 'plane':
      return 'text-travel-blue';
    case 'airport':
      return 'text-travel-blue';
    case 'other':
      return 'text-white/80';
    default:
      return 'text-white/80';
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
      return '대중교통';
    case 'car':
      return '자동차';
    case 'plane':
      return '비행기';
    case 'airport':
      return '공항';
    case 'other':
      return '기타';
    default:
      return '기타';
  }
};

export const PlanCard: React.FC<PlanCardProps> = ({ 
  plan, 
  onClick, 
  onEdit,
  onDelete,
  className,
  showActions = true,
  ...props
}) => {
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const formatTime = (time: string) => {
    return time.slice(0, 5); // HH:MM 형식으로 변환
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // 액션 버튼, 사진, 유튜브 관련 클릭 시 카드 클릭 이벤트 방지
    const target = e.target as HTMLElement;
    if (
      target.closest('.action-button') ||
      target.closest('[data-youtube-embed]') ||
      target.closest('[data-photo-modal]') ||
      target.closest('iframe') ||
      target.closest('.youtube-thumbnail') ||
      target.closest('.youtube-play-button')
    ) {
      return;
    }
    onClick?.(e);
  };

  const handlePhotoClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setSelectedPhotoIndex(index);
    setIsPhotoModalOpen(true);
  };

  return (
    <GlassCard
      variant="light"
      hoverable={!!onClick}
      className={cn(
        'cursor-pointer group transition-all duration-300',
        'hover:border-primary-300/40 hover:shadow-lg hover:shadow-primary-500/10',
        'border border-white/10',
        className
      )}
      onClick={handleCardClick}
      {...props}
    >
      <div className="flex items-start space-x-4">
        {/* Type Icon */}
        <div className={cn(
          'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center',
          'bg-gradient-to-br from-white/10 to-white/5 border border-white/20',
          getTypeColor(plan.type)
        )}>
          {getTypeIcon(plan.type)}
        </div>
        
        {/* Plan Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-lg font-semibold text-white truncate group-hover:text-primary-300 transition-colors">
              {plan.place_name}
            </h4>
            <div className="flex items-center space-x-2">
              <span className={cn(
                'text-xs px-2 py-1 rounded-full border',
                'bg-white/5 border-white/20 text-white/70'
              )}>
                {getTypeLabel(plan.type)}
              </span>
              
              {/* Action Buttons */}
              {showActions && (onEdit || onDelete) && (
                <div className="flex items-center space-x-1 opacity-80 sm:opacity-60 sm:group-hover:opacity-100 transition-opacity">
                  {onEdit && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                      }}
                      className="action-button p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 transition-colors"
                      aria-label="일정 편집"
                    >
                      <Edit className="w-3 h-3 text-blue-300" />
                    </button>
                  )}
                  
                  {onDelete && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('이 일정을 삭제하시겠습니까?')) {
                          onDelete();
                        }
                      }}
                      className="action-button p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 transition-colors"
                      aria-label="일정 삭제"
                    >
                      <Trash2 className="w-3 h-3 text-red-300" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Time */}
          <div className="flex items-center space-x-2 text-white/80 mb-3">
            <Clock className="w-4 h-4" />
            <span className="text-sm">
              {formatTime(plan.start_time)}
              {plan.end_time && ` ~ ${formatTime(plan.end_time)}`}
            </span>
          </div>
          
          {/* Opening Hours */}
          {plan.opening_hours && (
            <div className="flex items-center space-x-2 text-white/80 mb-2">
              <Clock className="w-4 h-4 text-travel-green" />
              <span className="text-sm">{plan.opening_hours}</span>
            </div>
          )}
          
          {/* Photos */}
          {plan.photos && plan.photos.length > 0 && (
            <div className="space-y-2">
              {/* Photos header */}
              <div className="flex items-center space-x-2 text-travel-orange">
                <Camera className="w-4 h-4" />
                <span className="text-sm">{plan.photos.length}장의 사진</span>
              </div>
              
              {/* Photos grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {plan.photos.slice(0, 4).map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`${plan.place_name} 사진 ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-lg transition-transform group-hover:scale-105 cursor-pointer"
                      onClick={(e) => handlePhotoClick(e, index)}
                    />
                    {/* 마지막 썸네일에 남은 사진 개수 표시 */}
                    {index === 3 && plan.photos && plan.photos.length > 4 && (
                      <div 
                        className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors"
                        onClick={(e) => handlePhotoClick(e, index)}
                      >
                        <span className="text-white text-sm font-semibold">
                          +{plan.photos.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* YouTube Video */}
          {plan.youtube_link && (
            <div className="mt-3 mb-4">
              <YouTubeEmbed
                url={plan.youtube_link}
                title={`${plan.place_name} 비디오`}
                className="w-full"
              />
            </div>
          )}
          
          {/* Location and External Links */}
          <div className={`flex items-center justify-between ${plan.youtube_link ? 'mt-2' : 'mt-4'}`}>
            {plan.latitude && plan.longitude && (
              <div className="flex items-center space-x-2 text-travel-blue">
                <MapPin className="w-4 h-4" />
                <span className="text-xs text-white/60">위치 정보 있음</span>
              </div>
            )}
            
            <div className="flex items-center space-x-3">
              {plan.website && (
                <a
                  href={plan.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center space-x-1 text-travel-purple hover:text-travel-purple/80 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-xs">홈페이지</span>
                </a>
              )}
              
              {plan.youtube_link && (
                <a
                  href={plan.youtube_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center space-x-1 text-travel-orange hover:text-travel-orange/80 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-xs">유튜브</span>
                </a>
              )}
              
              {plan.map_url && (
                <a
                  href={plan.map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center space-x-1 text-travel-green hover:text-travel-green/80 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-xs">지도</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Photo Modal */}
      {plan.photos && plan.photos.length > 0 && (
        <PhotoModal
          photos={plan.photos}
          isOpen={isPhotoModalOpen}
          onClose={() => setIsPhotoModalOpen(false)}
          initialIndex={selectedPhotoIndex}
          placeName={plan.place_name}
        />
      )}
    </GlassCard>
  );
};