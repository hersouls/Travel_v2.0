import React from 'react';
import { cn } from '../lib/utils';
import { GlassCard } from './GlassCard';
import { Plan } from '../types/plan';
import { 
  MapPin, 
  Clock, 
  Camera, 
  Utensils, 
  Bed, 
  Car, 
  Star 
} from 'lucide-react';

interface PlanCardProps {
  plan: Plan;
  onClick?: () => void;
  className?: string;
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
      return '교통';
    default:
      return '기타';
  }
};

export const PlanCard: React.FC<PlanCardProps> = ({ 
  plan, 
  onClick, 
  className 
}) => {
  const formatTime = (time: string) => {
    return time.slice(0, 5); // HH:MM 형식으로 변환
  };

  return (
    <GlassCard
      variant="light"
      hoverable={!!onClick}
      className={cn(
        'cursor-pointer group transition-all duration-300',
        'hover:border-primary-300/40',
        className
      )}
      onClick={onClick}
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
            <span className={cn(
              'text-xs px-2 py-1 rounded-full border',
              'bg-white/5 border-white/20 text-white/70'
            )}>
              {getTypeLabel(plan.type)}
            </span>
          </div>
          
          {/* Time */}
          <div className="flex items-center space-x-2 text-white/80 mb-3">
            <Clock className="w-4 h-4" />
            <span className="text-sm">
              {formatTime(plan.start_time)}
              {plan.end_time && ` ~ ${formatTime(plan.end_time)}`}
            </span>
          </div>
          
          {/* Photos indicator */}
          {plan.photos && plan.photos.length > 0 && (
            <div className="flex items-center space-x-2 text-travel-orange">
              <Camera className="w-4 h-4" />
              <span className="text-sm">{plan.photos.length}장의 사진</span>
            </div>
          )}
          
          {/* Location indicator */}
          {plan.latitude && plan.longitude && (
            <div className="flex items-center space-x-2 text-travel-blue mt-2">
              <MapPin className="w-4 h-4" />
              <span className="text-xs text-white/60">위치 정보 있음</span>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};