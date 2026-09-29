import { useState } from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { filterDocumentPages } from '../docs/doc-catalog';
import { renderDocs } from '../test/render-docs';
import { BLOCK_GROUPS } from './block-catalog';
import { AgentQuestion, type AgentQuestionRequest } from './examples/agent-question';
import { AgentWorkStatus, type AgentWorkTask } from './examples/agent-work-status';
import { SupportConversation, type SupportConversationData } from './examples/support-conversation';

const supportConversation: SupportConversationData = {
  id: 'support_1',
  customer: { name: '김서윤', initials: '서윤' },
  subject: '초대 링크',
  messages: [
    {
      id: 'customer',
      author: { name: '김서윤', initials: '서윤' },
      content: '초대 링크가 만료됐어요.',
      role: 'customer',
      sentAt: '2026-09-17T09:41:00+09:00',
    },
    {
      id: 'support',
      author: { name: 'City 지원팀', initials: 'CS' },
      content: '새 초대 링크를 보낼 수 있습니다.',
      role: 'support',
      sentAt: '2026-09-17T09:43:00+09:00',
    },
  ],
};

const agentTask: AgentWorkTask = {
  currentEventId: 'thinking',
  id: 'task_1',
  model: 'research-model-2026-09-long-context-v3',
  status: 'running',
  prompt: '릴리스 노트를 정리해 주세요.',
  response: '접근성 API와 마이그레이션 항목을 정리했습니다.',
  title: '릴리스 노트 초안',
  events: [
    { id: 'queued', content: '변경 로그를 찾았습니다.', meta: '10:02' },
    {
      id: 'thinking',
      content: 'Thinking — 문서를 비교하고 있습니다.',
      pending: true,
    },
  ],
};

const questionRequest: AgentQuestionRequest = {
  id: 'question_1',
  task: { id: 'task_1', title: '검색 기능 설정' },
  prompt: '검색 기능을 켜기 위해 환경 변수를 추가해 주세요.',
  question: '프로덕션 환경에 FEATURE_AGENT_SEARCH를 추가할까요?',
  choices: [
    { id: 'allow', label: '적용 허용', preferred: true },
    { id: 'reject', label: '이번에는 취소' },
  ],
  currentActivityId: 'question',
  activities: [
    {
      id: 'inspect',
      content: '환경 설정을 확인했습니다.',
      details: <pre aria-label="환경 설정 확인 입력">{'{ "path": ".env.production" }'}</pre>,
    },
    { id: 'question', content: '선택을 기다리고 있습니다.', pending: true },
  ],
};

function AgentQuestionHarness() {
  const [request, setRequest] = useState(questionRequest);
  return (
    <AgentQuestion
      request={request}
      onAnswer={async (_, choice) =>
        setRequest((current) => ({
          ...current,
          answer: choice.label,
          assistantResponse:
            choice.id === 'allow'
              ? '환경 변수를 추가했습니다.'
              : '환경 변수는 변경하지 않았습니다.',
          currentActivityId: undefined,
        }))
      }
    />
  );
}

