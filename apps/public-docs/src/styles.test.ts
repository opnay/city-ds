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

  it('keeps the organism mosaic at desktop geometry when mobile crops it', () => {
    expect(styles).toMatch(/\.city-showcase-grid\s*{[^}]*grid-template-columns:\s*repeat\(12,/s);
    expect(styles).toMatch(
      /@media \(max-width: 64rem\)[\s\S]*?\.city-showcase-grid\s*{[^}]*grid-template-columns:\s*repeat\(6,/,
    );
    expect(styles).toMatch(
      /@media \(max-width: 52rem\)[\s\S]*?\.city-showcase-grid\s*{[^}]*width:\s*87\.5rem;[^}]*min-width:\s*87\.5rem;[^}]*grid-template-columns:\s*repeat\(12,[^}]*zoom:\s*0\.64;/,
    );
  });

  it('contains page overflow and gives the wide order table its own scroll region', () => {
    expect(styles).toMatch(/\.city-docs-product-shell\s*{[^}]*overflow-x:\s*clip;/s);
    expect(styles).toMatch(/\.city-docs-home\s*{[^}]*overflow:\s*visible;/s);
    expect(styles).toMatch(/\.city-showcase-viewport\s*{[^}]*overflow-x:\s*clip;/s);
    expect(styles).toMatch(/\.city-showcase-orders-table\s*{[^}]*min-width:\s*39rem;/s);
  });

  it('places schedule and invite before the orders area', () => {
    const mosaic = styles.slice(
      styles.indexOf('.city-showcase-grid {', styles.indexOf('/* Organism mosaic landing */')),
      styles.indexOf(".city-showcase-item[data-organism='orders']"),
    );

    expect(mosaic.indexOf("'schedule schedule schedule schedule invite invite")).toBeGreaterThan(
      -1,
    );
    expect(mosaic.indexOf("'schedule schedule schedule schedule invite invite")).toBeLessThan(
      mosaic.indexOf("'orders orders orders orders orders orders"),
    );
  });

  it('keeps intrinsically wide examples in non-overlapping grid tracks', () => {
    expect(styles).toMatch(
      /\.city-docs-example-grid\s*{\s*grid-template-columns:\s*repeat\(auto-fit, minmax\(min\(100%, 18rem\), 1fr\)\);/,
    );
  });

  it('uses a subtle optional grid for every example preview', () => {
    expect(styles).toMatch(/var\(--city-color-border\) 20%,\s*transparent/);
    expect(styles).toMatch(
      /html\[data-city-docs-preview-grid='off'\] \.city-docs-example-preview\s*{\s*background:\s*var\(--city-color-background\);/,
    );
  });
});
