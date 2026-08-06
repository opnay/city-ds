import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderDocs } from '../test/render-docs';
import { COMPONENT_DOCS } from './doc-catalog';

describe('all component document routes', () => {
  it.each(COMPONENT_DOCS)('renders $slug with examples and API', async (entry) => {
    const { container } = await renderDocs([`/components/${entry.slug}`]);

    expect(screen.getByRole('heading', { level: 1, name: entry.title })).toHaveClass(
      'city-text-page-title',
    );
    for (const heading of [
      '언제 사용합니까',
      '언제 피해야 합니까',
      '합성 구조',
      '옵션과 상태',
      '주요 API',
      '접근성',
    ]) {
      expect(screen.getByRole('heading', { level: 2, name: heading })).toHaveClass(
        'city-text-section-title',
      );
    }
    const exampleTitles = container.querySelectorAll('.city-docs-example-title');
    const exampleTitleRows = container.querySelectorAll('.city-docs-example-title-row');
    const exampleDescriptions = container.querySelectorAll(
      '.city-docs-example-heading .city-docs-sr-only',
    );
    const exampleCoverageRows = container.querySelectorAll('.city-docs-coverage-list');

    expect(exampleTitles.length).toBeGreaterThan(0);
    expect(exampleTitleRows).toHaveLength(exampleTitles.length);
    expect(exampleDescriptions).toHaveLength(exampleTitles.length);
    expect(exampleCoverageRows).toHaveLength(exampleTitles.length);
    for (const title of exampleTitles) {
      expect(title.tagName).toBe('H3');
      expect(title.parentElement).toHaveClass('city-docs-example-title-row');
    }
    for (const description of exampleDescriptions) {
      expect(description).not.toBeEmptyDOMElement();
    }
    for (const titleRow of exampleTitleRows) {
      expect(
        within(titleRow as HTMLElement).getByRole('button', { name: '미리보기 설정' }),
      ).toBeVisible();
    }
    expect(container.querySelector('.city-docs-prose')).toHaveClass('city-prose');
    const apiRegion = screen.getByRole('region', { name: '주요 API' });
    expect(within(apiRegion).getByRole('table')).toBeVisible();
  });
});
