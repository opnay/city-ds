import { useState } from 'react';
import { Toggle } from '@opnay/city-ds-react/toggle';
const variants = ['primary', 'secondary', 'outline', 'ghost', 'destructive'] as const;
const sizes = ['sm', 'md', 'lg'] as const;
export default function ToggleMatrixExample() {
  const [pressed, setPressed] = useState(false);

  return (
    <div className="city-docs-example-stack">
      {variants.map((variant, index) => {
        const pressedSize = sizes[index % sizes.length]!;
        const unpressedSize = sizes[(index + 1) % sizes.length]!;
        return (
          <div key={variant} className="city-docs-example-row">
            <Toggle defaultPressed size={pressedSize} value={variant} variant={variant}>
              {variant} 선택
            </Toggle>
            <Toggle size={unpressedSize} value={`${variant}-off`} variant={variant}>
              {variant} 해제
            </Toggle>
          </div>
        );
      })}
      <div className="city-docs-example-row">
        <Toggle onPressedChange={setPressed} pressed={pressed} variant="outline">
          제어됨: {pressed ? '선택' : '해제'}
        </Toggle>
        <Toggle disabled variant="secondary">
          비활성 토글
        </Toggle>
      </div>
    </div>
  );
}
