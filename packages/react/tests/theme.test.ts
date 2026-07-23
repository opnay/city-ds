import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CITY_THEMES } from '../src/theme';

const stylesCss = readFileSync(resolve(process.cwd(), 'src/styles/index.css'), 'utf8');
const themeCss = readFileSync(resolve(process.cwd(), 'src/styles/theme.css'), 'utf8');
const packageJson = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8')) as {
  exports: Record<string, string>;
};

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

  it.each([
    '--city-color-background',
    '--city-color-foreground',
    '--city-color-primary',
    '--city-color-destructive',
    '--city-color-destructive-foreground',
    '--city-color-success',
    '--city-color-warning',
    '--city-color-info',
    '--city-color-ring',
  ])('publishes %s', (token) => {
    expect(themeCss).toContain(token);
  });
});
