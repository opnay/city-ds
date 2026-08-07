import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderDocs } from '../test/render-docs';
import { CATEGORY_LABELS, COMPONENT_DOCS } from './doc-catalog';

const WIDE_PREVIEW_COUNTS: Readonly<Record<string, number>> = {
  alert: 2,
  badge: 1,
  callout: 2,
  'data-table-region': 2,
  'filter-bar': 1,
  progress: 1,
  table: 4,
  toast: 1,
};

describe('all component document routes', () => {
  it.each(COMPONENT_DOCS)('renders $slug with examples and API', async (entry) => {
    const { container } = await renderDocs([`/components/${entry.slug}`]);

    expect(screen.getByRole('heading', { level: 1, name: entry.title })).toHaveClass(
      'city-text-page-title',
    );
    const pageHeading = screen
      .getByRole('heading', { level: 1, name: entry.title })
      .closest('header');

    expect(pageHeading).not.toBeNull();
    expect(
      within(pageHeading as HTMLElement).getByText(`컴포넌트 · ${CATEGORY_LABELS[entry.category]}`),
    ).toHaveClass('city-docs-page-eyebrow', 'city-text-caption');
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
    expect(
      within(featuredExample as HTMLElement).getByRole('heading', {
        level: 2,
        name: entry.title,
      }),
    ).toHaveClass('city-docs-example-title');
    expect(featuredExample?.querySelector('.city-docs-example-description')).toBeNull();
    expect(featuredExample?.querySelector('.city-docs-coverage-list')).toBeNull();
    const exampleTitles = container.querySelectorAll('.city-docs-example-title');
    const exampleTitleRows = container.querySelectorAll('.city-docs-example-title-row');
    const previewContents = container.querySelectorAll('.city-docs-example-preview-content');

    expect(exampleTitles.length).toBeGreaterThan(0);
    expect(exampleTitleRows).toHaveLength(exampleTitles.length);
    expect(previewContents).toHaveLength(exampleTitles.length);
    expect(container.querySelectorAll("[data-city-docs-layout='wide']")).toHaveLength(
      WIDE_PREVIEW_COUNTS[entry.slug] ?? 0,
    );
    for (const previewContent of previewContents) {
      expect(previewContent.getAttribute('data-city-docs-layout')).toMatch(/^(center|wide)$/);
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
    }
    for (const description of optionDescriptions) {
      expect(description).not.toBeEmptyDOMElement();
      expect(description).toBeVisible();
      expect(description).not.toHaveClass('city-docs-sr-only');
    }
    for (const titleRow of exampleTitleRows) {
      expect(
        within(titleRow as HTMLElement).getByRole('button', { name: '미리보기 설정' }),
      ).toBeVisible();
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

  it('keeps Calendar to one centered interactive preview', async () => {
    const { container } = await renderDocs(['/components/calendar']);

    expect(container.querySelectorAll('.city-docs-example')).toHaveLength(1);
    expect(container.querySelectorAll("[data-city-docs-layout='center']")).toHaveLength(1);
    expect(container.querySelectorAll("[data-city-docs-layout='wide']")).toHaveLength(0);
    expect(screen.getAllByRole('grid')).toHaveLength(1);
    expect(screen.getByRole('group', { name: '달력 크기' })).toBeVisible();
    expect(screen.getByRole('group', { name: '달력 상태' })).toBeVisible();
    expect(screen.getByRole('checkbox', { name: '인접 월 날짜 표시' })).toBeVisible();
  });
});
