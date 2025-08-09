import { useState, useCallback } from 'react';

type LoadingKey = string;

export function useLoadingState() {
  const [loadingStates, setLoadingStates] = useState<Record<LoadingKey, boolean>>({});

  const isLoading = useCallback((key: LoadingKey) => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  const withLoading = useCallback(async <T>(
    key: LoadingKey, 
    asyncFn: () => Promise<T>
  ): Promise<T> => {
    setLoadingStates(prev => ({ ...prev, [key]: true }));
    
    try {
      const result = await asyncFn();
      return result;
    } finally {
      setLoadingStates(prev => ({ ...prev, [key]: false }));
    }
  }, []);

  const setLoading = useCallback((key: LoadingKey, loading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: loading }));
  }, []);

  return {
    isLoading,
    withLoading,
    setLoading
  };
}
