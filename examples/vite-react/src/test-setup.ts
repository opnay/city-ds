import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

window.scrollTo = () => undefined;

afterEach(() => {
  cleanup();
  delete document.documentElement.dataset.theme;
  window.history.replaceState(null, '', '/');
});
