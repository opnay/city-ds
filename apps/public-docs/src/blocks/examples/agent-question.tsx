import { useRef, useState, type ReactNode } from 'react';
import {
  AgentActivity,
  Alert,
  Avatar,
  Button,
  Commentary,
  EmptyState,
  Skeleton,
} from '@opnay/city-ds-react';
import { CircleX, ShieldQuestion, Sparkles, Terminal } from 'lucide-react';
import { AiChatBlockCard } from './ai-chat-block-card';

function replaceCurrentActivity(
  activities: readonly AgentQuestionActivity[] | undefined,
  next: AgentQuestionActivity,
) {
  return [...(activities ?? []).map((activity) => ({ ...activity, pending: false })), next];
}

export interface AgentQuestionChoice {
  id: string;
  label: ReactNode;
  preferred?: boolean;
}

export interface AgentQuestionActivity {
  content: ReactNode;
  details?: ReactNode;
  id: string;
  indicator?: ReactNode;
  meta?: ReactNode;
  pending?: boolean;
}

export interface AgentQuestionRequest {
  activities?: readonly AgentQuestionActivity[];
  answer?: ReactNode;
  assistantResponse?: ReactNode;
  choices: readonly AgentQuestionChoice[];
  currentActivityId?: string | undefined;
  id: string;
  prompt: ReactNode;
  question: ReactNode;
}

export interface AgentQuestionProps {
  answerPending?: boolean;
  error?: string;
  loading?: boolean;
  onAnswer?:
    | ((request: AgentQuestionRequest, choice: AgentQuestionChoice) => Promise<void> | void)
    | undefined;
  onRetry?: (() => void) | undefined;
  request?: AgentQuestionRequest;
}

function QuestionActivity({
  activity,
  current,
}: {
  activity: AgentQuestionActivity;
  current: boolean;
}) {
  const contentProps = current
    ? ({ role: 'status', 'aria-live': 'polite', 'aria-atomic': true } as const)
    : undefined;
  const summary = (
    <>
      <AgentActivity.Indicator>{activity.indicator}</AgentActivity.Indicator>
      <AgentActivity.Content {...contentProps}>{activity.content}</AgentActivity.Content>
      {activity.meta && <AgentActivity.Meta>{activity.meta}</AgentActivity.Meta>}
    </>
  );

  return (
    <AgentActivity.Root pending={current && (activity.pending ?? false)} role="listitem">
      {activity.details ? (
        <>
          <AgentActivity.Trigger>{summary}</AgentActivity.Trigger>
          <AgentActivity.Details>{activity.details}</AgentActivity.Details>
        </>
      ) : (
        summary
      )}
    </AgentActivity.Root>
  );
}

