import { DatePicker } from '@opnay/city-ds-react/date-picker';

const today = new Date(2026, 6, 15);

export default function DatePickerStatesExample() {
  return (
    <div className="city-docs-example-stack">
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">비활성</span>
        <DatePicker.Root defaultValue={today} disabled>
          <DatePicker.Label>검토 날짜</DatePicker.Label>
          <DatePicker.Group>
            <DatePicker.Input />
            <DatePicker.Trigger />
          </DatePicker.Group>
        </DatePicker.Root>
      </div>
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">읽기 전용</span>
        <DatePicker.Root defaultValue={today} readOnly>
          <DatePicker.Label>검토 날짜</DatePicker.Label>
          <DatePicker.Group>
            <DatePicker.Input />
            <DatePicker.Trigger />
          </DatePicker.Group>
        </DatePicker.Root>
      </div>
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">오류</span>
        <DatePicker.Root invalid>
          <DatePicker.Label>검토 날짜</DatePicker.Label>
          <DatePicker.Group>
            <DatePicker.Input />
            <DatePicker.Trigger />
          </DatePicker.Group>
          <DatePicker.Error>날짜를 확인하십시오.</DatePicker.Error>
        </DatePicker.Root>
      </div>
    </div>
  );
}
