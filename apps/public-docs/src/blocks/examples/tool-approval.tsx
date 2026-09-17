import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Actioned,
  AgentActivity,
  Alert,
  Avatar,
  Button,
  Commentary,
  EmptyState,
  Skeleton,
  type ActionedStatus,
} from '@opnay/city-ds-react';
import { CircleX, ShieldQuestion, Sparkles } from 'lucide-react';
import { AiChatBlockCard } from './ai-chat-block-card';

const statusLabels: Record<ActionedStatus, string> = {
  queued: '대기 중',
  'approval-required': '승인 필요',
  running: '실행 중',
  completed: '완료',
  failed: '실패',
  cancelled: '취소됨',
  rejected: '거절됨',
};

function replaceCurrentActivity(
  activities: readonly DeveloperToolActivity[] | undefined,
  next: DeveloperToolActivity,
) {
  return [...(activities ?? []).map((activity) => ({ ...activity, pending: false })), next];
}

export interface DeveloperToolRequest {
  activities?: readonly DeveloperToolActivity[];
  approval?: ReactNode;
  assistantResponse?: ReactNode;
  currentActivityId?: string | undefined;
  error?: ReactNode;
  id: string;
  input: ReactNode;
  output?: ReactNode;
  prompt: ReactNode;
  status: ActionedStatus;
  title: string;
}

export interface DeveloperToolActivity {
  content: ReactNode;
  id: string;
  indicator?: ReactNode;
  meta?: ReactNode;
  pending?: boolean;
}

export interface ToolApprovalProps {
  actionPending?: boolean;
  defaultOpen?: boolean;
  error?: string;
  loading?: boolean;
  onApprove?: ((request: DeveloperToolRequest) => Promise<void>) | undefined;
  onCancel?: ((request: DeveloperToolRequest) => Promise<void>) | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  onReject?: ((request: DeveloperToolRequest) => Promise<void>) | undefined;
  onRetry?: (() => void) | undefined;
  onRetryExecution?: ((request: DeveloperToolRequest) => Promise<void>) | undefined;
  open?: boolean;
  request?: DeveloperToolRequest;
}

