import { useId, useRef, useState } from 'react';
import { toast } from '@opnay/city-ds-react/toast';
import { Button } from '@opnay/city-ds-react/button';
import { RadioGroup } from '@opnay/city-ds-react/radio-group';
import { SelectionCard } from '@opnay/city-ds-react/selection-card';
import { SegmentedControl } from '@opnay/city-ds-react/segmented-control';
import { Alert } from '@opnay/city-ds-react/alert';
import { EmptyState } from '@opnay/city-ds-react/empty-state';
import { Skeleton } from '@opnay/city-ds-react/skeleton';
import { Badge } from '@opnay/city-ds-react/badge';
import { BlockCard } from './block-card';
import './blocks.css';

export type BillingCycle = 'monthly' | 'yearly';
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  features: string[];
  prices: Record<BillingCycle, string>;
  terms?: Partial<Record<BillingCycle, string>>;
  yearlySavings?: string;
}
export const examplePlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'FREE',
    description: '개인 프로젝트를 시작할 때',
    features: ['프로젝트 1개', '멤버 1명'],
    prices: { monthly: '무료', yearly: '무료' },
  },
  {
    id: 'pro',
    name: 'PRO',
    description: '팀과 함께 작업할 때',
    features: ['프로젝트 20개', '멤버 5명', '이메일 지원'],
    prices: { monthly: '월 29,000원', yearly: '연 290,000원' },
    yearlySavings: `월간보다 연 ${Math.floor((1 - 290000 / (29000 * 12)) * 100)}% 절약`,
  },
];

export function PlanSelection({
  plans,
  current,
  onContinue,
  loading = false,
  canManage = true,
  notices = [],
}: {
  notices?: readonly string[];
  loading?: boolean;
  canManage?: boolean;
  plans: SubscriptionPlan[];
  current: { planId: string; cycle: BillingCycle };
  onContinue: (selection: { planId: string; cycle: BillingCycle }) => Promise<void>;
}) {
  const id = useId();
  const [cycle, setCycle] = useState<BillingCycle>(current.cycle);
  const [planId, setPlanId] = useState(current.planId);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const lock = useRef(false);
  const selected = plans.find((plan) => plan.id === planId);
  const unchanged = planId === current.planId && cycle === current.cycle;
  async function submit() {
    if (lock.current || !selected || unchanged || !canManage || loading) return;
    lock.current = true;
    setBusy(true);
    setError('');
    try {
      await onContinue({ planId, cycle });
    } catch {
      setError('선택한 플랜은 유지했어요. 다시 시도해 주세요.');
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  if (loading)
    return (
      <BlockCard title="플랜 선택">
        <div aria-label="플랜 불러오는 중" aria-busy="true" className="city-block-section">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-48 w-full" />
        </div>
      </BlockCard>
    );
  if (plans.length === 0)
    return (
      <BlockCard title="플랜 선택">
        <EmptyState.Root>
          <EmptyState.Title level={4}>선택할 수 있는 플랜이 없어요.</EmptyState.Title>
          <EmptyState.Description>
            제공 중인 플랜은 관리자에게 문의해 주세요.
          </EmptyState.Description>
        </EmptyState.Root>
      </BlockCard>
    );
  return (
    <BlockCard
      className="city-block-plan-selection"
      title="플랜 선택"
      description="필요한 기능과 결제 주기를 선택해 주세요."
      render={
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
        />
      }
    >
      {!canManage && (
        <Alert.Root tone="info" appearance="subtle">
          <Alert.Title level={4}>관리자만 플랜을 변경할 수 있어요.</Alert.Title>
          <Alert.Description>변경이 필요하면 관리자에게 요청해 주세요.</Alert.Description>
        </Alert.Root>
      )}
      <SegmentedControl
        className="city-block-billing-cycle"
        name={`${id}-cycle`}
        aria-label="결제 주기"
        value={cycle}
        onValueChange={(value) => {
          setCycle(value);
          setError('');
        }}
        disabled={busy || !canManage}
      >
        <SegmentedControl.Item value="monthly">월간</SegmentedControl.Item>
        <SegmentedControl.Item value="yearly">연간</SegmentedControl.Item>
      </SegmentedControl>
      <RadioGroup
        name={`${id}-plan`}
        aria-label="플랜"
        value={planId}
        onValueChange={(value) => {
          setPlanId(value);
          setError('');
        }}
        disabled={busy || !canManage}
        className="city-block-plan-grid"
      >
        {plans.map((plan) => (
          <SelectionCard key={plan.id}>
            <div className="city-block-plan-content min-w-0 flex-1">
              <div className="city-block-label-row">
                <h4 className="city-text-subsection-title" id={`${id}-${plan.id}`}>
                  {plan.name}
                </h4>
                {plan.id === current.planId && cycle === current.cycle && (
                  <Badge appearance="outline">현재 플랜</Badge>
                )}
              </div>
              <SelectionCard.Description id={`${id}-${plan.id}-description`}>
                {plan.description}
              </SelectionCard.Description>
              <div className="city-block-plan-price" id={`${id}-${plan.id}-price`}>
                <p className="city-text-body font-semibold">{plan.prices[cycle]}</p>
                {cycle === 'yearly' && plan.yearlySavings && (
                  <p className="city-text-supporting text-city-muted-foreground">
                    ({plan.yearlySavings})
                  </p>
                )}
              </div>
              <ul className="city-block-plan-features city-text-supporting">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              {plan.terms?.[cycle] && (
                <p id={`${id}-${plan.id}-terms`} className="city-text-supporting">
                  {plan.terms[cycle]}
                </p>
              )}
            </div>
            <RadioGroup.Control
              value={plan.id}
              aria-labelledby={`${id}-${plan.id}`}
              aria-describedby={`${id}-${plan.id}-description ${id}-${plan.id}-price`}
            />
          </SelectionCard>
        ))}
      </RadioGroup>
      {error && (
        <Alert.Root tone="destructive" appearance="subtle">
          <Alert.Title level={4}>선택을 진행하지 못했어요.</Alert.Title>
          <Alert.Description>{error}</Alert.Description>
        </Alert.Root>
      )}
      <div className="city-block-actions">
        <Button
          type="submit"
          aria-describedby={selected?.terms?.[cycle] ? `${id}-${selected.id}-terms` : undefined}
          disabled={busy || unchanged || !selected || !canManage}
        >
          {busy ? '진행 중…' : '선택한 플랜으로 계속'}
        </Button>
      </div>
      {notices.length > 0 && (
        <ul aria-label="요금 안내" className="city-block-plan-notices city-text-supporting">
          {notices.map((notice) => (
            <li key={notice}>{notice}</li>
          ))}
        </ul>
      )}
    </BlockCard>
  );
}

export default function PlanSelectionExample() {
  return (
    <div className="city-block-section">
      <PlanSelection
        plans={examplePlans}
        notices={[
          '표시된 금액은 부가세를 포함해요.',
          '유료 플랜은 결제일부터 선택한 주기에 따라 자동 갱신돼요.',
          '연간 요금은 한 번에 결제해요. 절약액은 같은 플랜을 월간으로 12개월 이용할 때와 비교한 금액이에요.',
        ]}
        current={{ planId: 'free', cycle: 'monthly' }}
        onContinue={async ({ planId, cycle }) => {
          toast.success(
            `${examplePlans.find((plan) => plan.id === planId)?.name} · ${cycle === 'monthly' ? '월간' : '연간'}을 선택했어요. 실제 결제는 진행하지 않아요.`,
          );
        }}
      />
    </div>
  );
}
