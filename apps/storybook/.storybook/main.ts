import tailwindcss from '@tailwindcss/vite';
import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  viteFinal: (config) =>
    mergeConfig(config, {
      plugins: [tailwindcss()],
      optimizeDeps: {
        include: ['@city-ds/react > @base-ui/react/accordion'],
      },
    }),
};

export default config;
