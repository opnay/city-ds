import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import {
  Alert,
  Button,
  DensityProvider,
  Drawer,
  Field,
  FilterBar,
  Pagination,
  SearchInput,
  Select,
  Toaster,
  toast,
  type CityTheme,
  type TableSortDirection,
} from '@opnay/city-ds-react';

import { AppShell, getDashboardRoute, useDashboardPath } from './app-shell';
import { DashboardPage } from './dashboard-pages';
import {
  assignCrew,
  countAttentionOrders,
  DISTRICT_ITEMS,
  INITIAL_WORK_ORDERS,
  selectWorkOrders,
  STATUS_ITEMS,
  type Crew,
  type DistrictFilter,
  type SortDirection,
  type StatusFilter,
  type WorkOrder,
  type WorkOrderStatus,
} from './operations-data';
import { WorkOrderTable } from './work-order-table';

const PAGE_SIZE = 6;
const WorkOrderDetails = lazy(async () => {
  const module = await import('./work-order-overlays');
  return { default: module.WorkOrderDetails };
});

export function App() {
  const { navigate, pathname } = useDashboardPath();
  const [theme, setTheme] = useState<CityTheme>('system');
  const route = getDashboardRoute(pathname);

  useEffect(() => {
    if (theme === 'system') {
      delete document.documentElement.dataset.theme;
      return;
    }

    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    document.title = `${route?.label ?? '페이지 없음'} · 서울 도시운영`;
  }, [route?.label]);

  return (
    <>
      <AppShell navigate={navigate} onThemeChange={setTheme} pathname={pathname} theme={theme}>
        {pathname === '/work-orders' ? (
          <OperationsPage />
        ) : (
          <DashboardPage navigate={navigate} pathname={pathname} />
        )}
      </AppShell>
      <Toaster />
    </>
  );
}

