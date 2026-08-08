import { useState } from 'react';
import { Select } from '@opnay/city-ds-react/select';

const items = { draft: '초안', review: '검토', done: '완료' } as const;

function Options() {
  return (
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup>
          <Select.List>
            {Object.entries(items).map(([key, label]) => (
              <Select.Item key={key} value={key}>
                <Select.ItemIndicator />
                <Select.ItemText>{label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.List>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  );
}

export default function SelectSelectionExample() {
  const [value, setValue] = useState<string | null>('draft');

  return (
    <div className="city-docs-example-stack">
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">제어</span>
        <Select.Root items={items} onValueChange={setValue} value={value}>
          <Select.Label className="city-docs-sr-only">작업 상태</Select.Label>
          <Select.Trigger>
            <Select.Value placeholder="상태 선택" />
            <Select.Icon />
          </Select.Trigger>
          <Options />
        </Select.Root>
      </div>
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">비제어</span>
        <Select.Root defaultValue="review" items={items}>
          <Select.Label className="city-docs-sr-only">작업 상태</Select.Label>
          <Select.Trigger>
            <Select.Value placeholder="상태 선택" />
            <Select.Icon />
          </Select.Trigger>
          <Options />
        </Select.Root>
      </div>
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">복수</span>
        <Select.Root defaultValue={['draft']} items={items} multiple>
          <Select.Label className="city-docs-sr-only">작업 상태</Select.Label>
          <Select.Trigger>
            <Select.Value placeholder="상태 선택" />
            <Select.Icon />
          </Select.Trigger>
          <Options />
        </Select.Root>
      </div>
    </div>
  );
}
