import { Toggle } from '@opnay/city-ds-react/toggle';

const variants = ['primary', 'secondary', 'outline', 'ghost', 'destructive'] as const;

export default function ToggleVariantsExample() {
  return (
    <div className="city-docs-example-stack">
      {variants.map((variant) => (
        <div className="city-docs-example-row" key={variant}>
          <Toggle defaultPressed value={`${variant}-on`} variant={variant}>
            {variant} 선택
          </Toggle>
          <Toggle value={`${variant}-off`} variant={variant}>
            {variant} 해제
          </Toggle>
        </div>
      ))}
    </div>
  );
}
