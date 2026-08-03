import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

window.scrollTo = () => undefined;
HTMLElement.prototype.scrollIntoView = () => undefined;

if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    addEventListener: () => undefined,
    addListener: () => undefined,
    dispatchEvent: () => false,
    matches: false,
    media: query,
    onchange: null,
    removeEventListener: () => undefined,
    removeListener: () => undefined,
  });
}

afterEach(() => {
  cleanup();
  delete document.documentElement.dataset.theme;
  window.localStorage.clear();
  window.history.replaceState(null, '', '/');
});
