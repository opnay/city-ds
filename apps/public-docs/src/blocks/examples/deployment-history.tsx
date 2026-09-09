import { useEffect, useRef, useState } from 'react';
import {
  Badge,
  Button,
  DataTableRegion,
  Field,
  FilterBar,
  SearchInput,
  Select,
  Skeleton,
  Table,
} from '@opnay/city-ds-react';
import { BlockCard } from './block-card';
import { DeploymentDetails } from './deployment-details';
import {
  deploymentEnvironmentLabels,
  deploymentStatusLabels,
  exampleDeployments,
  type DeploymentSummary,
} from './deployment-data';

export function DeploymentHistory({
  records,
  loading = false,
  error,
  onRetry,
  onView,
}: {
  records: readonly DeploymentSummary[];
  loading?: boolean;
  error?: string | undefined;
  onRetry?: () => void;
  onView: (id: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [environment, setEnvironment] = useState('all');
  const [status, setStatus] = useState('all');
  const filtered = records.filter(
    (record) =>
      (environment === 'all' || record.environment === environment) &&
      (status === 'all' || record.status === status) &&
      `${record.id} ${record.revision} ${record.actor} ${record.workflow ?? ''} ${record.branch ?? ''} ${record.commit ?? ''}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  function reset() {
    setQuery('');
    setEnvironment('all');
    setStatus('all');
  }
  return (
    <BlockCard
      title="실행 기록"
      description="워크플로우 실행 결과를 비교하고 로그와 이벤트 이력을 살펴보십시오."
      className="city-block-project-data"
    >
      <FilterBar
        aria-label="실행 기록 필터"
        actions={
          <Button variant="outline" onClick={reset}>
            초기화
          </Button>
        }
      >
        <Field.Root>
          <Field.Label className="sr-only">실행 검색</Field.Label>
          <SearchInput.Root value={query} onValueChange={setQuery}>
            <SearchInput.Group>
              <SearchInput.Input placeholder="워크플로우·브랜치·커밋 검색" />
              <SearchInput.Clear />
            </SearchInput.Group>
          </SearchInput.Root>
        </Field.Root>
        <HistoryFilter
          label="배포 환경"
          value={environment}
          onChange={setEnvironment}
          items={{ all: '모든 환경', ...deploymentEnvironmentLabels }}
        />
        <HistoryFilter
          label="실행 상태"
          value={status}
          onChange={setStatus}
          items={{ all: '모든 상태', ...deploymentStatusLabels }}
        />
      </FilterBar>
      {loading ? (
        <div
          role="status"
          aria-label="실행 기록 불러오는 중"
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
        <>
          <p role="status" className="city-block-status">
            실행 {filtered.length}건
          </p>
          {!filtered.length ? (
            <div className="city-block-section">
              <p>
                {records.length
                  ? '조건에 맞는 실행 기록이 없습니다.'
                  : '아직 실행 기록이 없습니다.'}
              </p>
              {records.length > 0 && (
                <Button variant="outline" onClick={reset}>
                  필터 초기화
                </Button>
              )}
            </div>
          ) : (
            <DataTableRegion label="실행 기록 목록">
              <Table.Root className="city-block-deployment-table">
                <Table.Header>
                  <Table.Row>
                    <Table.Head>실행</Table.Head>
                    <Table.Head>환경</Table.Head>
                    <Table.Head>상태</Table.Head>
                    <Table.Head>실행자</Table.Head>
                    <Table.Head>시작 시각 (KST)</Table.Head>
                    <Table.Head>소요 시간</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {filtered.map((record) => (
                    <Table.Row key={record.id}>
                      <Table.Cell>
                        {record.workflow && (
                          <div className="city-block-step-title">{record.workflow}</div>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`${record.revision} ${record.id} 상세 보기`}
                          onClick={() => onView(record.id)}
                        >
                          {record.revision}
                        </Button>
                        {(record.branch || record.commit) && (
                          <div className="city-block-status">
                            {[record.branch, record.commit].filter(Boolean).join(' · ')}
                          </div>
                        )}
                      </Table.Cell>
                      <Table.Cell>{deploymentEnvironmentLabels[record.environment]}</Table.Cell>
                      <Table.Cell>
                        <Badge
                          appearance="subtle"
                          tone={record.status === 'failed' ? 'destructive' : 'neutral'}
                        >
                          {deploymentStatusLabels[record.status]}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>{record.actor}</Table.Cell>
                      <Table.Cell>
                        <time dateTime={record.startedAt}>
                          {new Date(record.startedAt).toLocaleString('ko-KR', {
                            timeZone: 'Asia/Seoul',
                          })}
                        </time>
                      </Table.Cell>
                      <Table.Cell>{record.duration}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </DataTableRegion>
          )}
        </>
      )}
    </BlockCard>
  );
}
function HistoryFilter({
  label,
  value,
  onChange,
  items,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  items: Record<string, string>;
}) {
  return (
    <Select.Root value={value} items={items} onValueChange={(next) => onChange(next ?? 'all')}>
      <Select.Label className="sr-only">{label}</Select.Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Icon />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner>
          <Select.Popup>
            <Select.List aria-label={label}>
              {Object.entries(items).map(([key, text]) => (
                <Select.Item key={key} value={key}>
                  <Select.ItemText>{text}</Select.ItemText>
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
export default function DeploymentHistoryExample() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const details = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (selectedId) details.current?.focus();
  }, [selectedId]);
  const selected = exampleDeployments.find((record) => record.id === selectedId);
  return (
    <div className="city-block-section">
      <DeploymentHistory records={exampleDeployments} onView={setSelectedId} />
      {selected && (
        <>
          <div className="city-block-actions">
            <Button variant="outline" onClick={() => setSelectedId(null)}>
              상세 닫기
            </Button>
          </div>
          <div ref={details} tabIndex={-1} role="region" aria-label="선택한 실행 상세">
            <DeploymentDetails deployment={selected} />
          </div>
        </>
      )}
    </div>
  );
}
