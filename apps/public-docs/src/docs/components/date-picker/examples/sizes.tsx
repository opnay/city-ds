import { DatePicker } from '@opnay/city-ds-react/date-picker';

const sizes = ['xsm', 'sm', 'md', 'lg', 'xlg'] as const;

export default function DatePickerSizesExample() {
  return (
    <div className="city-docs-example-stack">
      {sizes.map((size) => (
        <div className="city-docs-example-variant" key={size}>
          <span className="city-docs-example-label">{size}</span>
          <DatePicker.Root size={size}>
            <DatePicker.Label>검토 날짜</DatePicker.Label>
            <DatePicker.Group>
              <DatePicker.Input />
              <DatePicker.Trigger />
            </DatePicker.Group>
          </DatePicker.Root>
        </div>
      ))}
    </div>
  );
}
