import { Callout } from '@opnay/city-ds-react/callout';

const tones = ['neutral', 'info', 'success', 'warning', 'destructive'] as const;
const appearances = ['subtle', 'outline'] as const;

export default function CalloutPresentationExample() {
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
    </div>
  );
}
