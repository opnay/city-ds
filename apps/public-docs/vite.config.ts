import mdx from '@mdx-js/rollup';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
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
    environment: 'jsdom',
    maxWorkers: 2,
    setupFiles: ['./src/test-setup.ts'],
  },
});
