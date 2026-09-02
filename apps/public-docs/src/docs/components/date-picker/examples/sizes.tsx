import { DatePicker } from '@opnay/city-ds-react/date-picker';
import { Field } from '@opnay/city-ds-react/field';

const sizes = ['xsm', 'sm', 'md', 'lg', 'xlg'] as const;

export default function DatePickerSizesExample() {
  return (
    <div className="city-docs-example-stack">
      {sizes.map((size) => (
        <div className="city-docs-example-variant" key={size}>
          <span className="city-docs-example-label">{size}</span>
          <Field.Root>
            <Field.Label>검토 날짜</Field.Label>
            <DatePicker.Root size={size}>
              <DatePicker.Group>
                <DatePicker.Input />
                <DatePicker.Trigger />
              </DatePicker.Group>
            </DatePicker.Root>
          </Field.Root>
        </div>
      ))}
    </div>
  );
}
