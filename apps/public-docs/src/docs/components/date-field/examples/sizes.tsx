import { DateField } from '@opnay/city-ds-react/date-field';

const initial = new Date(2026, 6, 15);
const sizes = ['sm', 'md', 'lg'] as const;

export default function DateFieldSizesExample() {
  return (
    <div className="city-docs-example-stack">
      {sizes.map((size) => (
        <DateField.Root defaultValue={initial} key={size} size={size}>
          <DateField.Label>{size} 검토 날짜</DateField.Label>
          <DateField.Input />
        </DateField.Root>
      ))}
    </div>
  );
}
