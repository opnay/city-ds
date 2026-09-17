import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { COMPONENT_CATEGORIES, filterComponentDocs, filterDocumentPages } from './doc-catalog';
import { renderDocs } from '../test/render-docs';

describe('AI & Chat documentation', () => {
  it('registers message and activity components without a duplicate tool execution primitive', async () => {
    expect(COMPONENT_CATEGORIES).toContain('AI & Chat');
    expect(filterComponentDocs('', 'AI & Chat').map((entry) => entry.slug)).toEqual([
      'commentary',
      'agent-activity',
    ]);
    for (const [query, slug] of [
      ['말풍선', 'commentary'],
      ['도구 로그', 'agent-activity'],
    ] as const) {
      expect(
        filterDocumentPages(query).some(
          (result) => result.kind === 'component' && result.entry.slug === slug,
        ),
      ).toBe(true);
    }
    expect(filterDocumentPages('Actioned')).toHaveLength(0);

    await renderDocs(['/components/commentary']);
    const nav = screen.getByRole('navigation', { name: '문서 탐색' });
    for (const title of ['Commentary', 'AgentActivity'])
      expect(within(nav).getByRole('link', { name: title })).toBeVisible();
    expect(within(nav).queryByRole('link', { name: 'Actioned' })).toBeNull();
  });
});
