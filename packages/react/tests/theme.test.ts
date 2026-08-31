import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CITY_THEMES } from '../src/theme';
import { CONTROL_SIZES } from '../src/types';

const stylesCss = readFileSync(resolve(process.cwd(), 'src/styles/index.css'), 'utf8');
const themeCss = readFileSync(resolve(process.cwd(), 'src/styles/theme.css'), 'utf8');
const consumerCss = readFileSync(
  resolve(process.cwd(), '../../examples/vite-react/src/smoke.css'),
  'utf8',
);
const packageJson = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8')) as {
  exports: Record<string, string>;
};

function readSourceTree(relativeDirectory: string) {
  const directory = resolve(process.cwd(), relativeDirectory);

  return readdirSync(directory, { encoding: 'utf8', recursive: true })
    .filter((path) => /\.(?:ts|tsx)$/.test(path))
    .map((path) => readFileSync(resolve(directory, path), 'utf8'))
    .join('\n');
}

const componentSource = [readSourceTree('src/components'), readSourceTree('src/lib')].join('\n');

const colorTokens = [
  '--city-color-background',
  '--city-color-foreground',
  '--city-color-surface',
  '--city-color-surface-raised',
  '--city-color-popup',
  '--city-color-muted',
  '--city-color-muted-foreground',
  '--city-color-accent',
  '--city-color-accent-hover',
  '--city-color-accent-active',
  '--city-color-accent-foreground',
  '--city-color-border',
  '--city-color-input',
  '--city-color-ring',
  '--city-color-primary',
  '--city-color-primary-hover',
  '--city-color-primary-active',
  '--city-color-primary-foreground',
  '--city-color-inverse',
  '--city-color-inverse-foreground',
  '--city-color-destructive',
  '--city-color-destructive-hover',
  '--city-color-destructive-active',
  '--city-color-destructive-foreground',
  '--city-color-destructive-surface',
  '--city-color-destructive-border',
  '--city-color-warning',
  '--city-color-warning-foreground',
  '--city-color-warning-surface',
  '--city-color-warning-border',
  '--city-color-success',
  '--city-color-success-foreground',
  '--city-color-success-surface',
  '--city-color-success-border',
  '--city-color-info',
  '--city-color-info-foreground',
  '--city-color-info-surface',
  '--city-color-info-border',
  '--city-color-backdrop',
  '--city-color-backdrop-subtle',
  '--city-color-shimmer',
];

const paletteFamilies = ['neutral', 'blue', 'green', 'amber', 'red'] as const;
const paletteSteps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
const paletteTokens = [
  '--city-palette-white',
  '--city-palette-black',
  ...paletteFamilies.flatMap((family) =>
    paletteSteps.map((step) => `--city-palette-${family}-${step}`),
  ),
];

type Oklch = readonly [lightness: number, chroma: number, hue: number];

function readPaletteOklch(token: string): Oklch {
  const value = themeCss.match(new RegExp(`--city-palette-${token}:\\s*oklch\\(([^)]+)\\);`))?.[1];
  const channels = value?.trim().split(/\s+/).map(Number);

  if (!channels || channels.length !== 3 || channels.some((channel) => !Number.isFinite(channel))) {
    throw new Error(`Invalid OKLCH palette token: ${token}`);
  }

  return channels as [number, number, number];
}

