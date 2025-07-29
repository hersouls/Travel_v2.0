import { useEffect, useCallback, useRef } from 'react';

// Browser API type declarations
declare global {
  interface Window {
    PerformanceObserver: typeof PerformanceObserver;
    webkitAudioContext: typeof AudioContext;
  }
}

interface PerformanceMetrics {
  FCP: number; // First Contentful Paint
  LCP: number; // Largest Contentful Paint
  FID: number; // First Input Delay
  CLS: number; // Cumulative Layout Shift
  TTFB: number; // Time to First Byte
}

interface PerformanceMonitorOptions {
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

// Performance entry types
interface FirstInputEntry extends PerformanceEntry {
  processingStart: number;
}

interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

export const usePerformanceMonitor = (options: PerformanceMonitorOptions = {}) => {
  const {
    onMetricsUpdate,
    onError,
    enabled = true
  } = options;

  const observerRef = useRef<PerformanceObserver | null>(null);
  const metricsRef = useRef<PerformanceMetrics>({
    FCP: 0,
    LCP: 0,
    FID: 0,
    CLS: 0,
    TTFB: 0
  });

  // FCP (First Contentful Paint) 측정
  const measureFCP = useCallback(() => {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        
        if (fcpEntry) {
          metricsRef.current.FCP = fcpEntry.startTime;
          onMetricsUpdate?.(metricsRef.current);
        }
      });

      observer.observe({ entryTypes: ['paint'] });
      observerRef.current = observer;
    } catch (error) {
      onError?.(error as Error);
    }
  }, [onMetricsUpdate, onError]);

  // LCP (Largest Contentful Paint) 측정
  const measureLCP = useCallback(() => {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        if (lastEntry) {
          metricsRef.current.LCP = lastEntry.startTime;
          onMetricsUpdate?.(metricsRef.current);
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (error) {
      onError?.(error as Error);
    }
  }, [onMetricsUpdate, onError]);

  // FID (First Input Delay) 측정
  const measureFID = useCallback(() => {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'first-input') {
            const firstInputEntry = entry as FirstInputEntry;
            metricsRef.current.FID = firstInputEntry.processingStart - entry.startTime;
            onMetricsUpdate?.(metricsRef.current);
          }
        });
      });

      observer.observe({ entryTypes: ['first-input'] });
    } catch (error) {
      onError?.(error as Error);
    }
  }, [onMetricsUpdate, onError]);

  // CLS (Cumulative Layout Shift) 측정
  const measureCLS = useCallback(() => {
    if (!('PerformanceObserver' in window)) return;

    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'layout-shift') {
            const layoutShiftEntry = entry as LayoutShiftEntry;
            if (!layoutShiftEntry.hadRecentInput) {
              clsValue += layoutShiftEntry.value;
              metricsRef.current.CLS = clsValue;
              onMetricsUpdate?.(metricsRef.current);
            }
          }
        });
      });

      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      onError?.(error as Error);
    }
  }, [onMetricsUpdate, onError]);

  // TTFB (Time to First Byte) 측정
  const measureTTFB = useCallback(() => {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            metricsRef.current.TTFB = navEntry.responseStart - navEntry.requestStart;
            onMetricsUpdate?.(metricsRef.current);
          }
        });
      });

      observer.observe({ entryTypes: ['navigation'] });
    } catch (error) {
      onError?.(error as Error);
    }
  }, [onMetricsUpdate, onError]);

  // 성능 등급 계산
  const getPerformanceGrade = useCallback((metrics: PerformanceMetrics) => {
    let score = 0;
    
    // LCP 점수 (33점)
    if (metrics.LCP < 1000) score += 33;
    else if (metrics.LCP < 2500) score += 16;
    
    // FID 점수 (33점)
    if (metrics.FID < 100) score += 33;
    else if (metrics.FID < 300) score += 16;
    
    // CLS 점수 (34점)
    if (metrics.CLS < 0.1) score += 34;
    else if (metrics.CLS < 0.25) score += 17;
    
    if (score >= 90) return 'A';
    if (score >= 70) return 'B';
    if (score >= 50) return 'C';
    return 'D';
  }, []);

  // 성능 모니터링 시작
  const startMonitoring = useCallback(() => {
    if (!enabled) return;

    measureFCP();
    measureLCP();
    measureFID();
    measureCLS();
    measureTTFB();
  }, [enabled, measureFCP, measureLCP, measureFID, measureCLS, measureTTFB]);

  // 컴포넌트 마운트 시 모니터링 시작
  useEffect(() => {
    if (enabled) {
      startMonitoring();
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enabled, startMonitoring]);

  return {
    metrics: metricsRef.current,
    getPerformanceGrade,
    startMonitoring
  };
};