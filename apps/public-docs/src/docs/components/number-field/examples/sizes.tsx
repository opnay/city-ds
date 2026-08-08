import { Field } from '@opnay/city-ds-react/field';
import { NumberField } from '@opnay/city-ds-react/number-field';

const sizes = ['xsm', 'sm', 'md', 'lg', 'xlg'] as const;

export default function NumberFieldSizesExample() {
  return (
    <div className="city-docs-example-stack">
      {sizes.map((size) => (
        <div className="city-docs-example-variant" key={size}>
          <span className="city-docs-example-label">{size}</span>
          <Field.Root>
            <Field.Label>인원</Field.Label>
            <NumberField.Root defaultValue={2} size={size}>
              <NumberField.Group>
                <NumberField.Input />
                <NumberField.Decrement aria-label="인원 줄이기" />
                <NumberField.Increment aria-label="인원 늘리기" />
              </NumberField.Group>
            </NumberField.Root>
          </Field.Root>
        </div>
      ))}
    </div>
  );
}
