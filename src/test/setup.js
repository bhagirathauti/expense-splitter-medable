import '@testing-library/jest-dom';

// Mock functions for window methods that might not be available in JSDOM
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};