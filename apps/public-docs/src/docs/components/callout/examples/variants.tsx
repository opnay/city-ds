import { Callout } from '@opnay/city-ds-react/callout';

const variants = ['info', 'success', 'warning', 'error'] as const;

export default function CalloutVariantsExample() {
  return (
    <div className="city-docs-example-grid">
      {variants.map((variant) => (
        <Callout.Root key={variant} variant={variant}>
          <Callout.Title>{variant}</Callout.Title>
          <Callout.Description>호환용 variant 표현입니다.</Callout.Description>
        </Callout.Root>
      ))}
    </div>
  );
}
