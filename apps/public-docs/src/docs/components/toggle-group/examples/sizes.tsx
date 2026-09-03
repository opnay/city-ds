import { ToggleGroup } from '@opnay/city-ds-react/toggle-group';

const sizes = ['xsm', 'sm', 'md', 'lg', 'xlg'] as const;

export default function ToggleGroupSizesExample() {
  return (
    <div className="city-docs-example-stack">
      {sizes.map((size) => (
        <ToggleGroup
          aria-label={`${size} 서식`}
          defaultValue={['bold']}
          key={size}
          multiple
          size={size}
        >
          <ToggleGroup.Item value="bold">굵게</ToggleGroup.Item>
          <ToggleGroup.Item value="italic">기울임</ToggleGroup.Item>
        </ToggleGroup>
      ))}
    </div>
  );
}
