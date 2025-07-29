/// <reference types="vite/client" />

// Environment Variables
interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_URL: string
  readonly VITE_AUDIO_BUFFER_SIZE: string
  readonly VITE_AUDIO_SAMPLE_RATE: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_PWA: string
  readonly VITE_ENABLE_OFFLINE: string
  readonly VITE_DEV_MODE: string
  readonly VITE_ENABLE_HOT_RELOAD: string
  readonly VITE_ENABLE_SOURCE_MAPS: string
  readonly VITE_ENABLE_COMPRESSION: string
  readonly VITE_ENABLE_CACHING: string
  readonly VITE_ENABLE_PREFETCH: string
}

interface _ImportMeta {
  readonly env: ImportMetaEnv
}

// Global Types
declare global {
  interface Window {
    __MOONWAVE_APP__: {
      version: string
      environment: string
    }
  }
}

// Audio API Extensions
interface _HTMLAudioElement {
  mozAudioChannelType?: string
  webkitAudioContext?: AudioContext
}

// PWA Types
interface _BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

// Service Worker Types
interface _ServiceWorkerRegistration {
  pushManager: PushManager
}

interface PushManager {
  subscribe(options?: PushSubscriptionOptions): Promise<PushSubscription>
  getSubscription(): Promise<PushSubscription | null>
  permissionState(options?: PushSubscriptionOptions): Promise<PermissionState>
}

// Performance API Extensions
interface _PerformanceObserverEntryList {
  getEntries(): PerformanceEntry[]
  getEntriesByType(type: string): PerformanceEntry[]
  getEntriesByName(name: string, type?: string): PerformanceEntry[]
}

// Web Audio API
interface AudioContext {
  createMediaElementSource(mediaElement: HTMLMediaElement): MediaElementAudioSourceNode
}

interface MediaElementAudioSourceNode extends AudioNode {
  mediaElement: HTMLMediaElement
}

// Custom Event Types
interface CustomEventMap {
  'audio:play': CustomEvent<{ trackId: string }>
  'audio:pause': CustomEvent<{ trackId: string }>
  'audio:ended': CustomEvent<{ trackId: string }>
  'audio:timeupdate': CustomEvent<{ currentTime: number; duration: number }>
  'player:statechange': CustomEvent<{ state: any }>
  'track:select': CustomEvent<{ track: any }>
  'lyrics:sync': CustomEvent<{ lineId: string; time: number }>
}

declare global {
  interface DocumentEventMap extends CustomEventMap {}
}

export {}