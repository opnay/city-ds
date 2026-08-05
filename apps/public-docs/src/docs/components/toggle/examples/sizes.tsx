import { Toggle } from '@opnay/city-ds-react/toggle';

const sizes = ['sm', 'md', 'lg'] as const;

export default function ToggleSizesExample() {
  return (
    <div className="city-docs-example-row">
      {sizes.map((size) => (
        <Toggle defaultPressed key={size} size={size} value={size}>
          {size}
        </Toggle>
      ))}
    </div>
  );
}
