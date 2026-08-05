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
      <Select.Root items={items} onValueChange={setValue} value={value}>
        <Select.Label>제어된 상태</Select.Label>
        <Select.Trigger>
          <Select.Value placeholder="상태 선택" />
          <Select.Icon />
        </Select.Trigger>
        <Options />
      </Select.Root>
      <Select.Root defaultValue="review" items={items}>
        <Select.Label>비제어 상태</Select.Label>
        <Select.Trigger>
          <Select.Value placeholder="상태 선택" />
          <Select.Icon />
        </Select.Trigger>
        <Options />
      </Select.Root>
      <Select.Root defaultValue={['draft']} items={items} multiple>
        <Select.Label>복수 상태</Select.Label>
        <Select.Trigger>
          <Select.Value placeholder="상태 선택" />
          <Select.Icon />
        </Select.Trigger>
        <Options />
      </Select.Root>
    </div>
  );
}
