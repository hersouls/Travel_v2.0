import React, { Suspense, lazy, ComponentType } from 'react';
import { Loading } from './ui/Loading';

interface LazyLoaderProps {
  component: () => Promise<{ default: ComponentType<Record<string, unknown>> }>;
  fallback?: React.ReactNode;
  props?: Record<string, unknown>;
}

export const LazyLoader: React.FC<LazyLoaderProps> = ({ 
  component, 
  fallback = <Loading />, 
  props = {} 
}) => {
  const LazyComponent = lazy(component);

  return (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// 자주 사용되는 컴포넌트들의 지연 로딩 래퍼
export const LazyTrackDetail = () => import('../pages/TrackDetailPage');
export const LazyLyricsSync = () => import('./player/LyricsSync');
export const LazyModal = () => import('./ui/Modal');