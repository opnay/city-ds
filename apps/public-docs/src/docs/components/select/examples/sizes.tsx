import { Select } from '@opnay/city-ds-react/select';

const items = { draft: '초안', review: '검토', done: '완료' } as const;
const sizes = ['xsm', 'sm', 'md', 'lg', 'xlg'] as const;

export default function SelectSizesExample() {
  return (
    <div className="city-docs-example-stack">
      {sizes.map((size) => (
        <div className="city-docs-example-variant" key={size}>
          <span className="city-docs-example-label">{size}</span>
          <Select.Root defaultValue="draft" items={items} size={size}>
            <Select.Label className="city-docs-sr-only">작업 상태</Select.Label>
            <Select.Trigger>
              <Select.Value placeholder="상태 선택" />
              <Select.Icon />
            </Select.Trigger>
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
          </Select.Root>
        </div>
      ))}
    </div>
  );
}
