import * as React from 'react';
import '@city-ds/react/styles.css';
import '../src/storybook.css';
import type { Decorator, Preview } from '@storybook/react-vite';
import type { CityTheme } from '@city-ds/react';

const WithTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme as CityTheme;

  React.useEffect(() => {
    if (theme === 'system') {
      delete document.documentElement.dataset.theme;
    } else {
      document.documentElement.dataset.theme = theme;
    }

    return () => {
      delete document.documentElement.dataset.theme;
    };
  }, [theme]);

  return <Story />;
};

const preview: Preview = {
  decorators: [WithTheme],
  globalTypes: {
    theme: {
      description: 'Global color scheme',
      toolbar: {
        dynamicTitle: true,
        icon: 'contrast',
        items: [
          { title: 'System', value: 'system' },
          { title: 'Light', value: 'light' },
          { title: 'Dark', value: 'dark' },
        ],
      },
    },
  },
  initialGlobals: {
    theme: 'system',
  },
  parameters: {
    a11y: {
      test: 'error',
    },
    controls: {
      expanded: true,
    },
    docs: {
      source: {
        type: 'code',
      },
    },
    layout: 'centered',
    options: {
      storySort: {
        order: [
          '시작하기',
          'Actions',
          'Forms',
          'Navigation',
          'Overlays',
          'Feedback',
          'Data display',
        ],
      },
    },
  },
};

export default preview;
