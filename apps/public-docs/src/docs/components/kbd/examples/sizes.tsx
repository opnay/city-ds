import { Kbd } from '@opnay/city-ds-react/kbd';

const sizes = ['sm', 'md', 'lg'] as const;

export default function KbdSizesExample() {
  return (
    <div className="city-docs-kbd-sizes">
      {sizes.map((size) => (
        <Kbd key={size} size={size}>
          {size}
        </Kbd>
      ))}
    </div>
  );
}
