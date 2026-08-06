import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

const styles = readFileSync('src/styles.css', 'utf8');

describe('public docs layout styles', () => {
  it('lets expanded example code shrink so the code block owns horizontal scrolling', () => {
    expect(styles).toMatch(/\.city-docs-example-code\s*{\s*min-width:\s*0;/);
  });

  it('keeps search fixed while one navigation list owns vertical scrolling', () => {
    expect(styles).toMatch(/\.city-docs-nav-scroll\s*{[^}]*overflow-y:\s*auto;/s);
    expect(styles).not.toContain('.city-docs-component-nav');
  });

  it('reflows the organism mosaic from twelve to six to one column', () => {
    expect(styles).toMatch(/\.city-showcase-grid\s*{[^}]*grid-template-columns:\s*repeat\(12,/s);
    expect(styles).toMatch(
      /@media \(max-width: 64rem\)[\s\S]*?\.city-showcase-grid\s*{[^}]*grid-template-columns:\s*repeat\(6,/,
    );
    expect(styles).toMatch(
      /@media \(max-width: 52rem\)[\s\S]*?\.city-showcase-grid\s*{[^}]*grid-template-columns:\s*minmax\(0, 1fr\)/,
    );
  });

  it('contains page overflow and gives the wide order table its own scroll region', () => {
    expect(styles).toMatch(/\.city-docs-product-shell\s*{[^}]*overflow-x:\s*clip;/s);
    expect(styles).toMatch(/\.city-docs-home\s*{[^}]*overflow:\s*visible;/s);
    expect(styles).toMatch(/\.city-showcase-orders-table\s*{[^}]*min-width:\s*39rem;/s);
  });

  it('moves the landing search to its own mobile header row', () => {
    expect(styles).toMatch(
      /@media \(max-width: 52rem\)[\s\S]*?\.city-docs-product-search\s*{[^}]*grid-column:\s*1 \/ -1;[^}]*grid-row:\s*2;/,
    );
  });
});
