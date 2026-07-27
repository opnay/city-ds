import { Progress, Skeleton, type BadgeProps } from '@city-ds/react';

import type { AssetStatus, MaintenanceStatus, WorkOrderStatus } from './dashboard-data';

export { DataTableRegion, FilterBar } from '@city-ds/react';

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
