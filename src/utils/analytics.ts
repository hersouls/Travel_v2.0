import { logEvent } from 'firebase/analytics';
import { analytics } from '../lib/firebase';

export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (!analytics) {
    console.warn('Analytics not initialized');
    return;
  }

  try {
    logEvent(analytics, eventName, parameters);
    console.log(`📊 Event tracked: ${eventName}`, parameters);
  } catch (error) {
    console.warn('Analytics event tracking failed:', error);
  }
};

export const trackPageView = (pageName: string, userId?: string) => {
  trackEvent('page_view', {
    page_title: pageName,
    user_id: userId
  });
};

export const trackTripCreated = (tripId: string, userId: string) => {
  trackEvent('trip_created', {
    trip_id: tripId,
    user_id: userId
  });
};

export const trackPlanAdded = (tripId: string, userId: string) => {
  trackEvent('plan_added', {
    trip_id: tripId,
    user_id: userId
  });
};

export const trackPlaceSearched = (query: string, userId: string) => {
  trackEvent('place_searched', {
    search_term: query,
    user_id: userId
  });
};

export const trackImageUploaded = (tripId: string, userId: string) => {
  trackEvent('image_uploaded', {
    trip_id: tripId,
    user_id: userId
  });
};

export const trackMapViewed = (tripId: string, userId: string) => {
  trackEvent('map_viewed', {
    trip_id: tripId,
    user_id: userId
  });
};