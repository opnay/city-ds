import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderDocs } from '../test/render-docs';
import { COMPONENT_DOCS } from './doc-catalog';

describe('all component document routes', () => {
  it.each(COMPONENT_DOCS)('renders $slug with examples and API', async (entry) => {
    await renderDocs([`/components/${entry.slug}`]);

    expect(screen.getByRole('heading', { level: 1, name: entry.title })).toBeVisible();
    for (const heading of [
      '언제 사용합니까',
      '언제 피해야 합니까',
      '합성 구조',
      '옵션과 상태',
      '주요 API',
      '접근성',
    ]) {
      expect(screen.getByRole('heading', { level: 2, name: heading })).toBeVisible();
    }
    const apiRegion = screen.getByRole('region', { name: '주요 API' });
    expect(within(apiRegion).getByRole('table')).toBeVisible();
  });
});
