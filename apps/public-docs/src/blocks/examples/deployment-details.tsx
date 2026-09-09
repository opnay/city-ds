import { useId, useState } from 'react';
import { Badge, Button, DataList, Skeleton, Stepper } from '@opnay/city-ds-react';
import { BlockCard } from './block-card';
import {
  deploymentEnvironmentLabels,
  deploymentStatusLabels,
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
      title={available ? available.revision : '배포 상세'}
      description={
        available ? <code className="city-text-caption">{available.id}</code> : undefined
      }
      actions={
        available && (
          <Badge
            tone={available.status === 'failed' ? 'destructive' : 'neutral'}
            appearance="subtle"
          >
            {deploymentStatusLabels[available.status]}
          </Badge>
        )
      }
      className="city-block-project-data"
    >
      {loading ? (
        <div
          role="status"
          aria-label="배포 상세 불러오는 중"
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
      ) : deployment ? (
        <DeploymentContents key={deployment.id} deployment={deployment} />
      ) : (
        <p className="city-block-status">조회할 배포가 없습니다.</p>
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
  const logId = useId();
  const selected =
    deployment.stages.find((stage) => stage.id === selectedId) ?? deployment.stages[0];
  return (
    <>
      <DataList.Root
        aria-label="배포 정보"
        orientation="vertical"
        className="city-block-deployment-metadata"
      >
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
      <div className="city-block-deployment-inspector">
        <Stepper.Root orientation="vertical" aria-label="배포 진행 단계">
          {deployment.stages.map((stage, index) => (
            <Stepper.Item
              key={stage.id}
              current={
                stage.id ===
                deployment.stages.find(
                  (item) => item.status === 'failed' || item.status === 'running',
                )?.id
              }
              status={
                stage.status === 'failed'
                  ? 'error'
                  : stage.status === 'succeeded'
                    ? 'completed'
                    : 'pending'
              }
              statusLabel={
                stage.status === 'pending' ? '실행 전' : deploymentStatusLabels[stage.status]
              }
            >
              <Stepper.Indicator>{index + 1}</Stepper.Indicator>
              <Stepper.Content>
                <Stepper.Trigger
                  aria-pressed={selected?.id === stage.id}
                  aria-controls={logId}
                  onClick={() => {
                    setSelectedId(stage.id);
                    setMessage('');
                  }}
                >
                  {stage.title}
                </Stepper.Trigger>
                <Stepper.Description>{stage.duration}</Stepper.Description>
              </Stepper.Content>
            </Stepper.Item>
          ))}
        </Stepper.Root>
        <section
          id={logId}
          className="city-block-log-section"
          aria-label={`${selected?.title ?? '실행'} 로그`}
        >
          <div className="city-block-split">
            <div className="city-block-label-row">
              <h4 className="city-block-step-title">실행 로그</h4>
              {selected && (selected.status === 'failed' || selected.status === 'running') && (
                <span className="city-block-status">{selected.duration}</span>
              )}
            </div>
            <Button
              size="sm"
              variant="ghost"
              aria-label="로그 복사"
              disabled={!selected?.logs.length}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(selected?.logs.join('\n') ?? '');
                  setMessage('로그를 복사했습니다.');
                } catch {
                  setMessage('복사하지 못했습니다. 로그를 직접 선택해 복사하십시오.');
                }
              }}
            >
              복사
            </Button>
          </div>
          {selected?.logs.length ? (
            <pre className="city-block-deployment-log" tabIndex={0} aria-label="실행 로그 내용">
              {selected.logs.join('\n')}
            </pre>
          ) : (
            <p className="city-block-status">아직 기록된 로그가 없습니다.</p>
          )}
          <p role="status" className="city-block-status">
            {message}
          </p>
        </section>
      </div>
    </>
  );
}
export default function DeploymentDetailsExample() {
  return <DeploymentDetails deployment={exampleDeployments[0] ?? null} />;
}
