import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CITY_THEMES } from '../src/theme';

const themeCss = readFileSync(resolve(process.cwd(), 'src/styles/theme.css'), 'utf8');

describe('theme contract', () => {
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
