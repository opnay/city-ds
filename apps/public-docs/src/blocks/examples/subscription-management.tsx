import { useRef, useState } from 'react';
import { Button } from '@opnay/city-ds-react/button';
import { Badge } from '@opnay/city-ds-react/badge';
import { AlertDialog } from '@opnay/city-ds-react/alert-dialog';
import { SegmentedControl } from '@opnay/city-ds-react/segmented-control';
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
  onChoosePlan,
  onAction,
}: {
  subscription: SubscriptionSnapshot;
  onChoosePlan: () => void;
  onAction: (action: SubscriptionAction) => Promise<void>;
}) {
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const lock = useRef(false);
  const planButtonRef = useRef<HTMLButtonElement>(null);
  const { status, plan, price, renewalDate, accessUntil } = subscription;
  async function run(action: SubscriptionAction) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError('');
    try {
      await onAction(action);
      setConfirm(false);
    } catch {
      setError('처리하지 못했어요. 다시 시도해 주세요.');
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <BlockCard title="구독 관리" description="현재 플랜과 다음 결제 일정을 확인해 주세요.">
      <div className="city-block-split">
        <strong>{plan}</strong>
        <Badge>{labels[status]}</Badge>
      </div>
      <p className="city-text-subsection-title">{price}</p>
      <p role="status">
        {status === 'free'
          ? '결제 없이 이용 중이에요.'
          : status === 'canceling'
            ? `${accessUntil}까지 이용할 수 있어요. 이후 무료 플랜으로 바뀌며 자동 결제하지 않아요.`
            : status === 'past-due'
              ? `결제를 완료하지 못했어요. ${accessUntil}까지 결제하면 계속 이용할 수 있어요.`
              : status === 'trial'
                ? `${accessUntil}에 체험이 끝나요. 해지하지 않으면 ${renewalDate}부터 표시된 금액으로 자동 결제해요.`
                : `다음 결제일은 ${renewalDate}이에요.`}
      </p>
      {error && !confirm && <p role="alert">{error}</p>}
      <div className="city-block-actions">
        {status !== 'past-due' && (
          <Button ref={planButtonRef} variant="outline" disabled={busy} onClick={onChoosePlan}>
            {status === 'free' ? '플랜 선택' : '플랜 변경'}
          </Button>
        )}
        {status !== 'free' && (
          <Button
            variant={status === 'active' || status === 'trial' ? 'outline' : 'primary'}
            disabled={busy}
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
      <AlertDialog.Root
        open={confirm}
        onOpenChange={(open) => {
          if (!busy) {
            setConfirm(open);
            setError('');
          }
        }}
      >
        <AlertDialog.Portal>
          <AlertDialog.Backdrop />
          <AlertDialog.Viewport>
            <AlertDialog.Popup finalFocus={planButtonRef}>
              <AlertDialog.Title>구독 해지를 예약할까요?</AlertDialog.Title>
              <AlertDialog.Description>
                {accessUntil}까지 이용할 수 있어요. 이후 무료 플랜으로 바뀌며 자동 결제하지 않아요.
              </AlertDialog.Description>
              {error && <p role="alert">{error}</p>}
              <div className="city-block-actions">
                <AlertDialog.Close render={<Button variant="outline" disabled={busy} />}>
                  닫기
                </AlertDialog.Close>
                <Button
                  disabled={busy}
                  onClick={() => {
                    void run('cancel');
                  }}
                >
                  {busy ? '처리 중…' : '해지 예약'}
                </Button>
              </div>
            </AlertDialog.Popup>
          </AlertDialog.Viewport>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </BlockCard>
  );
}

export default function SubscriptionManagementExample() {
  const [scenario, setScenario] = useState<SubscriptionStatus>('active');
  const [status, setStatus] = useState<SubscriptionStatus>('active');
  const [message, setMessage] = useState('');
  return (
    <div className="city-block-section">
      <SegmentedControl
        aria-label="구독 예제 상태"
        value={scenario}
        onValueChange={(value) => {
          setScenario(value);
          setStatus(value);
          setMessage('');
        }}
      >
        {Object.entries(labels).map(([value, label]) => (
          <SegmentedControl.Item key={value} value={value}>
            {label}
          </SegmentedControl.Item>
        ))}
      </SegmentedControl>
      <SubscriptionManagement
        key={scenario}
        subscription={{
          status,
          plan: status === 'free' ? 'Free' : 'Pro',
          price: status === 'free' ? '무료' : '월 29,000원 · 부가세 포함',
          renewalDate: '2026년 10월 8일',
          accessUntil: '2026년 10월 7일',
        }}
        onChoosePlan={() => {
          window.location.assign('/blocks/plan-selection');
        }}
        onAction={async (action) => {
          setStatus(
            action === 'cancel'
              ? 'canceling'
              : scenario === 'trial' && action === 'resume'
                ? 'trial'
                : 'active',
          );
          setMessage(
            action === 'cancel'
              ? '해지를 예약했어요.'
              : action === 'resume'
                ? '해지 예약을 취소했어요.'
                : '결제 성공 상태로 바꿨어요. 실제 결제는 진행하지 않아요.',
          );
        }}
      />
      <p role="status" className="city-block-status">
        {message}
      </p>
    </div>
  );
}
