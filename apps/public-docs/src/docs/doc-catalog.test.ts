import { describe, expect, it } from 'vitest';

import reactPackage from '../../../../packages/react/package.json';
import { COMPONENT_DOCS, filterComponentDocs, getComponentDoc } from './doc-catalog';

const NON_COMPONENT_EXPORTS = new Set(['.', './package.json', './styles.css', './theme.css']);

describe('component document catalog', () => {
  it('matches all 40 public component subpaths exactly', () => {
    const exportedSlugs = Object.keys(reactPackage.exports)
      .filter((path) => !NON_COMPONENT_EXPORTS.has(path))
      .map((path) => path.slice(2))
      .sort();
    const documentedSlugs = COMPONENT_DOCS.map((entry) => entry.slug).sort();

    expect(COMPONENT_DOCS).toHaveLength(40);
    expect(documentedSlugs).toEqual(exportedSlugs);
  });

  it('keeps slug, import path and title unique and related slugs valid', () => {
    expect(new Set(COMPONENT_DOCS.map((entry) => entry.slug)).size).toBe(40);
    expect(new Set(COMPONENT_DOCS.map((entry) => entry.importPath)).size).toBe(40);
    expect(new Set(COMPONENT_DOCS.map((entry) => entry.title)).size).toBe(40);

    for (const entry of COMPONENT_DOCS) {
      expect(entry.importPath).toBe(`@opnay/city-ds-react/${entry.slug}`);
      expect(entry.related.every((slug) => getComponentDoc(slug) !== undefined)).toBe(true);
    }
  });

  it('searches English, Korean and category metadata without loading content', () => {
    expect(filterComponentDocs('Button').map((entry) => entry.slug)).toContain('button');
    expect(filterComponentDocs('체크박스').map((entry) => entry.slug)).toEqual(
      expect.arrayContaining(['checkbox', 'checkbox-group']),
    );
    expect(filterComponentDocs('', 'Overlays')).toHaveLength(5);
    expect(filterComponentDocs('존재하지 않는 검색어')).toEqual([]);
  });
});
