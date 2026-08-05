import { DatePicker } from '@opnay/city-ds-react/date-picker';

const sizes = ['sm', 'md', 'lg'] as const;

export default function DatePickerSizesExample() {
  return (
    <div className="city-docs-example-stack">
      {sizes.map((size) => (
        <DatePicker.Root key={size} size={size}>
          <DatePicker.Label>{size} 검토 날짜</DatePicker.Label>
          <DatePicker.Group>
            <DatePicker.Input />
            <DatePicker.Trigger />
          </DatePicker.Group>
        </DatePicker.Root>
      ))}
    </div>
  );
}
