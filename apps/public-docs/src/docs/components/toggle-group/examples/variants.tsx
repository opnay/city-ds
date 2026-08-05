import { ToggleGroup } from '@opnay/city-ds-react/toggle-group';

const variants = ['primary', 'secondary', 'outline', 'ghost', 'destructive'] as const;

export default function ToggleGroupVariantsExample() {
  return (
    <div className="city-docs-example-stack">
      {variants.map((variant) => (
        <ToggleGroup
          aria-label={`${variant} 보기`}
          defaultValue={['grid']}
          key={variant}
          variant={variant}
        >
          <ToggleGroup.Item value="grid">격자</ToggleGroup.Item>
          <ToggleGroup.Item value="list">목록</ToggleGroup.Item>
        </ToggleGroup>
      ))}
    </div>
  );
}
