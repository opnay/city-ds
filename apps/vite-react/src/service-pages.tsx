import { useMemo, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, CalendarPlus, History, Search, X } from 'lucide-react';
import {
  Badge,
  Button,
  Dialog,
  Drawer,
  EmptyState,
  Field,
  Input,
  Popover,
  Progress,
  SearchField,
  Select,
  Switch,
  Table,
  ToggleGroup,
} from '@city-ds/react';

import {
  ACTIVITY_CATEGORIES,
  ACTIVITY_LOGS,
  ASSET_STATUSES,
  CREW_ITEMS,
  DISTRICT_ITEMS,
  INITIAL_ASSETS,
  INITIAL_MAINTENANCE_PLANS,
  LOCATIONS,
  MAINTENANCE_STATUSES,
  REPORT_PERIODS,
  REPORT_ROWS,
  type ActivityCategory,
  type Asset,
  type AssetStatus,
  type Crew,
  type MaintenancePlan,
  type MaintenanceStatus,
  type ReportPeriod,
} from './dashboard-data';
import { PageHeading } from './page-heading';
import {
  ASSET_STATUS_VARIANTS,
  DataTableRegion,
  FilterBar,
  MAINTENANCE_STATUS_VARIANTS,
  MetricItem,
} from './relay-ui';

type Notify = (title: string, description: string) => void;

const ASSET_STATUS_ITEMS = {
  전체: '전체 상태',
  ...Object.fromEntries(ASSET_STATUSES.map((status) => [status, status])),
} as Record<'전체' | AssetStatus, string>;

const ACTIVITY_CATEGORY_ITEMS = Object.fromEntries(
  ACTIVITY_CATEGORIES.map((category) => [category, category]),
) as Record<ActivityCategory, string>;

