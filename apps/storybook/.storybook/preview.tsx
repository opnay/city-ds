import * as React from 'react';
import '@city-ds/react/styles.css';
import '../src/storybook.css';
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import type { Decorator, Preview } from '@storybook/react-vite';
import { GLOBALS_UPDATED } from 'storybook/internal/core-events';
import type { CityTheme } from '@city-ds/react';

function resolveTheme(value: unknown): CityTheme {
  if (value === 'light' || value === 'dark') {
    return value;
  }

  return 'system';
}

function readThemeFromSearch(): CityTheme {
  const globals = new URLSearchParams(window.location.search).get('globals');
  const theme = globals
    ?.split(';')
    .find((entry) => entry.startsWith('theme:'))
    ?.slice('theme:'.length);

  return resolveTheme(theme);
}

function applyDocumentTheme(theme: CityTheme) {
  if (theme === 'system') {
    delete document.documentElement.dataset.theme;
    return;
  }

  document.documentElement.dataset.theme = theme;
}

function useDocumentTheme(theme: CityTheme) {
  React.useEffect(() => {
    applyDocumentTheme(theme);
  }, [theme]);
}

function CityDocsContainer({
  children,
  context,
  ...props
}: React.PropsWithChildren<DocsContainerProps>) {
  const [theme, setTheme] = React.useState<CityTheme>(readThemeFromSearch);

  React.useEffect(() => {
    const handleGlobalsUpdated = ({ globals }: { globals?: Record<string, unknown> }) => {
      setTheme(resolveTheme(globals?.theme));
    };

    context.channel.on(GLOBALS_UPDATED, handleGlobalsUpdated);

    return () => {
      context.channel.off(GLOBALS_UPDATED, handleGlobalsUpdated);
    };
  }, [context.channel]);

  useDocumentTheme(theme);

  return (
    <DocsContainer context={context} {...props}>
      {children}
    </DocsContainer>
  );
}

const WithTheme: Decorator = (Story, context) => {
  useDocumentTheme(resolveTheme(context.globals.theme));

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
        title: 'System',
        items: [
          { title: 'System', value: 'system' },
          { title: 'Light', value: 'light' },
          { title: 'Dark', value: 'dark' },
        ],
      },
    },
  },
  parameters: {
    a11y: {
      context: {
        exclude: ['[data-base-ui-focus-guard]'],
      },
      test: 'error',
    },
    controls: {
      expanded: true,
    },
    docs: {
      container: CityDocsContainer,
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
