import { useState } from 'react';
import { NumberInput } from '@opnay/city-ds-react/number-input';

function Control({
  disabled = false,
  label,
  value,
}: {
  disabled?: boolean;
  label: string;
  value?: number;
}) {
  return (
    <div className="city-docs-example-variant">
      <span className="city-docs-example-label">{label}</span>
      <NumberInput.Root defaultValue={value} disabled={disabled}>
        <NumberInput.Group>
          <NumberInput.Input aria-label="인원" />
          <NumberInput.Decrement aria-label="인원 줄이기" />
          <NumberInput.Increment aria-label="인원 늘리기" />
        </NumberInput.Group>
      </NumberInput.Root>
    </div>
  );
}

export default function NumberInputExample() {
  const [value, setValue] = useState(4);

  return (
    <div className="city-docs-example-stack">
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">제어</span>
        <NumberInput.Root
          max={12}
          min={1}
          onValueChange={(nextValue) => setValue(nextValue ?? 1)}
          value={value}
        >
          <NumberInput.Group>
            <NumberInput.Input aria-label="인원" />
            <NumberInput.Decrement aria-label="인원 줄이기" />
            <NumberInput.Increment aria-label="인원 늘리기" />
          </NumberInput.Group>
        </NumberInput.Root>
      </div>
      <Control label="비제어" value={2} />
      <Control disabled label="비활성" value={8} />
    </div>
  );
}
