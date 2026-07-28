import { Ban, CheckCircle2, Eye, MoreHorizontal, Search } from 'lucide-react';
import {
  Badge,
  Button,
  EmptyState,
  Menu,
  Pagination,
  Table,
  type TableSortDirection,
} from '@city-ds/react';

import { isTerminalStatus, type WorkOrder } from './dashboard-data';
import { DataTableRegion, WORK_ORDER_STATUS_BADGES } from './relay-ui';

interface WorkOrderTableProps {
  compact: boolean;
  currentPage: number;
  loading: boolean;
  onComplete: (id: string) => void;
  onOpenDetails: (id: string, trigger: HTMLElement | null) => void;
  onPageChange: (page: number) => void;
  onRequestCancel: (id: string, trigger: HTMLElement | null) => void;
  onResetFilters: () => void;
  onSelectedIdsChange: (ids: string[]) => void;
  onSortDirectionChange: (direction: TableSortDirection) => void;
  orders: readonly WorkOrder[];
  selectedIds: readonly string[];
  sortDirection: TableSortDirection | false;
  totalPages: number;
}

function getMobileSlaLabel(order: WorkOrder) {
  const isSlaRisk = !isTerminalStatus(order.status) && order.progress >= 75;

  return `${isSlaRisk ? 'SLA 위험' : 'SLA'} ${order.progress}%`;
}

