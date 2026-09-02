import { Field } from '@opnay/city-ds-react/field';
import { NumberInput } from '@opnay/city-ds-react/number-input';

const sizes = ['xsm', 'sm', 'md', 'lg', 'xlg'] as const;

export default function NumberInputSizesExample() {
  return (
    <div className="city-docs-example-stack">
      {sizes.map((size) => (
        <div className="city-docs-example-variant" key={size}>
          <span className="city-docs-example-label">{size}</span>
          <Field.Root>
            <Field.Label>인원</Field.Label>
            <NumberInput.Root defaultValue={2} size={size}>
              <NumberInput.Group>
                <NumberInput.Input />
                <NumberInput.Decrement aria-label="인원 줄이기" />
                <NumberInput.Increment aria-label="인원 늘리기" />
              </NumberInput.Group>
            </NumberInput.Root>
          </Field.Root>
        </div>
      ))}
    </div>
  );
}
