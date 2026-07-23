import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CITY_THEMES } from '../src/theme';

const stylesCss = readFileSync(resolve(process.cwd(), 'src/styles/index.css'), 'utf8');
const themeCss = readFileSync(resolve(process.cwd(), 'src/styles/theme.css'), 'utf8');
const consumerCss = [
  readFileSync(resolve(process.cwd(), '../../apps/vite-react/src/smoke.css'), 'utf8'),
  readFileSync(resolve(process.cwd(), '../../apps/next-react/app/smoke.css'), 'utf8'),
].join('\n');
const packageJson = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8')) as {
  exports: Record<string, string>;
};

const colorTokens = [
  '--city-color-background',
  '--city-color-foreground',
  '--city-color-surface',
  '--city-color-surface-raised',
  '--city-color-muted',
  '--city-color-muted-foreground',
  '--city-color-border',
  '--city-color-input',
  '--city-color-ring',
  '--city-color-primary',
  '--city-color-primary-foreground',
  '--city-color-destructive',
  '--city-color-destructive-foreground',
  '--city-color-warning',
  '--city-color-success',
  '--city-color-info',
];

const shadowTokens = ['--city-shadow-sm', '--city-shadow-panel', '--city-shadow-popup'];

const spacingTokens = [
  '--city-space-0',
  '--city-space-0-5',
  '--city-space-1',
  '--city-space-1-5',
  '--city-space-2',
  '--city-space-2-5',
  '--city-space-3',
  '--city-space-3-5',
  '--city-space-4',
  '--city-space-5',
  '--city-space-6',
  '--city-space-8',
  '--city-space-10',
  '--city-space-12',
  '--city-space-16',
];

const typographyTokens = [
  '--city-font-family-sans',
  '--city-font-family-mono',
  '--city-font-size-xs',
  '--city-font-size-sm',
  '--city-font-size-md',
  '--city-font-size-lg',
  '--city-line-height-xs',
  '--city-line-height-sm',
  '--city-line-height-md',
  '--city-line-height-lg',
  '--city-font-weight-regular',
  '--city-font-weight-medium',
  '--city-font-weight-semibold',
];

const radiusTokens = [
  '--city-radius-xs',
  '--city-radius-sm',
  '--city-radius-md',
  '--city-radius-lg',
  '--city-radius-full',
];

const controlTokens = ['--city-control-sm', '--city-control-md', '--city-control-lg'];

const motionTokens = [
  '--city-duration-fast',
  '--city-duration-normal',
  '--city-duration-slow',
  '--city-easing-standard',
  '--city-easing-enter',
  '--city-easing-exit',
];

const foundationTokens = [
  '--city-space-unit',
  ...spacingTokens,
  ...typographyTokens,
  ...radiusTokens,
  ...controlTokens,
  ...motionTokens,
];

describe('theme contract', () => {
  it('includes Tailwind Preflight in the app stylesheet only', () => {
    expect(stylesCss).toContain("@import 'tailwindcss';");
    expect(stylesCss).toContain("@import './theme.css';");
    expect(stylesCss).toContain("@source '../**/*.{ts,tsx}';");

    expect(packageJson.exports['./styles.css']).toBe('./dist/styles.css');
    expect(packageJson.exports['./theme.css']).toBe('./src/styles/theme.css');

    expect(stylesCss).toContain('color-scheme: light');
    expect(themeCss).not.toContain("@import 'tailwindcss'");
    expect(themeCss).not.toContain('@source');
    expect(themeCss).not.toMatch(/(^|\n)\s*color-scheme\s*:/);
  });

  it('supports light, dark, and system themes', () => {
    expect(CITY_THEMES).toEqual(['light', 'dark', 'system']);
    expect(themeCss).toContain("[data-theme='light']");
    expect(themeCss).toContain("[data-theme='dark']");
    expect(themeCss).toContain('(prefers-color-scheme: dark)');
  });

  it.each(foundationTokens)('publishes foundation token %s', (token) => {
    expect(themeCss).toContain(token);
  });

  it.each([...colorTokens, ...shadowTokens])(
    'defines theme-dependent token %s for light, dark, and system',
    (token) => {
      expect(themeCss.match(new RegExp(`${token}:`, 'g'))).toHaveLength(3);
    },
  );

  it('connects public tokens to Tailwind theme namespaces', () => {
    expect(themeCss).toContain('--spacing: var(--city-space-unit);');

    for (const token of colorTokens) {
      const name = token.replace('--city-color-', '');
      expect(themeCss).toContain(`--color-city-${name}: var(${token});`);
    }

    for (const token of spacingTokens) {
      const name = token.replace('--city-space-', '');
      expect(themeCss).toContain(`--spacing-city-${name}: var(${token});`);
    }

    for (const token of radiusTokens) {
      const name = token.replace('--city-radius-', '');
      expect(themeCss).toContain(`--radius-city-${name}: var(${token});`);
    }

    for (const token of shadowTokens) {
      const name = token.replace('--city-shadow-', '');
      const tailwindName = name === 'sm' ? '--shadow-sm' : `--shadow-city-${name}`;
      expect(themeCss).toContain(`${tailwindName}: var(${token});`);
    }

    expect(themeCss).toContain('--font-sans: var(--city-font-family-sans);');
    expect(themeCss).toContain('--font-mono: var(--city-font-family-mono);');
    expect(themeCss).toContain('--text-xs: var(--city-font-size-xs);');
    expect(themeCss).toContain('--text-xs--line-height: var(--city-line-height-xs);');
    expect(themeCss).toContain('--text-sm: var(--city-font-size-sm);');
    expect(themeCss).toContain('--text-sm--line-height: var(--city-line-height-sm);');
    expect(themeCss).toContain('--text-base: var(--city-font-size-md);');
    expect(themeCss).toContain('--text-base--line-height: var(--city-line-height-md);');
    expect(themeCss).toContain('--text-lg: var(--city-font-size-lg);');
    expect(themeCss).toContain('--text-lg--line-height: var(--city-line-height-lg);');
    expect(themeCss).toContain('--font-weight-normal: var(--city-font-weight-regular);');
    expect(themeCss).toContain('--font-weight-medium: var(--city-font-weight-medium);');
    expect(themeCss).toContain('--font-weight-semibold: var(--city-font-weight-semibold);');
    expect(themeCss).toContain('--ease-city-standard: var(--city-easing-standard);');
    expect(themeCss).toContain('--ease-city-enter: var(--city-easing-enter);');
    expect(themeCss).toContain('--ease-city-exit: var(--city-easing-exit);');
  });

  it('keeps consumer examples on published variables', () => {
    const publishedTokens = new Set(
      [...themeCss.matchAll(/(--city-[a-z0-9-]+)\s*:/g)].map((match) => match[1]),
    );
    const consumedTokens = [
      ...new Set([...consumerCss.matchAll(/var\((--city-[a-z0-9-]+)/g)].map((match) => match[1])),
    ];

    expect(consumedTokens.length).toBeGreaterThan(0);

    for (const token of consumedTokens) {
      expect(publishedTokens.has(token), `${token} must be published by theme.css`).toBe(true);
    }
  });
});
