import { DateField } from '@opnay/city-ds-react/date-field';

const initial = new Date(2026, 6, 15);
const sizes = ['xsm', 'sm', 'md', 'lg', 'xlg'] as const;

export default function DateFieldSizesExample() {
  return (
    <div className="city-docs-example-stack">
      {sizes.map((size) => (
        <div className="city-docs-example-variant" key={size}>
          <span className="city-docs-example-label">{size}</span>
          <DateField.Root defaultValue={initial} size={size}>
            <DateField.Label>검토 날짜</DateField.Label>
            <DateField.Input />
          </DateField.Root>
        </div>
      ))}
    </div>
  );
}
