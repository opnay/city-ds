import { Check, Clock, LoaderCircle, RotateCcw, TriangleAlert, X } from 'lucide-react';
import { Button, Skeleton, Timeline } from '@opnay/city-ds-react';
import { BlockCard } from './block-card';
import { exampleDeployments, type WorkflowEvent } from './deployment-data';

const eventPresentation = {
  queued: { label: '대기', Icon: Clock, color: undefined },
  running: { label: '실행 중', Icon: LoaderCircle, color: 'var(--city-palette-blue-600)' },
  succeeded: { label: '성공', Icon: Check, color: 'var(--city-palette-green-600)' },
  failed: { label: '실패', Icon: X, color: 'var(--city-palette-red-600)' },
  warning: { label: '경고', Icon: TriangleAlert, color: 'var(--city-palette-amber-600)' },
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
    return <p className="city-block-status">아직 기록된 실행 이벤트가 없습니다.</p>;
  }
  return (
    <Timeline.Root aria-label="실행 이벤트" className="w-full">
      {events.map((event) => {
        const { label, Icon, color } = eventPresentation[event.status];
        return (
          <Timeline.Item key={event.id}>
            <Timeline.Indicator color={color} appearance="outline">
              <Icon
                className={event.status === 'running' ? 'motion-safe:animate-spin' : undefined}
              />
            </Timeline.Indicator>
            <Timeline.Connector />
            <Timeline.Content>
              <div className="city-block-split city-block-event-heading">
                <Timeline.Title>{event.title}</Timeline.Title>
                <Timeline.Time dateTime={event.occurredAt}>
                  {new Date(event.occurredAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}{' '}
                  KST
                </Timeline.Time>
              </div>
              <span className="city-block-status">
                {label}
                {event.actor ? ` · ${event.actor}` : ''}
              </span>
              <Timeline.Description>{event.description}</Timeline.Description>
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
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      ) : error ? (
        <div role="alert" className="city-block-section">
          <p>{error}</p>
          {onRetry && (
            <Button variant="outline" onClick={onRetry}>
              다시 불러오기
            </Button>
          )}
        </div>
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
      description={`${run.id} · ${run.revision} · 스테이징 배포`}
    />
  );
}
