import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { filterDocumentPages } from '../docs/doc-catalog';
import { BLOCK_GROUPS, getBlockDoc } from './block-catalog';
import { DeploymentDetails } from './examples/deployment-details';
import DeploymentHistoryExample, { DeploymentHistory } from './examples/deployment-history';
import { exampleDeployments } from './examples/deployment-data';
import { WorkflowEvents } from './examples/workflow-events';

describe('Workflow blocks', () => {
  it('groups runs and events together and includes dependencies in copyable sources', async () => {
    const entries = BLOCK_GROUPS.find((group) => group.title === '워크플로우')!.items;
    expect(entries.map((entry) => entry.slug)).toEqual([
      'deployment-history',
      'deployment-details',
      'workflow-events',
    ]);
    const results = filterDocumentPages('워크플로우');
    for (const entry of entries) {
      expect(
        results.some((result) => result.kind === 'block' && result.entry.slug === entry.slug),
      ).toBe(true);
      const loaded = await getBlockDoc(entry.slug)!.load();
      expect(loaded.extraFiles?.some((file) => file.filename === 'deployment-data.ts')).toBe(true);
      if (entry.slug !== 'workflow-events') {
        expect(loaded.extraFiles?.some((file) => file.filename === 'workflow-events.tsx')).toBe(
          true,
        );
      }
    }
  });

  it('preserves failures before retries, original timestamps and the requested log target', async () => {
    const user = userEvent.setup();
    const viewLogs = vi.fn();
    const events = exampleDeployments[1]!.events!;
    render(<WorkflowEvents events={events} onViewLogs={viewLogs} />);
    const items = within(screen.getByRole('list', { name: '실행 이벤트' })).getAllByRole(
      'listitem',
    );
    expect(items).toHaveLength(events.length);
    events.forEach((event, index) => {
      expect(items[index]).toHaveTextContent(event.title);
      expect(items[index]!.querySelector('time')).toHaveAttribute('dateTime', event.occurredAt);
    });
    await user.click(screen.getByRole('button', { name: '빌드 재시도 요청 로그 보기' }));
    expect(viewLogs).toHaveBeenCalledWith('build');
    expect(screen.queryByRole('button', { name: '실행 대기 로그 보기' })).not.toBeInTheDocument();
  });

  it('replaces stale events with loading or errors and supports retry and empty states', async () => {
    const user = userEvent.setup();
    const retry = vi.fn();
    const events = exampleDeployments[1]!.events!;
    const { rerender } = render(<WorkflowEvents events={events} loading />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    rerender(<WorkflowEvents events={events} error="이벤트 조회 실패" onRetry={retry} />);
    expect(screen.getByRole('alert')).toHaveTextContent('이벤트 조회 실패');
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '다시 불러오기' }));
    expect(retry).toHaveBeenCalledOnce();
    rerender(<WorkflowEvents events={[]} />);
    expect(screen.getByText('아직 기록된 실행 이벤트가 없습니다.')).toBeVisible();
  });

  it('opens event logs without changing the current stage and hides invalid log targets', async () => {
    const user = userEvent.setup();
    const run = exampleDeployments[1]!;
    render(
      <DeploymentDetails
        deployment={{
          ...run,
          events: [
            ...run.events!,
            {
              id: 'unknown',
              title: '외부 작업',
              description: '다른 시스템에서 처리했습니다.',
              occurredAt: run.startedAt,
              status: 'succeeded',
              stageId: 'unknown',
            },
          ],
        }}
      />,
    );
    await user.click(screen.getByRole('tab', { name: '이벤트 이력' }));
    await user.click(screen.getByRole('button', { name: '설정 검증 완료 로그 보기' }));
    expect(screen.getByRole('region', { name: '설정 검증 로그' })).toHaveFocus();
    expect(screen.getByLabelText('실행 로그 내용')).toHaveTextContent('설정 검증 완료');
    expect(screen.getByRole('tab', { name: '빌드 진행 중' })).toBeVisible();
    await user.click(screen.getByRole('tab', { name: '이벤트 이력' }));
    expect(screen.queryByRole('button', { name: '외부 작업 로그 보기' })).not.toBeInTheDocument();
  });

  it('keeps date boundaries and supports keyboard job selection without changing status', async () => {
    const user = userEvent.setup();
    const run = exampleDeployments[0]!;
    const { unmount } = render(
      <WorkflowEvents
        events={[
          {
            id: 'before',
            title: '전날 요청',
            description: '',
            occurredAt: '2026-09-08T14:59:59Z',
            status: 'queued',
          },
          {
            id: 'after',
            title: '다음날 실행',
            description: '',
            occurredAt: '2026-09-08T15:00:00Z',
            status: 'running',
          },
        ]}
      />,
    );
    expect(screen.getAllByRole('list', { name: '실행 이벤트' })).toHaveLength(2);
    expect(screen.getByRole('region', { name: '2026년 9월 8일' })).toHaveTextContent('23:59:59');
    expect(screen.getByRole('region', { name: '2026년 9월 9일' })).toHaveTextContent('00:00:00');
    unmount();
    render(<DeploymentDetails deployment={run} />);
    screen.getByRole('tab', { name: '빌드 실패' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: '배포 실행 전' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.getByText('아직 기록된 로그가 없습니다.')).toBeVisible();
    expect(screen.getByRole('tab', { name: '빌드 실패' })).toHaveTextContent('실패');
  });

  it('returns focus to the selected run when the detail drawer closes', async () => {
    const user = userEvent.setup();
    render(<DeploymentHistoryExample />);
    const trigger = screen.getByRole('button', { name: 'v1.2.1 dep_103 상세 보기' });
    await user.click(trigger);
    expect(await screen.findByRole('dialog')).toBeVisible();
    await user.keyboard('{Escape}');
    expect(trigger).toHaveFocus();
  });

  it('finds executions by branch and commit', async () => {
    const user = userEvent.setup();
    render(<DeploymentHistory records={exampleDeployments} onView={vi.fn()} />);
    const search = screen.getByRole('searchbox', { name: '실행 검색' });
    await user.type(search, 'release/1.2.1');
    expect(screen.getByRole('status')).toHaveTextContent('실행 1건');
    expect(screen.getByRole('button', { name: 'v1.2.1 dep_102 상세 보기' })).toBeVisible();
    await user.clear(search);
    await user.type(search, '8c12e90');
    expect(screen.getByRole('status')).toHaveTextContent('실행 1건');
    expect(screen.getByRole('button', { name: 'v1.2.0 dep_101 상세 보기' })).toBeVisible();
  });
});