export function AssetsPage({ compact }: { compact: boolean }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'전체' | AssetStatus>('전체');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const detailsTriggerRef = useRef<HTMLElement | null>(null);

  const assets = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('ko-KR');

    return INITIAL_ASSETS.filter((asset) => {
      if (status !== '전체' && asset.status !== status) {
        return false;
      }

      return (
        !normalizedQuery ||
        [asset.id, asset.name, asset.type, asset.location, asset.district]
          .join(' ')
          .toLocaleLowerCase('ko-KR')
          .includes(normalizedQuery)
      );
    });
  }, [query, status]);

  const selectedAsset = INITIAL_ASSETS.find((asset) => asset.id === selectedAssetId) ?? null;

  const resetFilters = () => {
    setQuery('');
    setStatus('전체');
  };

  return (
    <>
      <PageHeading
        description="시설의 상태와 점검 일정을 확인하고 이상 징후가 있는 자산을 추적합니다."
        meta={<Badge variant="outline">등록 자산 {INITIAL_ASSETS.length}개</Badge>}
        title="시설 자산"
      />

      <section aria-labelledby="asset-list-heading" className="relay-panel">
        <div className="relay-panel-heading">
          <div>
            <h2 id="asset-list-heading">자산 목록</h2>
            <p>점검이 필요한 자산을 우선 확인하십시오. {assets.length}개 표시</p>
          </div>
        </div>

        <FilterBar
          actions={
            <Button
              disabled={query === '' && status === '전체'}
              onClick={resetFilters}
              size="sm"
              variant="outline"
            >
              자산 필터 초기화
            </Button>
          }
          label="시설 자산 필터"
        >
          <SearchField.Root
            className="relay-filter-search"
            onValueChange={setQuery}
            size="sm"
            value={query}
          >
            <SearchField.Label className="city-sr-only">시설 자산 검색</SearchField.Label>
            <SearchField.Group>
              <SearchField.Input placeholder="자산 번호·이름·위치 검색" />
              <SearchField.Clear />
            </SearchField.Group>
          </SearchField.Root>
          <Select.Root
            items={ASSET_STATUS_ITEMS}
            onValueChange={(value) => value && setStatus(value)}
            size="sm"
            value={status}
          >
            <Select.Label className="city-sr-only">자산 상태 필터</Select.Label>
            <Select.Trigger className="relay-filter-select">
              <Select.Value />
              <Select.Icon />
            </Select.Trigger>
            <Select.Portal>
              <Select.Positioner sideOffset={6}>
                <Select.Popup>
                  <Select.List>
                    {Object.keys(ASSET_STATUS_ITEMS).map((item) => (
                      <Select.Item key={item} value={item}>
                        <Select.ItemIndicator />
                        <Select.ItemText>
                          {ASSET_STATUS_ITEMS[item as keyof typeof ASSET_STATUS_ITEMS]}
                        </Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.List>
                </Select.Popup>
              </Select.Positioner>
            </Select.Portal>
          </Select.Root>
        </FilterBar>

        <DataTableRegion
          hintId="asset-table-scroll-hint"
          label="시설 자산 가로 스크롤 영역"
          showHint={assets.length > 0}
        >
          <Table.Root aria-label="시설 자산 목록" size={compact ? 'sm' : 'md'} variant="line">
            <Table.Header>
              <Table.Row>
                <Table.Head>자산</Table.Head>
                <Table.Head>유형</Table.Head>
                <Table.Head>위치</Table.Head>
                <Table.Head>상태</Table.Head>
                <Table.Head>건강도</Table.Head>
                <Table.Head>다음 점검</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {assets.length === 0 ? (
                <Table.StateRow colSpan={6}>
                  <EmptyState.Root density="compact">
                    <EmptyState.Icon>
                      <Search aria-hidden="true" />
                    </EmptyState.Icon>
                    <EmptyState.Title level={3}>조건에 맞는 자산이 없습니다</EmptyState.Title>
                    <EmptyState.Description>
                      검색어나 상태 필터를 조정하십시오.
                    </EmptyState.Description>
                    <EmptyState.Actions>
                      <Button onClick={resetFilters} size="sm" variant="outline">
                        필터 초기화
                      </Button>
                    </EmptyState.Actions>
                  </EmptyState.Root>
                </Table.StateRow>
              ) : (
                assets.map((asset) => (
                  <Table.Row key={asset.id}>
                    <Table.Cell>
                      <Button
                        aria-label={`${asset.id} ${asset.name} 자산 상세 보기`}
                        className="relay-primary-link"
                        onClick={(event) => {
                          detailsTriggerRef.current = event.currentTarget;
                          setSelectedAssetId(asset.id);
                        }}
                        size="sm"
                        variant="ghost"
                      >
                        <span>
                          <strong>{asset.id}</strong>
                          <small>{asset.name}</small>
                        </span>
                      </Button>
                    </Table.Cell>
                    <Table.Cell>{asset.type}</Table.Cell>
                    <Table.Cell>
                      <span>{asset.district}</span>
                      <small className="relay-cell-detail">{asset.location}</small>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge variant={ASSET_STATUS_VARIANTS[asset.status]}>{asset.status}</Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="relay-health-cell">
                        <strong>{asset.health}%</strong>
                        <Progress.Root aria-label={`${asset.name} 건강도`} value={asset.health}>
                          <Progress.Track>
                            <Progress.Indicator />
                          </Progress.Track>
                        </Progress.Root>
                      </span>
                    </Table.Cell>
                    <Table.Cell>{asset.nextInspection}</Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </DataTableRegion>
      </section>

      <AssetDetailsDrawer
        asset={selectedAsset}
        finalFocus={detailsTriggerRef}
        onClose={() => setSelectedAssetId(null)}
        open={Boolean(selectedAsset)}
      />
    </>
  );
}

function AssetDetailsDrawer({
  asset,
  finalFocus,
  onClose,
  open,
}: {
  asset: Asset | null;
  finalFocus: React.RefObject<HTMLElement | null>;
  onClose: () => void;
  open: boolean;
}) {
  if (!asset) {
    return null;
  }

  return (
    <Drawer.Root onOpenChange={(nextOpen) => !nextOpen && onClose()} open={open}>
      <Drawer.Portal>
        <Drawer.Backdrop />
        <Drawer.Viewport side="right">
          <Drawer.Popup className="relay-details-drawer" finalFocus={finalFocus} side="right">
            <div className="relay-details-drawer-header relay-overlay-heading">
              <div>
                <Badge variant={ASSET_STATUS_VARIANTS[asset.status]}>{asset.status}</Badge>
                <Drawer.Title>{asset.name}</Drawer.Title>
                <Drawer.Description>
                  {asset.id} · {asset.type}
                </Drawer.Description>
              </div>
              <Drawer.Close
                aria-label="자산 상세 닫기"
                render={<Button iconOnly size="sm" variant="ghost" />}
              >
                <X aria-hidden="true" size={18} />
              </Drawer.Close>
            </div>
            <Drawer.Content className="relay-details-drawer-content">
              <div className="relay-drawer-body">
                <div className="relay-progress-label">
                  <strong>자산 건강도</strong>
                  <span>{asset.health}%</span>
                </div>
                <Progress.Root aria-label={`${asset.name} 상세 건강도`} value={asset.health}>
                  <Progress.Track>
                    <Progress.Indicator />
                  </Progress.Track>
                </Progress.Root>

                <dl className="relay-detail-list">
                  <div>
                    <dt>위치</dt>
                    <dd>
                      {asset.district} · {asset.location}
                    </dd>
                  </div>
                  <div>
                    <dt>최근 점검</dt>
                    <dd>{asset.lastInspection}</dd>
                  </div>
                  <div>
                    <dt>다음 점검</dt>
                    <dd>{asset.nextInspection}</dd>
                  </div>
                  <div>
                    <dt>열린 작업</dt>
                    <dd>{asset.openOrders}건</dd>
                  </div>
                </dl>

                <section aria-labelledby="asset-history-heading">
                  <h3 id="asset-history-heading">최근 점검 기록</h3>
                  <ol className="relay-activity-list">
                    <li>
                      <strong>2026. 7. 27.</strong>
                      <span>원격 상태 데이터와 현장 점검 결과를 동기화했습니다.</span>
                    </li>
                    <li>
                      <strong>{asset.lastInspection}</strong>
                      <span>정기 점검 체크리스트를 완료했습니다.</span>
                    </li>
                  </ol>
                </section>
              </div>
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export function MaintenancePage({ compact, onNotify }: { compact: boolean; onNotify: Notify }) {
  const [plans, setPlans] = useState<MaintenancePlan[]>(() => [...INITIAL_MAINTENANCE_PLANS]);
  const [status, setStatus] = useState<'전체' | MaintenanceStatus>('전체');
  const [autoCreate, setAutoCreate] = useState(true);

  const visiblePlans = status === '전체' ? plans : plans.filter((plan) => plan.status === status);

  const createPlan = (input: Omit<MaintenancePlan, 'id' | 'status' | 'workOrderCreated'>) => {
    const plan: MaintenancePlan = {
      ...input,
      id: `MP-${720 + plans.length + 1}`,
      status: '예정',
      workOrderCreated: autoCreate,
    };
    setPlans((current) => [plan, ...current]);
    setStatus('전체');
    onNotify(
      '정비 계획을 추가했습니다',
      autoCreate
        ? `${plan.id} 계획과 연결 작업 요청을 만들었습니다.`
        : `${plan.id} 계획을 일정에 추가했습니다.`,
    );
  };

  const createWorkOrder = (id: string) => {
    setPlans((current) =>
      current.map((plan) => (plan.id === id ? { ...plan, workOrderCreated: true } : plan)),
    );
    onNotify('작업 요청을 만들었습니다', `${id} 정비 계획에 작업 요청을 연결했습니다.`);
  };

  return (
    <>
      <PageHeading
        actions={<CreateMaintenanceDialog onCreate={createPlan} />}
        description="예방 정비 일정을 조율하고 현장 작업 요청으로 전환합니다."
        title="정비 계획"
      />

      <section aria-labelledby="maintenance-list-heading" className="relay-panel">
        <div className="relay-panel-heading">
          <div>
            <h2 id="maintenance-list-heading">예정된 정비</h2>
            <p>계획 {visiblePlans.length}건 · 2026년 7월 27일 기준</p>
          </div>
          <label className="relay-switch-label">
            <Switch checked={autoCreate} onCheckedChange={setAutoCreate} size="sm" />
            작업 요청 자동 생성
          </label>
        </div>

        <FilterBar
          actions={
            <Button
              disabled={status === '전체'}
              onClick={() => setStatus('전체')}
              size="sm"
              variant="outline"
            >
              정비 필터 초기화
            </Button>
          }
          label="정비 계획 필터"
        >
          <ToggleGroup
            aria-label="정비 계획 상태"
            onValueChange={(values) => {
              const nextStatus = values[0];
              if (nextStatus) {
                setStatus(nextStatus);
              }
            }}
            size="sm"
            value={[status]}
            variant="outline"
          >
            {(['전체', ...MAINTENANCE_STATUSES] as const).map((item) => (
              <ToggleGroup.Item key={item} value={item}>
                {item}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup>
        </FilterBar>

        {visiblePlans.length === 0 ? (
          <EmptyState.Root density="compact">
            <EmptyState.Icon>
              <CalendarPlus aria-hidden="true" />
            </EmptyState.Icon>
            <EmptyState.Title level={3}>이 상태의 정비 계획이 없습니다</EmptyState.Title>
            <EmptyState.Description>
              다른 상태를 선택하거나 새 정비 계획을 추가하십시오.
            </EmptyState.Description>
          </EmptyState.Root>
        ) : (
          <div className={compact ? 'relay-maintenance-list is-compact' : 'relay-maintenance-list'}>
            {visiblePlans.map((plan) => (
              <article className="relay-maintenance-item" key={plan.id}>
                <div className="relay-maintenance-date" aria-label={plan.scheduledAt}>
                  <CalendarPlus aria-hidden="true" size={18} />
                  <span>{plan.scheduledAt}</span>
                </div>
                <div className="relay-maintenance-copy">
                  <div>
                    <strong>{plan.title}</strong>
                    <Badge variant={MAINTENANCE_STATUS_VARIANTS[plan.status]}>{plan.status}</Badge>
                  </div>
                  <span>
                    {plan.id} · {plan.asset}
                  </span>
                  <small>
                    {plan.district} {plan.location} · {plan.crew} · {plan.duration}분
                  </small>
                </div>
                <div className="relay-maintenance-action">
                  {plan.workOrderCreated ? (
                    <Badge variant="outline">작업 연결됨</Badge>
                  ) : (
                    <Button onClick={() => createWorkOrder(plan.id)} size="sm" variant="outline">
                      작업 요청 만들기
                      <ArrowRight aria-hidden="true" size={15} />
                    </Button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function CreateMaintenanceDialog({
  onCreate,
}: {
  onCreate: (input: Omit<MaintenancePlan, 'id' | 'status' | 'workOrderCreated'>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [asset, setAsset] = useState('');
  const [location, setLocation] = useState('');
  const [crew, setCrew] = useState<Crew>('도심 1팀');
  const [scheduledAt, setScheduledAt] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const reset = () => {
    setTitle('');
    setAsset('');
    setLocation('');
    setCrew('도심 1팀');
    setScheduledAt('');
    setSubmitted(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    if (!title.trim() || !asset.trim() || !location || !scheduledAt.trim()) {
      return;
    }

    const matchingAsset = INITIAL_ASSETS.find((item) => item.location === location);
    onCreate({
      asset: asset.trim(),
      crew,
      district: matchingAsset?.district ?? '종로구',
      duration: 60,
      location,
      scheduledAt: scheduledAt.trim(),
      title: title.trim(),
    });
    setOpen(false);
    reset();
  };

  return (
    <Dialog.Root
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          reset();
        }
      }}
      open={open}
    >
      <Dialog.Trigger render={<Button size="md" />}>
        <CalendarPlus aria-hidden="true" size={17} />
        정비 계획 추가
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Viewport>
          <Dialog.Popup className="relay-form-dialog relay-form-dialog--compact">
            <div className="relay-overlay-heading">
              <div>
                <Dialog.Title>새 정비 계획</Dialog.Title>
                <Dialog.Description>
                  정비 대상과 일정을 입력해 운영 캘린더에 추가하십시오.
                </Dialog.Description>
              </div>
              <Dialog.Close
                aria-label="정비 계획 닫기"
                render={<Button iconOnly size="sm" variant="ghost" />}
              >
                <X aria-hidden="true" size={18} />
              </Dialog.Close>
            </div>
            <form className="relay-dialog-form" noValidate onSubmit={handleSubmit}>
              <div className="relay-dialog-body">
                <Field.Root invalid={submitted && !title.trim()}>
                  <Field.Label>계획 제목</Field.Label>
                  <Input
                    aria-required="true"
                    onValueChange={setTitle}
                    placeholder="예: 승강기 제어반 월간 점검"
                    value={title}
                  />
                  <Field.Error match={submitted && !title.trim()}>제목을 입력하십시오.</Field.Error>
                </Field.Root>
                <Field.Root invalid={submitted && !asset.trim()}>
                  <Field.Label>대상 자산</Field.Label>
                  <Input
                    aria-required="true"
                    onValueChange={setAsset}
                    placeholder="자산 이름을 입력하십시오"
                    value={asset}
                  />
                  <Field.Error match={submitted && !asset.trim()}>자산을 입력하십시오.</Field.Error>
                </Field.Root>
                <div className="relay-form-grid">
                  <Field.Root invalid={submitted && !location}>
                    <Select.Root
                      items={Object.fromEntries(LOCATIONS.map((item) => [item, item]))}
                      onValueChange={(value) => setLocation(value ?? '')}
                      value={location || null}
                    >
                      <Select.Label>시설 위치</Select.Label>
                      <Select.Trigger>
                        <Select.Value placeholder="위치 선택" />
                        <Select.Icon />
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Positioner sideOffset={6}>
                          <Select.Popup>
                            <Select.List>
                              {LOCATIONS.map((item) => (
                                <Select.Item key={item} value={item}>
                                  <Select.ItemIndicator />
                                  <Select.ItemText>{item}</Select.ItemText>
                                </Select.Item>
                              ))}
                            </Select.List>
                          </Select.Popup>
                        </Select.Positioner>
                      </Select.Portal>
                    </Select.Root>
                    <Field.Error match={submitted && !location}>위치를 선택하십시오.</Field.Error>
                  </Field.Root>
                  <Field.Root>
                    <Select.Root
                      items={CREW_ITEMS}
                      onValueChange={(value) => value && setCrew(value)}
                      value={crew}
                    >
                      <Select.Label>담당팀</Select.Label>
                      <Select.Trigger>
                        <Select.Value />
                        <Select.Icon />
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Positioner sideOffset={6}>
                          <Select.Popup>
                            <Select.List>
                              {Object.keys(CREW_ITEMS).map((item) => (
                                <Select.Item key={item} value={item}>
                                  <Select.ItemIndicator />
                                  <Select.ItemText>{item}</Select.ItemText>
                                </Select.Item>
                              ))}
                            </Select.List>
                          </Select.Popup>
                        </Select.Positioner>
                      </Select.Portal>
                    </Select.Root>
                  </Field.Root>
                </div>
                <Field.Root invalid={submitted && !scheduledAt.trim()}>
                  <Field.Label>정비 일정</Field.Label>
                  <Input
                    aria-required="true"
                    onValueChange={setScheduledAt}
                    placeholder="예: 7월 31일 · 09:00"
                    value={scheduledAt}
                  />
                  <Field.Description>
                    데모 기준일 이후의 날짜와 시간을 입력하십시오.
                  </Field.Description>
                  <Field.Error match={submitted && !scheduledAt.trim()}>
                    일정을 입력하십시오.
                  </Field.Error>
                </Field.Root>
              </div>
              <div className="relay-dialog-footer">
                <Dialog.Close render={<Button size="md" variant="secondary" />}>취소</Dialog.Close>
                <Button size="md" type="submit">
                  계획 추가
                </Button>
              </div>
            </form>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function ReportsPage({ compact }: { compact: boolean }) {
  const [period, setPeriod] = useState<ReportPeriod>('7일');
  const [district, setDistrict] = useState<keyof typeof DISTRICT_ITEMS>('전체 권역');

  const periodRows = REPORT_ROWS.filter((row) => row.period === period);
  const visibleRows =
    district === '전체 권역' ? periodRows : periodRows.filter((row) => row.district === district);
  const average = (field: 'assetAvailability' | 'plannedMaintenance' | 'slaCompliance') =>
    visibleRows.reduce((sum, row) => sum + row[field], 0) / Math.max(visibleRows.length, 1);
  const openOrders = visibleRows.reduce((sum, row) => sum + row.openOrders, 0);
  const slaCompliance = average('slaCompliance');
  const plannedMaintenance = average('plannedMaintenance');
  const assetAvailability = average('assetAvailability');

  return (
    <>
      <PageHeading
        description="권역별 작업 대응 성과와 시설 가용성을 기간 단위로 비교합니다."
        meta={<Badge variant="outline">마지막 집계 오늘 11:50</Badge>}
        title="운영 리포트"
      />

      <FilterBar
        actions={
          <Button
            disabled={period === '7일' && district === '전체 권역'}
            onClick={() => {
              setPeriod('7일');
              setDistrict('전체 권역');
            }}
            size="sm"
            variant="outline"
          >
            리포트 조건 초기화
          </Button>
        }
        label="리포트 조건"
        surface="standalone"
      >
        <Select.Root
          items={DISTRICT_ITEMS}
          onValueChange={(value) => value && setDistrict(value)}
          size="sm"
          value={district}
        >
          <Select.Label className="city-sr-only">리포트 권역</Select.Label>
          <Select.Trigger className="relay-filter-select">
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner sideOffset={6}>
              <Select.Popup>
                <Select.List>
                  {Object.keys(DISTRICT_ITEMS).map((item) => (
                    <Select.Item key={item} value={item}>
                      <Select.ItemIndicator />
                      <Select.ItemText>{item}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.List>
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
        <ToggleGroup
          aria-label="리포트 기간"
          onValueChange={(values) => {
            const nextPeriod = values[0];
            if (nextPeriod) {
              setPeriod(nextPeriod);
            }
          }}
          size="sm"
          value={[period]}
          variant="outline"
        >
          {REPORT_PERIODS.map((item) => (
            <ToggleGroup.Item key={item} value={item}>
              {item}
            </ToggleGroup.Item>
          ))}
        </ToggleGroup>
      </FilterBar>

      <section aria-label={`${period} 운영 지표`} className="relay-metrics relay-report-metrics">
        <MetricItem detail="활성 상태 기준" label="열린 작업" value={`${openOrders}건`} />
        <MetricItem
          detail="목표 95.0%"
          label="SLA 준수율"
          progress={slaCompliance}
          value={`${slaCompliance.toFixed(1)}%`}
        />
        <MetricItem
          detail="계획 대비 완료"
          label="계획 정비율"
          progress={plannedMaintenance}
          value={`${plannedMaintenance.toFixed(1)}%`}
        />
        <MetricItem
          detail="운영 가능 시간"
          label="자산 가용성"
          progress={assetAvailability}
          value={`${assetAvailability.toFixed(1)}%`}
        />
      </section>

      <section aria-labelledby="report-comparison-heading" className="relay-panel">
        <div className="relay-panel-heading">
          <div>
            <h2 id="report-comparison-heading">권역 비교</h2>
            <p>{period} 집계 · 백분율은 소수점 첫째 자리까지 표시합니다.</p>
          </div>
        </div>
        <DataTableRegion hintId="report-table-scroll-hint" label="운영 리포트 가로 스크롤 영역">
          <Table.Root aria-label="권역별 운영 리포트" size={compact ? 'sm' : 'md'} variant="line">
            <Table.Header>
              <Table.Row>
                <Table.Head>권역</Table.Head>
                <Table.Head>열린 작업</Table.Head>
                <Table.Head>SLA 준수율</Table.Head>
                <Table.Head>계획 정비율</Table.Head>
                <Table.Head>자산 가용성</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {visibleRows.map((row) => (
                <Table.Row key={`${row.period}-${row.district}`}>
                  <Table.Cell>
                    <strong>{row.district}</strong>
                  </Table.Cell>
                  <Table.Cell>{row.openOrders}건</Table.Cell>
                  <Table.Cell>{row.slaCompliance.toFixed(1)}%</Table.Cell>
                  <Table.Cell>{row.plannedMaintenance.toFixed(1)}%</Table.Cell>
                  <Table.Cell>{row.assetAvailability.toFixed(1)}%</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </DataTableRegion>
      </section>
    </>
  );
}

export function ActivityPage({ compact }: { compact: boolean }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('전체');
  const [includeSystem, setIncludeSystem] = useState(true);

  const activities = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('ko-KR');

    return ACTIVITY_LOGS.filter((activity) => {
      if (!includeSystem && activity.system) {
        return false;
      }
      if (category !== '전체' && activity.category !== category) {
        return false;
      }
      return (
        !normalizedQuery ||
        [activity.id, activity.actor, activity.summary, activity.target]
          .join(' ')
          .toLocaleLowerCase('ko-KR')
          .includes(normalizedQuery)
      );
    });
  }, [category, includeSystem, query]);

  const resetFilters = () => {
    setQuery('');
    setCategory('전체');
    setIncludeSystem(true);
  };

  return (
    <>
      <PageHeading
        description="작업·자산·배정 변경의 주체와 전후 상태를 시간순으로 추적합니다."
        meta={<Badge variant="outline">감사 보존 180일</Badge>}
        title="활동 기록"
      />

      <section aria-labelledby="activity-list-heading" className="relay-panel">
        <div className="relay-panel-heading">
          <div>
            <h2 id="activity-list-heading">변경 이력</h2>
            <p>{activities.length}건 표시 · 최신순</p>
          </div>
        </div>

        <FilterBar
          actions={
            <>
              <label className="relay-switch-label">
                <Switch checked={includeSystem} onCheckedChange={setIncludeSystem} size="sm" />
                시스템 이벤트 포함
              </label>
              <Button
                disabled={query === '' && category === '전체' && includeSystem}
                onClick={resetFilters}
                size="sm"
                variant="outline"
              >
                활동 필터 초기화
              </Button>
            </>
          }
          label="활동 기록 필터"
        >
          <SearchField.Root
            className="relay-filter-search"
            onValueChange={setQuery}
            size="sm"
            value={query}
          >
            <SearchField.Label className="city-sr-only">활동 기록 검색</SearchField.Label>
            <SearchField.Group>
              <SearchField.Input placeholder="대상·담당자·내용 검색" />
              <SearchField.Clear />
            </SearchField.Group>
          </SearchField.Root>
          <Select.Root
            items={ACTIVITY_CATEGORY_ITEMS}
            onValueChange={(value) => value && setCategory(value)}
            size="sm"
            value={category}
          >
            <Select.Label className="city-sr-only">활동 유형 필터</Select.Label>
            <Select.Trigger className="relay-filter-select">
              <Select.Value />
              <Select.Icon />
            </Select.Trigger>
            <Select.Portal>
              <Select.Positioner sideOffset={6}>
                <Select.Popup>
                  <Select.List>
                    {ACTIVITY_CATEGORIES.map((item) => (
                      <Select.Item key={item} value={item}>
                        <Select.ItemIndicator />
                        <Select.ItemText>{item}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.List>
                </Select.Popup>
              </Select.Positioner>
            </Select.Portal>
          </Select.Root>
        </FilterBar>

        <DataTableRegion
          hintId="activity-table-scroll-hint"
          label="활동 기록 가로 스크롤 영역"
          showHint={activities.length > 0}
        >
          <Table.Root aria-label="Relay 활동 기록" size={compact ? 'sm' : 'md'} variant="line">
            <Table.Header>
              <Table.Row>
                <Table.Head>시간</Table.Head>
                <Table.Head>유형</Table.Head>
                <Table.Head>대상</Table.Head>
                <Table.Head>활동</Table.Head>
                <Table.Head>수행자</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {activities.length === 0 ? (
                <Table.StateRow colSpan={5}>
                  <EmptyState.Root density="compact">
                    <EmptyState.Icon>
                      <History aria-hidden="true" />
                    </EmptyState.Icon>
                    <EmptyState.Title level={3}>조건에 맞는 활동이 없습니다</EmptyState.Title>
                    <EmptyState.Description>
                      검색어 또는 활동 유형을 조정하십시오.
                    </EmptyState.Description>
                    <EmptyState.Actions>
                      <Button onClick={resetFilters} size="sm" variant="outline">
                        필터 초기화
                      </Button>
                    </EmptyState.Actions>
                  </EmptyState.Root>
                </Table.StateRow>
              ) : (
                activities.map((activity) => (
                  <Table.Row key={activity.id}>
                    <Table.Cell>
                      <ActivityDetailsPopover
                        after={activity.after}
                        before={activity.before}
                        id={activity.id}
                        timestamp={activity.timestamp}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Badge variant="outline">{activity.category}</Badge>
                    </Table.Cell>
                    <Table.Cell>{activity.target}</Table.Cell>
                    <Table.Cell>{activity.summary}</Table.Cell>
                    <Table.Cell>{activity.actor}</Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </DataTableRegion>
      </section>
    </>
  );
}

function ActivityDetailsPopover({
  after,
  before,
  id,
  timestamp,
}: {
  after: string;
  before: string;
  id: string;
  timestamp: string;
}) {
  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label={`${id} 변경 상세`}
        render={<Button className="relay-primary-link" size="sm" variant="ghost" />}
      >
        <span>
          <strong>{timestamp}</strong>
          <small>{id}</small>
        </span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner align="end" sideOffset={6}>
          <Popover.Popup className="relay-activity-popover">
            <Popover.Title>변경 상세</Popover.Title>
            <Popover.Description>{id} 이벤트의 기록된 값입니다.</Popover.Description>
            <div className="relay-change-comparison">
              <div>
                <span>이전</span>
                <strong>{before}</strong>
              </div>
              <ArrowRight aria-hidden="true" size={16} />
              <div>
                <span>변경 후</span>
                <strong>{after}</strong>
              </div>
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
