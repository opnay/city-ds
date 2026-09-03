import { ToggleGroup } from '@opnay/city-ds-react/toggle-group';

const variants = ['primary', 'secondary', 'outline', 'ghost', 'destructive'] as const;

export default function ToggleGroupVariantsExample() {
  return (
    <div className="city-docs-example-stack">
      {variants.map((variant) => (
        <ToggleGroup
          aria-label={`${variant} 서식`}
          defaultValue={['bold']}
          key={variant}
          multiple
          variant={variant}
        >
          <ToggleGroup.Item value="bold">굵게</ToggleGroup.Item>
          <ToggleGroup.Item value="italic">기울임</ToggleGroup.Item>
          <ToggleGroup.Item disabled value="underline">
            밑줄 사용 불가
          </ToggleGroup.Item>
        </ToggleGroup>
      ))}
    </div>
  );
}