function OperationsPage() {
  const refreshTimerRef = useRef<number | null>(null);
  const [orders, setOrders] = useState<WorkOrder[]>(() => [...INITIAL_WORK_ORDERS]);
  const [queryDraft, setQueryDraft] = useState('');
  const [query, setQuery] = useState('');
  const [district, setDistrict] = useState<DistrictFilter>('전체 자치구');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [sortDirection, setSortDirection] = useState<SortDirection>(false);
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('10:02');

  useEffect(
    () => () => {
      if (refreshTimerRef.current !== null) {
        window.clearTimeout(refreshTimerRef.current);
      }
    },
    [],
  );

  const visibleOrders = useMemo(
    () => selectWorkOrders(orders, { district, query, sortDirection, status }),
    [district, orders, query, sortDirection, status],
  );
  const priorityOrders = useMemo(
    () =>
      selectWorkOrders(orders, {
        district: '전체 자치구',
        query: '',
        sortDirection: false,
        status: 'attention',
      }),
    [orders],
  );
  const attentionCount = countAttentionOrders(orders);
  const totalPages = Math.max(1, Math.ceil(visibleOrders.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pagedOrders = visibleOrders.slice(pageStart, pageStart + PAGE_SIZE);
  const selectedOrder = orders.find((order) => order.id === selectedId) ?? null;
  const firstPriorityOrder = priorityOrders[0] ?? null;

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const resetFilters = () => {
    setQueryDraft('');
    setQuery('');
    setDistrict('전체 자치구');
    setStatus('all');
    setSortDirection(false);
    setPage(1);
  };

  const refreshOrders = () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    if (refreshTimerRef.current !== null) window.clearTimeout(refreshTimerRef.current);

    refreshTimerRef.current = window.setTimeout(() => {
      setLastUpdated('10:07');
      setIsRefreshing(false);
      refreshTimerRef.current = null;
      toast.success('작업 목록을 갱신했습니다.', {
        description: '표시 중인 작업과 필터는 그대로 유지했습니다.',
      });
    }, 650);
  };

  const assignSelectedCrew = (workOrderId: string, crew: Crew) => {
    setOrders((currentOrders) => assignCrew(currentOrders, workOrderId, crew));
    toast.success('담당팀 배정 완료', {
      description: `${workOrderId} 작업을 ${crew}에 배정했습니다.`,
    });
  };

  const advanceWorkOrder = (workOrderId: string) => {
    const currentOrder = orders.find((order) => order.id === workOrderId);
    if (!currentOrder) return;

    const nextStatus: WorkOrderStatus | null =
      currentOrder.status === '배정됨'
        ? '진행 중'
        : currentOrder.status === '진행 중'
          ? '완료'
          : null;

    if (nextStatus === null) return;

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === workOrderId
          ? {
              ...order,
              activities: [
                {
                  at: '10:08',
                  description:
                    nextStatus === '진행 중'
                      ? `${order.crew}이 현장 작업을 시작했습니다.`
                      : '현장 조치와 확인을 마치고 작업을 완료했습니다.',
                },
                ...order.activities,
              ],
              blocker: nextStatus === '진행 중' ? undefined : order.blocker,
              dueLabel: nextStatus === '완료' ? '기한 내 완료' : order.dueLabel,
              risk: nextStatus === '완료' ? 'normal' : order.risk,
              status: nextStatus,
              updatedAt: '방금 전',
            }
          : order,
      ),
    );

    toast.success(nextStatus === '진행 중' ? '현장 작업 시작' : '작업 완료', {
      description:
        nextStatus === '진행 중'
          ? `${workOrderId} 작업을 진행 상태로 변경했습니다.`
          : `${workOrderId} 작업을 완료 처리했습니다.`,
    });
  };

  return (
    <Drawer.Root
      open={drawerOpen}
      onOpenChange={(nextOpen) => setDrawerOpen(nextOpen)}
      swipeDirection="right"
    >
      <div className="city-ops-page">
        <section className="city-ops-page-heading" id="operations">
          <div>
            <p className="city-ops-page-meta">2026년 8월 1일 토요일 · 주간 근무</p>
            <h1>현장 작업</h1>
            <p>SLA 위험 작업을 먼저 확인하고, 담당팀 배정부터 완료까지 한 흐름에서 처리합니다.</p>
          </div>
          {firstPriorityOrder ? (
            <Drawer.Trigger
              onClick={() => setSelectedId(firstPriorityOrder.id)}
              render={<Button />}
            >
              최우선 작업 열기
            </Drawer.Trigger>
          ) : null}
        </section>

        {attentionCount > 0 ? (
          <Alert.Root appearance="subtle" tone="warning">
            <Alert.Title level={2}>조치 확인이 필요한 작업 {attentionCount}건</Alert.Title>
            <Alert.Description>
              SLA 위험 또는 담당팀 미배정 상태입니다. 위험 작업부터 담당 범위와 다음 단계를
              확인하십시오.
            </Alert.Description>
            <Alert.Action>
              <Button
                onClick={() => {
                  setStatus('attention');
                  setPage(1);
                }}
                size="sm"
                type="button"
                variant="outline"
              >
                조치 필요만 보기
              </Button>
            </Alert.Action>
          </Alert.Root>
        ) : null}

        <section aria-labelledby="work-list-heading" className="city-ops-work-list">
          <div className="city-ops-section-heading">
            <div>
              <h2 id="work-list-heading">작업 목록</h2>
              <p>필터 결과 {visibleOrders.length}건</p>
            </div>
            <div className="city-ops-refresh-group">
              <span id="refresh-status">
                {isRefreshing
                  ? '작업 목록 갱신 중 · 기존 데이터 유지'
                  : `마지막 갱신 ${lastUpdated}`}
              </span>
              <Button
                aria-describedby="refresh-status"
                disabled={isRefreshing}
                onClick={refreshOrders}
                size="sm"
                type="button"
                variant="ghost"
              >
                <RefreshCw
                  aria-hidden="true"
                  className={isRefreshing ? 'city-ops-spin' : undefined}
                  size={15}
                  strokeWidth={1.8}
                />
                {isRefreshing ? '갱신 중' : '새로고침'}
              </Button>
            </div>
          </div>

          <DensityProvider density="compact">
            <FilterBar
              actions={
                <Button onClick={resetFilters} size="sm" type="button" variant="outline">
                  필터 초기화
                </Button>
              }
              appearance="band"
              aria-label="현장 작업 필터"
            >
              <Field.Root className="city-ops-search-input">
                <Field.Label className="city-sr-only">작업 검색</Field.Label>
                <SearchInput.Root
                  onSubmit={(value) => {
                    setQuery(value);
                    setPage(1);
                  }}
                  onValueChange={(value) => {
                    setQueryDraft(value);
                    if (value.length === 0) {
                      setQuery('');
                      setPage(1);
                    }
                  }}
                  size="sm"
                  value={queryDraft}
                >
                  <SearchInput.Group>
                    <SearchInput.Input placeholder="작업 번호, 위치, 제목 검색" />
                    <SearchInput.Clear aria-label="검색어 지우기" />
                    <SearchInput.Submit aria-label="작업 검색 실행" />
                  </SearchInput.Group>
                </SearchInput.Root>
              </Field.Root>

              <Select.Root
                items={DISTRICT_ITEMS}
                onValueChange={(value) => {
                  setDistrict((value as DistrictFilter | null) ?? '전체 자치구');
                  setPage(1);
                }}
                size="sm"
                value={district}
              >
                <Select.Label className="city-sr-only">자치구</Select.Label>
                <Select.Trigger className="city-ops-filter-select">
                  <Select.Value />
                  <Select.Icon />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Positioner sideOffset={6}>
                    <Select.Popup>
                      <Select.List>
                        {Object.entries(DISTRICT_ITEMS).map(([value, label]) => (
                          <Select.Item key={value} value={value}>
                            <Select.ItemIndicator />
                            <Select.ItemText>{label}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.List>
                    </Select.Popup>
                  </Select.Positioner>
                </Select.Portal>
              </Select.Root>

              <Select.Root
                items={STATUS_ITEMS}
                onValueChange={(value) => {
                  setStatus((value as StatusFilter | null) ?? 'all');
                  setPage(1);
                }}
                size="sm"
                value={status}
              >
                <Select.Label className="city-sr-only">작업 상태</Select.Label>
                <Select.Trigger className="city-ops-filter-select">
                  <Select.Value />
                  <Select.Icon />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Positioner sideOffset={6}>
                    <Select.Popup>
                      <Select.List>
                        {Object.entries(STATUS_ITEMS).map(([value, label]) => (
                          <Select.Item key={value} value={value}>
                            <Select.ItemIndicator />
                            <Select.ItemText>{label}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.List>
                    </Select.Popup>
                  </Select.Positioner>
                </Select.Portal>
              </Select.Root>
            </FilterBar>

            <WorkOrderTable
              isRefreshing={isRefreshing}
              onResetFilters={resetFilters}
              onSelect={setSelectedId}
              onSortDirectionChange={(direction: TableSortDirection) => {
                setSortDirection(direction);
                setPage(1);
              }}
              rows={pagedOrders}
              sortDirection={sortDirection}
            />

            <footer className="city-ops-table-footer">
              <p>
                전체 {visibleOrders.length}건
                {visibleOrders.length > 0
                  ? ` · ${pageStart + 1}–${Math.min(pageStart + PAGE_SIZE, visibleOrders.length)} 표시`
                  : ''}
              </p>
              {totalPages > 1 ? (
                <Pagination.Root
                  aria-label="현장 작업 페이지"
                  labels={{
                    first: '첫 페이지로',
                    last: '마지막 페이지로',
                    navigation: '현장 작업 페이지',
                    next: '다음 페이지로',
                    nextGroup: (count) => `${count}페이지 앞으로`,
                    page: (targetPage) => `${targetPage}페이지`,
                    previous: '이전 페이지로',
                    previousGroup: (count) => `${count}페이지 뒤로`,
                  }}
                  onPageChange={setPage}
                  page={currentPage}
                  totalPages={totalPages}
                />
              ) : null}
            </footer>
          </DensityProvider>
        </section>

        {selectedOrder ? (
          <Suspense
            fallback={
              <span className="city-sr-only" role="status">
                작업 상세 불러오는 중
              </span>
            }
          >
            <WorkOrderDetails
              onAdvance={advanceWorkOrder}
              onAssign={assignSelectedCrew}
              order={selectedOrder}
            />
          </Suspense>
        ) : null}
      </div>
    </Drawer.Root>
  );
}
