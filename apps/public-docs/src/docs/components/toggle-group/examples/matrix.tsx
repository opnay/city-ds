import { useState } from 'react';
import { ToggleGroup } from '@opnay/city-ds-react/toggle-group';
const variants = ['primary', 'secondary', 'outline', 'ghost', 'destructive'] as const;
const sizes = ['sm', 'md', 'lg'] as const;
export default function ToggleGroupMatrixExample() {
  const [controlledValue, setControlledValue] = useState(['grid']);

  return (
    <div className="city-docs-example-stack">
      {variants.map((variant, index) => (
        <ToggleGroup
          key={variant}
          aria-label={`${variant} 보기`}
          defaultValue={['list']}
          multiple
          orientation={index === 0 ? 'vertical' : 'horizontal'}
          size={sizes[index % sizes.length]!}
          variant={variant}
        >
          <ToggleGroup.Item value="grid">격자</ToggleGroup.Item>
          <ToggleGroup.Item value="list">목록</ToggleGroup.Item>
        </ToggleGroup>
      ))}
      <ToggleGroup
        aria-label="단일 보기"
        defaultValue={['grid']}
        multiple={false}
        size="lg"
        variant="outline"
      >
        <ToggleGroup.Item value="grid">격자</ToggleGroup.Item>
        <ToggleGroup.Item value="list">목록</ToggleGroup.Item>
      </ToggleGroup>
      <ToggleGroup
        aria-label="제어된 보기"
        onValueChange={setControlledValue}
        value={controlledValue}
        variant="secondary"
      >
        <ToggleGroup.Item value="grid">격자</ToggleGroup.Item>
        <ToggleGroup.Item value="list">목록</ToggleGroup.Item>
        <ToggleGroup.Item disabled value="map">
          지도
        </ToggleGroup.Item>
      </ToggleGroup>
    </div>
  );
}
