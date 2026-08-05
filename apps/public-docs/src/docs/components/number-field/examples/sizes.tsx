import { NumberField } from '@opnay/city-ds-react/number-field';

const sizes = ['sm', 'md', 'lg'] as const;

export default function NumberFieldSizesExample() {
  return (
    <div className="city-docs-example-stack">
      {sizes.map((size) => (
        <NumberField.Root defaultValue={2} key={size} size={size}>
          <NumberField.Group>
            <NumberField.Input aria-label={`${size} 인원`} />
            <NumberField.Decrement aria-label={`${size} 인원 줄이기`} />
            <NumberField.Increment aria-label={`${size} 인원 늘리기`} />
          </NumberField.Group>
        </NumberField.Root>
      ))}
    </div>
  );
}
