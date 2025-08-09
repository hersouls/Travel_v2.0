import { trace } from 'firebase/performance';
import { performance } from '../lib/firebase';

export const measurePerformance = (name: string) => {
  if (!performance) {
    console.warn('Performance monitoring not initialized');
    return {
      start: () => {},
      stop: () => {}
    };
  }

  const performanceTrace = trace(performance, name);
  
  return {
    start: () => {
      performanceTrace.start();
      console.log(`⏱️ Performance trace started: ${name}`);
    },
    stop: () => {
      performanceTrace.stop();
      console.log(`⏱️ Performance trace stopped: ${name}`);
    }
  };
};

export const measureDatabaseQuery = (queryName: string) => {
  return measurePerformance(`db_query_${queryName}`);
};

export const measurePageLoad = (pageName: string) => {
  return measurePerformance(`page_load_${pageName}`);
};

export const measureImageUpload = () => {
  return measurePerformance('image_upload');
};

export const measureMapRender = () => {
  return measurePerformance('map_render');
};

export const getCoreWebVitals = () => {
  if ('web-vital' in window) {
    // Web Vitals 측정 (실제 구현 시 web-vitals 라이브러리 사용)
    return {
      FCP: 0, // First Contentful Paint
      LCP: 0, // Largest Contentful Paint
      FID: 0, // First Input Delay
      CLS: 0, // Cumulative Layout Shift
      TTFB: 0 // Time to First Byte
    };
  }
  return null;
};