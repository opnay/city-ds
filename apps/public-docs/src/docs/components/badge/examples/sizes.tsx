import { Badge } from '@opnay/city-ds-react/badge';

const sizes = ['sm', 'md', 'lg'] as const;

export default function BadgeSizesExample() {
  return (
    <div className="city-docs-example-row">
      {sizes.map((size) => (
        <Badge key={size} size={size}>
          {size}
        </Badge>
      ))}
    </div>
  );
}
