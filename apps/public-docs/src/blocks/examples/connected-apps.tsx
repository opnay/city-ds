import { DataList } from '@opnay/city-ds-react/data-list';
import { useRef, useState } from 'react';
import { Button } from '@opnay/city-ds-react/button';
import { Skeleton } from '@opnay/city-ds-react/skeleton';
import { BlockCard } from './block-card';
import { AccountActionDialog } from './user-management-shared';

export interface ConnectedApp {
  id: string;
  name: string;
  permissions: readonly string[];
  connectedAt: string;
}

export function ConnectedApps({
  apps,
  onDisconnect,
  canManage = true,
  loading = false,
  error,
  onRetry,
}: {
  apps: readonly ConnectedApp[];
  onDisconnect: (id: string) => Promise<void>;
  canManage?: boolean;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
}) {
  const [selected, setSelected] = useState<ConnectedApp | null>(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const status = useRef<HTMLParagraphElement>(null);
  const returnFocus = useRef<HTMLElement>(null);
  return (
    <BlockCard
      title="연결된 앱 관리"
      description="계정 데이터에 접근할 수 있는 외부 앱과 허용한 권한을 확인하십시오."
    >
      {!loading && !error && (
        <p ref={status} tabIndex={-1} role="status" className="city-block-status">
          연결된 앱 {apps.length}개
        </p>
      )}
      {!loading && !error && message && <p className="city-block-status">{message}</p>}
      {loading ? (
        <Skeleton aria-label="연결된 앱 불러오는 중" className="h-24 w-full" />
      ) : error ? (
        <div role="alert" className="city-block-section">
          <p>{error}</p>
          {onRetry && (
            <Button variant="outline" onClick={onRetry}>
              다시 불러오기
            </Button>
          )}
        </div>
      ) : !apps.length ? (
        <p className="city-block-status">
          연결된 앱이 없습니다. 앱에 접근을 허용하면 여기에 표시됩니다.
        </p>
      ) : (
        <ul className="city-block-list">
          {apps.map((app) => (
            <li key={app.id} className="grid min-w-0 gap-2">
              <div className="flex items-center justify-between gap-3">
                <strong className="break-all">{app.name}</strong>
                {canManage && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                    aria-label={`${app.name} 연결 해제`}
                    onClick={(event) => {
                      returnFocus.current = event.currentTarget;
                      setSelected(app);
                      setOpen(true);
                    }}
                  >
                    연결 해제
                  </Button>
                )}
              </div>
              <DataList.Root density="compact" className="city-block-connected-app-details">
                <DataList.Item>
                  <DataList.Label>허용한 권한</DataList.Label>
                  <DataList.Value>
                    <ul className="m-0 flex list-none flex-wrap gap-x-3 gap-y-1 p-0">
                      {app.permissions.map((permission) => (
                        <li key={permission}>{permission}</li>
                      ))}
                    </ul>
                  </DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label>연결일</DataList.Label>
                  <DataList.Value>{app.connectedAt}</DataList.Value>
                </DataList.Item>
              </DataList.Root>
            </li>
          ))}
        </ul>
      )}
      {!canManage && <p className="city-block-status">연결을 해제할 권한이 없습니다.</p>}
      <AccountActionDialog
        finalFocus={returnFocus}
        open={open}
        onOpenChange={setOpen}
        title="앱 연결을 해제하시겠습니까?"
        description={`${selected?.name ?? ''}의 새로운 데이터 접근을 차단합니다. 이미 전달된 데이터는 해당 앱의 정책에 따라 남아 있을 수 있습니다.`}
        confirmLabel="연결 해제"
        destructive
        onConfirm={async () => {
          if (!selected || !canManage) throw new Error('Unavailable');
          await onDisconnect(selected.id);
          setMessage(`${selected.name} 연결을 해제했습니다.`);
          returnFocus.current = status.current;
        }}
      />
    </BlockCard>
  );
}

export const exampleConnectedApps: readonly ConnectedApp[] = [
  {
    id: 'calendar',
    name: '일정 도우미',
    permissions: ['기본 프로필 읽기', '일정 읽기 및 작성'],
    connectedAt: '2026. 9. 1.',
  },
  {
    id: 'reports',
    name: '리포트 내보내기',
    permissions: ['기본 프로필 읽기', '팀 활동 읽기'],
    connectedAt: '2026. 8. 12.',
  },
];

export default function ConnectedAppsExample() {
  const [apps, setApps] = useState(exampleConnectedApps);
  return (
    <ConnectedApps
      apps={apps}
      onDisconnect={async (id) => setApps((current) => current.filter((app) => app.id !== id))}
    />
  );
}
