import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

// 구독 타입 정의
export interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: 'USD' | 'KRW';
  paymentCycle: 'monthly' | 'yearly';
  status: 'active' | 'paused' | 'cancelled';
  nextPaymentDate: string;
  category: string;
  description?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

// 설정 타입 정의
export interface Preferences {
  exchangeRate: number;
  defaultCurrency: 'KRW';
  theme: 'dark' | 'light';
  language: 'ko' | 'en';
  timezone: string;
  dateFormat: string;
  currencyFormat: string;
}

interface DataContextType {
  subscriptions: Subscription[];
  preferences: Preferences | null;
  updatePreferences: (newPreferences: Partial<Preferences>) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 기본 설정
  const defaultPreferences = {
    exchangeRate: 1300,
    defaultCurrency: 'KRW' as const,
    theme: 'dark' as const,
    language: 'ko' as const,
    timezone: 'Asia/Seoul',
    dateFormat: 'YYYY-MM-DD',
    currencyFormat: 'KRW'
  };

  // 구독 데이터 구독
  useEffect(() => {
    if (!user) {
      setSubscriptions([]);
      setPreferences(defaultPreferences);
      setLoading(false);
      return;
    }

    const subscriptionsQuery = query(
      collection(db, 'subscriptions'),
      where('user_id', '==', user.uid)
    );

    const unsubscribeSubscriptions = onSnapshot(
      subscriptionsQuery,
      (snapshot) => {
        const subscriptionsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Subscription[];
        setSubscriptions(subscriptionsData);
      },
      (error) => {
        console.error('구독 데이터 로딩 실패:', error);
        setError('구독 데이터를 불러오는데 실패했습니다.');
      }
    );

    // 설정 데이터 구독
    const preferencesDoc = doc(db, 'users', user.uid);
    const unsubscribePreferences = onSnapshot(
      preferencesDoc,
      (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setPreferences({
            ...defaultPreferences,
            ...userData.preferences
          });
        } else {
          setPreferences(defaultPreferences);
        }
        setLoading(false);
      },
      (error) => {
        console.error('설정 데이터 로딩 실패:', error);
        setPreferences(defaultPreferences);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeSubscriptions();
      unsubscribePreferences();
    };
  }, [user]);

  const updatePreferences = async (newPreferences: Partial<Preferences>) => {
    if (!user) return;

    try {
      const userDoc = doc(db, 'users', user.uid);
      await updateDoc(userDoc, {
        preferences: {
          ...preferences,
          ...newPreferences
        },
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('설정 업데이트 실패:', error);
      throw error;
    }
  };

  const value: DataContextType = {
    subscriptions,
    preferences,
    updatePreferences,
    loading,
    error
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}
