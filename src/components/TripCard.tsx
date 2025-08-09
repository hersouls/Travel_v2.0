import React from 'react';
import { cn } from '../lib/utils';
import { GlassCard } from './GlassCard';
import { Trip } from '../types/trip';
import { MapPin, Calendar, Image, Edit, Trash2 } from 'lucide-react';

interface TripCardProps extends React.HTMLAttributes<HTMLDivElement> {
  trip: Trip;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
  showActions?: boolean;
}

export const TripCard: React.FC<TripCardProps> = ({ 
  trip, 
  onClick, 
  onEdit,
  onDelete,
  className,
  showActions = false,
  ...props
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDuration = () => {
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return `${diffDays}일`;
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // 액션 버튼 클릭 시 카드 클릭 이벤트 방지
    if ((e.target as HTMLElement).closest('.action-button')) {
      return;
    }
    onClick?.();
  };

  return (
    <GlassCard
      variant="travel"
      hoverable={!!onClick}
      withWaveEffect={true}
      className={cn(
        'cursor-pointer group transition-all duration-300',
        'hover:scale-105 hover:shadow-2xl',
        className
      )}
      onClick={handleCardClick}
      {...props}
    >
      {/* Cover Image */}
      <div className="relative w-full h-32 sm:h-36 md:h-40 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-travel-blue/20 to-travel-purple/20">
        {trip.cover_image ? (
          <img 
            src={trip.cover_image} 
            alt={trip.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Image className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white/60" />
          </div>
        )}
        
        {/* Duration Badge */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1 sm:px-3 sm:py-1">
          <span className="text-white text-xs sm:text-sm font-semibold">{getDuration()}</span>
        </div>

        {/* Action Buttons */}
        {showActions && (onEdit || onDelete) && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex items-center space-x-1 opacity-80 sm:opacity-60 sm:group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="action-button p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 transition-colors backdrop-blur-sm"
                aria-label="여행 편집"
              >
                <Edit className="w-3 h-3 text-blue-300" />
              </button>
            )}
            
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('이 여행을 삭제하시겠습니까?')) {
                    onDelete();
                  }
                }}
                className="action-button p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 transition-colors backdrop-blur-sm"
                aria-label="여행 삭제"
              >
                <Trash2 className="w-3 h-3 text-red-300" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Trip Info */}
      <div className="space-y-2 sm:space-y-3">
        <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-travel-blue transition-colors line-clamp-2">
          {trip.title}
        </h3>
        
        <div className="flex items-center space-x-2 text-white/80">
          <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-xs sm:text-sm">{trip.country}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-white/80">
          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-xs sm:text-sm">
            {formatDate(trip.start_date)} ~ {formatDate(trip.end_date)}
          </span>
        </div>
        
        {trip.plans_count !== undefined && (
          <div className="flex justify-between items-center pt-2 border-t border-white/10">
            <span className="text-white/60 text-xs sm:text-sm">일정</span>
            <span className="text-travel-orange font-semibold text-xs sm:text-sm">{trip.plans_count}개</span>
          </div>
        )}
      </div>
    </GlassCard>
  );
};