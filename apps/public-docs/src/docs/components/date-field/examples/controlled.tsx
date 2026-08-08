import { useState } from 'react';
import { DateField } from '@opnay/city-ds-react/date-field';

const initial = new Date(2026, 6, 15);

export default function DateFieldControlledExample() {
  const [value, setValue] = useState<Date | null>(initial);

  return (
    <div className="city-docs-example-stack">
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">제어</span>
        <DateField.Root onValueChange={setValue} value={value}>
          <DateField.Label>검토 날짜</DateField.Label>
          <DateField.Input />
          <DateField.Description>YYYY-MM-DD로 입력하십시오.</DateField.Description>
        </DateField.Root>
      </div>
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">오류</span>
        <DateField.Root invalid>
          <DateField.Label>검토 날짜</DateField.Label>
          <DateField.Input />
          <DateField.Error>가능한 날짜를 입력하십시오.</DateField.Error>
        </DateField.Root>
      </div>
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">비활성</span>
        <DateField.Root defaultValue={initial} disabled>
          <DateField.Label>검토 날짜</DateField.Label>
          <DateField.Input />
          <DateField.Description>정책으로 수정할 수 없습니다.</DateField.Description>
        </DateField.Root>
      </div>
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">읽기 전용</span>
        <DateField.Root defaultValue={initial} readOnly>
          <DateField.Label>검토 날짜</DateField.Label>
          <DateField.Input />
          <DateField.Description>읽기 전용 값입니다.</DateField.Description>
        </DateField.Root>
      </div>
    </div>
  );
}
