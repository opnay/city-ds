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
});
