import { useState } from 'react';
import { DateField } from '@opnay/city-ds-react/date-field';

const initial = new Date(2026, 6, 15);

export default function DateFieldControlledExample() {
  const [value, setValue] = useState<Date | null>(initial);

  return (
    <div className="city-docs-example-stack">
      <DateField.Root onValueChange={setValue} value={value}>
        <DateField.Label>검토 날짜</DateField.Label>
        <DateField.Input />
        <DateField.Description>YYYY-MM-DD로 입력하십시오.</DateField.Description>
      </DateField.Root>
      <DateField.Root invalid>
        <DateField.Label>배포 날짜</DateField.Label>
        <DateField.Input />
        <DateField.Error>가능한 날짜를 입력하십시오.</DateField.Error>
      </DateField.Root>
      <DateField.Root defaultValue={initial} disabled>
        <DateField.Label>확정 날짜</DateField.Label>
        <DateField.Input />
        <DateField.Description>정책으로 수정할 수 없습니다.</DateField.Description>
      </DateField.Root>
      <DateField.Root defaultValue={initial} readOnly>
        <DateField.Label>조회 날짜</DateField.Label>
        <DateField.Input />
        <DateField.Description>읽기 전용 값입니다.</DateField.Description>
      </DateField.Root>
    </div>
  );
}
