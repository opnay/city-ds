import { type ReactNode, useRef, useState } from 'react';
import {
  AgentActivity,
  Alert,
  Avatar,
  Button,
  Commentary,
  EmptyState,
  Skeleton,
} from '@opnay/city-ds-react';
import { CircleX, Clock, Sparkles, Terminal } from 'lucide-react';
import { AiChatBlockCard } from './ai-chat-block-card';

export interface AgentWorkEvent {
  content: ReactNode;
  details?: ReactNode;
  id: string;
  indicator?: ReactNode;
  meta?: ReactNode;
  pending?: boolean;
}

function WorkActivity({ event, current }: { event: AgentWorkEvent; current: boolean }) {
  const contentProps = current
    ? ({ role: 'status', 'aria-live': 'polite', 'aria-atomic': true } as const)
    : undefined;
  const summary = (
    <>
      <AgentActivity.Indicator>{event.indicator}</AgentActivity.Indicator>
      <AgentActivity.Content {...contentProps}>{event.content}</AgentActivity.Content>
      {event.meta && <AgentActivity.Meta>{event.meta}</AgentActivity.Meta>}
    </>
  );

  return (
    <AgentActivity.Root pending={current && (event.pending ?? false)} role="listitem">
      {event.details ? (
        <>
          <AgentActivity.Trigger>{summary}</AgentActivity.Trigger>
          <AgentActivity.Details>{event.details}</AgentActivity.Details>
        </>
      ) : (
        summary
      )}
    </AgentActivity.Root>
  );
}

export interface AgentWorkTask {
  currentEventId?: string | undefined;
  events: readonly AgentWorkEvent[];
  id: string;
  model?: string;
  prompt: ReactNode;
  response?: ReactNode;
  title: string;
}

export interface AgentWorkStatusProps {
  cancelling?: boolean;
  error?: string;
  loading?: boolean;
  onCancel?: ((taskId: string) => Promise<void> | void) | undefined;
  onRetry?: (() => void) | undefined;
  task?: AgentWorkTask;
}

