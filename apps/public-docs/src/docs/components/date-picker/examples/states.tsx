import { DatePicker } from '@opnay/city-ds-react/date-picker';

const today = new Date(2026, 6, 15);

export default function DatePickerStatesExample() {
  return (
    <div className="city-docs-example-stack">
      <DatePicker.Root defaultValue={today} disabled>
        <DatePicker.Label>비활성 날짜</DatePicker.Label>
        <DatePicker.Group>
          <DatePicker.Input />
          <DatePicker.Trigger />
        </DatePicker.Group>
      </DatePicker.Root>
      <DatePicker.Root defaultValue={today} readOnly>
        <DatePicker.Label>읽기 전용 날짜</DatePicker.Label>
        <DatePicker.Group>
          <DatePicker.Input />
          <DatePicker.Trigger />
        </DatePicker.Group>
      </DatePicker.Root>
      <DatePicker.Root invalid>
        <DatePicker.Label>유효하지 않은 날짜</DatePicker.Label>
        <DatePicker.Group>
          <DatePicker.Input />
          <DatePicker.Trigger />
        </DatePicker.Group>
        <DatePicker.Error>날짜를 확인하십시오.</DatePicker.Error>
      </DatePicker.Root>
    </div>
  );
}
