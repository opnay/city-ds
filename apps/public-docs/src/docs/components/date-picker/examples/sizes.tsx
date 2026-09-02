import { DatePicker } from '@opnay/city-ds-react/date-picker';

const sizes = ['xsm', 'sm', 'md', 'lg', 'xlg'] as const;

export default function DatePickerSizesExample() {
  return (
    <div className="city-docs-example-stack">
      {sizes.map((size) => (
        <div className="city-docs-example-variant" key={size}>
          <span className="city-docs-example-label">{size}</span>
          <DatePicker.Root size={size}>
            <DatePicker.Group>
              <DatePicker.Input aria-label="검토 날짜" />
              <DatePicker.Trigger aria-label="검토 날짜 달력 열기" />
            </DatePicker.Group>
          </DatePicker.Root>
        </div>
      ))}
    </div>
  );
}
