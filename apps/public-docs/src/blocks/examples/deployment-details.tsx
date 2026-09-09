import { useEffect, useRef, useState } from 'react';
import { Alert, Badge, Button, DataList, EmptyState, Skeleton, Tabs } from '@opnay/city-ds-react';
import { BlockCard } from './block-card';
import { WorkflowEventList } from './workflow-events';
import {
  deploymentEnvironmentLabels,
  deploymentStatusLabels,
  deploymentStatusTones,
  exampleDeployments,
  type DeploymentRecord,
} from './deployment-data';

export function DeploymentDetails({
  deployment,
  loading = false,
  error,
  onRetry,
}: {
  deployment: DeploymentRecord | null;
  loading?: boolean;
  error?: string | undefined;
  onRetry?: () => void;
}) {
  const available = !loading && !error ? deployment : null;
  return (
    <BlockCard
      title={available ? (available.workflow ?? '워크플로우 실행') : '실행 상세'}
      description={
        available ? (
          <span>
            {available.revision} · <code className="city-text-caption">{available.id}</code>
          </span>
        ) : undefined
      }
      actions={
        available && (
          <Badge tone={deploymentStatusTones[available.status]} appearance="subtle">
            {deploymentStatusLabels[available.status]}
          </Badge>
        )
      }
      className="city-block-project-data city-block-workflow-detail"
    >
      {loading ? (
        <div
          role="status"
          aria-label="실행 상세 불러오는 중"
          aria-busy="true"
          className="city-block-section"
        >
          <div className="city-block-deployment-metadata">
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <Skeleton key={item} className="h-10" />
            ))}
          </div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-48" />
        </div>
      ) : error ? (
        <Alert.Root tone="destructive">
          <Alert.Title level={4}>실행 상세를 불러오지 못했습니다.</Alert.Title>
          <Alert.Description>{error}</Alert.Description>
          {onRetry && (
            <Alert.Action>
              <Button variant="outline" onClick={onRetry}>
                다시 불러오기
              </Button>
            </Alert.Action>
          )}
        </Alert.Root>
      ) : deployment ? (
        <DeploymentContents key={deployment.id} deployment={deployment} />
      ) : (
        <EmptyState.Root>
          <EmptyState.Title level={4}>조회할 실행이 없습니다.</EmptyState.Title>
          <EmptyState.Description>실행 기록에서 조회할 항목을 선택하십시오.</EmptyState.Description>
        </EmptyState.Root>
      )}
    </BlockCard>
  );
}
function DeploymentContents({ deployment }: { deployment: DeploymentRecord }) {
  const initial =
    deployment.stages.find((stage) => stage.status === 'failed' || stage.status === 'running') ??
    deployment.stages.at(-1);
  const [selectedId, setSelectedId] = useState(initial?.id);
  const [message, setMessage] = useState('');
  const [view, setView] = useState<string>('logs');
  const focusLog = useRef(false);
  const logRef = useRef<HTMLElement>(null);
  const selected =
    deployment.stages.find((stage) => stage.id === selectedId) ?? deployment.stages[0];
  useEffect(() => {
    if (focusLog.current && view === 'logs') {
      logRef.current?.focus();
      focusLog.current = false;
    }
  }, [view, selectedId]);
  const failure =
    deployment.status === 'failed'
      ? deployment.events?.findLast((event) => event.status === 'failed')
      : undefined;
  return (
    <>
      {failure && (
        <Alert.Root tone="destructive">
          <Alert.Title level={4}>{failure.title}</Alert.Title>
          <Alert.Description>
            {failure.description} 해당 작업의 로그에서 원인을 확인하십시오.
          </Alert.Description>
        </Alert.Root>
      )}
      <DataList.Root
        aria-label="배포 정보"
        orientation="vertical"
        className="city-block-deployment-metadata"
      >
        {deployment.branch && (
          <DataList.Item>
            <DataList.Label>브랜치</DataList.Label>
            <DataList.Value>{deployment.branch}</DataList.Value>
          </DataList.Item>
        )}
        {deployment.commit && (
          <DataList.Item>
            <DataList.Label>커밋</DataList.Label>
            <DataList.Value>
              <code>{deployment.commit}</code>
            </DataList.Value>
          </DataList.Item>
        )}
        <DataList.Item>
          <DataList.Label>환경</DataList.Label>
          <DataList.Value>{deploymentEnvironmentLabels[deployment.environment]}</DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label>실행자</DataList.Label>
          <DataList.Value>{deployment.actor}</DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label>시작 시각</DataList.Label>
          <DataList.Value>
            <time dateTime={deployment.startedAt}>
              {new Date(deployment.startedAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}{' '}
              KST
            </time>
          </DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label>소요 시간</DataList.Label>
          <DataList.Value>{deployment.duration}</DataList.Value>
        </DataList.Item>
      </DataList.Root>
      <Tabs.Root value={view} onValueChange={(value) => setView(String(value))}>
        <Tabs.List aria-label="실행 상세 보기">
          <Tabs.Tab value="logs">작업 로그</Tabs.Tab>
          {deployment.events && <Tabs.Tab value="events">이벤트 이력</Tabs.Tab>}
        </Tabs.List>
        <Tabs.Panel value="logs">
          <Tabs.Root
            value={selected?.id ?? null}
            onValueChange={(value) => {
              setSelectedId(String(value));
              setMessage('');
            }}
          >
            <Tabs.List aria-label="작업 선택" className="city-block-job-tabs">
              {deployment.stages.map((stage) => (
                <Tabs.Tab key={stage.id} value={stage.id}>
                  {stage.title}{' '}
                  <Badge
                    appearance="subtle"
                    tone={
                      stage.status === 'pending' ? 'neutral' : deploymentStatusTones[stage.status]
                    }
                  >
                    {stage.status === 'pending' ? '실행 전' : deploymentStatusLabels[stage.status]}
                  </Badge>
                </Tabs.Tab>
              ))}
            </Tabs.List>
            {deployment.stages.map((stage) => (
              <Tabs.Panel key={stage.id} value={stage.id}>
                <section
                  ref={selected?.id === stage.id ? logRef : undefined}
                  tabIndex={-1}
                  className="city-block-log-section"
                  aria-label={`${stage.title} 로그`}
                >
                  <div className="city-block-split">
                    <div className="city-block-label-row">
                      <h4 className="city-text-label">{stage.title} 로그</h4>
                      <span className="city-block-status">{stage.duration}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label="로그 복사"
                      disabled={!stage.logs.length}
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(stage.logs.join('\n') ?? '');
                          setMessage('로그를 복사했습니다.');
                        } catch {
                          setMessage('복사하지 못했습니다. 로그를 직접 선택해 복사하십시오.');
                        }
                      }}
                    >
                      복사
                    </Button>
                  </div>
                  {stage.logs.length ? (
                    <pre
                      className="city-block-deployment-log"
                      tabIndex={0}
                      aria-label="실행 로그 내용"
                    >
                      {stage.logs.join('\n')}
                    </pre>
                  ) : (
                    <EmptyState.Root density="compact">
                      <EmptyState.Title level={4}>아직 기록된 로그가 없습니다.</EmptyState.Title>
                      <EmptyState.Description>
                        {stage.status === 'pending'
                          ? '작업이 시작되면 로그가 표시됩니다.'
                          : '이 작업에서 수집된 로그가 없습니다.'}
                      </EmptyState.Description>
                    </EmptyState.Root>
                  )}
                  <p role="status" className="city-block-status">
                    {message}
                  </p>
                </section>
              </Tabs.Panel>
            ))}
          </Tabs.Root>
          {!deployment.stages.length && (
            <EmptyState.Root>
              <EmptyState.Title level={4}>등록된 작업이 없습니다.</EmptyState.Title>
            </EmptyState.Root>
          )}
        </Tabs.Panel>
        {deployment.events && (
          <Tabs.Panel value="events">
            <WorkflowEventList
              events={deployment.events.map((event) =>
                event.stageId && !deployment.stages.some((stage) => stage.id === event.stageId)
                  ? { ...event, stageId: undefined }
                  : event,
              )}
              onViewLogs={(stageId) => {
                focusLog.current = true;
                setSelectedId(stageId);
                setView('logs');
                setMessage('');
              }}
            />
          </Tabs.Panel>
        )}
      </Tabs.Root>
    </>
  );
}
export default function DeploymentDetailsExample() {
  return <DeploymentDetails deployment={exampleDeployments[0] ?? null} />;
}
