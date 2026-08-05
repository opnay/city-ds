import { Alert } from '@opnay/city-ds-react/alert';

const tones = ['neutral', 'info', 'success', 'warning', 'destructive'] as const;
const appearances = ['subtle', 'outline'] as const;

export default function AlertPresentationExample() {
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
    </div>
  );
}
