import type { ReactNode } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { Progress, Skeleton, Table, Toolbar, type BadgeProps } from '@city-ds/react';

import type { AssetStatus, MaintenanceStatus, WorkOrderStatus } from './dashboard-data';

export type BadgePresentation = Pick<BadgeProps, 'appearance' | 'tone'>;

export const WORK_ORDER_STATUS_BADGES: Record<WorkOrderStatus, BadgePresentation> = {
  접수: { appearance: 'outline', tone: 'neutral' },
  배정됨: { appearance: 'outline', tone: 'info' },
  '진행 중': { appearance: 'solid', tone: 'info' },
  대기: { appearance: 'outline', tone: 'warning' },
  완료: { appearance: 'subtle', tone: 'success' },
  취소: { appearance: 'subtle', tone: 'destructive' },
};

export const ASSET_STATUS_BADGES: Record<AssetStatus, BadgePresentation> = {
  정상: { appearance: 'subtle', tone: 'success' },
  '점검 필요': { appearance: 'outline', tone: 'warning' },
  '운영 중단': { appearance: 'subtle', tone: 'destructive' },
};

export const MAINTENANCE_STATUS_BADGES: Record<MaintenanceStatus, BadgePresentation> = {
  예정: { appearance: 'outline', tone: 'neutral' },
  '준비 중': { appearance: 'outline', tone: 'info' },
  '진행 중': { appearance: 'solid', tone: 'info' },
  완료: { appearance: 'subtle', tone: 'success' },
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
