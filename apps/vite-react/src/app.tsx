import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import {
  Activity,
  Bell,
  Building2,
  CalendarRange,
  CheckCircle2,
  ChartNoAxesColumnIncreasing,
  ClipboardList,
  History,
  LayoutDashboard,
  Menu as MenuIcon,
  RefreshCw,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import {
  Accordion,
  Alert,
  Badge,
  Breadcrumbs,
  Button,
  DensityProvider,
  Drawer,
  EmptyState,
  Menu,
  Popover,
  Progress,
  SearchField,
  Select,
  Switch,
  Toast,
  ToggleGroup,
  Tooltip,
  type CityTheme,
  type TableSortDirection,
} from '@city-ds/react';

import {
  CREW_CAPACITY,
  DISTRICT_ITEMS,
  INITIAL_WORK_ORDERS,
  isTerminalStatus,
  type Crew,
  type StatusFilter,
  type WorkOrder,
  type WorkOrderStatus,
} from './dashboard-data';
import {
  CancelWorkOrderDialog,
  CreateWorkOrderDialog,
  WorkOrderDetailsDrawer,
  type CreateWorkOrderInput,
} from './work-order-overlays';
import { PageHeading } from './page-heading';
import { FilterBar, MetricItem } from './relay-ui';
import { ActivityPage, AssetsPage, MaintenancePage, ReportsPage } from './service-pages';
import { WorkOrderTable } from './work-order-table';

const PAGE_SIZE = 6;
const THEMES: readonly CityTheme[] = ['system', 'light', 'dark'];
const STATUS_FILTERS: readonly StatusFilter[] = ['전체', 'SLA 위험', '진행 중', '완료'];

const NAVIGATION_ITEMS = [
  {
    description: '오늘의 SLA와 운영 지표를 한눈에 확인합니다.',
    group: '운영',
    icon: LayoutDashboard,
    label: '운영 현황',
    path: '/',
    section: 'overview',
    title: '운영 현황',
  },
  {
    description: '작업을 검색하고 배정·완료 상태를 관리합니다.',
    group: '운영',
    icon: ClipboardList,
    label: '작업 요청',
    path: '/work-orders',
    section: 'queue',
    title: '작업 요청',
  },
  {
    description: '예방 정비 일정을 만들고 작업 요청 전환 상태를 관리합니다.',
    group: '운영',
    icon: CalendarRange,
    label: '정비 계획',
    path: '/maintenance',
    section: 'maintenance',
    title: '정비 계획',
  },
  {
    description: '시설 상태와 점검 이력을 기준으로 대응 대상을 찾습니다.',
    group: '자원',
    icon: Building2,
    label: '시설 자산',
    path: '/assets',
    section: 'assets',
    title: '시설 자산',
  },
  {
    description: '현장팀별 배정 부하와 가용성을 확인합니다.',
    group: '자원',
    icon: Users,
    label: '현장팀',
    path: '/crews',
    section: 'crews',
    title: '현장팀',
  },
  {
    description: '권역별 SLA와 자산 가용성 변화를 비교합니다.',
    group: '분석 및 관리',
    icon: ChartNoAxesColumnIncreasing,
    label: '운영 리포트',
    path: '/reports',
    section: 'reports',
    title: '운영 리포트',
  },
  {
    description: '작업·자산·배정 변경의 감사 이력을 추적합니다.',
    group: '분석 및 관리',
    icon: History,
    label: '활동 기록',
    path: '/activity',
    section: 'activity',
    title: '활동 기록',
  },
  {
    description: '운영 데이터와 통신 채널 상태를 점검합니다.',
    group: '분석 및 관리',
    icon: Activity,
    label: '서비스 상태',
    path: '/service-status',
    section: 'health',
    title: '서비스 상태',
  },
] as const;

const NAVIGATION_GROUPS = ['운영', '자원', '분석 및 관리'] as const;

type DashboardPath = (typeof NAVIGATION_ITEMS)[number]['path'];
type DashboardRoute = (typeof NAVIGATION_ITEMS)[number];

interface CancelledWorkOrder {
  id: string;
  status: WorkOrderStatus;
}

function normalizePathname(pathname: string) {
  if (pathname === '/') {
    return pathname;
  }

  return pathname.replace(/\/+$/, '');
}

function getDashboardRoute(pathname: string): DashboardRoute | null {
  const normalizedPath = normalizePathname(pathname);
  return NAVIGATION_ITEMS.find((item) => item.path === normalizedPath) ?? null;
}

function useDashboardPath() {
  const [pathname, setPathname] = useState(() => normalizePathname(window.location.pathname));

  useEffect(() => {
    const handlePopState = () => setPathname(normalizePathname(window.location.pathname));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: DashboardPath) => {
    if (normalizePathname(window.location.pathname) === path) {
      return;
    }

    window.history.pushState(null, '', path);
    setPathname(path);
  };

  return { navigate, pathname };
}

function isPlainLeftClick(event: ReactMouseEvent<HTMLAnchorElement>) {
  return (
    event.button === 0 &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.shiftKey &&
    event.currentTarget.target !== '_blank'
  );
}

export function App() {
  return (
    <Toast.Provider limit={3} timeout={6000}>
      <Tooltip.Provider closeDelay={100} delay={300}>
        <RelayDashboard />
      </Tooltip.Provider>
    </Toast.Provider>
  );
}

function RelayDashboard() {
  const toastManager = Toast.useToastManager();
  const { navigate, pathname } = useDashboardPath();
  const currentRoute = getDashboardRoute(pathname);
  const [orders, setOrders] = useState<WorkOrder[]>(() => [...INITIAL_WORK_ORDERS]);
  const [quickSearchQuery, setQuickSearchQuery] = useState('');
  const [query, setQuery] = useState('');
  const [district, setDistrict] =
    useState<(typeof DISTRICT_ITEMS)[keyof typeof DISTRICT_ITEMS]>('전체 권역');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('전체');
  const [sortDirection, setSortDirection] = useState<TableSortDirection>('desc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [pendingCancelId, setPendingCancelId] = useState<string | null>(null);
  const [cancelledOrder, setCancelledOrder] = useState<CancelledWorkOrder | null>(null);
  const [theme, setTheme] = useState<CityTheme>('system');
  const [compact, setCompact] = useState(false);
  const [liveUpdates, setLiveUpdates] = useState(true);
  const [loading, setLoading] = useState(false);
  const detailsTriggerRef = useRef<HTMLElement | null>(null);
  const cancelTriggerRef = useRef<HTMLElement | null>(null);
  const previousPathRef = useRef(pathname);

  useEffect(() => {
    if (theme === 'system') {
      delete document.documentElement.dataset.theme;
      return;
    }

    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (!loading) {
      return;
    }

    const timer = window.setTimeout(() => setLoading(false), 450);
    return () => window.clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    document.title = `${currentRoute?.title ?? '페이지를 찾을 수 없습니다'} · Relay`;

    if (previousPathRef.current === pathname) {
      return;
    }

    previousPathRef.current = pathname;
    window.scrollTo({ behavior: 'auto', left: 0, top: 0 });
    const frame = window.requestAnimationFrame(() => {
      document.querySelector<HTMLElement>('.relay-page-heading h1')?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [currentRoute, pathname]);

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('ko-KR');

    return orders
      .filter((order) => {
        if (district !== '전체 권역' && order.district !== district) {
          return false;
        }

        if (
          statusFilter === 'SLA 위험' &&
          (order.progress < 75 || order.status === '완료' || order.status === '취소')
        ) {
          return false;
        }

        if (statusFilter === '진행 중' && order.status !== '진행 중') {
          return false;
        }

        if (statusFilter === '완료' && order.status !== '완료') {
          return false;
        }

        if (!normalizedQuery) {
          return true;
        }

        return [order.id, order.title, order.location, order.crew]
          .join(' ')
          .toLocaleLowerCase('ko-KR')
          .includes(normalizedQuery);
      })
      .sort((left, right) =>
        sortDirection === 'asc' ? left.progress - right.progress : right.progress - left.progress,
      );
  }, [district, orders, query, sortDirection, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const resolvedPage = Math.min(currentPage, totalPages);
  const pageOrders = filteredOrders.slice((resolvedPage - 1) * PAGE_SIZE, resolvedPage * PAGE_SIZE);
  const selectedOrder = orders.find((order) => order.id === selectedOrderId) ?? null;
  const pendingCancelOrder = orders.find((order) => order.id === pendingCancelId) ?? null;
  const activeOrders = orders.filter((order) => order.status !== '완료' && order.status !== '취소');
  const riskOrders = activeOrders.filter((order) => order.progress >= 75);
  const completedOrders = orders.filter((order) => order.status === '완료');

  const updateOrder = (id: string, updates: Partial<WorkOrder>) => {
    setOrders((current) =>
      current.map((order) => (order.id === id ? { ...order, ...updates } : order)),
    );
  };

  const showToast = (title: string, description: string) => {
    toastManager.add({ description, title });
  };

  const handleCreate = (input: CreateWorkOrderInput) => {
    const sequence = 3000 + orders.length + 1;
    const createdOrder: WorkOrder = {
      ...input,
      crew: '미배정',
      id: `WO-${sequence}`,
      progress: input.priority === '긴급' ? 28 : 12,
      slaDueAt: input.priority === '긴급' ? '오늘 13:30' : '오늘 18:30',
      status: '접수',
      updatedAt: '방금 전',
    };

    setOrders((current) => [createdOrder, ...current]);
    setQuery('');
    setDistrict('전체 권역');
    setStatusFilter('전체');
    setCurrentPage(1);
    setSelectedIds([]);
    setSortDirection('asc');
    navigate('/work-orders');
    showToast('작업이 생성되었습니다', `${createdOrder.id} 작업을 운영 대기열에 추가했습니다.`);
  };

  const handleComplete = (id: string) => {
    updateOrder(id, { progress: 100, status: '완료', updatedAt: '방금 전' });
    showToast('작업을 완료했습니다', `${id} 상태를 완료로 변경했습니다.`);
  };

  const handleCancel = (id: string) => {
    const order = orders.find((candidate) => candidate.id === id);
    if (!order || isTerminalStatus(order.status)) {
      return;
    }

    setCancelledOrder({ id, status: order.status });
    if (selectedOrderId === id) {
      cancelTriggerRef.current = detailsTriggerRef.current;
      setSelectedOrderId(null);
    }
    updateOrder(id, { status: '취소', updatedAt: '방금 전' });
    setPendingCancelId(null);
    showToast('작업을 취소했습니다', `${id} 작업을 취소 상태로 변경했습니다.`);
  };

  const handleUndoCancel = () => {
    if (!cancelledOrder) {
      return;
    }

    updateOrder(cancelledOrder.id, {
      status: cancelledOrder.status,
      updatedAt: '방금 전',
    });
    showToast('취소를 되돌렸습니다', `${cancelledOrder.id} 작업의 이전 상태를 복원했습니다.`);
    setCancelledOrder(null);
  };

  const handleCrewChange = (id: string, crew: Crew) => {
    const order = orders.find((candidate) => candidate.id === id);
    if (!order || isTerminalStatus(order.status)) {
      return;
    }

    if (order.status === '진행 중' && crew === '미배정') {
      showToast(
        '담당팀을 변경할 수 없습니다',
        '진행 중인 작업은 미배정 상태로 되돌릴 수 없습니다.',
      );
      return;
    }

    const status =
      order.status === '진행 중' || order.status === '대기'
        ? order.status
        : crew === '미배정'
          ? '접수'
          : '배정됨';

    updateOrder(id, { crew, status, updatedAt: '방금 전' });
    showToast('담당팀을 변경했습니다', `${id} 작업을 ${crew}에 배정했습니다.`);
  };

  const handleOpenDetails = (id: string, trigger: HTMLElement | null) => {
    detailsTriggerRef.current = trigger;
    setSelectedOrderId(id);
  };

  const handleRequestCancel = (id: string, trigger: HTMLElement | null) => {
    const order = orders.find((candidate) => candidate.id === id);
    if (!order || isTerminalStatus(order.status)) {
      return;
    }

    cancelTriggerRef.current = trigger;
    setPendingCancelId(id);
  };

  const resetPage = () => {
    setCurrentPage(1);
    setSelectedIds([]);
  };

  const resetFilters = () => {
    setQuery('');
    setDistrict('전체 권역');
    setStatusFilter('전체');
    setCurrentPage(1);
    setSelectedIds([]);
  };

  return (
    <DensityProvider
      className="relay-app"
      data-density={compact ? 'compact' : 'comfortable'}
      density={compact ? 'compact' : 'comfortable'}
    >
      <aside className="relay-sidebar">
        <SidebarContent
          activePath={pathname}
          compact={compact}
          onCompactChange={setCompact}
          onNavigate={navigate}
          onThemeChange={setTheme}
          theme={theme}
        />
      </aside>

      <div className="relay-workspace">
        <header className="relay-topbar">
          <MobileNavigation
            activePath={pathname}
            compact={compact}
            onCompactChange={setCompact}
            onNavigate={navigate}
            onThemeChange={setTheme}
            theme={theme}
          />

          <Breadcrumbs.Root aria-label="현재 위치">
            <Breadcrumbs.List>
              <Breadcrumbs.Item>
                <Breadcrumbs.Link
                  href="/"
                  onClick={(event) => {
                    if (isPlainLeftClick(event)) {
                      event.preventDefault();
                      navigate('/');
                    }
                  }}
                >
                  서울 중앙 운영
                </Breadcrumbs.Link>
              </Breadcrumbs.Item>
              <Breadcrumbs.Item>
                <Breadcrumbs.Separator />
                <Breadcrumbs.Page>{currentRoute?.label ?? '페이지 없음'}</Breadcrumbs.Page>
              </Breadcrumbs.Item>
            </Breadcrumbs.List>
          </Breadcrumbs.Root>

          <div className="relay-global-search-slot">
            <SearchField.Root
              className="relay-global-search"
              onSubmit={(value) => {
                setQuery(value);
                resetPage();
                navigate('/work-orders');
              }}
              onValueChange={setQuickSearchQuery}
              size="sm"
              value={quickSearchQuery}
            >
              <SearchField.Label className="city-sr-only">작업 빠른 검색</SearchField.Label>
              <SearchField.Group>
                <SearchField.Input placeholder="작업 번호·제목 빠른 검색" />
                <SearchField.Clear />
                <SearchField.Submit aria-label="작업 검색 실행" />
              </SearchField.Group>
            </SearchField.Root>
          </div>

          <div className="relay-topbar-actions">
            <NotificationPopover riskOrders={riskOrders} />
            <AccountMenu onNotify={showToast} />
          </div>
        </header>

        <main className="relay-main" id="main-content">
          {currentRoute?.section === 'overview' ? (
            <>
              <PageHeading
                actions={<CreateWorkOrderDialog onCreate={handleCreate} />}
                description="서울 중앙 권역의 작업 요청과 현장 대응 상태를 관리합니다."
                meta={<LiveStatus enabled={liveUpdates} />}
                title="운영 현황"
              />

              <Alert.Root
                className="relay-risk-alert"
                showIcon
                tone={riskOrders.length > 0 ? 'warning' : 'success'}
              >
                <Alert.Title>
                  {riskOrders.length > 0
                    ? `SLA 위험 작업 ${riskOrders.length}건을 확인하십시오`
                    : '현재 SLA 위험 작업이 없습니다'}
                </Alert.Title>
                <Alert.Description>
                  {riskOrders.length > 0
                    ? `${[...new Set(riskOrders.map((order) => order.location))].join(', ')} 작업이 SLA 대응 시간 75%를 넘었습니다.`
                    : '모든 활성 작업이 현재 대응 시간 기준 안에 있습니다.'}
                </Alert.Description>
                {riskOrders.length > 0 ? (
                  <Alert.Action>
                    <Button
                      onClick={() => {
                        setStatusFilter('SLA 위험');
                        resetPage();
                        navigate('/work-orders');
                      }}
                      size="sm"
                      variant="outline"
                    >
                      위험 작업 보기
                    </Button>
                  </Alert.Action>
                ) : null}
              </Alert.Root>

              <section aria-label="오늘의 운영 지표" className="relay-metrics">
                <MetricItem
                  detail="어제보다 6건 감소"
                  label="열린 작업"
                  loading={loading}
                  value={`${activeOrders.length}건`}
                />
                <MetricItem
                  detail="목표 95.0%"
                  label="SLA 준수율"
                  loading={loading}
                  progress={94}
                  value="93.8%"
                />
                <MetricItem
                  detail="전체 24개 팀"
                  label="가동 현장팀"
                  loading={loading}
                  value="18팀"
                />
                <MetricItem
                  detail={`${completedOrders.length}건 오늘 완료`}
                  label="계획 정비율"
                  loading={loading}
                  progress={72}
                  value="72%"
                />
              </section>

              <section aria-labelledby="overview-heading" className="relay-panel">
                <div className="relay-panel-heading">
                  <div>
                    <h2 id="overview-heading">운영 바로가기</h2>
                    <p>세부 화면으로 이동해 현재 상태를 확인하고 조치할 수 있습니다.</p>
                  </div>
                </div>
                <div className="relay-overview-list">
                  <OverviewLink
                    description="접수·배정·SLA 상태를 검색하고 변경합니다."
                    icon={ClipboardList}
                    label="작업 요청"
                    meta={`${activeOrders.length}건 열림`}
                    onNavigate={navigate}
                    path="/work-orders"
                  />
                  <OverviewLink
                    description="팀별 현재 배정 부하와 추가 수용량을 확인합니다."
                    icon={Users}
                    label="현장팀"
                    meta="18 / 24팀 가동"
                    onNavigate={navigate}
                    path="/crews"
                  />
                  <OverviewLink
                    description="배정 엔진·현장 단말·감사 로그 상태를 점검합니다."
                    icon={Activity}
                    label="서비스 상태"
                    meta="정상 운영"
                    onNavigate={navigate}
                    path="/service-status"
                  />
                </div>
              </section>
            </>
          ) : null}

          {currentRoute?.section === 'queue' ? (
            <>
              <PageHeading
                actions={<CreateWorkOrderDialog onCreate={handleCreate} />}
                description="작업을 검색하고 우선순위·배정·SLA 상태를 관리합니다."
                meta={<LiveStatus enabled={liveUpdates} />}
                title="작업 요청"
              />

              <section aria-labelledby="queue-heading" className="relay-panel">
                <div className="relay-panel-heading">
                  <div>
                    <h2 id="queue-heading">작업 대기열</h2>
                    <p>{filteredOrders.length}건 표시 · 최근 동기화 방금 전</p>
                  </div>
                  <label className="relay-switch-label">
                    <Switch checked={liveUpdates} onCheckedChange={setLiveUpdates} size="sm" />
                    실시간 업데이트
                  </label>
                </div>

                <FilterBar
                  actions={
                    <>
                      <Button
                        disabled={
                          query === '' && district === '전체 권역' && statusFilter === '전체'
                        }
                        onClick={resetFilters}
                        size="sm"
                        variant="outline"
                      >
                        작업 필터 초기화
                      </Button>
                      <Tooltip.Root>
                        <Tooltip.Trigger
                          aria-label="작업 새로고침"
                          render={
                            <Button
                              aria-label="작업 새로고침"
                              disabled={loading}
                              iconOnly
                              onClick={() => setLoading(true)}
                              size="sm"
                              variant="ghost"
                            />
                          }
                        >
                          <RefreshCw aria-hidden="true" size={16} />
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Positioner sideOffset={8}>
                            <Tooltip.Popup>
                              최신 작업 새로고침
                              <Tooltip.Arrow />
                            </Tooltip.Popup>
                          </Tooltip.Positioner>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </>
                  }
                  label="작업 필터"
                >
                  <SearchField.Root
                    className="relay-filter-search"
                    onValueChange={(value) => {
                      setQuery(value);
                      resetPage();
                    }}
                    size="sm"
                    value={query}
                  >
                    <SearchField.Label className="city-sr-only">작업 요청 검색</SearchField.Label>
                    <SearchField.Group>
                      <SearchField.Input placeholder="번호·제목·위치·담당팀 검색" />
                      <SearchField.Clear />
                    </SearchField.Group>
                  </SearchField.Root>
                  <Select.Root
                    items={DISTRICT_ITEMS}
                    onValueChange={(value) => {
                      if (value) {
                        setDistrict(value);
                        resetPage();
                      }
                    }}
                    size="sm"
                    value={district}
                  >
                    <Select.Label className="city-sr-only">권역 필터</Select.Label>
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
                    aria-label="작업 상태 필터"
                    onValueChange={(values) => {
                      const nextFilter = values[0];
                      if (nextFilter) {
                        setStatusFilter(nextFilter);
                        resetPage();
                      }
                    }}
                    size="sm"
                    value={[statusFilter]}
                    variant="outline"
                  >
                    {STATUS_FILTERS.map((filter) => (
                      <ToggleGroup.Item key={filter} value={filter}>
                        {filter}
                      </ToggleGroup.Item>
                    ))}
                  </ToggleGroup>
                </FilterBar>

                <WorkOrderTable
                  compact={compact}
                  currentPage={resolvedPage}
                  loading={loading}
                  onComplete={handleComplete}
                  onOpenDetails={handleOpenDetails}
                  onPageChange={setCurrentPage}
                  onRequestCancel={handleRequestCancel}
                  onResetFilters={resetFilters}
                  onSelectedIdsChange={setSelectedIds}
                  onSortDirectionChange={setSortDirection}
                  orders={pageOrders}
                  selectedIds={selectedIds}
                  sortDirection={sortDirection}
                  totalPages={totalPages}
                />
              </section>
            </>
          ) : null}

          {currentRoute?.section === 'maintenance' ? (
            <MaintenancePage compact={compact} onNotify={showToast} />
          ) : null}

          {currentRoute?.section === 'assets' ? <AssetsPage compact={compact} /> : null}

          {currentRoute?.section === 'crews' ? (
            <>
              <PageHeading
                description="현장팀별 배정 부하와 추가 작업 수용 가능 여부를 확인합니다."
                meta={<Badge appearance="outline">18 / 24팀 가동</Badge>}
                title="현장팀"
              />

              <section aria-labelledby="crew-heading" className="relay-panel">
                <div className="relay-panel-heading">
                  <div>
                    <h2 id="crew-heading">현장팀 가용성</h2>
                    <p>배정 부하가 80%를 넘으면 신규 긴급 작업만 받을 수 있습니다.</p>
                  </div>
                </div>
                <div className="relay-crew-list">
                  {CREW_CAPACITY.map((crew) => (
                    <div className="relay-crew-row" key={crew.name}>
                      <div>
                        <strong>{crew.name}</strong>
                        <span>
                          작업 {crew.assignments} / 수용 {crew.capacity}
                        </span>
                      </div>
                      <Badge
                        appearance="subtle"
                        tone={crew.progress === 100 ? 'destructive' : 'success'}
                      >
                        {crew.status}
                      </Badge>
                      <Progress.Root aria-label={`${crew.name} 배정 부하`} value={crew.progress}>
                        <Progress.Track>
                          <Progress.Indicator />
                        </Progress.Track>
                      </Progress.Root>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : null}

          {currentRoute?.section === 'reports' ? <ReportsPage compact={compact} /> : null}

          {currentRoute?.section === 'activity' ? <ActivityPage compact={compact} /> : null}

          {currentRoute?.section === 'health' ? (
            <>
              <PageHeading
                description="운영 데이터와 현장 통신 채널의 현재 상태를 점검합니다."
                meta={
                  <Badge appearance="subtle" tone="success">
                    정상 운영
                  </Badge>
                }
                title="서비스 상태"
              />

              <section aria-labelledby="health-heading" className="relay-panel">
                <div className="relay-panel-heading">
                  <div>
                    <h2 id="health-heading">운영 채널 상태</h2>
                    <p>운영 데이터와 현장 통신 채널이 모두 정상입니다.</p>
                  </div>
                </div>
                <Accordion.Root defaultValue={['dispatch']}>
                  <ServiceHealthItem
                    description="작업 배정과 상태 변경 이벤트가 평균 1.2초 이내 처리됩니다."
                    label="작업 배정 엔진"
                    value="dispatch"
                  />
                  <ServiceHealthItem
                    description="24개 현장팀 단말 중 23개가 최근 5분 내 상태를 전송했습니다."
                    label="현장 단말 통신"
                    value="devices"
                  />
                  <ServiceHealthItem
                    description="금일 운영 로그 18,420건이 보존 정책에 따라 기록되었습니다."
                    label="감사 로그"
                    value="audit"
                  />
                </Accordion.Root>
              </section>
            </>
          ) : null}

          {!currentRoute ? (
            <>
              <PageHeading
                description="요청한 Relay 화면이 존재하지 않거나 이동되었습니다."
                title="페이지를 찾을 수 없습니다"
              />
              <EmptyState.Root className="relay-route-empty">
                <EmptyState.Icon>
                  <LayoutDashboard aria-hidden="true" />
                </EmptyState.Icon>
                <EmptyState.Title>운영 현황으로 돌아가십시오</EmptyState.Title>
                <EmptyState.Description>
                  사이드바에서 사용할 수 있는 화면을 선택할 수 있습니다.
                </EmptyState.Description>
                <EmptyState.Actions>
                  <Button onClick={() => navigate('/')}>운영 현황 보기</Button>
                </EmptyState.Actions>
              </EmptyState.Root>
            </>
          ) : null}
        </main>
      </div>

      <WorkOrderDetailsDrawer
        finalFocus={detailsTriggerRef}
        onClose={() => setSelectedOrderId(null)}
        onCrewChange={handleCrewChange}
        onRequestCancel={handleRequestCancel}
        open={Boolean(selectedOrder)}
        order={selectedOrder}
      />
      <CancelWorkOrderDialog
        finalFocus={cancelTriggerRef}
        onCancel={handleCancel}
        onOpenChange={(open) => {
          if (!open) {
            setPendingCancelId(null);
          }
        }}
        open={Boolean(pendingCancelOrder)}
        order={pendingCancelOrder}
      />

      <Toast.Portal>
        <Toast.Viewport>
          {toastManager.toasts.map((toast) => (
            <Toast.Root key={toast.id} toast={toast}>
              <Toast.Content>
                <div>
                  <Toast.Title />
                  <Toast.Description />
                </div>
                {toast.title === '작업을 취소했습니다' && cancelledOrder ? (
                  <Toast.Action onClick={handleUndoCancel}>실행 취소</Toast.Action>
                ) : null}
                <Toast.Close />
              </Toast.Content>
            </Toast.Root>
          ))}
        </Toast.Viewport>
      </Toast.Portal>
    </DensityProvider>
  );
}

function LiveStatus({ enabled }: { enabled: boolean }) {
  return (
    <span className="relay-live-status">
      <span aria-hidden="true" />
      {enabled ? '실시간 연결됨' : '업데이트 일시 정지'}
    </span>
  );
}

function OverviewLink({
  description,
  icon: Icon,
  label,
  meta,
  onNavigate,
  path,
}: {
  description: string;
  icon: LucideIcon;
  label: string;
  meta: string;
  onNavigate: (path: DashboardPath) => void;
  path: DashboardPath;
}) {
  return (
    <a
      className="relay-overview-link"
      href={path}
      onClick={(event) => {
        if (isPlainLeftClick(event)) {
          event.preventDefault();
          onNavigate(path);
        }
      }}
    >
      <span className="relay-overview-icon">
        <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
      </span>
      <span>
        <strong>{label}</strong>
        <small>{description}</small>
      </span>
      <Badge appearance="outline">{meta}</Badge>
    </a>
  );
}

interface SidebarContentProps {
  activePath: string;
  compact: boolean;
  onCompactChange: (compact: boolean) => void;
  onNavigate: (path: DashboardPath) => void;
  onThemeChange: (theme: CityTheme) => void;
  theme: CityTheme;
}

function SidebarContent({
  activePath,
  compact,
  onCompactChange,
  onNavigate,
  onThemeChange,
  theme,
}: SidebarContentProps) {
  return (
    <div className="relay-sidebar-content">
      <div className="relay-brand">
        <span className="relay-brand-mark">
          <Activity aria-hidden="true" size={19} strokeWidth={2} />
        </span>
        <span>
          <strong>Relay (Mock Service)</strong>
          <small>서울 중앙 운영</small>
        </span>
      </div>

      <nav aria-label="Relay 주요 메뉴" className="relay-navigation">
        {NAVIGATION_GROUPS.map((group) => (
          <div className="relay-nav-group" key={group}>
            <p>{group}</p>
            {NAVIGATION_ITEMS.filter((item) => item.group === group).map(
              ({ icon: Icon, label, path }) => (
                <a
                  aria-current={normalizePathname(activePath) === path ? 'page' : undefined}
                  className={
                    normalizePathname(activePath) === path
                      ? 'relay-nav-link is-selected'
                      : 'relay-nav-link'
                  }
                  href={path}
                  key={label}
                  onClick={(event) => {
                    if (isPlainLeftClick(event)) {
                      event.preventDefault();
                      onNavigate(path);
                    }
                  }}
                >
                  <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
                  {label}
                </a>
              ),
            )}
          </div>
        ))}
      </nav>

      <div className="relay-sidebar-settings">
        <span>화면 테마</span>
        <ToggleGroup
          aria-label="화면 테마"
          onValueChange={(values) => {
            const nextTheme = values[0];
            if (nextTheme) {
              onThemeChange(nextTheme);
            }
          }}
          size="sm"
          value={[theme]}
          variant="outline"
        >
          {THEMES.map((item) => (
            <ToggleGroup.Item key={item} value={item}>
              {item === 'system' ? '시스템' : item === 'light' ? '라이트' : '다크'}
            </ToggleGroup.Item>
          ))}
        </ToggleGroup>
        <label className="relay-switch-label">
          <Switch checked={compact} onCheckedChange={onCompactChange} size="sm" />
          컴팩트 밀도
        </label>
      </div>
    </div>
  );
}

function MobileNavigation(props: SidebarContentProps) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer.Root onOpenChange={setOpen} open={open} swipeDirection="left">
      <Drawer.Trigger
        aria-label="주요 메뉴 열기"
        className="relay-mobile-menu-trigger"
        render={<Button size="md" variant="ghost" />}
      >
        <MenuIcon aria-hidden="true" size={19} />
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Backdrop />
        <Drawer.Viewport side="left">
          <Drawer.Popup className="relay-mobile-drawer" side="left" size="sm">
            <Drawer.Header>
              <Drawer.Title>Relay 메뉴</Drawer.Title>
              <Drawer.Close
                aria-label="주요 메뉴 닫기"
                render={<Button iconOnly size="sm" variant="ghost" />}
              >
                <X aria-hidden="true" size={18} />
              </Drawer.Close>
            </Drawer.Header>
            <Drawer.Body className="relay-mobile-drawer-content">
              <Drawer.Description className="city-sr-only">
                워크스페이스 탐색과 화면 설정
              </Drawer.Description>
              <SidebarContent
                {...props}
                onNavigate={(section) => {
                  setOpen(false);
                  props.onNavigate(section);
                }}
              />
            </Drawer.Body>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function NotificationPopover({ riskOrders }: { riskOrders: readonly WorkOrder[] }) {
  const riskCount = riskOrders.length;

  return (
    <Popover.Root>
      <Tooltip.Root>
        <Tooltip.Trigger
          aria-label={`알림 ${riskCount}개`}
          render={
            <Popover.Trigger
              aria-label={`알림 ${riskCount}개`}
              className="relay-icon-trigger relay-notification-trigger"
            />
          }
        >
          <Bell aria-hidden="true" size={18} strokeWidth={1.8} />
          {riskCount > 0 ? (
            <Badge
              aria-hidden="true"
              appearance="solid"
              className="relay-notification-badge"
              count={riskCount}
              tone="destructive"
            />
          ) : null}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner sideOffset={8}>
            <Tooltip.Popup>
              운영 알림
              <Tooltip.Arrow />
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
      <Popover.Portal>
        <Popover.Positioner align="end" sideOffset={8}>
          <Popover.Popup className="relay-notification-popover">
            <Popover.Title>운영 알림</Popover.Title>
            <Popover.Description>
              {riskCount > 0
                ? 'SLA 대응이 필요한 현재 작업입니다.'
                : '현재 확인이 필요한 SLA 위험 작업이 없습니다.'}
            </Popover.Description>
            {riskCount > 0 ? (
              <div className="relay-notification-list">
                {riskOrders.map((order) => (
                  <NotificationItem
                    detail={`${order.location} · ${order.updatedAt}`}
                    key={order.id}
                    title={`${order.title} 작업이 SLA ${order.progress}%에 도달했습니다.`}
                  />
                ))}
              </div>
            ) : null}
            <Popover.Arrow />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

function NotificationItem({ detail, title }: { detail: string; title: string }) {
  return (
    <div>
      <strong>{title}</strong>
      <span>{detail}</span>
    </div>
  );
}

function AccountMenu({ onNotify }: { onNotify: (title: string, description: string) => void }) {
  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label="사용자 메뉴"
        className="relay-account-trigger"
        render={<Button variant="ghost" />}
      >
        <span className="relay-avatar" aria-hidden="true">
          AK
        </span>
        <span>
          <strong>아리 김</strong>
          <small>운영 매니저</small>
        </span>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner align="end" sideOffset={6}>
          <Menu.Popup>
            <Menu.Group>
              <Menu.GroupLabel>Relay 계정</Menu.GroupLabel>
              <Menu.Item
                onClick={() =>
                  onNotify('프로필 데모', '프로필 화면은 데모 범위에 포함되지 않습니다.')
                }
              >
                프로필 보기
              </Menu.Item>
              <Menu.Item
                onClick={() =>
                  onNotify('설정 데모', '워크스페이스 설정은 단일 화면 데모에서 제공하지 않습니다.')
                }
              >
                계정 설정
              </Menu.Item>
            </Menu.Group>
            <Menu.Separator />
            <Menu.Item disabled>로그아웃</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

function ServiceHealthItem({
  description,
  label,
  value,
}: {
  description: string;
  label: string;
  value: string;
}) {
  return (
    <Accordion.Item value={value}>
      <Accordion.Header>
        <Accordion.Trigger>
          <span className="relay-health-trigger">
            <CheckCircle2 aria-hidden="true" size={17} />
            {label}
            <Badge appearance="subtle" tone="success">
              정상
            </Badge>
          </span>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel>{description}</Accordion.Panel>
    </Accordion.Item>
  );
}
