import { ToggleGroup } from '@opnay/city-ds-react/toggle-group';

const sizes = ['xsm', 'sm', 'md', 'lg', 'xlg'] as const;

export default function ToggleGroupSizesExample() {
  return (
    <div className="city-docs-example-stack">
      {sizes.map((size) => (
        <ToggleGroup aria-label={`${size} 보기`} defaultValue={['grid']} key={size} size={size}>
          <ToggleGroup.Item value="grid">격자</ToggleGroup.Item>
          <ToggleGroup.Item value="list">목록</ToggleGroup.Item>
        </ToggleGroup>
      ))}
    </div>
  );
}
