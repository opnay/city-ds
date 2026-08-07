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

  it('restores document list markers and compacts inline code', () => {
    expect(styles).toMatch(/\.city-docs-prose > ul,[^}]*list-style-type:\s*disc;/s);
    expect(styles).toMatch(/\.city-docs-prose > ol,[^}]*list-style-type:\s*decimal;/s);
    expect(styles).toMatch(
      /\.city-docs-prose > :where\(h2, h3, p\) > code,[^}]*margin-inline:\s*4px;[^}]*font-size:\s*var\(--city-font-size-sm\);[^}]*line-height:\s*1\.25;[^}]*vertical-align:\s*0\.05em;/s,
    );
  });

  it('aligns reading and code blocks while giving prose code extra vertical space', () => {
    expect(styles).toMatch(/--city-docs-reading-max:\s*56rem;/);
    expect(styles).not.toMatch(/--city-docs-code-max\s*:/);
    expect(styles).toMatch(
      /\.city-docs-page-heading\s*{[^}]*max-width:\s*var\(--city-docs-reading-max\);[^}]*margin-inline:\s*auto;/s,
    );
    expect(styles).toMatch(
      /\.city-docs-prose\s*{[^}]*max-inline-size:\s*64rem;[^}]*margin-inline:\s*auto;/s,
    );
    expect(styles).toMatch(
      /\.city-docs-prose > :where\(h2, h3, p, ul, ol, blockquote\)\s*{[^}]*width:\s*min\(100%, var\(--city-docs-reading-max\)\);[^}]*margin-inline:\s*auto;/s,
    );
    expect(styles).toMatch(
      /\.city-docs-prose > \.city-docs-prose-code-wrap\s*{[^}]*width:\s*min\(100%, var\(--city-docs-reading-max\)\);[^}]*margin-block:\s*var\(--city-space-2\);[^}]*margin-inline:\s*auto;/s,
    );
    expect(styles).toMatch(
      /\.city-docs-import-block\s*{[^}]*max-width:\s*var\(--city-docs-reading-max\);[^}]*margin-inline:\s*auto;/s,
    );
    expect(styles).toMatch(
      /\.city-docs-prose-table-wrap\s*{[^}]*width:\s*min\(100%, var\(--city-docs-reading-max\)\);[^}]*margin-inline:\s*auto;/s,
    );
    expect(styles).toMatch(
      /\.city-docs-related\s*{[^}]*max-width:\s*var\(--city-docs-reading-max\);[^}]*margin-inline:\s*auto;/s,
    );
  });

  it('presents task lists as one divided checklist surface', () => {
    expect(styles).toMatch(
      /\.city-docs-prose > ul\.city-docs-checklist\s*{[^}]*border:\s*1px solid var\(--city-color-border\);[^}]*list-style:\s*none;/s,
    );
    expect(styles).toMatch(
      /\.city-docs-checklist > \.city-docs-checklist-item \+ \.city-docs-checklist-item\s*{[^}]*border-top:/s,
    );
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

  it('keeps API table columns readable and scrollable on narrow screens', () => {
    expect(styles).toMatch(/\.city-docs-api-table table\s*{\s*min-width:\s*40rem;/);
    expect(styles).toMatch(/\.city-docs-api-table :where\(th, td\)\s*{\s*min-width:\s*160px;/);
    expect(styles).toMatch(
      /\.city-docs-api-table :where\(th, td\):nth-child\(3\)\s*{\s*min-width:\s*120px;/,
    );
    expect(styles).toMatch(
      /\.city-docs-api-table :where\(th, td\):first-child\s*{\s*white-space:\s*nowrap;/,
    );
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

  it('centers bounded preview content while explicit wide examples keep the full canvas', () => {
    expect(styles).toMatch(
      /\.city-docs-example-preview\s*{[^}]*--city-docs-preview-content-max:\s*40rem;[^}]*display:\s*grid;[^}]*place-items:\s*center;/s,
    );
    expect(styles).toMatch(
      /\.city-docs-example-preview-content\s*{[^}]*width:\s*min\(100%, var\(--city-docs-preview-content-max\)\);[^}]*justify-items:\s*center;/s,
    );
    expect(styles).toMatch(
      /\.city-docs-example-preview-content \.city-docs-example-row\s*{[^}]*justify-content:\s*center;/s,
    );
    expect(styles).toMatch(
      /\.city-docs-example-preview-content\[data-city-docs-layout='wide'\]\s*{[^}]*width:\s*100%;[^}]*justify-items:\s*stretch;/s,
    );
  });

  it('keeps prose list layout out of list-based component previews', () => {
    expect(styles).toMatch(/\.city-docs-prose > :where\(ul, ol\)/);
    expect(styles).not.toMatch(/\.city-docs-prose ul,\s*\n\s*\.city-docs-prose ol/);
  });

  it('uses a two-row code-block-style header for preview settings and option tags', () => {
    expect(styles).toMatch(/\.city-docs-code-header,\s*\n\s*\.city-docs-example-title-row\s*{/);
    expect(styles).toMatch(
      /\.city-docs-example-heading-copy\s*{[^}]*display:\s*grid;[^}]*gap:\s*var\(--city-space-1\);/s,
    );
    expect(styles).toMatch(
      /\.city-docs-example-description\s*{[^}]*color:\s*var\(--city-color-muted-foreground\);[^}]*text-overflow:\s*ellipsis;[^}]*white-space:\s*nowrap;/s,
    );
    expect(styles).toMatch(
      /\.city-docs-coverage-list\s*{[^}]*overflow-x:\s*auto;[^}]*flex-wrap:\s*nowrap;[^}]*scrollbar-width:\s*thin;/s,
    );
    expect(styles).toMatch(
      /\.city-docs-coverage-list span\s*{[^}]*flex:\s*0 0 auto;[^}]*white-space:\s*nowrap;/s,
    );
    expect(styles).not.toMatch(/\.city-docs-example-preview-toolbar\s*{/);
    expect(styles).toMatch(/\.city-docs-preview-settings-option\s*{/);
  });

  it('caps every code surface at 22 lines with internal scrolling', () => {
    expect(styles).toMatch(
      /--city-docs-code-max-height:\s*calc\(\s*36\.3em \+ var\(--city-space-4\) \+ var\(--city-space-4\)\s*\);/,
    );
    expect(styles).toMatch(/max-height:\s*var\(--city-docs-code-max-height\);/);
    expect(styles).toMatch(/line-height:\s*1\.65;/);
  });
});