export function WorkOrderTable({
  compact,
  currentPage,
  loading,
  onComplete,
  onOpenDetails,
  onPageChange,
  onRequestCancel,
  onResetFilters,
  onSelectedIdsChange,
  onSortDirectionChange,
  orders,
  selectedIds,
  sortDirection,
  totalPages,
}: WorkOrderTableProps) {
  const selectableIds = orders.map((order) => order.id);
  const selectedOnPage = selectableIds.filter((id) => selectedIds.includes(id));
  const allSelected = selectableIds.length > 0 && selectedOnPage.length === selectableIds.length;
  const partiallySelected = selectedOnPage.length > 0 && !allSelected;
  const isStateView = loading || orders.length === 0;

  const selectPage = (checked: boolean) => {
    if (checked) {
      onSelectedIdsChange([...new Set([...selectedIds, ...selectableIds])]);
      return;
    }

    onSelectedIdsChange(selectedIds.filter((id) => !selectableIds.includes(id)));
  };

  const selectOrder = (id: string, checked: boolean) => {
    onSelectedIdsChange(
      checked ? [...selectedIds, id] : selectedIds.filter((selectedId) => selectedId !== id),
    );
  };

  return (
    <>
      <DataTableRegion
        hint="표를 좌우로 스크롤하여 나머지 열을 확인하십시오."
        hintId="work-order-scroll-hint"
        label="작업 요청 표 가로 스크롤 영역"
        showHint={!isStateView}
      >
        <Table.Root
          aria-label="작업 요청 목록"
          className={isStateView ? 'relay-work-order-table is-state' : 'relay-work-order-table'}
          size={compact ? 'sm' : 'md'}
          variant="line"
        >
          <Table.Caption className="city-sr-only">Relay 운영 작업 요청</Table.Caption>
          {!isStateView ? (
            <Table.Header>
              <Table.Row>
                <Table.SelectionHead
                  checked={partiallySelected ? 'indeterminate' : allSelected}
                  label="현재 페이지 작업 전체 선택"
                  onCheckedChange={selectPage}
                />
                <Table.Head>작업</Table.Head>
                <Table.Head>권역</Table.Head>
                <Table.Head>우선순위</Table.Head>
                <Table.Head>상태</Table.Head>
                <Table.Head>담당팀</Table.Head>
                <Table.Head
                  aria-sort={
                    sortDirection === false
                      ? undefined
                      : sortDirection === 'asc'
                        ? 'ascending'
                        : 'descending'
                  }
                >
                  <Table.SortButton
                    aria-label={
                      sortDirection === false
                        ? 'SLA 진행 정렬 없음'
                        : `SLA 진행 ${sortDirection === 'asc' ? '오름차순' : '내림차순'} 정렬됨`
                    }
                    direction={sortDirection}
                    onDirectionChange={onSortDirectionChange}
                  >
                    SLA 진행
                  </Table.SortButton>
                </Table.Head>
                <Table.Head>
                  <span className="city-sr-only">행 작업</span>
                </Table.Head>
              </Table.Row>
            </Table.Header>
          ) : null}
          <Table.Body>
            {loading ? (
              <Table.StateRow colSpan={8} status="loading">
                작업 요청을 새로 불러오는 중입니다.
              </Table.StateRow>
            ) : null}
            {!loading && orders.length === 0 ? (
              <Table.StateRow colSpan={8}>
                <EmptyState.Root density="compact">
                  <EmptyState.Icon>
                    <Search aria-hidden="true" />
                  </EmptyState.Icon>
                  <EmptyState.Title level={3}>조건에 맞는 작업이 없습니다</EmptyState.Title>
                  <EmptyState.Description>
                    검색어나 필터를 조정하면 다른 작업을 확인할 수 있습니다.
                  </EmptyState.Description>
                  <EmptyState.Actions>
                    <Button onClick={onResetFilters} size="sm" variant="outline">
                      필터 초기화
                    </Button>
                  </EmptyState.Actions>
                </EmptyState.Root>
              </Table.StateRow>
            ) : null}
            {!loading
              ? orders.map((order) => (
                  <Table.Row
                    data-selected={selectedIds.includes(order.id) || undefined}
                    key={order.id}
                  >
                    <Table.SelectionCell
                      checked={selectedIds.includes(order.id)}
                      label={`${order.id} 선택`}
                      onCheckedChange={(checked) => selectOrder(order.id, checked)}
                    />
                    <Table.Cell>
                      <Button
                        aria-label={`${order.id} ${order.title} 상세 보기`}
                        className="relay-primary-link"
                        data-order-details={order.id}
                        onClick={(event) => onOpenDetails(order.id, event.currentTarget)}
                        size="sm"
                        title={order.title}
                        variant="ghost"
                      >
                        <span>
                          <strong>{order.id}</strong>
                          <small>{order.title}</small>
                          <span className="relay-mobile-work-order-meta">
                            <span>상태: {order.status}</span>
                            <span aria-hidden="true">·</span>
                            <span
                              data-sla-risk={
                                (!isTerminalStatus(order.status) && order.progress >= 75) ||
                                undefined
                              }
                            >
                              {getMobileSlaLabel(order)}
                            </span>
                          </span>
                        </span>
                      </Button>
                    </Table.Cell>
                    <Table.Cell>
                      <span>{order.district}</span>
                      <small className="relay-cell-detail">{order.location}</small>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        appearance={order.priority === '긴급' ? 'subtle' : 'outline'}
                        tone={order.priority === '긴급' ? 'destructive' : 'neutral'}
                      >
                        {order.priority}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge {...WORK_ORDER_STATUS_BADGES[order.status]}>{order.status}</Badge>
                    </Table.Cell>
                    <Table.Cell>{order.crew}</Table.Cell>
                    <Table.Cell>
                      <span className="relay-sla-cell">
                        <strong>{order.progress}%</strong>
                        <small>{order.slaDueAt}</small>
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Menu.Root>
                        <Menu.Trigger
                          aria-label={`${order.id} 작업 메뉴`}
                          className="relay-icon-trigger relay-row-menu-trigger"
                          data-order-menu={order.id}
                        >
                          <MoreHorizontal aria-hidden="true" size={17} strokeWidth={1.8} />
                        </Menu.Trigger>
                        <Menu.Portal>
                          <Menu.Positioner align="end" sideOffset={6}>
                            <Menu.Popup>
                              <Menu.Item
                                onClick={() =>
                                  onOpenDetails(
                                    order.id,
                                    document.querySelector<HTMLElement>(
                                      `[data-order-details="${order.id}"]`,
                                    ),
                                  )
                                }
                              >
                                <Eye aria-hidden="true" size={16} />
                                상세 보기
                              </Menu.Item>
                              <Menu.Item
                                disabled={order.status === '완료' || order.status === '취소'}
                                onClick={() => onComplete(order.id)}
                              >
                                <CheckCircle2 aria-hidden="true" size={16} />
                                완료 처리
                              </Menu.Item>
                              <Menu.Separator />
                              <Menu.Item
                                disabled={isTerminalStatus(order.status)}
                                onClick={() =>
                                  onRequestCancel(
                                    order.id,
                                    document.querySelector<HTMLElement>(
                                      `[data-order-menu="${order.id}"]`,
                                    ),
                                  )
                                }
                                variant="destructive"
                              >
                                <Ban aria-hidden="true" size={16} />
                                작업 취소
                              </Menu.Item>
                            </Menu.Popup>
                          </Menu.Positioner>
                        </Menu.Portal>
                      </Menu.Root>
                    </Table.Cell>
                  </Table.Row>
                ))
              : null}
          </Table.Body>
        </Table.Root>
      </DataTableRegion>

      {!loading && totalPages > 1 ? (
        <div className="relay-pagination">
          <span>
            {selectedIds.length > 0
              ? `${selectedIds.length}개 선택됨`
              : '작업을 선택할 수 있습니다'}
          </span>
          <Pagination.Root
            aria-label="작업 요청 페이지"
            labels={{
              first: '첫 페이지로',
              previous: '이전 페이지로',
              previousGroup: (count) => `${count}페이지 뒤로`,
              page: (page) => `${page}페이지`,
              nextGroup: (count) => `${count}페이지 앞으로`,
              next: '다음 페이지로',
              last: '마지막 페이지로',
            }}
            onPageChange={onPageChange}
            page={currentPage}
            totalPages={totalPages}
          />
        </div>
      ) : null}
    </>
  );
}