export function AgentWorkStatus({
  cancelling = false,
  error,
  loading = false,
  onCancel,
  onRetry,
  task,
}: AgentWorkStatusProps) {
  const [localCancelling, setLocalCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const cancellingRef = useRef(false);

  if (loading && !task) {
    return (
      <AiChatBlockCard title="에이전트 작업">
        <div
          role="status"
          aria-label="에이전트 작업 불러오는 중"
          aria-busy="true"
          className="city-ai-chat-block-transcript"
        >
          <Skeleton className="h-12 w-2/3 justify-self-end" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-4/5" />
        </div>
      </AiChatBlockCard>
    );
  }

  if (error && !task) {
    return (
      <AiChatBlockCard title="에이전트 작업">
        <Alert.Root tone="destructive">
          <Alert.Title level={4}>에이전트 작업을 불러오지 못했습니다.</Alert.Title>
          <Alert.Description>{error}</Alert.Description>
          {onRetry && <Button onClick={onRetry}>다시 불러오기</Button>}
        </Alert.Root>
      </AiChatBlockCard>
    );
  }

  if (!task) {
    return (
      <AiChatBlockCard title="에이전트 작업">
        <EmptyState.Root>
          <EmptyState.Title level={4}>선택한 작업이 없습니다.</EmptyState.Title>
          <EmptyState.Description>
            작업을 시작하면 프롬프트, 진행 상태, 응답을 표시합니다.
          </EmptyState.Description>
        </EmptyState.Root>
      </AiChatBlockCard>
    );
  }

  const workTask = task;
  const currentEvent = workTask.events.find((event) => event.id === workTask.currentEventId);
  const hasCurrentEvent = Boolean(currentEvent);
  const busy = cancelling || localCancelling;

  async function cancelTask() {
    if (!onCancel || !hasCurrentEvent || busy || cancellingRef.current) return;
    cancellingRef.current = true;
    setLocalCancelling(true);
    setCancelError('');
    try {
      await onCancel(workTask.id);
    } catch {
      setCancelError('작업 중단 요청을 처리하지 못했습니다. 연결을 확인한 뒤 다시 시도하십시오.');
    } finally {
      cancellingRef.current = false;
      setLocalCancelling(false);
    }
  }

  return (
    <AiChatBlockCard
      title={task.title}
      description={
        task.model
          ? `${task.model}${hasCurrentEvent ? '으로 처리 중인 작업입니다.' : '으로 실행한 작업입니다.'}`
          : undefined
      }
      actions={
        onCancel && hasCurrentEvent ? (
          <Button variant="outline" disabled={busy} onClick={cancelTask}>
            {busy ? '중단 요청 중…' : '작업 중단'}
          </Button>
        ) : undefined
      }
    >
      {error && (
        <Alert.Root tone="destructive">
          <Alert.Title level={4}>작업을 새로고침하지 못했습니다.</Alert.Title>
          <Alert.Description>{error}</Alert.Description>
          {onRetry && <Button onClick={onRetry}>다시 불러오기</Button>}
        </Alert.Root>
      )}
      {cancelError && (
        <Alert.Root tone="destructive">
          <Alert.Title level={4}>작업 중단 요청을 처리하지 못했습니다.</Alert.Title>
          <Alert.Description>{cancelError}</Alert.Description>
        </Alert.Root>
      )}
      <div className="city-ai-chat-block-transcript" aria-busy={loading || undefined}>
        <Commentary.Root appearance="bubble" align="end">
          <Commentary.Header>
            <Avatar.Root aria-label="사용자" size="sm">
              <Avatar.Fallback>나</Avatar.Fallback>
            </Avatar.Root>
            <Commentary.Author>사용자</Commentary.Author>
          </Commentary.Header>
          <Commentary.Content>{task.prompt}</Commentary.Content>
        </Commentary.Root>
        <div className="city-ai-chat-block-events" role="list" aria-label="에이전트 작업 이벤트">
          {task.events.map((event) => {
            const isCurrent = event.id === currentEvent?.id;
            return <WorkActivity key={event.id} event={event} current={isCurrent} />;
          })}
        </div>
        {task.response && (
          <Commentary.Root appearance="plain" align="start">
            <Commentary.Header>
              <Avatar.Root aria-label="에이전트" size="sm">
                <Avatar.Fallback>AI</Avatar.Fallback>
              </Avatar.Root>
              <Commentary.Author>에이전트</Commentary.Author>
              {task.model && <Commentary.Meta>{task.model}</Commentary.Meta>}
            </Commentary.Header>
            <Commentary.Content>{task.response}</Commentary.Content>
          </Commentary.Root>
        )}
      </div>
    </AiChatBlockCard>
  );
}

const exampleTask: AgentWorkTask = {
  currentEventId: 'thinking',
  id: 'task_87',
  model: 'research-model-2026-09-long-context-v3',
  prompt: '이번 릴리스에서 변경된 접근성 API와 마이그레이션 항목을 요약해 주세요.',
  title: '릴리스 노트 초안',
  events: [
    {
      id: 'queued',
      content: '릴리스 문서와 변경 로그를 찾았습니다.',
      indicator: <Clock />,
      meta: '10:02',
    },
    {
      id: 'model',
      content: '긴 문서 비교를 위해 분석 모델을 전환했습니다.',
      indicator: <Sparkles />,
      meta: '10:04',
    },
    {
      id: 'complete',
      content: '공개 API와 의존성 목록을 정리했습니다.',
      details: (
        <pre tabIndex={0} aria-label="정리한 공개 API">
          <code>{'Commentary\nAgentActivity\nDensityProvider'}</code>
        </pre>
      ),
      indicator: <Terminal />,
      meta: '10:05',
    },
    {
      id: 'thinking',
      content: 'Thinking — 변경 범위와 기존 컴포넌트 의존성을 확인하고 있습니다.',
      pending: true,
      meta: '지금',
    },
  ],
};

export default function AgentWorkStatusExample() {
  const [cancelled, setCancelled] = useState(false);
  return (
    <AgentWorkStatus
      task={{
        ...exampleTask,
        currentEventId: cancelled ? undefined : exampleTask.currentEventId,
        events: cancelled
          ? exampleTask.events.map((event) =>
              event.id === exampleTask.currentEventId
                ? {
                    ...event,
                    content: '사용자 요청으로 작업을 중단했습니다.',
                    pending: false,
                    indicator: <CircleX />,
                  }
                : event,
            )
          : exampleTask.events,
      }}
      onCancel={() => setCancelled(true)}
    />
  );
}
