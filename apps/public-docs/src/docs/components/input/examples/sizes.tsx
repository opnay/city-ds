import { Input } from '@opnay/city-ds-react/input';

const sizes = ['sm', 'md', 'lg'] as const;

export default function InputSizesExample() {
  return (
    <div className="city-docs-example-stack">
      {sizes.map((size) => (
        <Input aria-label={`${size} 입력`} key={size} placeholder={`${size} 입력`} size={size} />
      ))}
    </div>
  );
}
