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
      /\.city-docs-prose > :where\(ul, ol\),[^}]*gap:\s*var\(--city-space-1\);/s,
    );
    expect(styles).toMatch(
      /\.city-docs-prose > :where\(h2, h3, p\) > code,[^}]*margin-inline:\s*4px;[^}]*font-size:\s*var\(--city-font-size-sm\);[^}]*line-height:\s*1\.25;[^}]*vertical-align:\s*0\.05em;/s,
    );
  });

  it('aligns reading, component reference, and code blocks', () => {
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
      /\.city-docs-component-reference\s*{[^}]*width:\s*100%;[^}]*max-width:\s*var\(--city-docs-reading-max\);[^}]*margin-inline:\s*auto;/s,
    );
    expect(styles).toMatch(
      /\.city-docs-prose > \.city-docs-prose-code-wrap\s*{[^}]*width:\s*min\(100%, var\(--city-docs-reading-max\)\);[^}]*margin-block:\s*var\(--city-space-2\);[^}]*margin-inline:\s*auto;/s,
    );
    expect(styles).toMatch(
      /\.city-docs-import-block\s*{[^}]*max-width:\s*var\(--city-docs-reading-max\);[^}]*margin-inline:\s*auto;/s,
    );
    expect(styles).not.toMatch(/\.city-docs-import-block\s*{[^}]*margin-top:/s);
    expect(styles).toMatch(
      /\.city-docs-prose-table-wrap\s*{[^}]*width:\s*min\(100%, var\(--city-docs-reading-max\)\);[^}]*margin-inline:\s*auto;/s,
    );
    expect(styles).toMatch(
      /\.city-docs-related\s*{[^}]*max-width:\s*var\(--city-docs-reading-max\);[^}]*margin-inline:\s*auto;/s,
    );
    expect(styles).toMatch(
      /\.city-docs-selection-guidance\s*{[^}]*width:\s*100%;[^}]*max-width:\s*var\(--city-docs-reading-max\);[^}]*margin-inline:\s*auto;/s,
    );
    expect(styles).toMatch(
      /\.city-docs-catalog-filter,\s*\.city-docs-catalog-empty-state,\s*\.city-docs-component-groups,\s*\.city-docs-results-count\s*{[^}]*width:\s*min\(100%, var\(--city-docs-reading-max\)\);[^}]*margin-inline:\s*auto;/s,
    );
    expect(styles).toMatch(
      /\.city-docs-results-count\s*{[^}]*margin-block:\s*0;[^}]*color:\s*var\(--city-color-muted-foreground\);/s,
    );
  });

  it('assigns section, region, and home gaps by role and viewport', () => {
    expect(styles).toMatch(/\.city-docs-article\s*{[^}]*gap:\s*var\(--city-space-12\);/s);
    expect(styles).toMatch(
      /\.city-docs-component-reference\s*{[^}]*gap:\s*var\(--city-space-8\);/s,
    );
    expect(styles).toMatch(
      /@media \(max-width: 64rem\)[\s\S]*?\.city-docs-article\s*{[^}]*gap:\s*var\(--city-space-10\);/,
    );
    expect(styles).toMatch(
      /@media \(max-width: 52rem\)[\s\S]*?\.city-docs-article\s*{[^}]*gap:\s*var\(--city-space-8\);[\s\S]*?\.city-docs-component-reference\s*{[^}]*gap:\s*var\(--city-space-6\);/,
    );
    expect(styles).toMatch(
      /\/\* Organism mosaic landing \*\/[\s\S]*?\.city-docs-home\s*{[^}]*gap:\s*var\(--city-space-12\);/,
    );
    expect(styles).toMatch(
      /@media \(max-width: 64rem\)[\s\S]*?\.city-docs-home\s*{[^}]*gap:\s*var\(--city-space-10\);/,
    );
  });

  it('keeps spacing ownership on parent containers and uses scale tokens', () => {
    expect(styles).toMatch(
      /\.city-docs-page-heading-copy\s*{[^}]*display:\s*grid;[^}]*gap:\s*var\(--city-space-3\);/s,
    );
    expect(styles).toMatch(
      /\.city-docs-nav-section-primary\s*{[^}]*display:\s*grid;[^}]*gap:\s*var\(--city-space-1\);/s,
    );
    expect(styles).not.toMatch(/\.city-docs-nav-categories\s*{[^}]*margin-top:/s);
    expect(styles).not.toMatch(/(?:gap|margin-top):\s*1px;/);
  });

  it('separates sidebar category and document text hierarchy', () => {
    expect(styles).toMatch(
      /\.city-docs-nav-section h2,\s*\.city-docs-nav-subsection h3\s*{[^}]*color:\s*var\(--city-color-foreground\);/s,
    );
    expect(styles).toMatch(
      /\.city-docs-nav-section a\s*{[^}]*color:\s*var\(--city-color-muted-foreground\);/s,
    );
    expect(styles).toMatch(
      /\.city-docs-theme-controls\s*{[^}]*display:\s*inline-flex;[^}]*gap:\s*var\(--city-space-1\);/s,
    );
    expect(styles).toMatch(
      /\.city-docs-nav-controls\s*{[^}]*display:\s*grid;[^}]*padding-inline:\s*var\(--city-space-1\);[^}]*gap:\s*var\(--city-space-2\);/s,
    );
    expect(styles).toMatch(/\.city-docs-nav-mode-trigger\s*{[^}]*width:\s*100%;/s);
    expect(styles).toMatch(/\.city-docs-home-link\s*{[^}]*justify-content:\s*flex-start;/s);
    expect(styles).toMatch(
      /\.city-docs-sidebar\s*>\s*\.city-docs-home-link\s*{[^}]*width:\s*100%;[^}]*padding:\s*var\(--city-space-2\);/s,
    );
    expect(styles).not.toContain('.city-docs-mobile-brand .city-docs-brand');
    expect(styles).not.toContain('.city-docs-theme-trigger');
    expect(styles).toMatch(
      /\.city-docs-article\s*{[^}]*--city-docs-heading-text:\s*var\(--city-palette-black\);[^}]*--city-docs-body-text:\s*color-mix\([\s\S]*?var\(--city-palette-black\) 84%,[\s\S]*?transparent[\s\S]*?\);/,
    );
    expect(styles).toMatch(
      /\[data-theme='dark'\] \.city-docs-article\s*{[^}]*--city-docs-heading-text:\s*var\(--city-palette-white\);[^}]*var\(--city-palette-white\) 84%/s,
    );
    expect(styles).toMatch(
      /\.city-docs-page-heading h1,[\s\S]*?\.city-docs-example-title\s*{[^}]*color:\s*var\(--city-docs-heading-text\);/,
    );
    expect(styles).toMatch(
      /\.city-docs-page-description,[\s\S]*?\.city-docs-selection-guidance > p:not\(\.city-docs-selection-guidance-label\)\s*{[^}]*color:\s*var\(--city-docs-body-text\);/,
    );
  });

  it('keeps catalog filter fields aligned and lets them stack on narrow screens', () => {
    expect(styles).toMatch(
      /\.city-docs-catalog-search\s*{[^}]*min-width:\s*16rem;[^}]*flex:\s*1 1 16rem;/s,
    );
    expect(styles).toMatch(
      /\.city-docs-catalog-category\s*{[^}]*width:\s*11rem;[^}]*flex:\s*0 0 11rem;/s,
    );
    expect(styles).toMatch(
      /@media \(max-width: 40rem\)[\s\S]*?\.city-docs-catalog-search,\s*\.city-docs-catalog-category\s*{[^}]*width:\s*100%;[^}]*min-width:\s*0;[^}]*flex:\s*1 1 auto;/,
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

  it('keeps desktop showcase cards contained without changing the mobile crop', () => {
    expect(styles).not.toMatch(/\.city-docs-home\s*{[^}]*padding-bottom:/s);
    expect(styles).toMatch(
      /\.city-showcase-card-header > div > div\s*{[^}]*display:\s*grid;[^}]*min-width:\s*0;[^}]*gap:\s*var\(--city-space-0-5\);/s,
    );
    expect(styles).toMatch(
      /\.city-showcase-card-body\s*{[^}]*padding:\s*var\(--city-space-3\);[^}]*gap:\s*var\(--city-space-3\);/s,
    );
    expect(styles).toMatch(/\.city-showcase-card-action\s*{\s*margin-top:\s*auto;/);
    expect(styles).toMatch(
      /\.city-showcase-schedule-grid\s*{[^}]*grid-template-columns:\s*minmax\(11\.5rem, 1\.1fr\) minmax\(10rem, 0\.9fr\);/s,
    );
    expect(styles).toMatch(
      /\.city-showcase-toolbar > span\s*{[^}]*flex:\s*none;[^}]*white-space:\s*nowrap;/s,
    );
    expect(styles).toMatch(/\.city-showcase-setting-copy\s*{[^}]*flex:\s*1;/s);
    expect(styles).toMatch(
      /\.city-showcase-upload\s+\.city-showcase-card-body:has\(\[data-city-file-upload-root\]\[data-file-count='0'\]\)\s*{\s*justify-content:\s*center;/,
    );
    expect(styles).not.toMatch(
      /\.city-showcase-upload \[data-city-file-upload-root\]\[data-file-count='0'\]\s*{\s*margin-block:/,
    );
    expect(styles).not.toMatch(/\.city-showcase-settings-list > div > span\s*{/);
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

  it('uses one smaller type step for document tables and their inline code', () => {
    expect(styles).toMatch(
      /\.city-docs-api-table table,\s*\.city-docs-prose-table-wrap table\s*{[^}]*font-size:\s*var\(--city-font-size-sm\);[^}]*line-height:\s*var\(--city-line-height-sm\);/s,
    );
    expect(styles).toMatch(
      /\.city-docs-api-table code,\s*\.city-docs-prose-table-wrap code\s*{[^}]*font-size:\s*var\(--city-font-size-xs\);[^}]*line-height:\s*var\(--city-line-height-xs\);/s,
    );
    expect(styles).not.toMatch(
      /\.city-docs-prose-table-wrap th\s*{[^}]*font-size:\s*var\(--city-font-size-xs\);/s,
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
    expect(styles).toMatch(
      /\.city-docs-example-grid > \[data-city-badge]\s*{[^}]*width:\s*fit-content;[^}]*justify-self:\s*start;/s,
    );
  });

  it('uses the full preview width before table content overflows', () => {
    expect(styles).not.toContain('.city-docs-example-narrow');
    expect(styles).toMatch(/\.city-docs-example-overflow-table\s*{\s*min-width:\s*64rem;/);
    expect(styles).toMatch(
      /\.city-docs-example-overflow-table :where\(th, td\)\s*{\s*white-space:\s*nowrap;/,
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
      /\.city-docs-example-preview\s*{[^}]*--city-docs-preview-content-max:\s*40rem;[^}]*display:\s*grid;[^}]*color:\s*var\(--city-color-foreground\);[^}]*place-items:\s*center;/s,
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

  it('separates example captions from the field controls they describe', () => {
    expect(styles).toMatch(
      /\.city-docs-example-variant\s*{[^}]*display:\s*grid;[^}]*width:\s*min\(100%, 20rem\);[^}]*align-content:\s*start;[^}]*gap:\s*var\(--city-space-2\);/s,
    );
    expect(styles).toMatch(/\.city-docs-example-label\s*{\s*width:\s*fit-content;/);
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
    expect(styles).toMatch(/\.city-docs-example-heading\s*{[^}]*align-items:\s*center;/s);
    expect(styles).toMatch(
      /\.city-docs-example-heading\[data-has-coverage]\s*{[^}]*align-items:\s*flex-start;/s,
    );
    expect(styles).toMatch(
      /\.city-docs-example-description\s*{[^}]*color:\s*var\(--city-docs-body-text\);[^}]*text-overflow:\s*ellipsis;[^}]*white-space:\s*nowrap;/s,
    );
    expect(styles).toMatch(
      /\.city-docs-coverage-list\s*{[^}]*overflow-x:\s*auto;[^}]*flex-wrap:\s*nowrap;[^}]*scrollbar-width:\s*thin;/s,
    );
    expect(styles).toMatch(
      /\.city-docs-coverage-list span\s*{[^}]*flex:\s*0 0 auto;[^}]*white-space:\s*nowrap;/s,
    );
    expect(styles).not.toMatch(/\.city-docs-example-preview-toolbar\s*{/);
    expect(styles).not.toMatch(/\.city-docs-preview-settings-option\s*{/);
  });

  it('caps every code surface at 22 lines with internal scrolling', () => {
    expect(styles).toMatch(
      /--city-docs-code-max-height:\s*calc\(\s*36\.3em \+ var\(--city-space-4\) \+ var\(--city-space-4\)\s*\);/,
    );
    expect(styles).toMatch(/max-height:\s*var\(--city-docs-code-max-height\);/);
    expect(styles).toMatch(/line-height:\s*1\.65;/);
  });

  it('keeps code bodies closer to the page background than muted surfaces', () => {
    expect(styles).toMatch(
      /\.city-docs-prose-code,[\s\S]*?\.city-docs-example-code pre\s*{[^}]*background:\s*var\(--city-color-surface\);/s,
    );
    expect(styles).toMatch(
      /\.city-docs-code-frame\s*{[^}]*background:\s*var\(--city-color-surface\);/s,
    );
  });
});
