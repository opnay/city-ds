import { Button } from '@opnay/city-ds-react/button';

const variants = ['primary', 'secondary', 'outline', 'ghost', 'destructive'] as const;

export default function ButtonVariantsExample() {
  return (
    <div className="city-docs-example-row">
      {variants.map((variant) => (
        <Button key={variant} type="button" variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  );
}
