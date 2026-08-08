import { Switch } from '@opnay/city-ds-react/switch';

const sizes = ['xsm', 'sm', 'md', 'lg', 'xlg'] as const;

export default function SwitchSizesExample() {
  return (
    <div className="city-docs-example-row">
      {sizes.map((size) => (
        <Switch aria-label={`${size} 알림`} defaultChecked key={size} size={size} />
      ))}
    </div>
  );
}
