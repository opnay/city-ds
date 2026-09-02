import { DatePicker } from '@opnay/city-ds-react/date-picker';
import { Field } from '@opnay/city-ds-react/field';

const today = new Date(2026, 6, 15);

export default function DatePickerStatesExample() {
  return (
    <div className="city-docs-example-stack">
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">비활성</span>
        <Field.Root disabled>
          <Field.Label>검토 날짜</Field.Label>
          <DatePicker.Root defaultValue={today} disabled>
            <DatePicker.Group>
              <DatePicker.Input />
              <DatePicker.Trigger />
            </DatePicker.Group>
          </DatePicker.Root>
        </Field.Root>
      </div>
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">읽기 전용</span>
        <Field.Root>
          <Field.Label>검토 날짜</Field.Label>
          <DatePicker.Root defaultValue={today} readOnly>
            <DatePicker.Group>
              <DatePicker.Input />
              <DatePicker.Trigger />
            </DatePicker.Group>
          </DatePicker.Root>
        </Field.Root>
      </div>
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">오류</span>
        <Field.Root invalid>
          <Field.Label>검토 날짜</Field.Label>
          <DatePicker.Root invalid>
            <DatePicker.Group>
              <DatePicker.Input />
              <DatePicker.Trigger />
            </DatePicker.Group>
          </DatePicker.Root>
          <Field.Error match>날짜를 확인하십시오.</Field.Error>
        </Field.Root>
      </div>
    </div>
  );
}
