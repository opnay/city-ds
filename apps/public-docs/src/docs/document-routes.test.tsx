import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderDocs } from '../test/render-docs';
import { CATEGORY_LABELS, COMPONENT_DOCS } from './doc-catalog';

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
    for (const heading of ['대표 예제', '주요 API', '접근성']) {
      expect(screen.getByRole('heading', { level: 2, name: heading })).toHaveClass(
        'city-text-section-title',
      );
    }
    for (const removedHeading of ['언제 사용합니까', '언제 피해야 합니까', '합성 구조']) {
      expect(screen.queryByRole('heading', { level: 2, name: removedHeading })).toBeNull();
    }
    const sectionNames = Array.from(container.querySelectorAll('h2'), (heading) =>
      heading.textContent?.trim(),
    );
    expect(sectionNames.indexOf('대표 예제')).toBeLessThan(sectionNames.indexOf('주요 API'));
    expect(sectionNames.indexOf('주요 API')).toBeLessThan(sectionNames.indexOf('접근성'));
    const exampleTitles = container.querySelectorAll('.city-docs-example-title');
    const exampleTitleRows = container.querySelectorAll('.city-docs-example-title-row');
    const exampleDescriptions = container.querySelectorAll('.city-docs-example-description');
    const exampleCoverageRows = container.querySelectorAll('.city-docs-coverage-list');

    expect(exampleTitles.length).toBeGreaterThan(0);
    expect(exampleTitleRows).toHaveLength(exampleTitles.length);
    expect(exampleDescriptions).toHaveLength(exampleTitles.length);
    expect(exampleCoverageRows).toHaveLength(exampleTitles.length);
    const optionHeading = screen.queryByRole('heading', { level: 2, name: '옵션과 사용법' });
    if (exampleTitles.length > 1) {
      expect(optionHeading).toBeVisible();
      expect(sectionNames.indexOf('주요 API')).toBeLessThan(sectionNames.indexOf('옵션과 사용법'));
      expect(sectionNames.indexOf('옵션과 사용법')).toBeLessThan(sectionNames.indexOf('접근성'));
    } else {
      expect(optionHeading).toBeNull();
    }
    for (const title of exampleTitles) {
      expect(title.tagName).toBe('H3');
      expect(title.parentElement).toHaveClass('city-docs-example-heading-copy');
      expect(title.parentElement?.parentElement).toHaveClass('city-docs-example-title-row');
    }
    for (const description of exampleDescriptions) {
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
    const selectionGuidance = container.querySelector('.city-docs-selection-guidance');
    const related = container.querySelector('.city-docs-related');
    expect(selectionGuidance).toHaveTextContent('선택 가이드');
    expect(selectionGuidance).toHaveTextContent(entry.selectionGuidance);
    expect(screen.queryByRole('heading', { name: '선택 가이드' })).toBeNull();
    expect(selectionGuidance?.compareDocumentPosition(related as Node)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });
});
