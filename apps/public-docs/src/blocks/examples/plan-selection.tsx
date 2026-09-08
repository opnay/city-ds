import { useId, useRef, useState } from 'react';
import { Button } from '@opnay/city-ds-react/button';
import { RadioGroup } from '@opnay/city-ds-react/radio-group';
import { SelectionCard } from '@opnay/city-ds-react/selection-card';
import { SegmentedControl } from '@opnay/city-ds-react/segmented-control';
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
  terms: Record<BillingCycle, string>;
}
export const examplePlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: '개인 프로젝트를 시작할 때',
    features: ['프로젝트 1개', '멤버 1명'],
    prices: { monthly: '무료', yearly: '무료' },
    terms: { monthly: '결제 없이 바로 이용해요.', yearly: '결제 없이 바로 이용해요.' },
  },
  {
    id: 'pro',
    name: 'Pro',
    description: '팀과 함께 작업할 때',
    features: ['프로젝트 20개', '멤버 5명', '이메일 지원'],
    prices: { monthly: '월 29,000원', yearly: '연 290,000원' },
    terms: {
      monthly: '선택 후 결제를 진행해요. 결제일부터 매월 29,000원을 결제해요. 부가세가 포함돼요.',
      yearly:
        '선택 후 결제를 진행해요. 결제일부터 매년 290,000원을 한 번에 결제해요. 부가세가 포함돼요.',
    },
  },
];

export function PlanSelection({
  plans,
  current,
  onContinue,
}: {
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
  return (
    <BlockCard title="플랜 선택" description="필요한 기능과 결제 주기를 선택해 주세요.">
      <SegmentedControl
        aria-label="결제 주기"
        value={cycle}
        onValueChange={(value) => {
          setCycle(value);
          setError('');
        }}
        disabled={busy}
      >
        <SegmentedControl.Item value="monthly">월간</SegmentedControl.Item>
        <SegmentedControl.Item value="yearly">연간</SegmentedControl.Item>
      </SegmentedControl>
      <RadioGroup
        aria-label="플랜"
        value={planId}
        onValueChange={(value) => {
          setPlanId(value);
          setError('');
        }}
        disabled={busy}
        className="city-block-section"
      >
        {plans.map((plan) => (
          <SelectionCard key={plan.id}>
            <SelectionCard.Content>
              <SelectionCard.Title id={`${id}-${plan.id}`}>{plan.name}</SelectionCard.Title>
              <SelectionCard.Description id={`${id}-${plan.id}-description`}>
                {plan.description}
              </SelectionCard.Description>
              <p id={`${id}-${plan.id}-price`} className="city-text-subsection-title">
                {plan.prices[cycle]}
              </p>
              {plan.id === current.planId && cycle === current.cycle && <Badge>현재 플랜</Badge>}
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </SelectionCard.Content>
            <RadioGroup.Control
              value={plan.id}
              aria-labelledby={`${id}-${plan.id}`}
              aria-describedby={`${id}-${plan.id}-description ${id}-${plan.id}-price`}
            />
          </SelectionCard>
        ))}
      </RadioGroup>
      {selected && (
        <p className="city-text-supporting" role="status">
          {selected.terms[cycle]}
        </p>
      )}
      {error && <p role="alert">{error}</p>}
      <div className="city-block-actions">
        <Button
          disabled={busy || unchanged || !selected}
          onClick={async () => {
            if (lock.current || !selected || unchanged) return;
            lock.current = true;
            setBusy(true);
            setError('');
            try {
              await onContinue({ planId, cycle });
            } catch {
              setError('선택을 진행하지 못했어요. 다시 시도해 주세요.');
            } finally {
              lock.current = false;
              setBusy(false);
            }
          }}
        >
          {busy ? '진행 중…' : '선택한 플랜으로 계속'}
        </Button>
      </div>
    </BlockCard>
  );
}

export default function PlanSelectionExample() {
  const [message, setMessage] = useState('');
  return (
    <div className="city-block-section">
      <PlanSelection
        plans={examplePlans}
        current={{ planId: 'free', cycle: 'monthly' }}
        onContinue={async ({ planId, cycle }) => {
          setMessage(
            `${examplePlans.find((plan) => plan.id === planId)?.name} · ${cycle === 'monthly' ? '월간' : '연간'}을 선택했어요. 실제 결제는 진행하지 않아요.`,
          );
        }}
      />
      <p className="city-block-status" role="status">
        {message}
      </p>
    </div>
  );
}
