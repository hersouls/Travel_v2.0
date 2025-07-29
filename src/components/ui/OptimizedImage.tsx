import React, { useState, useCallback, memo } from 'react';
import { cn } from '../../utils/cn';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = memo(({
  src,
  alt,
  className,
  width,
  height,
  loading = 'lazy',
  placeholder,
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  // WebP 지원 확인
  const supportsWebP = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  };

  // 최적화된 이미지 URL 생성
  const getOptimizedSrc = () => {
    if (hasError) return placeholder || src;
    
    // WebP 지원 시 WebP 포맷 사용
    if (supportsWebP() && !src.includes('.webp')) {
      // 실제 구현에서는 서버에서 WebP 변환을 제공해야 함
      return src;
    }
    
    return src;
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* 플레이스홀더 */}
      {!isLoaded && placeholder && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ backgroundImage: `url(${placeholder})` }}
        />
      )}
      
      {/* 실제 이미지 */}
      <img
        src={getOptimizedSrc()}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          objectFit: 'cover',
          width: width ? `${width}px` : '100%',
          height: height ? `${height}px` : 'auto',
        }}
      />
      
      {/* 로딩 스피너 */}
      {!isLoaded && !placeholder && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';