import { DateInput } from '@opnay/city-ds-react/date-input';
import { Field } from '@opnay/city-ds-react/field';

const initial = new Date(2026, 6, 15);
const sizes = ['xsm', 'sm', 'md', 'lg', 'xlg'] as const;

export default function DateInputSizesExample() {
  return (
    <div className="city-docs-example-stack">
      {sizes.map((size) => (
        <div className="city-docs-example-variant" key={size}>
          <span className="city-docs-example-label">{size}</span>
          <Field.Root>
            <Field.Label>검토 날짜</Field.Label>
            <DateInput.Root defaultValue={initial} size={size}>
              <DateInput.Input />
            </DateInput.Root>
          </Field.Root>
        </div>
      ))}
    </div>
  );
}
