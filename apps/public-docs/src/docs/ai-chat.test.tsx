import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import ConversationExample from './components/actioned/examples/conversation';
import { COMPONENT_CATEGORIES, filterComponentDocs, filterDocumentPages } from './doc-catalog';
import { renderDocs } from '../test/render-docs';

describe('AI & Chat documentation', () => {
  it('registers menu and search entries', async () => {
    expect(COMPONENT_CATEGORIES).toContain('AI & Chat');
    expect(filterComponentDocs('', 'AI & Chat').map((entry) => entry.slug)).toEqual([
      'commentary',
      'agent-activity',
      'actioned',
    ]);
    for (const [query, slug] of [
      ['말풍선', 'commentary'],
      ['Thinking', 'agent-activity'],
      ['승인', 'actioned'],
    ]) {
      expect(
        filterDocumentPages(query!).some(
          (result) => result.kind === 'component' && result.entry.slug === slug,
        ),
      ).toBe(true);
    }
    await renderDocs(['/components/commentary']);
    const nav = screen.getByRole('navigation', { name: '문서 탐색' });
    for (const title of ['Commentary', 'AgentActivity', 'Actioned'])
      expect(within(nav).getByRole('link', { name: title })).toBeVisible();
  });

  it('guards duplicate approval and restores focus while distinguishing every outcome', async () => {
    const user = userEvent.setup();
    render(<ConversationExample />);
    await user.click(screen.getByRole('button', { name: '작업 시작' }));
    expect(screen.getByRole('status')).toHaveTextContent('Thinking');
    expect(screen.getByRole('button', { name: '승인 요청 보기' })).toHaveFocus();
    await user.keyboard('{Enter}');
    const trigger = screen.getByRole('button', { name: 'README.md 읽기' });
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(screen.getByRole('button', { name: '거절' }));
    expect(screen.getByRole('status')).toHaveTextContent('거절됨');
    expect(screen.getByText('실행 요청: 0회')).toBeVisible();
    expect(trigger).toHaveFocus();
    await user.click(screen.getByRole('button', { name: '다시 승인 요청' }));
    const approve = screen.getByRole('button', { name: '허용' });
    act(() => {
      approve.click();
      approve.click();
    });
    expect(screen.getByText('실행 요청: 1회')).toBeVisible();
    expect(screen.queryByRole('button', { name: '허용' })).toBeNull();
    expect(screen.getByRole('status')).toHaveTextContent('실행 중');
    expect(trigger).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.click(screen.getByRole('button', { name: '실패 결과 적용' }));
    expect(screen.getByRole('status')).toHaveTextContent('실패');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveFocus();
    await user.click(screen.getByRole('button', { name: '다시 승인 요청' }));
    await user.click(screen.getByRole('button', { name: '허용' }));
    await user.click(screen.getByRole('button', { name: '실행 취소' }));
    expect(screen.getByRole('status')).toHaveTextContent('취소됨');
    expect(trigger).toHaveFocus();
    await user.click(screen.getByRole('button', { name: '다시 승인 요청' }));
    await user.click(screen.getByRole('button', { name: '허용' }));
    await user.click(screen.getByRole('button', { name: '성공 결과 적용' }));
    expect(screen.getByRole('status')).toHaveTextContent('완료');
    expect(screen.getByText('실행 요청: 3회')).toBeVisible();
    expect(screen.getByText(/이 프로젝트는 Base UI 기반 React 디자인 시스템/)).toBeVisible();
    expect(trigger).toHaveFocus();
  });
});
