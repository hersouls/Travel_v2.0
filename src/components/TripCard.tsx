import React from 'react';
import { cn } from '../lib/utils';
import { GlassCard } from './GlassCard';
import { Trip } from '../types/trip';
import { MapPin, Calendar, Image } from 'lucide-react';

interface TripCardProps {
  trip: Trip;
  onClick?: () => void;
  className?: string;
}

export const TripCard: React.FC<TripCardProps> = ({ 
  trip, 
  onClick, 
  className 
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
      onClick={onClick}
    >
      {/* Cover Image */}
      <div className="relative w-full h-40 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-travel-blue/20 to-travel-purple/20">
        {trip.cover_image ? (
          <img 
            src={trip.cover_image} 
            alt={trip.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Image className="w-12 h-12 text-white/60" />
          </div>
        )}
        
        {/* Duration Badge */}
        <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-white text-sm font-semibold">{getDuration()}</span>
        </div>
      </div>

      {/* Trip Info */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-white group-hover:text-travel-blue transition-colors">
          {trip.title}
        </h3>
        
        <div className="flex items-center space-x-2 text-white/80">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{trip.country}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-white/80">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">
            {formatDate(trip.start_date)} ~ {formatDate(trip.end_date)}
          </span>
        </div>
        
        {trip.plans_count !== undefined && (
          <div className="flex justify-between items-center pt-2 border-t border-white/10">
            <span className="text-white/60 text-sm">일정</span>
            <span className="text-travel-orange font-semibold">{trip.plans_count}개</span>
          </div>
        )}
      </div>
    </GlassCard>
  );
};