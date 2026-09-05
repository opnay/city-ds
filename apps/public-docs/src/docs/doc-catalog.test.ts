import { describe, expect, it } from 'vitest';

import reactPackage from '../../../../packages/react/package.json';
import {
  COMPONENT_DOCS,
  GUIDE_DOCS,
  HOME_DOC,
  STATIC_DOCS,
  filterComponentDocs,
  filterDocumentPages,
  getComponentDoc,
} from './doc-catalog';

const NON_COMPONENT_EXPORTS = new Set(['.', './package.json', './styles.css', './theme.css']);

describe('component document catalog', () => {
  it('matches public component subpaths exactly', () => {
    const exportedSlugs = Object.keys(reactPackage.exports)
      .filter((path) => !NON_COMPONENT_EXPORTS.has(path))
      .map((path) => path.slice(2))
      .sort();
    const documentedSlugs = COMPONENT_DOCS.map((entry) => entry.slug).sort();

    expect(COMPONENT_DOCS).toHaveLength(exportedSlugs.length);
    expect(documentedSlugs).toEqual(exportedSlugs);
  });

  it('keeps slug, import path and title unique and related slugs valid', () => {
    expect(new Set(COMPONENT_DOCS.map((entry) => entry.slug)).size).toBe(COMPONENT_DOCS.length);
    expect(new Set(COMPONENT_DOCS.map((entry) => entry.importPath)).size).toBe(
      COMPONENT_DOCS.length,
    );
    expect(new Set(COMPONENT_DOCS.map((entry) => entry.title)).size).toBe(COMPONENT_DOCS.length);

    for (const entry of COMPONENT_DOCS) {
      expect(entry.importPath).toBe(`@opnay/city-ds-react/${entry.slug}`);
      expect(entry.related.every((slug) => getComponentDoc(slug) !== undefined)).toBe(true);
      expect(entry.selectionGuidance.trim().length).toBeGreaterThan(0);
    }
  });

  it('searches English, Korean and category metadata without loading content', () => {
    expect(filterComponentDocs('Button').map((entry) => entry.slug)).toContain('button');
    expect(filterComponentDocs('체크박스').map((entry) => entry.slug)).toEqual(
      expect.arrayContaining(['checkbox', 'checkbox-group']),
    );
    expect(filterComponentDocs('구분선').map((entry) => entry.slug)).toContain('divider');
    expect(filterComponentDocs('세로').map((entry) => entry.slug)).toContain('divider');
    expect(filterComponentDocs('', 'Overlays')).toHaveLength(5);
    expect(filterComponentDocs('존재하지 않는 검색어')).toEqual([]);
  });

  it('documents the Sonner-based Toast imports', () => {
    expect(getComponentDoc('toast')?.importNames).toEqual(['Toaster', 'toast']);
  });
});

describe('document page search', () => {
  it('keeps Home separate from the ordered Guides menu', () => {
    expect(HOME_DOC).toMatchObject({ label: '홈', path: '/', section: 'start' });
    expect(GUIDE_DOCS.map((entry) => entry.label)).toEqual([
      '시작하기',
      '기초',
      '색상',
      '패턴',
      '접근성',
    ]);
    expect(GUIDE_DOCS.every((entry) => entry.section === 'guides')).toBe(true);
  });

  it('indexes every static and component document path exactly once', () => {
    const paths = filterDocumentPages('').map((result) =>
      result.kind === 'static' ? result.entry.path : `/components/${result.entry.slug}`,
    );

    expect(STATIC_DOCS).toHaveLength(7);
    expect(paths).toHaveLength(STATIC_DOCS.length + COMPONENT_DOCS.length);
    expect(new Set(paths).size).toBe(STATIC_DOCS.length + COMPONENT_DOCS.length);
  });

  it('searches page titles, descriptions, paths, categories and keywords', () => {
    expect(filterDocumentPages('Getting started')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entry: expect.objectContaining({ path: '/getting-started' }),
          kind: 'static',
        }),
      ]),
    );
    expect(filterDocumentPages('설치')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entry: expect.objectContaining({ path: '/getting-started' }),
          kind: 'static',
        }),
      ]),
    );
    expect(filterDocumentPages('색상')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entry: expect.objectContaining({ path: '/color' }),
          kind: 'static',
        }),
      ]),
    );
    expect(filterDocumentPages('/components/button')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entry: expect.objectContaining({ slug: 'button' }),
          kind: 'component',
        }),
      ]),
    );
    expect(filterDocumentPages('폼')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          entry: expect.objectContaining({ path: '/patterns' }),
          kind: 'static',
        }),
        expect.objectContaining({
          entry: expect.objectContaining({ slug: 'field' }),
          kind: 'component',
        }),
      ]),
    );
    expect(filterDocumentPages('존재하지 않는 검색어')).toEqual([]);
  });
});
