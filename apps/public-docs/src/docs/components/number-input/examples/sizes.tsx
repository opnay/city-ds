import { NumberInput } from '@opnay/city-ds-react/number-input';

const sizes = ['xsm', 'sm', 'md', 'lg', 'xlg'] as const;

export default function NumberInputSizesExample() {
  return (
    <div className="city-docs-example-stack">
      {sizes.map((size) => (
        <div className="city-docs-example-variant" key={size}>
          <span className="city-docs-example-label">{size}</span>
          <NumberInput.Root defaultValue={2} size={size}>
            <NumberInput.Group>
              <NumberInput.Input aria-label="인원" />
              <NumberInput.Decrement aria-label="인원 줄이기" />
              <NumberInput.Increment aria-label="인원 늘리기" />
            </NumberInput.Group>
          </NumberInput.Root>
        </div>
      ))}
    </div>
  );
}