describe('AI & Chat blocks', () => {
  it('adds the three production blocks to the catalog, navigation and search', async () => {
    const entries = BLOCK_GROUPS.find((group) => group.title === 'AI & Chat')!.items;
    expect(entries.map((entry) => entry.slug)).toEqual([
      'support-conversation',
      'agent-work-status',
      'agent-question',
    ]);
    for (const entry of entries) {
      expect(
        filterDocumentPages(entry.title).some(
          (result) => result.kind === 'block' && result.entry.slug === entry.slug,
        ),
      ).toBe(true);

      const loaded = await entry.load();
      expect(loaded.extraFiles?.map((file) => file.filename)).toEqual([
        'ai-chat-block-card.tsx',
        'ai-chat-blocks.css',
      ]);
    }

    await renderDocs(['/blocks']);
    const main = within(screen.getByRole('main'));
    const section = main.getByRole('region', { name: 'AI & Chat' });
    expect(within(section).getByRole('heading', { level: 2, name: 'AI & Chat' })).toBeVisible();
    const navigation = within(screen.getByRole('navigation', { name: '문서 탐색' }));
    await userEvent.setup().click(navigation.getByRole('button', { name: 'AI & Chat' }));
    expect(navigation.getByRole('link', { name: '에이전트 질문' })).toHaveAttribute(
      'href',
      '/blocks/agent-question',
    );
  });

  it('renders a support conversation from API data and sends the composed reply once', async () => {
    const user = userEvent.setup();
    let completeSend: (() => void) | undefined;
    const sendMessage = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          completeSend = resolve;
        }),
    );
    const messageAction = vi.fn();
    const { container } = render(
      <SupportConversation
        conversation={supportConversation}
        onMessageAction={messageAction}
        onSendMessage={sendMessage}
      />,
    );
    expect(
      container.querySelector('[data-city-appearance="bubble"][data-city-align="end"]'),
    ).toBeTruthy();
    expect(
      container.querySelector('[data-city-appearance="plain"][data-city-align="start"]'),
    ).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'City 지원팀 답변 복사' }));
    expect(messageAction).toHaveBeenCalledWith(supportConversation.messages[1], 'copy');
    await user.type(screen.getByRole('textbox', { name: '답변' }), '새 초대 링크를 보냈습니다.');
    await user.click(screen.getByRole('button', { name: '답변 보내기' }));
    expect(sendMessage).toHaveBeenCalledOnce();
    expect(sendMessage).toHaveBeenCalledWith({
      conversationId: 'support_1',
      content: '새 초대 링크를 보냈습니다.',
    });
    expect(screen.getByRole('textbox', { name: '답변' })).toBeDisabled();
    const sending = screen.getByRole('button', { name: '보내는 중…' });
    expect(sending).toBeDisabled();
    await user.click(sending);
    expect(sendMessage).toHaveBeenCalledOnce();
    completeSend?.();
    await waitFor(() => expect(screen.getByRole('textbox', { name: '답변' })).toHaveValue(''));
  });

  it('keeps loading, request errors and empty selections distinct', () => {
    const { rerender } = render(<SupportConversation loading />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    rerender(<SupportConversation error="권한을 확인하지 못했습니다." />);
    expect(screen.getByRole('alert')).toHaveTextContent('권한을 확인하지 못했습니다.');
    expect(screen.queryByText('선택한 고객 문의가 없습니다.')).not.toBeInTheDocument();

    rerender(<AgentWorkStatus />);
    expect(screen.getByText('선택한 작업이 없습니다.')).toBeVisible();

    rerender(<AgentQuestion />);
    expect(screen.getByText('응답할 질문이 없습니다.')).toBeVisible();
  });

  it('keeps previously loaded content when a refresh fails', () => {
    const { rerender } = render(
      <SupportConversation
        conversation={supportConversation}
        error="권한을 확인하지 못했습니다."
      />,
    );
    expect(screen.getByText('새 초대 링크를 보낼 수 있습니다.')).toBeVisible();
    expect(screen.getByRole('alert')).toHaveTextContent('권한을 확인하지 못했습니다.');

    rerender(<AgentWorkStatus task={agentTask} error="작업 정보를 새로고침하지 못했습니다." />);
    expect(screen.getByText('릴리스 노트를 정리해 주세요.')).toBeVisible();
    expect(screen.getByRole('alert')).toHaveTextContent('작업 정보를 새로고침하지 못했습니다.');

    rerender(<AgentQuestion request={questionRequest} error="질문을 새로고침하지 못했습니다." />);
    expect(screen.getByText('검색 기능을 켜기 위해 환경 변수를 추가해 주세요.')).toBeVisible();
    expect(screen.getByRole('alert')).toHaveTextContent('질문을 새로고침하지 못했습니다.');
  });

  it('shows an actual agent task transcript and announces only the current event', () => {
    render(<AgentWorkStatus task={agentTask} onCancel={vi.fn()} />);
    expect(screen.getByText('접근성 API와 마이그레이션 항목을 정리했습니다.')).toBeVisible();
    expect(screen.getAllByText('research-model-2026-09-long-context-v3')).not.toHaveLength(0);
    expect(screen.getByRole('list', { name: '에이전트 작업 이벤트' })).toHaveTextContent(
      '변경 로그를 찾았습니다.',
    );
    const current = screen.getByRole('status');
    expect(current).toHaveTextContent('Thinking');
    expect(current).toHaveAttribute('aria-live', 'polite');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('does not describe a finished agent task as still processing', () => {
    const { rerender } = render(<AgentWorkStatus task={agentTask} onCancel={vi.fn()} />);
    expect(
      screen.getByText('research-model-2026-09-long-context-v3으로 처리 중인 작업입니다.'),
    ).toBeVisible();

    rerender(
      <AgentWorkStatus
        task={{
          ...agentTask,
          currentEventId: undefined,
          status: 'succeeded',
        }}
        onCancel={vi.fn()}
      />,
    );
    expect(
      screen.getByText('research-model-2026-09-long-context-v3으로 실행한 작업입니다.'),
    ).toBeVisible();
    expect(screen.queryByRole('button', { name: '작업 중단' })).not.toBeInTheDocument();
  });

  it('derives one current event from its ID and keeps tool logs inside the activity stream', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <AgentQuestion
        request={{
          ...questionRequest,
          activities: [
            ...(questionRequest.activities ?? []),
            { id: 'stale-pending', content: '이전 처리입니다.', pending: true },
          ],
        }}
      />,
    );
    expect(screen.getAllByRole('status')).toHaveLength(1);
    expect(screen.getByRole('status')).toHaveTextContent('선택을 기다리고 있습니다.');
    const trigger = screen.getByRole('button', { name: /환경 설정을 확인했습니다/ });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(screen.getByLabelText('환경 설정 확인 입력')).toBeVisible();

    rerender(
      <AgentQuestion
        request={{
          ...questionRequest,
          currentActivityId: undefined,
        }}
      />,
    );
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('prevents duplicate cancellation while a request is in flight', async () => {
    const user = userEvent.setup();
    let finishCancel: (() => void) | undefined;
    const onCancel = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finishCancel = resolve;
        }),
    );
    render(<AgentWorkStatus task={agentTask} onCancel={onCancel} />);

    const cancel = screen.getByRole('button', { name: '작업 중단' });
    await user.click(cancel);
    await user.click(cancel);
    expect(onCancel).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: '중단 요청 중…' })).toBeDisabled();

    finishCancel?.();
    await waitFor(() => expect(screen.getByRole('button', { name: '작업 중단' })).toBeEnabled());
  });

  it('sends one answer, then renders server-owned activity and response data', async () => {
    const user = userEvent.setup();
    render(<AgentQuestionHarness />);
    await user.click(screen.getByRole('button', { name: '적용 허용' }));
    expect(screen.getByText('적용 허용')).toBeVisible();
    expect(screen.queryByRole('button', { name: '적용 허용' })).toBeNull();
    expect(screen.getByText('환경 변수를 추가했습니다.')).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent('질문에 답변했습니다.');
  });

  it('blocks duplicate answers and preserves a failed question for retry', async () => {
    const user = userEvent.setup();
    let finishAnswer: (() => void) | undefined;
    const onAnswer = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finishAnswer = resolve;
        }),
    );
    const { rerender } = render(<AgentQuestion request={questionRequest} onAnswer={onAnswer} />);
    const allow = screen.getByRole('button', { name: '적용 허용' });
    await user.click(allow);
    await user.click(allow);
    expect(onAnswer).toHaveBeenCalledOnce();
    expect(allow).toBeDisabled();
    finishAnswer?.();
    await waitFor(() => expect(allow).toBeEnabled());

    const failedAnswer = vi.fn().mockRejectedValue(new Error('offline'));
    rerender(<AgentQuestion request={questionRequest} onAnswer={failedAnswer} />);
    await user.click(screen.getByRole('button', { name: '이번에는 취소' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('응답을 전송하지 못했습니다.');
    expect(screen.getByText('프로덕션 환경에 FEATURE_AGENT_SEARCH를 추가할까요?')).toBeVisible();
    await user.click(screen.getByRole('button', { name: '이번에는 취소' }));
    expect(failedAnswer).toHaveBeenCalledTimes(2);
  });
});
