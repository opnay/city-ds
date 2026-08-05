import { useState } from 'react';
import { NumberField } from '@opnay/city-ds-react/number-field';

function Control({ disabled = false, value }: { disabled?: boolean; value?: number }) {
  return (
    <NumberField.Root defaultValue={value} disabled={disabled}>
      <NumberField.Group>
        <NumberField.Input aria-label="인원" />
        <NumberField.Decrement aria-label="인원 줄이기" />
        <NumberField.Increment aria-label="인원 늘리기" />
      </NumberField.Group>
    </NumberField.Root>
  );
}

export default function NumberFieldExample() {
  const [value, setValue] = useState(4);

  return (
    <div className="city-docs-example-stack">
      <NumberField.Root
        max={12}
        min={1}
        onValueChange={(nextValue) => setValue(nextValue ?? 1)}
        value={value}
      >
        <NumberField.Group>
          <NumberField.Input aria-label="제어된 인원" />
          <NumberField.Decrement aria-label="인원 줄이기" />
          <NumberField.Increment aria-label="인원 늘리기" />
        </NumberField.Group>
      </NumberField.Root>
      <Control value={2} />
      <Control disabled value={8} />
    </div>
  );
}
