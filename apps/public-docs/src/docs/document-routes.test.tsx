import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderDocs } from '../test/render-docs';
import { COMPONENT_DOCS } from './doc-catalog';

const WIDE_PREVIEW_COUNTS: Readonly<Record<string, number>> = {
  alert: 2,
  badge: 1,
  'data-table-region': 3,
  divider: 3,
  'empty-state': 1,
  fieldset: 5,
  'filter-bar': 2,
  panel: 2,
  popover: 1,
  progress: 1,
  skeleton: 1,
  table: 5,
  toast: 1,
};

const CONFIGURABLE_COMPONENTS = new Set([
  'accordion',
  'alert',
  'alert-dialog',
  'badge',
  'button',
  'breadcrumbs',
  'calendar',
  'checkbox',
  'checkbox-group',
  'combobox',
  'date-picker',
  'data-table-region',
  'density-provider',
  'dialog',
  'divider',
  'drawer',
  'empty-state',
  'field',
  'fieldset',
  'file-upload',
  'filter-bar',
  'input',
  'number-input',
  'menu',
  'pagination',
  'panel',
  'popover',
  'progress',
  'radio-group',
  'search-input',
  'segmented-control',
  'select',
  'skeleton',
  'slider',
  'switch',
  'table',
  'tabs',
  'toast',
  'toggle-group',
  'toolbar',
  'tooltip',
]);

