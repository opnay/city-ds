import { Callout } from '@opnay/city-ds-react/callout';

const tones = ['neutral', 'info', 'success', 'warning', 'destructive'] as const;
const appearances = ['subtle', 'outline'] as const;
const variants = ['info', 'success', 'warning', 'error'] as const;

export default function CalloutMatrixExample() {
  return (
    <div className="city-docs-example-grid">
      {appearances.flatMap((appearance) =>
        tones.map((tone) => (
          <Callout.Root appearance={appearance} key={`${tone}-${appearance}`} tone={tone}>
            <Callout.Title>{tone}</Callout.Title>
            <Callout.Description>{appearance} 안내입니다.</Callout.Description>
          </Callout.Root>
        )),
      )}
      {variants.map((variant) => (
        <Callout.Root key={variant} showIcon={false} variant={variant}>
          <Callout.Title>{variant}</Callout.Title>
          <Callout.Description>아이콘 없는 안내입니다.</Callout.Description>
        </Callout.Root>
      ))}
    </div>
  );
}
