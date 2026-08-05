import { Badge } from '@opnay/city-ds-react/badge';

const modes = ['label', 'count', 'dot'] as const;
const tones = ['neutral', 'info', 'success', 'warning', 'destructive'] as const;
const appearances = ['solid', 'subtle', 'outline'] as const;

export default function BadgePresentationExample() {
  return (
    <div className="city-docs-example-grid">
      {modes.flatMap((mode) =>
        tones.flatMap((tone) =>
          appearances.map((appearance) => (
            <Badge
              {...(mode === 'count'
                ? { count: 3 }
                : mode === 'dot'
                  ? { 'aria-label': `${tone} 상태`, dot: true }
                  : { children: tone })}
              appearance={appearance}
              key={`${mode}-${tone}-${appearance}`}
              tone={tone}
            />
          )),
        ),
      )}
    </div>
  );
}
