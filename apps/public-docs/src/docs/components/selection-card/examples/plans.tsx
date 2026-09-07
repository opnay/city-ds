import { useId } from 'react';
import { Checkbox } from '@opnay/city-ds-react/checkbox';
import { CheckboxGroup } from '@opnay/city-ds-react/checkbox-group';
import { RadioGroup } from '@opnay/city-ds-react/radio-group';
import { SelectionCard } from '@opnay/city-ds-react/selection-card';

const plans = [
  { value: 'starter', title: 'Starter', description: '개인 프로젝트를 시작할 때', price: '무료' },
  { value: 'pro', title: 'Pro', description: '팀과 함께 서비스를 운영할 때', price: '월 29,000원' },
  {
    value: 'enterprise',
    title: 'Enterprise',
    description: '조직 단위 관리가 필요할 때 · 준비 중',
    price: '별도 문의',
    disabled: true,
  },
];

export default function PlansExample({
  disabled = false,
  type = 'radio',
}: {
  disabled?: boolean;
  type?: 'radio' | 'checkbox';
}) {
  const id = useId();
  const Control = type === 'checkbox' ? Checkbox : RadioGroup.Control;
  const cards = plans.map((plan) => (
    <SelectionCard key={plan.value}>
      <SelectionCard.Content>
        <SelectionCard.Title id={`${id}-${plan.value}-title`}>{plan.title}</SelectionCard.Title>
        <SelectionCard.Description id={`${id}-${plan.value}-description`}>
          {plan.description}
        </SelectionCard.Description>
        <span className="mt-3 text-lg font-semibold">{plan.price}</span>
      </SelectionCard.Content>
      <Control
        value={plan.value}
        disabled={plan.disabled}
        aria-labelledby={`${id}-${plan.value}-title`}
        aria-describedby={`${id}-${plan.value}-description`}
        className="mt-1"
      />
    </SelectionCard>
  ));

  if (type === 'checkbox') {
    return (
      <CheckboxGroup
        aria-label="플랜 복수 선택"
        defaultValue={['pro']}
        disabled={disabled}
        className="city-docs-example-grid city-docs-example-matrix"
      >
        {cards}
      </CheckboxGroup>
    );
  }

  return (
    <RadioGroup
      aria-label="플랜 선택"
      name="plan"
      defaultValue="pro"
      disabled={disabled}
      className="city-docs-example-grid city-docs-example-matrix"
    >
      {cards}
    </RadioGroup>
  );
}
