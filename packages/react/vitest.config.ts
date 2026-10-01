import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    // Reuse the DOM and imported modules; tests unmount their renders after each case.
    isolate: false,
    setupFiles: ['./tests/setup.ts'],
  },
});
