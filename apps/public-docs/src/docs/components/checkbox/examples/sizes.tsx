import { Checkbox } from '@opnay/city-ds-react/checkbox';

const sizes = ['sm', 'md', 'lg'] as const;

export default function CheckboxSizesExample() {
  return (
    <div className="city-docs-example-row">
      {sizes.map((size) => (
        <label key={size}>
          <Checkbox aria-label={`${size} 선택`} defaultChecked size={size} /> {size}
        </label>
      ))}
    </div>
  );
}
