import { Clock3, SearchX, UserRound } from 'lucide-react';
import {
  Badge,
  Button,
  DataTableRegion,
  Drawer,
  EmptyState,
  Table,
  type TableSortDirection,
} from '@opnay/city-ds-react';

import type { SortDirection, WorkOrder, WorkOrderRisk, WorkOrderStatus } from './operations-data';

interface WorkOrderTableProps {
  isRefreshing: boolean;
  onResetFilters: () => void;
  onSelect: (workOrderId: string) => void;
  onSortDirectionChange: (direction: TableSortDirection) => void;
  rows: readonly WorkOrder[];
  sortDirection: SortDirection;
}

const statusPresentation: Record<
  WorkOrderStatus,
  { appearance: 'outline' | 'subtle'; tone: 'neutral' | 'info' | 'success' | 'warning' }
> = {
  접수: { appearance: 'subtle', tone: 'warning' },
  배정됨: { appearance: 'outline', tone: 'info' },
  '진행 중': { appearance: 'subtle', tone: 'info' },
  대기: { appearance: 'outline', tone: 'warning' },
  완료: { appearance: 'subtle', tone: 'success' },
};

const riskContent: Record<
  WorkOrderRisk,
  { appearance: 'outline'; label: string; tone: 'destructive' | 'neutral' | 'warning' }
> = {
  critical: { appearance: 'outline', label: '긴급', tone: 'destructive' },
  high: { appearance: 'outline', label: '높음', tone: 'warning' },
  normal: { appearance: 'outline', label: '일반', tone: 'neutral' },
};

export function WorkOrderTable({
  isRefreshing,
  onResetFilters,
  onSelect,
  onSortDirectionChange,
  rows,
  sortDirection,
}: WorkOrderTableProps) {
  return (
    <DataTableRegion
      hint="모든 열을 보려면 표를 가로로 스크롤하세요."
      label="현장 작업 표 가로 스크롤 영역"
    >
      <Table.Root
        aria-busy={isRefreshing}
        aria-label="현장 작업 목록"
        className="city-ops-table"
        size="sm"
      >
        <Table.Caption>2026년 8월 1일 서울 현장 작업 목록</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.Head className="city-ops-col-risk">위험도</Table.Head>
            <Table.Head>작업</Table.Head>
            <Table.Head className="city-ops-col-district">자치구</Table.Head>
            <Table.Head className="city-ops-col-crew">담당팀</Table.Head>
            <Table.Head
              aria-sort={
                sortDirection === 'asc'
                  ? 'ascending'
                  : sortDirection === 'desc'
                    ? 'descending'
                    : 'none'
              }
              className="city-ops-col-sla"
            >
              <Table.SortButton direction={sortDirection} onDirectionChange={onSortDirectionChange}>
                SLA
              </Table.SortButton>
            </Table.Head>
            <Table.Head className="city-ops-col-status">상태</Table.Head>
            <Table.Head className="city-ops-col-updated">최근 변경</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.length === 0 ? (
            <Table.StateRow colSpan={7}>
              <EmptyState.Root density="compact">
                <EmptyState.Icon>
                  <SearchX aria-hidden="true" />
                </EmptyState.Icon>
                <EmptyState.Title level={3}>조건에 맞는 작업이 없습니다.</EmptyState.Title>
                <EmptyState.Description>
                  검색어나 필터를 바꾸면 다른 작업을 확인할 수 있습니다.
                </EmptyState.Description>
                <EmptyState.Actions>
                  <Button onClick={onResetFilters} size="sm" type="button" variant="outline">
                    필터 초기화
                  </Button>
                </EmptyState.Actions>
              </EmptyState.Root>
            </Table.StateRow>
          ) : (
            rows.map((order) => {
              const risk = riskContent[order.risk];
              const status = statusPresentation[order.status];

              return (
                <Table.Row key={order.id}>
                  <Table.Cell>
                    <Badge appearance={risk.appearance} size="sm" tone={risk.tone}>
                      {risk.label}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="city-ops-order-cell">
                      <Drawer.Trigger
                        aria-label={`${order.id} ${order.title} 상세 보기`}
                        onClick={() => onSelect(order.id)}
                        render={<Button size="sm" variant="ghost" />}
                      >
                        <span className="city-ops-order-id">{order.id}</span>
                      </Drawer.Trigger>
                      <span>{order.title}</span>
                      <small>{order.location}</small>
                    </div>
                  </Table.Cell>
                  <Table.Cell>{order.district}</Table.Cell>
                  <Table.Cell>
                    {order.crew === null ? (
                      <Badge appearance="outline" size="sm" tone="warning">
                        미배정
                      </Badge>
                    ) : (
                      <span className="city-ops-crew">
                        <UserRound aria-hidden="true" size={14} strokeWidth={1.8} />
                        {order.crew}
                      </span>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span className="city-ops-sla">
                      <Clock3 aria-hidden="true" size={14} strokeWidth={1.8} />
                      {order.dueLabel}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge appearance={status.appearance} size="sm" tone={status.tone}>
                      {order.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell className="city-ops-updated-cell">{order.updatedAt}</Table.Cell>
                </Table.Row>
              );
            })
          )}
        </Table.Body>
      </Table.Root>
    </DataTableRegion>
  );
}
