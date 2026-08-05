import { Badge } from '@opnay/city-ds-react/badge';

const variants = ['solid', 'subtle', 'outline', 'destructive'] as const;

export default function BadgeVariantsExample() {
  return (
    <div className="city-docs-example-row">
      {variants.map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  );
}
