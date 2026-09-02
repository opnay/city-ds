import { DatePicker } from '@opnay/city-ds-react/date-picker';

const today = new Date(2026, 6, 15);

export default function DatePickerStatesExample() {
  return (
    <div className="city-docs-example-stack">
      <div className="city-docs-example-variant">
        <DatePicker.Root defaultValue={today} disabled>
          <DatePicker.Group>
            <DatePicker.Input aria-label="검토 날짜" />
            <DatePicker.Trigger aria-label="검토 날짜 달력 열기" />
          </DatePicker.Group>
        </DatePicker.Root>
      </div>
      <div className="city-docs-example-variant">
        <DatePicker.Root defaultValue={today} readOnly>
          <DatePicker.Group>
            <DatePicker.Input aria-label="검토 날짜" />
            <DatePicker.Trigger aria-label="검토 날짜 달력 열기" />
          </DatePicker.Group>
        </DatePicker.Root>
      </div>
      <div className="city-docs-example-variant">
        <DatePicker.Root invalid>
          <DatePicker.Group>
            <DatePicker.Input aria-label="검토 날짜" />
            <DatePicker.Trigger aria-label="검토 날짜 달력 열기" />
          </DatePicker.Group>
        </DatePicker.Root>
      </div>
    </div>
  );
}
