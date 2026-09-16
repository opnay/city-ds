import { useRef, useState } from 'react';
import {
  Alert,
  Drawer,
  EmptyState,
  Badge,
  Button,
  DataTableRegion,
  Field,
  FilterPanel,
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
  deploymentStatusTones,
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
      <FilterPanel
        aria-label="실행 기록 필터"
        actions={
          <Button
            variant="outline"
            disabled={!query && environment === 'all' && status === 'all'}
            onClick={reset}
          >
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
      </FilterPanel>
      {loading ? (
        <div
          role="status"
          aria-label="실행 기록 불러오는 중"
          aria-busy="true"
          className="city-block-section"
        >
          {[0, 1, 2].map((row) => (
            <div key={row} className="city-block-run-skeleton">
              <Skeleton className="h-10" />
              <Skeleton />
              <Skeleton />
            </div>
          ))}
        </div>
      ) : error ? (
        <Alert.Root tone="destructive">
          <Alert.Title level={4}>실행 기록을 불러오지 못했습니다.</Alert.Title>
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
        <>
          <p role="status" className="city-block-status">
            실행 {filtered.length}건
          </p>
          {!filtered.length ? (
            <EmptyState.Root>
              <EmptyState.Title level={4}>
                {records.length
                  ? '조건에 맞는 실행 기록이 없습니다.'
                  : '아직 실행 기록이 없습니다.'}
              </EmptyState.Title>
              <EmptyState.Description>
                {records.length
                  ? '검색어 또는 필터를 조정하십시오.'
                  : '워크플로우를 실행하면 결과가 여기에 표시됩니다.'}
              </EmptyState.Description>
              {records.length > 0 && (
                <Button variant="outline" onClick={reset}>
                  필터 초기화
                </Button>
              )}
            </EmptyState.Root>
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
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`${record.revision} ${record.id} 상세 보기`}
                          onClick={() => onView(record.id)}
                        >
                          {record.workflow ?? record.revision}
                        </Button>
                        <div className="city-text-caption">
                          {record.id} · {record.revision}
                        </div>
                        {(record.branch || record.commit) && (
                          <div className="city-block-status">
                            {[record.branch, record.commit].filter(Boolean).join(' · ')}
                          </div>
                        )}
                      </Table.Cell>
                      <Table.Cell>{deploymentEnvironmentLabels[record.environment]}</Table.Cell>
                      <Table.Cell>
                        <Badge appearance="subtle" tone={deploymentStatusTones[record.status]}>
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
    <div className="min-w-0">
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
    </div>
  );
}
export default function DeploymentHistoryExample() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const selected = exampleDeployments.find((record) => record.id === selectedId);
  return (
    <Drawer.Root
      open={selectedId !== null}
      onOpenChange={(open) => {
        if (!open) setSelectedId(null);
      }}
    >
      <DeploymentHistory
        records={exampleDeployments}
        onView={(id) => {
          trigger.current = document.activeElement as HTMLElement;
          setSelectedId(id);
        }}
      />
      <Drawer.Portal>
        <Drawer.Backdrop />
        <Drawer.Viewport side="right">
          <Drawer.Popup side="right" size="xl" finalFocus={trigger}>
            <Drawer.Header>
              <Drawer.Title>실행 상세</Drawer.Title>
              <Drawer.Close render={<Button variant="ghost" size="sm" />}>상세 닫기</Drawer.Close>
            </Drawer.Header>
            <Drawer.Content className="city-block-workflow-drawer">
              {selected && <DeploymentDetails deployment={selected} />}
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
