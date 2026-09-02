import { useState } from 'react';
import { DateInput } from '@opnay/city-ds-react/date-input';
import { Field } from '@opnay/city-ds-react/field';

const initial = new Date(2026, 6, 15);

export default function DateInputControlledExample() {
  const [value, setValue] = useState<Date | null>(initial);

  return (
    <div className="city-docs-example-stack">
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">제어</span>
        <Field.Root>
          <Field.Label>검토 날짜</Field.Label>
          <DateInput.Root onValueChange={setValue} value={value}>
            <DateInput.Input />
          </DateInput.Root>
          <Field.Description>YYYY-MM-DD로 입력하십시오.</Field.Description>
        </Field.Root>
      </div>
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">오류</span>
        <Field.Root invalid>
          <Field.Label>검토 날짜</Field.Label>
          <DateInput.Root invalid>
            <DateInput.Input />
          </DateInput.Root>
          <Field.Error match>가능한 날짜를 입력하십시오.</Field.Error>
        </Field.Root>
      </div>
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">비활성</span>
        <Field.Root disabled>
          <Field.Label>검토 날짜</Field.Label>
          <DateInput.Root defaultValue={initial} disabled>
            <DateInput.Input />
          </DateInput.Root>
          <Field.Description>정책으로 수정할 수 없습니다.</Field.Description>
        </Field.Root>
      </div>
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">읽기 전용</span>
        <Field.Root>
          <Field.Label>검토 날짜</Field.Label>
          <DateInput.Root defaultValue={initial} readOnly>
            <DateInput.Input />
          </DateInput.Root>
          <Field.Description>읽기 전용 값입니다.</Field.Description>
        </Field.Root>
      </div>
    </div>
  );
}
