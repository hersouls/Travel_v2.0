import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { WaveButton } from './WaveButton';
import { GlassCard } from './GlassCard';

interface PhotoModalProps {
  photos: string[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
  placeName?: string;
}

export const PhotoModal: React.FC<PhotoModalProps> = ({
  photos,
  isOpen,
  onClose,
  initialIndex = 0,
  placeName = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Reset index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, photos.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  if (!isOpen || photos.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      {/* Close button */}
      <WaveButton
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 bg-black/30 hover:bg-black/50 rounded-full p-3"
        ariaLabel="닫기"
      >
        <X className="w-6 h-6 text-white" />
      </WaveButton>

      {/* Navigation buttons */}
      {photos.length > 1 && (
        <>
          <WaveButton
            variant="ghost"
            size="sm"
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 rounded-full p-3"
            ariaLabel="이전 사진"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </WaveButton>

          <WaveButton
            variant="ghost"
            size="sm"
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 rounded-full p-3"
            ariaLabel="다음 사진"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </WaveButton>
        </>
      )}

      {/* Main content */}
      <div className="flex flex-col items-center justify-center max-w-7xl max-h-full p-4">
        {/* Image */}
        <div className="relative mb-4">
          <img
            src={photos[currentIndex]}
            alt={`${placeName} 사진 ${currentIndex + 1}`}
            className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
          />
        </div>

        {/* Info panel */}
        <GlassCard variant="light" className="max-w-md">
          <div className="text-center space-y-2">
            {placeName && (
              <h3 className="text-lg font-semibold text-white">
                {placeName}
              </h3>
            )}
            <div className="flex items-center justify-center space-x-4 text-white/70 text-sm">
              <span>{currentIndex + 1} / {photos.length}</span>
            </div>
            
            {/* Thumbnail navigation */}
            {photos.length > 1 && (
              <div className="flex justify-center space-x-2 mt-4 overflow-x-auto max-w-full">
                {photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${
                      index === currentIndex 
                        ? 'ring-2 ring-primary-400 scale-110' 
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`썸네일 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Click outside to close */}
      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
      />
    </div>
  );
};