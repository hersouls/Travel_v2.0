import '@testing-library/jest-dom';

// Mock TextEncoder and TextDecoder for Jest environment
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder } = require('util');
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  const { TextDecoder } = require('util');
  global.TextDecoder = TextDecoder;
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock Audio API
Object.defineProperty(window, 'Audio', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    play: jest.fn().mockResolvedValue(undefined),
    pause: jest.fn(),
    load: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    currentTime: 0,
    duration: 0,
    volume: 1,
    muted: false,
    paused: true,
    ended: false,
  })),
});

// Mock Howler.js
jest.mock('howler', () => ({
  Howl: jest.fn().mockImplementation(() => ({
    play: jest.fn(),
    pause: jest.fn(),
    stop: jest.fn(),
    volume: jest.fn(),
    seek: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    duration: jest.fn(() => 180),
    playing: jest.fn(() => false),
  })),
  Howler: {
    volume: jest.fn(),
    mute: jest.fn(),
    stop: jest.fn(),
  },
}));