export function ToolApproval({
  actionPending = false,
  defaultOpen = false,
  error,
  loading = false,
  onApprove,
  onCancel,
  onOpenChange,
  onReject,
  onRetry,
  onRetryExecution,
  open,
  request,
}: ToolApprovalProps) {
  const [localPending, setLocalPending] = useState(false);
  const [actionError, setActionError] = useState('');
  const inFlight = useRef(false);
  const focusAfterStatus = useRef(false);
  const previousStatus = useRef(request?.status);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const statusChanged = previousStatus.current !== request?.status;
    previousStatus.current = request?.status;
    if (!statusChanged || !focusAfterStatus.current) return;
    focusAfterStatus.current = false;
    trigger.current?.focus();
  }, [request?.status]);

  async function perform(action?: (request: DeveloperToolRequest) => Promise<void>) {
    if (!request || !action || inFlight.current || actionPending) return;
    inFlight.current = true;
    focusAfterStatus.current = true;
    setLocalPending(true);
    setActionError('');
    try {
      await action(request);
    } catch {
      focusAfterStatus.current = false;
      setActionError('요청을 처리하지 못했습니다. 연결을 확인한 뒤 다시 시도하십시오.');
    } finally {
      inFlight.current = false;
      setLocalPending(false);
    }
  }

  if (loading && !request) {
    return (
      <AiChatBlockCard title="개발 도구 실행">
        <div
          role="status"
          aria-label="도구 실행 불러오는 중"
          aria-busy="true"
          className="city-ai-chat-block-transcript"
        >
          <Skeleton className="h-12 w-2/3 justify-self-end" />
          <Skeleton className="h-20 w-full" />
        </div>
      </AiChatBlockCard>
    );
  }

  if (error && !request) {
    return (
      <AiChatBlockCard title="개발 도구 실행">
        <Alert.Root tone="destructive">
          <Alert.Title level={4}>도구 실행을 불러오지 못했습니다.</Alert.Title>
          <Alert.Description>{error}</Alert.Description>
          {onRetry && <Button onClick={onRetry}>다시 불러오기</Button>}
        </Alert.Root>
      </AiChatBlockCard>
    );
  }

  if (!request) {
    return (
      <AiChatBlockCard title="개발 도구 실행">
        <EmptyState.Root>
          <EmptyState.Title level={4}>표시할 도구 요청이 없습니다.</EmptyState.Title>
          <EmptyState.Description>
            에이전트가 도구를 요청하면 승인과 실행 결과를 표시합니다.
          </EmptyState.Description>
        </EmptyState.Root>
      </AiChatBlockCard>
    );
  }

  const busy = actionPending || localPending;
  const isActiveStatus =
    request.status === 'queued' ||
    request.status === 'approval-required' ||
    request.status === 'running';
  const currentActivity = isActiveStatus
    ? request.activities?.find((activity) => activity.id === request.currentActivityId)
    : undefined;
  return (
    <AiChatBlockCard title="개발 도구 실행">
      {error && (
        <Alert.Root tone="destructive">
          <Alert.Title level={4}>도구 실행을 새로고침하지 못했습니다.</Alert.Title>
          <Alert.Description>{error}</Alert.Description>
          {onRetry && <Button onClick={onRetry}>다시 불러오기</Button>}
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
          <Commentary.Content>{request.prompt}</Commentary.Content>
        </Commentary.Root>
        {request.activities && request.activities.length > 0 && (
          <div className="city-ai-chat-block-events" role="list" aria-label="에이전트 작업 이벤트">
            {request.activities.map((activity) => {
              const isCurrent = activity.id === currentActivity?.id;
              return (
                <AgentActivity.Root
                  key={activity.id}
                  pending={isCurrent && (activity.pending ?? false)}
                  role="listitem"
                >
                  <AgentActivity.Indicator>{activity.indicator}</AgentActivity.Indicator>
                  <AgentActivity.Content
                    {...(isCurrent
                      ? { role: 'status', 'aria-live': 'polite', 'aria-atomic': true }
                      : undefined)}
                  >
                    {activity.content}
                  </AgentActivity.Content>
                  {activity.meta && <AgentActivity.Meta>{activity.meta}</AgentActivity.Meta>}
                </AgentActivity.Root>
              );
            })}
          </div>
        )}
        <Actioned.Root
          status={request.status}
          open={open}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
        >
          <Actioned.Header>
            <Actioned.Trigger ref={trigger}>{request.title}</Actioned.Trigger>
            <Actioned.Status>{statusLabels[request.status]}</Actioned.Status>
          </Actioned.Header>
          <Actioned.Content>
            <div className="city-ai-chat-block-tool-detail">
              <h4>도구 입력</h4>
              <pre tabIndex={0} aria-label={`${request.title} 입력`}>
                <code>{request.input}</code>
              </pre>
              {request.output && (
                <>
                  <h4>도구 결과</h4>
                  <div>{request.output}</div>
                </>
              )}
              {request.error && <div role="alert">{request.error}</div>}
            </div>
          </Actioned.Content>
          {request.status === 'approval-required' && (
            <Actioned.Approval>
              <p>{request.approval ?? '이 도구 실행을 허용하시겠습니까?'}</p>
              <Actioned.Actions>
                {onApprove && (
                  <Button disabled={busy} onClick={() => perform(onApprove)}>
                    허용
                  </Button>
                )}
                {onReject && (
                  <Button variant="outline" disabled={busy} onClick={() => perform(onReject)}>
                    거절
                  </Button>
                )}
              </Actioned.Actions>
            </Actioned.Approval>
          )}
          {request.status === 'running' && onCancel && (
            <Actioned.Actions className="border-t border-city-border p-3">
              <Button variant="outline" disabled={busy} onClick={() => perform(onCancel)}>
                실행 취소
              </Button>
            </Actioned.Actions>
          )}
          {(request.status === 'failed' ||
            request.status === 'cancelled' ||
            request.status === 'rejected') &&
            onRetryExecution && (
              <Actioned.Actions className="border-t border-city-border p-3">
                <Button variant="outline" disabled={busy} onClick={() => perform(onRetryExecution)}>
                  다시 승인 요청
                </Button>
              </Actioned.Actions>
            )}
        </Actioned.Root>
        {actionError && (
          <p role="alert" className="city-ai-chat-block-error">
            {actionError}
          </p>
        )}
        {request.assistantResponse && (
          <Commentary.Root appearance="plain" align="start">
            <Commentary.Header>
              <Avatar.Root aria-label="에이전트" size="sm">
                <Avatar.Fallback>AI</Avatar.Fallback>
              </Avatar.Root>
              <Commentary.Author>에이전트</Commentary.Author>
            </Commentary.Header>
            <Commentary.Content>{request.assistantResponse}</Commentary.Content>
          </Commentary.Root>
        )}
      </div>
    </AiChatBlockCard>
  );
}

const exampleRequest: DeveloperToolRequest = {
  currentActivityId: 'approval',
  activities: [
    {
      id: 'thinking',
      content: 'Thinking — 환경 설정과 변경 영향을 확인했습니다.',
      indicator: <Sparkles />,
      meta: '10:05',
    },
    {
      id: 'approval',
      content: '변경 사항을 적용하려면 승인이 필요합니다.',
      indicator: <ShieldQuestion />,
      meta: '지금',
    },
  ],
  id: 'tool_419',
  approval: '프로젝트의 환경 변수를 추가하도록 허용하시겠습니까?',
  input: '{\n  "name": "FEATURE_AGENT_SEARCH",\n  "value": "enabled"\n}',
  prompt: '검색 기능을 켜기 위해 FEATURE_AGENT_SEARCH 환경 변수를 추가해 주세요.',
  status: 'approval-required',
  title: '환경 변수 추가',
};

export default function ToolApprovalExample() {
  const [request, setRequest] = useState(exampleRequest);
  return (
    <ToolApproval
      request={request}
      onApprove={async () =>
        setRequest((current) => {
          const id = `running-${current.activities?.length ?? 0}`;
          return {
            ...current,
            activities: replaceCurrentActivity(current.activities, {
              id,
              content: '환경 변수를 추가하고 있습니다.',
              meta: '지금',
              pending: true,
            }),
            currentActivityId: id,
            status: 'running',
          };
        })
      }
      onCancel={async () =>
        setRequest((current) => {
          const id = `cancelled-${current.activities?.length ?? 0}`;
          return {
            ...current,
            activities: replaceCurrentActivity(current.activities, {
              id,
              content: '사용자 요청으로 도구 실행을 취소했습니다.',
              indicator: <CircleX />,
              meta: '지금',
            }),
            currentActivityId: undefined,
            status: 'cancelled',
          };
        })
      }
      onReject={async () =>
        setRequest((current) => {
          const id = `rejected-${current.activities?.length ?? 0}`;
          return {
            ...current,
            activities: replaceCurrentActivity(current.activities, {
              id,
              content: '사용자가 도구 실행 요청을 거절했습니다.',
              indicator: <CircleX />,
              meta: '지금',
            }),
            currentActivityId: undefined,
            status: 'rejected',
          };
        })
      }
      onRetryExecution={async () =>
        setRequest((current) => {
          const id = `approval-retry-${current.activities?.length ?? 0}`;
          return {
            ...current,
            activities: replaceCurrentActivity(current.activities, {
              id,
              content: '변경 사항을 적용하려면 다시 승인이 필요합니다.',
              indicator: <ShieldQuestion />,
              meta: '지금',
            }),
            currentActivityId: id,
            status: 'approval-required',
          };
        })
      }
    />
  );
}
