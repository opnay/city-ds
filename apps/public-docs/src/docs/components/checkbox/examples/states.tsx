import { useState } from 'react';
import { Checkbox } from '@opnay/city-ds-react/checkbox';

export default function CheckboxStatesExample() {
  const [checked, setChecked] = useState(false);
  return (
    <div className="city-docs-example-stack">
      <label>
        <Checkbox aria-label="알림 받기" checked={checked} onCheckedChange={setChecked} size="sm" />{' '}
        알림 받기
      </label>
      <label>
        <Checkbox aria-label="일부 선택됨" indeterminate size="md" /> 전체 선택
      </label>
      <label>
        <Checkbox aria-label="정책으로 잠김" checked disabled size="lg" /> 정책으로 잠김
      </label>
    </div>
  );
}
