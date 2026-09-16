import {
  CircleCheck,
  CircleAlert,
  Clock,
  LoaderCircle,
  RotateCcw,
  TriangleAlert,
} from 'lucide-react';
import { Alert, Button, EmptyState, Skeleton, Timeline } from '@opnay/city-ds-react';
import { BlockCard } from './block-card';
import { exampleDeployments, type WorkflowEvent } from './deployment-data';

const eventPresentation = {
  queued: { label: '대기', Icon: Clock, color: undefined },
  running: { label: '실행 중', Icon: LoaderCircle, color: 'var(--city-color-info)' },
  succeeded: { label: '성공', Icon: CircleCheck, color: 'var(--city-color-success)' },
  failed: { label: '실패', Icon: CircleAlert, color: 'var(--city-color-destructive)' },
  warning: { label: '경고', Icon: TriangleAlert, color: 'var(--city-color-warning)' },
  retried: { label: '재시도', Icon: RotateCcw, color: undefined },
} as const;

export function WorkflowEventList({
  events,
  onViewLogs,
}: {
  events: readonly WorkflowEvent[];
  onViewLogs?: ((stageId: string) => void) | undefined;
}) {
  if (!events.length) {
    return (
      <EmptyState.Root>
        <EmptyState.Title level={4}>아직 기록된 실행 이벤트가 없습니다.</EmptyState.Title>
        <EmptyState.Description>
          실행 중 발생하는 상태 변경과 재시도가 시간순으로 표시됩니다.
        </EmptyState.Description>
      </EmptyState.Root>
    );
  }
  const groups: { date: string; events: WorkflowEvent[] }[] = [];
  for (const event of events) {
    const date = new Date(event.occurredAt).toLocaleDateString('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const previous = groups.at(-1);
    if (previous?.date === date) previous.events.push(event);
    else groups.push({ date, events: [event] });
  }
  return (
    <div className="city-block-event-groups">
      {groups.map((group, index) => (
        <section
          key={`${group.date}-${index}`}
          className="city-block-event-group"
          aria-label={group.date}
        >
          <h4 className="city-text-label">
            {group.date} <span className="city-text-caption">KST</span>
          </h4>
          <Timeline.Root aria-label="실행 이벤트" className="w-full">
            {group.events.map((event) => {
              const { label, Icon, color } = eventPresentation[event.status];
              return (
                <Timeline.Item key={event.id}>
                  <Timeline.Indicator color={color} appearance="subtle">
                    <Icon
                      className={
                        event.status === 'running' ? 'motion-safe:animate-spin' : undefined
                      }
                    />
                  </Timeline.Indicator>
                  <Timeline.Connector />
                  <Timeline.Content>
                    <div className="city-block-split city-block-event-heading">
                      <Timeline.Title>
                        <span className="sr-only">{label}: </span>
                        {event.title}
                      </Timeline.Title>
                      <Timeline.Time dateTime={event.occurredAt}>
                        {new Date(event.occurredAt).toLocaleTimeString('en-GB', {
                          timeZone: 'Asia/Seoul',
                          hour12: false,
                        })}
                      </Timeline.Time>
                    </div>
                    <Timeline.Description>{event.description}</Timeline.Description>
                    {event.actor && (
                      <span className="city-text-caption">실행자 · {event.actor}</span>
                    )}
                    {event.stageId && onViewLogs && (
                      <div className="city-block-label-row">
                        <Button
                          size="sm"
                          variant="ghost"
                          aria-label={`${event.title} 로그 보기`}
                          onClick={() => onViewLogs(event.stageId!)}
                        >
                          로그 보기
                        </Button>
                      </div>
                    )}
                  </Timeline.Content>
                </Timeline.Item>
              );
            })}
          </Timeline.Root>
        </section>
      ))}
    </div>
  );
}

export function WorkflowEvents({
  events,
  description,
  loading = false,
  error,
  onRetry,
  onViewLogs,
}: {
  events: readonly WorkflowEvent[];
  description?: string;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  onViewLogs?: ((stageId: string) => void) | undefined;
}) {
  return (
    <BlockCard
      title="실행 이벤트 이력"
      description={description}
      className="city-block-project-data"
    >
      {loading ? (
        <div
          role="status"
          aria-label="실행 이벤트 불러오는 중"
          aria-busy="true"
          className="city-block-section"
        >
          {[0, 1, 2].map((item) => (
            <div key={item} className="city-block-event-skeleton">
              <Skeleton variant="circular" className="size-6" />
              <div className="city-block-section">
                <Skeleton className="w-40" />
                <Skeleton />
                <Skeleton className="w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <Alert.Root tone="destructive">
          <Alert.Title level={4}>이벤트를 불러오지 못했습니다.</Alert.Title>
          <Alert.Description>{error}</Alert.Description>
          {onRetry && (
            <Alert.Action>
              <Button variant="outline" onClick={onRetry}>
                다시 불러오기
              </Button>
            </Alert.Action>
          )}
        </Alert.Root>
      ) : (
        <WorkflowEventList events={events} onViewLogs={onViewLogs} />
      )}
    </BlockCard>
  );
}

export default function WorkflowEventsExample() {
  const run = exampleDeployments[1]!;
  return (
    <WorkflowEvents
      events={run.events ?? []}
      description={`${run.workflow} · ${run.id} · ${run.revision} · 스테이징`}
    />
  );
}
