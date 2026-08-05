import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const styles = readFileSync('src/styles.css', 'utf8');

describe('public docs layout styles', () => {
  it('lets expanded example code shrink so the code block owns horizontal scrolling', () => {
    expect(styles).toMatch(/\.city-docs-example-code\s*{\s*min-width:\s*0;/);
  });

  it('keeps every landing scene at least one viewport tall', () => {
    expect(styles).toMatch(
      /\.city-docs-home-hero,\s*\.city-docs-home-section\s*{[^}]*min-height:\s*calc\(100dvh - var\(--city-docs-product-header-height\)\);/,
    );
  });
});