function relativeLuminance([lightness, chroma, hue]: Oklch) {
  const hueRadians = (hue * Math.PI) / 180;
  const a = chroma * Math.cos(hueRadians);
  const b = chroma * Math.sin(hueRadians);
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const clamp = (channel: number) => Math.min(1, Math.max(0, channel));
  const red = clamp(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s);
  const green = clamp(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s);
  const blue = clamp(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s);

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(first: Oklch, second: Oklch) {
  const lighter = Math.max(relativeLuminance(first), relativeLuminance(second));
  const darker = Math.min(relativeLuminance(first), relativeLuminance(second));

  return (lighter + 0.05) / (darker + 0.05);
}

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

const typographySizes = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'];

const typographyTokens = [
  '--city-font-family-sans',
  '--city-font-family-mono',
  ...typographySizes.flatMap((size) => [`--city-font-size-${size}`, `--city-line-height-${size}`]),
  '--city-font-weight-regular',
  '--city-font-weight-medium',
  '--city-font-weight-semibold',
];

const contentTextClasses = [
  'city-text-display',
  'city-text-page-title',
  'city-text-section-title',
  'city-text-subsection-title',
  'city-text-lead',
  'city-text-body',
  'city-text-supporting',
  'city-text-caption',
];

const radiusTokens = [
  '--city-radius-xs',
  '--city-radius-sm',
  '--city-radius-md',
  '--city-radius-lg',
  '--city-radius-full',
];

const controlTokens = [
  '--city-control-xsm',
  '--city-control-sm',
  '--city-control-md',
  '--city-control-lg',
  '--city-control-xlg',
  '--city-hit-target-min',
];

const motionTokens = [
  '--city-duration-fast',
  '--city-duration-normal',
  '--city-duration-slow',
  '--city-duration-xslow',
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
  it('defines the five-step control size scale', () => {
    expect(CONTROL_SIZES).toEqual(['xsm', 'sm', 'md', 'lg', 'xlg']);
    expect(themeCss).toContain('--city-control-xsm: 1.5rem;');
    expect(themeCss).toContain('--city-control-sm: 1.75rem;');
    expect(themeCss).toContain('--city-control-md: 2rem;');
    expect(themeCss).toContain('--city-control-lg: 2.25rem;');
    expect(themeCss).toContain('--city-control-xlg: 2.5rem;');
  });

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

  it('defines the four-step motion duration scale and the default easing', () => {
    expect(themeCss).toContain('--city-duration-fast: 80ms;');
    expect(themeCss).toContain('--city-duration-normal: 120ms;');
    expect(themeCss).toContain('--city-duration-slow: 160ms;');
    expect(themeCss).toContain('--city-duration-xslow: 240ms;');
    expect(themeCss).toContain('--city-easing-standard: ease-in-out;');
  });

  it('disables the Skeleton shimmer when reduced motion is requested', () => {
    expect(stylesCss).toMatch(
      /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\.city-skeleton::after \{[\s\S]*?animation: none;[\s\S]*?content: none;[\s\S]*?\n\s{2}}\n}/,
    );
  });

  it('derives the Skeleton shimmer from the semantic color token', () => {
    expect(stylesCss).toContain(
      'background: linear-gradient(90deg, transparent, var(--city-color-shimmer), transparent);',
    );
    expect(stylesCss).not.toMatch(/\.city-skeleton::after[\s\S]*?rgb\(/);
  });

  it('derives text Skeleton height from hidden typography content', () => {
    expect(stylesCss).toMatch(
      /\.city-skeleton\[data-variant='text']::before \{\s*content: '\\00a0';\s*visibility: hidden;\s*}/,
    );
  });

  it('expands icon-only button hit areas without changing visual control sizes', () => {
    expect(themeCss).toContain('--city-hit-target-min: 2.75rem;');
    expect(stylesCss).toMatch(
      /@media \(pointer: coarse\) \{[\s\S]*?\.city-button\[data-city-icon-only]::after \{[\s\S]*?height: var\(--city-hit-target-min\);[\s\S]*?width: var\(--city-hit-target-min\);[\s\S]*?\n {2}}\n}/,
    );
  });

  it.each(foundationTokens)('publishes foundation token %s', (token) => {
    expect(themeCss).toContain(token);
  });

  it.each(paletteTokens)('publishes pinned palette token %s once', (token) => {
    expect(themeCss.match(new RegExp(`${token}:`, 'g'))).toHaveLength(1);
    expect(themeCss).toMatch(new RegExp(`${token}: oklch\\(`));
  });

  it.each([...colorTokens, ...shadowTokens])(
    'defines theme-dependent token %s for light, dark, and system',
    (token) => {
      expect(themeCss.match(new RegExp(`${token}:`, 'g'))).toHaveLength(3);
    },
  );

  it('connects public tokens to Tailwind theme namespaces', () => {
    expect(themeCss).toContain('--spacing: var(--city-space-unit);');
    expect(themeCss).toContain('--city-font-size-2xs: 0.625rem;');
    expect(themeCss).toContain('--city-line-height-2xs: 0.75rem;');

    for (const token of colorTokens) {
      const name = token.replace('--city-color-', '');
      expect(themeCss).toContain(`--color-city-${name}: var(${token});`);
    }

    for (const token of paletteTokens) {
      const name = token.replace('--city-palette-', '');
      expect(themeCss).toContain(`--color-city-palette-${name}: var(${token});`);
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
    for (const size of typographySizes) {
      const tailwindSize = size === 'md' ? 'base' : size;
      expect(themeCss).toContain(`--text-${tailwindSize}: var(--city-font-size-${size});`);
      expect(themeCss).toContain(
        `--text-${tailwindSize}--line-height: var(--city-line-height-${size});`,
      );
    }

    expect(themeCss).toContain('--font-weight-normal: var(--city-font-weight-regular);');
    expect(themeCss).toContain('--font-weight-medium: var(--city-font-weight-medium);');
    expect(themeCss).toContain('--font-weight-semibold: var(--city-font-weight-semibold);');
    expect(themeCss).toContain('--ease-city-standard: var(--city-easing-standard);');
    expect(themeCss).toContain('--ease-city-enter: var(--city-easing-enter);');
    expect(themeCss).toContain('--ease-city-exit: var(--city-easing-exit);');
    expect(themeCss).toContain('--default-transition-duration: var(--city-duration-normal);');
    expect(themeCss).toContain(
      '--default-transition-timing-function: var(--city-easing-standard);',
    );
  });

  it('derives semantic colors from the pinned palette', () => {
    for (const token of colorTokens) {
      const definitions = [...themeCss.matchAll(new RegExp(`${token}:\\s*([^;]+);`, 'g'))].map(
        (match) => match[1]?.trim(),
      );

      expect(definitions).toHaveLength(3);
      for (const value of definitions) {
        expect(value).toMatch(/^(?:var\(--city-palette-|color-mix\()/);
      }
    }
  });

  it('maps neutral semantic roles to the contracted palette steps', () => {
    const lightTheme = themeCss.match(/:root,\n\[data-theme='light'] \{([\s\S]*?)\n}/)?.[1];
    const darkTheme = themeCss.match(/\[data-theme='dark'] \{([\s\S]*?)\n}/)?.[1];
    const systemTheme = themeCss.match(/:root:not\(\[data-theme]\) \{([\s\S]*?)\n  }\n}/)?.[1];
    const lightMappings = [
      ['background', 'white'],
      ['foreground', 'neutral-900'],
      ['surface', 'neutral-50'],
      ['muted', 'neutral-100'],
      ['accent', 'neutral-100'],
      ['accent-hover', 'neutral-200'],
      ['accent-active', 'neutral-300'],
      ['border', 'neutral-200'],
      ['input', 'neutral-300'],
      ['ring', 'neutral-600'],
    ] as const;
    const darkMappings = [
      ['background', 'neutral-950'],
      ['foreground', 'neutral-50'],
      ['surface', 'neutral-900'],
      ['muted', 'neutral-800'],
      ['muted-foreground', 'neutral-400'],
      ['accent', 'neutral-800'],
      ['accent-hover', 'neutral-700'],
      ['accent-active', 'neutral-600'],
      ['border', 'neutral-700'],
      ['input', 'neutral-600'],
      ['ring', 'neutral-400'],
    ] as const;

    for (const [token, palette] of lightMappings) {
      expect(lightTheme).toContain(`--city-color-${token}: var(--city-palette-${palette});`);
    }

    for (const theme of [darkTheme, systemTheme]) {
      for (const [token, palette] of darkMappings) {
        expect(theme).toContain(`--city-color-${token}: var(--city-palette-${palette});`);
      }
    }
  });

  it('uses an opaque white overlay for popup surfaces in dark themes', () => {
    const lightTheme = themeCss.match(/:root,\n\[data-theme='light'] \{([\s\S]*?)\n}/)?.[1];
    const darkTheme = themeCss.match(/\[data-theme='dark'] \{([\s\S]*?)\n}/)?.[1];
    const systemTheme = themeCss.match(/:root:not\(\[data-theme]\) \{([\s\S]*?)\n  }\n}/)?.[1];
    const darkPopupPattern =
      /--city-color-popup:\s*color-mix\(\s*in srgb,\s*var\(--city-palette-white\) 12%,\s*var\(--city-color-background\)\s*\);/;

    expect(lightTheme).toContain('--city-color-popup: var(--city-palette-white);');
    expect(darkTheme).toMatch(darkPopupPattern);
    expect(systemTheme).toMatch(darkPopupPattern);
  });

  it('maps strong feedback fills and foregrounds for both themes', () => {
    const lightTheme = themeCss.match(/:root,\n\[data-theme='light'] \{([\s\S]*?)\n}/)?.[1];
    const darkTheme = themeCss.match(/\[data-theme='dark'] \{([\s\S]*?)\n}/)?.[1];
    const systemTheme = themeCss.match(/:root:not\(\[data-theme]\) \{([\s\S]*?)\n  }\n}/)?.[1];
    const lightMappings = [
      ['info', 'blue-600', 'neutral-50'],
      ['success', 'green-700', 'neutral-50'],
      ['warning', 'amber-700', 'neutral-50'],
      ['destructive', 'red-700', 'neutral-50'],
    ] as const;
    const darkMappings = [
      ['info', 'blue-600', 'neutral-50'],
      ['success', 'green-700', 'neutral-50'],
      ['warning', 'amber-700', 'neutral-50'],
      ['destructive', 'red-600', 'neutral-50'],
    ] as const;

    for (const [tone, fill, foreground] of lightMappings) {
      expect(lightTheme).toContain(`--city-color-${tone}: var(--city-palette-${fill});`);
      expect(lightTheme).toContain(
        `--city-color-${tone}-foreground: var(--city-palette-${foreground});`,
      );
    }

    for (const theme of [darkTheme, systemTheme]) {
      for (const [tone, fill, foreground] of darkMappings) {
        expect(theme).toContain(`--city-color-${tone}: var(--city-palette-${fill});`);
        expect(theme).toContain(
          `--city-color-${tone}-foreground: var(--city-palette-${foreground});`,
        );
      }

      expect(theme).toContain('--city-color-destructive-hover: var(--city-palette-red-700);');
      expect(theme).toContain('--city-color-destructive-active: var(--city-palette-red-800);');
    }

    const lightForeground = readPaletteOklch('neutral-50');
    const chromaticSolidFills = [
      ...lightMappings.map(([tone, fill]) => [`light ${tone}`, fill] as const),
      ['light destructive hover', 'red-800'],
      ['light destructive active', 'red-900'],
      ...darkMappings.map(([tone, fill]) => [`dark ${tone}`, fill] as const),
      ['dark destructive hover', 'red-700'],
      ['dark destructive active', 'red-800'],
    ] as const;

    for (const [role, fill] of chromaticSolidFills) {
      expect(contrastRatio(readPaletteOklch(fill), lightForeground), role).toBeGreaterThanOrEqual(
        4.5,
      );
    }
  });

  it('keeps component colors on semantic tokens without opacity shortcuts', () => {
    expect(componentSource).not.toMatch(/--city-palette-/);
    expect(componentSource).not.toMatch(/(?:bg|border|ring|text)-(?:black|white)(?:\/[0-9]+)?/);
    expect(componentSource).not.toMatch(
      /city-(?:primary|destructive|info|success|warning|ring|muted)\/[0-9]+/,
    );
  });

  it('publishes content text roles without coupling color or layout margins', () => {
    for (const className of contentTextClasses) {
      const rule = stylesCss.match(new RegExp(`\\.${className} \\{([\\s\\S]*?)\\n  \\}`))?.[1];

      expect(rule, `${className} must have a CSS rule`).toBeDefined();
      expect(rule).not.toMatch(/^\s*(?:color|margin(?:-block|-inline)?):/m);
    }

    expect(stylesCss).toContain(
      'font-size: clamp(var(--city-font-size-4xl), 4vw, var(--city-font-size-5xl));',
    );
    expect(stylesCss).toContain(
      'font-size: clamp(var(--city-font-size-3xl), 3vw, var(--city-font-size-4xl));',
    );
    expect(stylesCss).toMatch(
      /\.city-text-body \{[\s\S]*?line-height: var\(--city-line-height-lg\);[\s\S]*?\n  \}/,
    );
  });

  it('keeps prose flow separate from descendant typography roles', () => {
    const proseRule = stylesCss.match(/\.city-prose \{([\s\S]*?)\n  \}/)?.[1];

    expect(proseRule).toContain('max-inline-size: 68ch;');
    expect(proseRule).toContain('gap: var(--city-space-5);');
    expect(proseRule).toContain('overflow-wrap: anywhere;');
    expect(proseRule).toContain('word-break: keep-all;');
    expect(proseRule).not.toContain('font-size');
    expect(stylesCss).toContain('.city-prose > :where(ol, ul)');
    expect(stylesCss).toContain('.city-prose > :where(h1, h2, h3, h4, h5, h6):not(:first-child)');
    expect(stylesCss).toContain('margin-block-start: var(--city-space-6);');
  });

  it('keeps Sonner toast surfaces, motion and default icons on city contracts', () => {
    expect(stylesCss).toMatch(
      /\.city-toast-surface \{[\s\S]*?background-color: color-mix\(in oklab, currentColor 8%, var\(--city-color-background\)\);[\s\S]*?\n  \}/,
    );
    expect(stylesCss).toContain('[data-sonner-toaster].city-toast-viewport');
    expect(stylesCss).toContain('transition-duration: var(--city-duration-normal);');
    expect(stylesCss).toContain('transition-timing-function: var(--city-easing-standard);');
    expect(stylesCss).toContain('[data-sonner-toast].city-toast-root:has([data-action])');
    expect(stylesCss).toContain('[data-icon]:has([data-city-toast-default-icon])');
    expect(stylesCss).toMatch(
      /\[data-sonner-toast\]\.city-toast-root:has\(\[data-action\]\)[\s\S]*?\[data-icon\]:has\(\[data-city-toast-default-icon\]\) \{[\s\S]*?display: none;[\s\S]*?\n  \}/,
    );
  });

  it('keeps the dark interaction surface distinct from the raised surface', () => {
    const darkTheme = themeCss.match(/\[data-theme='dark'] \{([\s\S]*?)\n}/)?.[1];
    const readToken = (token: string) => darkTheme?.match(new RegExp(`${token}:\\s*([^;]+);`))?.[1];
    const interactionColors = [
      readToken('--city-color-accent'),
      readToken('--city-color-accent-hover'),
      readToken('--city-color-accent-active'),
    ];

    expect(interactionColors.every(Boolean)).toBe(true);
    expect(new Set(interactionColors)).toHaveLength(3);
    expect(interactionColors).not.toContain(readToken('--city-color-surface-raised'));
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
