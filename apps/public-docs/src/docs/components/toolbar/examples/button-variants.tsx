import { Toolbar } from '@opnay/city-ds-react/toolbar';

const variants = ['primary', 'secondary', 'outline', 'ghost', 'destructive'] as const;

export default function ToolbarButtonVariantsExample() {
  return (
    <Toolbar.Root aria-label="명령 표면">
      <Toolbar.Group>
        {variants.map((variant) => (
          <Toolbar.Button key={variant} variant={variant}>
            {variant}
          </Toolbar.Button>
        ))}
      </Toolbar.Group>
    </Toolbar.Root>
  );
}
