import type { ComponentProps, ReactNode } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { Progress, Skeleton, Table, Toolbar, type Badge } from '@city-ds/react';

import type { AssetStatus, MaintenanceStatus, WorkOrderStatus } from './dashboard-data';

export type BadgeVariant = NonNullable<ComponentProps<typeof Badge>['variant']>;

export const WORK_ORDER_STATUS_VARIANTS: Record<WorkOrderStatus, BadgeVariant> = {
  접수: 'outline',
  배정됨: 'subtle',
  '진행 중': 'solid',
  대기: 'outline',
  완료: 'subtle',
  취소: 'destructive',
};

export const ASSET_STATUS_VARIANTS: Record<AssetStatus, BadgeVariant> = {
  정상: 'subtle',
  '점검 필요': 'outline',
  '운영 중단': 'destructive',
};

export const MAINTENANCE_STATUS_VARIANTS: Record<MaintenanceStatus, BadgeVariant> = {
  예정: 'outline',
  '준비 중': 'outline',
  '진행 중': 'solid',
  완료: 'subtle',
};

interface FilterBarProps {
  actions?: ReactNode;
  children: ReactNode;
  label: string;
  surface?: 'embedded' | 'standalone';
}

export function FilterBar({ actions, children, label, surface = 'embedded' }: FilterBarProps) {
  return (
    <Toolbar.Root
      appearance={surface === 'embedded' ? 'band' : 'outline'}
      aria-label={label}
      className={`relay-filter-bar relay-filter-bar--${surface}`}
      size="sm"
    >
      {children}
      {actions ? (
        <>
          <Toolbar.Separator />
          <div className="relay-filter-bar-actions">{actions}</div>
        </>
      ) : null}
    </Toolbar.Root>
  );
}

interface MetricItemProps {
  detail: string;
  label: string;
  loading?: boolean;
  progress?: number;
  value: string;
}

export function MetricItem({ detail, label, loading = false, progress, value }: MetricItemProps) {
  return (
    <article className="relay-metric">
      <span>{label}</span>
      {loading ? (
        <div aria-hidden="true" className="relay-metric-skeleton">
          <Skeleton size="lg" />
          <Skeleton size="sm" />
        </div>
      ) : (
        <>
          <strong>{value}</strong>
          <small>{detail}</small>
          {progress === undefined ? null : (
            <Progress.Root aria-label={`${label} ${value}`} size="sm" value={progress}>
              <Progress.Track>
                <Progress.Indicator />
              </Progress.Track>
            </Progress.Root>
          )}
        </>
      )}
    </article>
  );
}

interface DataTableRegionProps {
  children: ReactNode;
  hintId: string;
  label: string;
  showHint?: boolean;
}

export function DataTableRegion({
  children,
  hintId,
  label,
  showHint = true,
}: DataTableRegionProps) {
  return (
    <div className="relay-table-region">
      {showHint ? (
        <p className="relay-table-scroll-hint" id={hintId}>
          <ArrowLeftRight aria-hidden="true" size={16} />
          표를 좌우로 스크롤하여 나머지 열을 확인하십시오.
        </p>
      ) : null}
      <Table.ScrollArea
        appearance="plain"
        aria-describedby={showHint ? hintId : undefined}
        aria-label={label}
        className="relay-table-scroll-area"
        role="region"
      >
        {children}
      </Table.ScrollArea>
    </div>
  );
}
