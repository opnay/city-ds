import { Toolbar } from '@opnay/city-ds-react/toolbar';

const variants = ['primary', 'secondary', 'outline', 'ghost', 'destructive'] as const;

export default function ToolbarToggleVariantsExample() {
  return (
    <Toolbar.Root aria-label="토글 표면">
      <Toolbar.ToggleGroup aria-label="보기" defaultValue={['outline']} multiple>
        {variants.map((variant) => (
          <Toolbar.Toggle key={variant} value={variant} variant={variant}>
            {variant}
          </Toolbar.Toggle>
        ))}
      </Toolbar.ToggleGroup>
    </Toolbar.Root>
  );
}
