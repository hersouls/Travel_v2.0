import React from 'react';
import { WaveBackground } from './WaveBackground';
import { WaveButton } from './WaveButton';
import { GlassCard } from './GlassCard';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface IntroPageProps {
  onEnter: () => void;
}

export const IntroPage: React.FC<IntroPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Wave Background */}
      <WaveBackground />
      
      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6 animate-fade-in">
        <GlassCard 
          variant="strong" 
          withWaveEffect={true}
          className="mb-8"
        >
          {/* Logo */}
          <div className="mb-8">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=120&h=120&fit=crop"
              alt="Moonwave Logo"
              className="w-24 h-24 mx-auto mb-6 rounded-full shadow-2xl wave-pulse wave-optimized"
            />
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 break-keep-ko wave-pulse">
            Moonwave
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl lg:text-2xl text-white/90 leading-relaxed break-keep-ko mb-4">
            파동과 유리의 조화로 만나는
          </p>
          <p className="text-lg sm:text-xl lg:text-2xl text-white/90 leading-relaxed break-keep-ko">
            몽환적인 음악 경험
          </p>
        </GlassCard>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <WaveButton
            onClick={onEnter}
            variant="primary"
            size="lg"
            ariaLabel="음악 플레이어 시작하기"
            className="min-w-[200px]"
          >
            음악으로 만나기
          </WaveButton>
          
          <WaveButton
            onClick={() => {/* 향후 플레이리스트 기능 */}}
            variant="secondary"
            size="lg"
            ariaLabel="플레이리스트 보기"
            className="min-w-[200px]"
          >
            플레이리스트 보기
          </WaveButton>
        </div>
        
        {/* Quote */}
        <GlassCard 
          variant="light" 
          className="mt-12 max-w-2xl mx-auto"
        >
          <p className="text-white/80 italic text-sm sm:text-base break-keep-ko">
            "타고난 것보다 만들어가는 것"
          </p>
        </GlassCard>
      </div>
    </div>
  );
};