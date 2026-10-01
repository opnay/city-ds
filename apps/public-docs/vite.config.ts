import mdx from '@mdx-js/rollup';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import remarkGfm from 'remark-gfm';
import { defineConfig } from 'vitest/config';

const mdxPlugin = mdx({
  providerImportSource: '@mdx-js/react',
  remarkPlugins: [remarkGfm],
});

export default defineConfig({
  plugins: [
    tanstackRouter({
      autoCodeSplitting: true,
      target: 'react',
    }),
    { ...mdxPlugin, enforce: 'pre' },
    react({ include: /\.(?:js|jsx|md|mdx|ts|tsx)$/ }),
  ],
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'jsdom',
          isolate: false,
          environment: 'jsdom',
          include: ['src/**/*.test.{ts,tsx}'],
          maxWorkers: 2,
          setupFiles: ['./src/test-setup.ts'],
          // Route tests load MDX and examples on demand, including cold transforms in CI.
          testTimeout: 15_000,
        },
      },
      {
        extends: true,
        test: {
          name: 'chromium',
          include: ['tests/browser/**/*.test.{ts,tsx}'],
          setupFiles: ['./tests/browser/setup.ts'],
          browser: {
            enabled: true,
            headless: true,
            fileParallelism: false,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
          testTimeout: 30_000,
        },
      },
    ],
  },
});
