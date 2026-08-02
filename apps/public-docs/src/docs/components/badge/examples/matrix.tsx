import { Badge } from '@opnay/city-ds-react/badge';

const tones = ['neutral', 'info', 'success', 'warning', 'destructive'] as const;
const appearances = ['solid', 'subtle', 'outline'] as const;
const sizes = ['sm', 'md', 'lg'] as const;
const modes = ['label', 'count', 'dot'] as const;
const legacyVariants = ['solid', 'subtle', 'outline', 'destructive'] as const;

export default function BadgeMatrixExample() {
  return (
    <div className="city-docs-example-stack">
      <div className="city-docs-example-row">
        {legacyVariants.map((variant) => (
          <Badge key={variant} variant={variant}>
            {variant}
          </Badge>
        ))}
      </div>
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
                size={
                  sizes[(tones.indexOf(tone) + appearances.indexOf(appearance)) % sizes.length]!
                }
                tone={tone}
              />
            )),
          ),
        )}
      </div>
    </div>
  );
}