export function AgentQuestion({
  answerPending = false,
  error,
  loading = false,
  onAnswer,
  onRetry,
  request,
}: AgentQuestionProps) {
  const [localPending, setLocalPending] = useState(false);
  const [answerError, setAnswerError] = useState('');
  const inFlight = useRef(false);

  async function submitAnswer(choice: AgentQuestionChoice) {
    if (!request || !onAnswer || request.answer || answerPending || inFlight.current) return;
    inFlight.current = true;
    setLocalPending(true);
    setAnswerError('');
    try {
      await onAnswer(request, choice);
    } catch {
      setAnswerError('응답을 전송하지 못했습니다. 연결을 확인한 뒤 다시 시도하십시오.');
    } finally {
      inFlight.current = false;
      setLocalPending(false);
    }
  }

  if (loading && !request) {
    return (
      <AiChatBlockCard title="에이전트 질문">
        <div
          role="status"
          aria-label="에이전트 질문 불러오는 중"
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
      <AiChatBlockCard title="에이전트 질문">
        <Alert.Root tone="destructive">
          <Alert.Title level={4}>에이전트 질문을 불러오지 못했습니다.</Alert.Title>
          <Alert.Description>{error}</Alert.Description>
          {onRetry && <Button onClick={onRetry}>다시 불러오기</Button>}
        </Alert.Root>
      </AiChatBlockCard>
    );
  }

  if (!request) {
    return (
      <AiChatBlockCard title="에이전트 질문">
        <EmptyState.Root>
          <EmptyState.Title level={4}>응답할 질문이 없습니다.</EmptyState.Title>
          <EmptyState.Description>
            에이전트가 선택이 필요한 질문을 보내면 답변을 표시합니다.
          </EmptyState.Description>
        </EmptyState.Root>
      </AiChatBlockCard>
    );
  }

  const busy = answerPending || localPending;
  const currentActivity = request.activities?.find(
    (activity) => activity.id === request.currentActivityId,
  );

  return (
    <AiChatBlockCard title="에이전트 질문">
      {error && (
        <Alert.Root tone="destructive">
          <Alert.Title level={4}>대화를 새로고침하지 못했습니다.</Alert.Title>
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
            {request.activities.map((activity) => (
              <QuestionActivity
                key={activity.id}
                activity={activity}
                current={activity.id === currentActivity?.id}
              />
            ))}
          </div>
        )}
        <Commentary.Root appearance="bubble" align="start">
          <Commentary.Header>
            <Avatar.Root aria-label="에이전트" size="sm">
              <Avatar.Fallback>AI</Avatar.Fallback>
            </Avatar.Root>
            <Commentary.Author>에이전트</Commentary.Author>
          </Commentary.Header>
          <Commentary.Content>{request.question}</Commentary.Content>
          {!request.answer && request.choices.length > 0 && (
            <Commentary.Actions className="city-ai-chat-block-actions">
              {request.choices.map((choice) => (
                <Button
                  key={choice.id}
                  size="sm"
                  variant={choice.preferred ? 'primary' : 'outline'}
                  disabled={busy || !onAnswer}
                  onClick={() => submitAnswer(choice)}
                >
                  {choice.label}
                </Button>
              ))}
            </Commentary.Actions>
          )}
        </Commentary.Root>
        {request.answer && (
          <Commentary.Root appearance="bubble" align="end">
            <Commentary.Header>
              <Avatar.Root aria-label="사용자" size="sm">
                <Avatar.Fallback>나</Avatar.Fallback>
              </Avatar.Root>
              <Commentary.Author>사용자</Commentary.Author>
            </Commentary.Header>
            <Commentary.Content>{request.answer}</Commentary.Content>
          </Commentary.Root>
        )}
        {answerError && (
          <p role="alert" className="city-ai-chat-block-error">
            {answerError}
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

const exampleRequest: AgentQuestionRequest = {
  currentActivityId: 'question',
  activities: [
    {
      id: 'inspect',
      content: 'Thinking — 환경 설정과 변경 영향을 확인했습니다.',
      details: (
        <pre tabIndex={0} aria-label="환경 설정 확인 입력">
          <code>{'{ "path": ".env.production" }'}</code>
        </pre>
      ),
      indicator: <Terminal />,
      meta: '10:05',
    },
    {
      id: 'question',
      content: '프로덕션 환경에 적용하기 전에 답변을 기다리고 있습니다.',
      indicator: <ShieldQuestion />,
      meta: '지금',
      pending: true,
    },
  ],
  choices: [
    { id: 'allow', label: '적용 허용', preferred: true },
    { id: 'reject', label: '이번에는 취소' },
  ],
  id: 'question_419',
  prompt: '검색 기능을 켜기 위해 FEATURE_AGENT_SEARCH 환경 변수를 추가해 주세요.',
  question: '프로덕션 환경에 FEATURE_AGENT_SEARCH를 추가할까요?',
};

export default function AgentQuestionExample() {
  const [request, setRequest] = useState(exampleRequest);
  return (
    <AgentQuestion
      request={request}
      onAnswer={async (_, choice) =>
        setRequest((current) => {
          const id = `answered-${current.activities?.length ?? 0}`;
          return {
            ...current,
            answer: choice.label,
            activities: replaceCurrentActivity(current.activities, {
              id,
              content:
                choice.id === 'allow'
                  ? '선택을 받았습니다. 환경 변수를 적용하고 있습니다.'
                  : '선택을 받았습니다. 환경 변수 추가를 취소했습니다.',
              indicator: choice.id === 'allow' ? <Sparkles /> : <CircleX />,
              meta: '지금',
              pending: choice.id === 'allow',
            }),
            assistantResponse:
              choice.id === 'allow'
                ? '환경 변수를 추가했습니다. 다음 배포부터 검색 기능이 활성화됩니다.'
                : '환경 변수는 변경하지 않았습니다.',
            currentActivityId: choice.id === 'allow' ? id : undefined,
          };
        })
      }
    />
  );
}
