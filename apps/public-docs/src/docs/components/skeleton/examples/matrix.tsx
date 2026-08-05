import { Skeleton } from '@opnay/city-ds-react/skeleton';

const variants = ['text', 'circular', 'rectangular'] as const;
const sizes = ['sm', 'md', 'lg'] as const;

export default function SkeletonMatrixExample() {
  return (
    <div className="city-docs-example-stack">
      {variants.map((variant) => (
        <div key={variant} className="city-docs-example-row">
          {sizes.map((size) => (
            <Skeleton key={size} size={size} variant={variant} />
          ))}
        </div>
      ))}
    </div>
  );
}