describe('all component document routes', () => {
  it('adds an option playground to every component route', () => {
    expect([...CONFIGURABLE_COMPONENTS].sort()).toEqual(
      COMPONENT_DOCS.map((entry) => entry.slug).sort(),
    );
  });

  it.each(COMPONENT_DOCS)('renders $slug with examples and API', async (entry) => {
    const { container } = await renderDocs([`/components/${entry.slug}`]);

    expect(screen.getByRole('heading', { level: 1, name: entry.title })).toHaveClass(
      'city-text-page-title',
    );
    const pageHeading = screen
      .getByRole('heading', { level: 1, name: entry.title })
      .closest('header');

    expect(pageHeading).not.toBeNull();
    expect(pageHeading?.querySelector('.city-docs-page-eyebrow')).not.toBeInTheDocument();
    expect(pageHeading?.querySelector(':scope > [data-city-badge]')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: '접근성' })).toHaveClass(
      'city-text-section-title',
    );
    for (const removedHeading of [
      '대표 예제',
      '주요 API',
      '언제 사용합니까',
      '언제 피해야 합니까',
      '합성 구조',
    ]) {
      expect(screen.queryByRole('heading', { level: 2, name: removedHeading })).toBeNull();
    }
    const componentReference = container.querySelector('.city-docs-component-reference');
    const featuredExample = componentReference?.querySelector(':scope > .city-docs-example');
    expect(componentReference).not.toBeNull();
    expect(featuredExample).not.toBeNull();
    expect(featuredExample?.querySelector('.city-docs-example-heading')).not.toHaveAttribute(
      'data-has-coverage',
    );
    expect(
      within(featuredExample as HTMLElement).getByRole('heading', {
        level: 2,
        name: entry.title,
      }),
    ).toHaveClass('city-docs-example-title');
    expect(featuredExample?.querySelector('.city-docs-example-description')).toBeNull();
    expect(featuredExample?.querySelector('.city-docs-coverage-list')).toBeNull();
    const exampleTitles = container.querySelectorAll('.city-docs-example-title');
    const exampleFrames = container.querySelectorAll('.city-docs-example');
    const exampleTitleRows = container.querySelectorAll('.city-docs-example-title-row');
    const exampleHeaders = container.querySelectorAll('.city-docs-example-heading');
    const previewCanvases = container.querySelectorAll('.city-docs-example-preview-canvas');
    const previewContents = container.querySelectorAll('.city-docs-example-preview-content');

    expect(exampleTitles.length).toBeGreaterThan(0);
    expect(exampleFrames).toHaveLength(exampleTitles.length);
    expect(exampleTitleRows).toHaveLength(exampleTitles.length);
    expect(exampleHeaders).toHaveLength(exampleTitles.length);
    expect(previewCanvases).toHaveLength(exampleTitles.length);
    expect(previewContents).toHaveLength(exampleTitles.length);
    expect(container.querySelectorAll("[data-city-docs-layout='wide']")).toHaveLength(
      WIDE_PREVIEW_COUNTS[entry.slug] ?? 0,
    );
    for (const previewContent of previewContents) {
      expect(previewContent.getAttribute('data-city-docs-layout')).toMatch(/^(center|wide)$/);
    }
    for (const frame of exampleFrames) {
      const body = frame.querySelector(':scope > [data-city-panel-body]');

      expect(frame).toHaveAttribute('data-city-panel');
      expect(frame.querySelector(':scope > [data-city-panel-header]')).not.toBeNull();
      expect(body).toHaveClass('city-docs-example-body', 'min-w-0');
      expect(body).not.toHaveClass('bg-city-background', 'bg-city-muted');
      expect(body?.querySelector('.city-docs-example-preview')).not.toBeNull();
      expect(body?.querySelector('.city-docs-example-code')).not.toBeNull();
    }
    const optionHeading = screen.queryByRole('heading', { level: 2, name: '옵션과 사용법' });
    const optionSection = optionHeading?.closest('.city-docs-component-reference-section');
    const optionTitles = optionSection?.querySelectorAll('.city-docs-example-title') ?? [];
    const optionDescriptions =
      optionSection?.querySelectorAll('.city-docs-example-description') ?? [];
    const optionCoverageRows = optionSection?.querySelectorAll('.city-docs-coverage-list') ?? [];

    expect(optionDescriptions).toHaveLength(optionTitles.length);
    expect(optionCoverageRows).toHaveLength(optionTitles.length);
    if (exampleTitles.length > 1) {
      expect(optionHeading).toBeVisible();
      expect(optionTitles).toHaveLength(exampleTitles.length - 1);
    } else {
      expect(optionHeading).toBeNull();
    }
    for (const title of optionTitles) {
      expect(title.tagName).toBe('H3');
      expect(title.parentElement).toHaveClass('city-docs-example-heading-copy');
      expect(title.parentElement?.parentElement).toHaveClass('city-docs-example-title-row');
      expect(title.closest('.city-docs-example-heading')).toHaveAttribute('data-has-coverage');
    }
    for (const description of optionDescriptions) {
      expect(description).not.toBeEmptyDOMElement();
      expect(description).toBeVisible();
      expect(description).not.toHaveClass('city-docs-sr-only');
    }
    for (const header of exampleHeaders) {
      expect(
        within(header as HTMLElement).getByRole('button', { name: '미리보기 설정' }),
      ).toBeVisible();
    }
    const optionPanels = screen.queryAllByRole('complementary', { name: '미리보기 옵션' });
    expect(optionPanels).toHaveLength(CONFIGURABLE_COMPONENTS.has(entry.slug) ? 1 : 0);
    for (const panel of optionPanels) {
      expect(panel).not.toHaveAttribute('hidden');
    }
    expect(container.querySelector('.city-docs-prose')).toHaveClass('city-prose');
    const importRegion = screen.getByRole('region', { name: `${entry.title} 가져오기` });
    expect(pageHeading).toContainElement(importRegion);
    expect(screen.queryByRole('heading', { level: 2, name: '가져오기' })).toBeNull();
    const apiRegion = screen.getByRole('region', { name: '주요 API' });
    expect(within(apiRegion).getByRole('table')).toBeVisible();
    const accessibilityHeading = screen.getByRole('heading', { level: 2, name: '접근성' });
    expect(featuredExample?.compareDocumentPosition(apiRegion)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(apiRegion.compareDocumentPosition(accessibilityHeading)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    if (optionHeading) {
      expect(apiRegion.compareDocumentPosition(optionHeading)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
      expect(optionHeading.compareDocumentPosition(accessibilityHeading)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
    }
    const selectionGuidance = container.querySelector('.city-docs-selection-guidance');
    const related = container.querySelector('.city-docs-related');
    expect(selectionGuidance).toHaveTextContent('선택 가이드');
    expect(selectionGuidance).toHaveTextContent(entry.selectionGuidance);
    expect(screen.queryByRole('heading', { name: '선택 가이드' })).toBeNull();
    expect(selectionGuidance?.compareDocumentPosition(related as Node)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it('keeps Calendar static examples centered', async () => {
    const { container } = await renderDocs(['/components/calendar']);

    expect(container.querySelectorAll('.city-docs-example')).toHaveLength(4);
    expect(container.querySelectorAll("[data-city-docs-layout='center']")).toHaveLength(4);
    expect(container.querySelectorAll("[data-city-docs-layout='wide']")).toHaveLength(0);
    expect(screen.getAllByRole('grid')).toHaveLength(12);
    expect(screen.queryByRole('group', { name: '달력 크기' })).toBeNull();
    expect(screen.queryByRole('group', { name: '달력 상태' })).toBeNull();
  });

  it.each([
    { slug: 'data-table-region', tableCount: 6 },
    { slug: 'table', tableCount: 3 },
  ])('uses the full preview width before $slug tables overflow', async ({ slug, tableCount }) => {
    const { container } = await renderDocs([`/components/${slug}`]);
    const overflowTables = container.querySelectorAll('.city-docs-example-overflow-table');

    expect(container.querySelector('.city-docs-example-narrow')).toBeNull();
    expect(overflowTables).toHaveLength(tableCount);
    for (const table of overflowTables) {
      expect(table.closest('[data-city-table-scroll-area]')).not.toBeNull();
      expect(table.closest("[data-city-docs-layout='wide']")).not.toBeNull();
    }
  });
});
