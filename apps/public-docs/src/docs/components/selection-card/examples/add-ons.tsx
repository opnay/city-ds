import { useId } from 'react';
import { Checkbox } from '@opnay/city-ds-react/checkbox';
import { CheckboxGroup } from '@opnay/city-ds-react/checkbox-group';
import { SelectionCard } from '@opnay/city-ds-react/selection-card';

const options = [
  { value: 'backup', title: '자동 백업', description: '매일 데이터를 안전하게 보관합니다.' },
  { value: 'analytics', title: '사용량 분석', description: '팀의 이용 현황을 확인합니다.' },
];

export default function AddOnsExample() {
  const id = useId();

  return (
    <CheckboxGroup
      aria-label="추가 기능"
      defaultValue={['backup']}
      className="city-docs-example-grid city-docs-example-matrix"
    >
      {options.map((option) => (
        <SelectionCard key={option.value}>
          <Checkbox
            name="addOns"
            value={option.value}
            aria-labelledby={`${id}-${option.value}-title`}
            aria-describedby={`${id}-${option.value}-description`}
            className="mt-1"
          />
          <SelectionCard.Content>
            <SelectionCard.Title id={`${id}-${option.value}-title`}>
              {option.title}
            </SelectionCard.Title>
            <SelectionCard.Description id={`${id}-${option.value}-description`}>
              {option.description}
            </SelectionCard.Description>
          </SelectionCard.Content>
        </SelectionCard>
      ))}
    </CheckboxGroup>
  );
}
