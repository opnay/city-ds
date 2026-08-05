import { Alert } from '@opnay/city-ds-react/alert';

const variants = ['info', 'success', 'warning', 'error'] as const;

export default function AlertVariantsExample() {
  return (
    <div className="city-docs-example-grid">
      {variants.map((variant) => (
        <Alert.Root key={variant} variant={variant}>
          <Alert.Title>{variant}</Alert.Title>
          <Alert.Description>호환용 variant 표현입니다.</Alert.Description>
        </Alert.Root>
      ))}
    </div>
  );
}
