import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const styles = readFileSync('src/styles.css', 'utf8');

describe('public docs layout styles', () => {
  it('lets expanded example code shrink so the code block owns horizontal scrolling', () => {
    expect(styles).toMatch(/\.city-docs-example-code\s*{\s*min-width:\s*0;/);
  });

  it('keeps mobile and tablet landing scenes at least 600 pixels tall', () => {
    expect(styles).toMatch(
      /\.city-docs-home-hero,\s*\.city-docs-home-section\s*{[^}]*min-height:\s*37\.5rem;/,
    );
  });

  it('uses the viewport height only for desktop landing scenes', () => {
    expect(styles).toMatch(
      /@media \(min-width:\s*80rem\)\s*{[\s\S]*?\.city-docs-home-hero,\s*\.city-docs-home-section\s*{[^}]*min-height:\s*calc\(100dvh - var\(--city-docs-product-header-height\)\);/,
    );
  });

  it('uses the foundation specimen grid to occupy the scene without clipping its palette', () => {
    expect(styles).toMatch(
      /\.city-docs-home-token-strip\s*{[^}]*grid-template-columns:\s*minmax\(14rem, 1\.35fr\) repeat\(4, minmax\(0, 1fr\)\);/,
    );
    expect(styles).toMatch(
      /@media \(min-width:\s*80rem\)\s*{[\s\S]*?\.city-docs-home-foundation \.city-docs-home-token-strip\s*{\s*align-self:\s*stretch;/,
    );
  });

  it('keeps the mobile product preview inside its viewport scene', () => {
    expect(styles).toMatch(
      /\.city-docs-home-preview-table\s*{[^}]*max-height:\s*9rem;[^}]*overflow-y:\s*auto;/,
    );
    expect(styles).toMatch(
      /\.city-docs-home-preview-heading button,\s*\.city-docs-home-preview input,\s*\.city-docs-home-preview \[role='combobox'\]\s*{[^}]*min-height:\s*var\(--city-control-lg\);/,
    );
  });

  it('does not stretch the mobile screen-reader live region beyond the viewport', () => {
    expect(styles).toContain('.city-docs-home-install-row > :not(.city-docs-sr-only)');
  });
});
