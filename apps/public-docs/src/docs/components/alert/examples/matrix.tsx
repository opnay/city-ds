import { Alert } from '@opnay/city-ds-react/alert';

const tones = ['neutral', 'info', 'success', 'warning', 'destructive'] as const;
const appearances = ['subtle', 'outline'] as const;
const variants = ['info', 'success', 'warning', 'error'] as const;

export default function AlertMatrixExample() {
  return (
    <div className="city-docs-example-grid">
      {appearances.flatMap((appearance) =>
        tones.map((tone) => (
          <Alert.Root appearance={appearance} key={`${tone}-${appearance}`} tone={tone}>
            <Alert.Title>{tone}</Alert.Title>
            <Alert.Description>{appearance} 표시입니다.</Alert.Description>
          </Alert.Root>
        )),
      )}
      {variants.map((variant) => (
        <Alert.Root key={variant} showIcon={false} variant={variant}>
          <Alert.Title>{variant}</Alert.Title>
          <Alert.Description>아이콘 없이도 의미를 전달합니다.</Alert.Description>
        </Alert.Root>
      ))}
    </div>
  );
}
