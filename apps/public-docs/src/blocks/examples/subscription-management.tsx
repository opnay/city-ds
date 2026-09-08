import { DataList } from '@opnay/city-ds-react/data-list';
import { useRef, useState } from 'react';
import { toast } from '@opnay/city-ds-react/toast';
import { Button } from '@opnay/city-ds-react/button';
import { Badge } from '@opnay/city-ds-react/badge';
import { Dialog } from '@opnay/city-ds-react/dialog';
import { Alert } from '@opnay/city-ds-react/alert';
import { Skeleton } from '@opnay/city-ds-react/skeleton';
import { BlockCard } from './block-card';
import './blocks.css';

export type SubscriptionStatus = 'free' | 'active' | 'trial' | 'past-due' | 'canceling';
export type SubscriptionAction = 'cancel' | 'resume' | 'retry';
export interface SubscriptionSnapshot {
  status: SubscriptionStatus;
  plan: string;
  price: string;
  renewalDate: string;
  accessUntil: string;
}
const labels: Record<SubscriptionStatus, string> = {
  free: '무료',
  active: '구독 중',
  trial: '체험 중',
  'past-due': '결제 실패',
  canceling: '해지 예약',
};

export function SubscriptionManagement({
  subscription,
  planSelectionHref,
  onPlanSelection,
  loading = false,
  canManage = true,
  onAction,
}: {
  subscription: SubscriptionSnapshot;
  planSelectionHref: string;
  onPlanSelection?: () => void;
  loading?: boolean;
  canManage?: boolean;
  onAction: (action: SubscriptionAction) => Promise<void>;
}) {
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const lock = useRef(false);
  const actionButtonRef = useRef<HTMLButtonElement>(null);
  const { status, plan, price, renewalDate, accessUntil } = subscription;
  async function run(action: SubscriptionAction) {
    if (lock.current || loading || !canManage) return;
    lock.current = true;
    setBusy(true);
    setError('');
    try {
      await onAction(action);
      setConfirm(false);
    } catch {
      setError('현재 상태는 유지했어요. 다시 시도해 주세요.');
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  const tone =
    status === 'past-due'
      ? 'destructive'
      : status === 'trial' || status === 'canceling'
        ? 'warning'
        : 'neutral';
  if (loading)
    return (
      <BlockCard title="구독 관리">
        <div className="city-block-section" aria-busy="true" aria-label="구독 불러오는 중">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-24 w-full" />
        </div>
      </BlockCard>
    );
  return (
    <BlockCard title="구독 관리" description="현재 플랜과 다음 결제 일정을 확인해 주세요.">
      <DataList.Root density="compact" className="city-text-supporting">
        <DataList.Item>
          <DataList.Label>현재 플랜</DataList.Label>
          <DataList.Value>{plan}</DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label>상태</DataList.Label>
          <DataList.Value>
            <Badge tone={tone} appearance="subtle">
              {labels[status]}
            </Badge>
          </DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label>{status === 'free' ? '이용 요금' : '결제 금액'}</DataList.Label>
          <DataList.Value>{price}</DataList.Value>
        </DataList.Item>
        {status !== 'free' && (
          <DataList.Item>
            <DataList.Label>
              {status === 'canceling' || status === 'past-due'
                ? '이용 종료일'
                : status === 'trial'
                  ? '체험 종료일'
                  : '다음 결제일'}
            </DataList.Label>
            <DataList.Value>{status === 'active' ? renewalDate : accessUntil}</DataList.Value>
          </DataList.Item>
        )}
      </DataList.Root>
      {(status === 'trial' || status === 'canceling' || status === 'past-due') && (
        <Alert.Root tone={tone} appearance="subtle">
          <Alert.Title level={4}>
            {status === 'past-due'
              ? '결제를 완료하지 못했어요.'
              : status === 'canceling'
                ? '해지를 예약했어요.'
                : '체험 종료 후 자동 결제해요.'}
          </Alert.Title>
          <Alert.Description>
            {status === 'past-due'
              ? `${accessUntil}까지 결제를 다시 시도해 주세요.`
              : status === 'canceling'
                ? `${accessUntil}까지 이용할 수 있어요. 이후 무료 플랜으로 바뀌며 자동 결제하지 않아요.`
                : `체험 종료 전에 해지를 예약하지 않으면 ${renewalDate}부터 위 금액으로 자동 결제해요.`}
          </Alert.Description>
        </Alert.Root>
      )}
      {!canManage && (
        <Alert.Root tone="info" appearance="subtle">
          <Alert.Title level={4}>관리자만 구독을 변경할 수 있어요.</Alert.Title>
          <Alert.Description>변경이 필요하면 관리자에게 요청해 주세요.</Alert.Description>
        </Alert.Root>
      )}
      {error && !confirm && (
        <Alert.Root tone="destructive" appearance="subtle">
          <Alert.Title level={4}>변경하지 못했어요.</Alert.Title>
          <Alert.Description>{error}</Alert.Description>
        </Alert.Root>
      )}
      <div className="city-block-actions">
        {status !== 'past-due' && (
          <Button
            nativeButton={!!onPlanSelection}
            role={onPlanSelection ? 'button' : 'link'}
            render={onPlanSelection ? <button type="button" /> : <a href={planSelectionHref} />}
            onClick={onPlanSelection}
            variant={
              status === 'free' || status === 'active' || status === 'trial' ? 'primary' : 'outline'
            }
            disabled={busy || !canManage}
          >
            {status === 'free' ? '플랜 선택' : '플랜 변경'}
          </Button>
        )}
        {status !== 'free' && (
          <Button
            ref={actionButtonRef}
            variant={status === 'active' || status === 'trial' ? 'outline' : 'primary'}
            disabled={busy || !canManage}
            onClick={() => {
              if (status === 'past-due') {
                void run('retry');
                return;
              }
              if (status === 'canceling') {
                void run('resume');
                return;
              }
              setError('');
              setConfirm(true);
            }}
          >
            {busy
              ? status === 'past-due'
                ? '결제 중…'
                : '처리 중…'
              : status === 'past-due'
                ? '결제 다시 시도'
                : status === 'canceling'
                  ? '해지 예약 취소'
                  : '해지 예약'}
          </Button>
        )}
      </div>
      <Dialog.Root
        open={confirm}
        onOpenChange={(open) => {
          if (!busy) {
            setConfirm(open);
            setError('');
          }
        }}
      >
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Viewport>
            <Dialog.Popup finalFocus={actionButtonRef} size="sm" scroll="body">
              <Dialog.Header>
                <Dialog.Title>구독 해지를 예약할까요?</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body className="city-block-section">
                <Dialog.Description>
                  {accessUntil}까지 이용할 수 있어요. 이후 무료 플랜으로 바뀌며 자동 결제하지
                  않아요.
                </Dialog.Description>
                {error && (
                  <Alert.Root tone="destructive" appearance="subtle">
                    <Alert.Title level={3}>해지를 예약하지 못했어요.</Alert.Title>
                    <Alert.Description>{error}</Alert.Description>
                  </Alert.Root>
                )}
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.Close render={<Button variant="outline" disabled={busy || !canManage} />}>
                  닫기
                </Dialog.Close>
                <Button
                  variant="destructive"
                  disabled={busy || !canManage}
                  onClick={() => {
                    void run('cancel');
                  }}
                >
                  {busy ? '처리 중…' : '해지 예약'}
                </Button>
              </Dialog.Footer>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    </BlockCard>
  );
}

export default function SubscriptionManagementExample({
  scenario = 'active',
}: {
  scenario?: SubscriptionStatus;
}) {
  return <SubscriptionScenario key={scenario} scenario={scenario} />;
}

function SubscriptionScenario({ scenario }: { scenario: SubscriptionStatus }) {
  const [status, setStatus] = useState<SubscriptionStatus>(scenario);
  return (
    <div className="city-block-section">
      <SubscriptionManagement
        key={scenario}
        subscription={{
          status,
          plan: status === 'free' ? 'Free' : 'Pro',
          price: status === 'free' ? '무료' : '월 29,000원 · 부가세 포함',
          renewalDate: '2026년 10월 8일',
          accessUntil: '2026년 10월 7일',
        }}
        planSelectionHref="/blocks/plan-selection"
        onPlanSelection={() => toast.info('플랜 변경 버튼을 눌렀어요.')}
        onAction={async (action) => {
          setStatus(
            action === 'cancel'
              ? 'canceling'
              : scenario === 'trial' && action === 'resume'
                ? 'trial'
                : 'active',
          );
          toast.success(
            action === 'cancel'
              ? '해지를 예약했어요.'
              : action === 'resume'
                ? '해지 예약을 취소했어요.'
                : '결제 성공 상태로 바꿨어요. 실제 결제는 진행하지 않아요.',
          );
        }}
      />
    </div>
  );
}
