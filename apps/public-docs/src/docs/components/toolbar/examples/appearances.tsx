import { Toolbar } from '@opnay/city-ds-react/toolbar';

const appearances = ['plain', 'band', 'outline'] as const;

export default function ToolbarAppearancesExample() {
  return (
    <div className="city-docs-example-stack">
      {appearances.map((appearance) => (
        <Toolbar.Root aria-label={`${appearance} 도구`} appearance={appearance} key={appearance}>
          <Toolbar.Group>
            <Toolbar.Button>저장</Toolbar.Button>
            <Toolbar.Button>공유</Toolbar.Button>
          </Toolbar.Group>
        </Toolbar.Root>
      ))}
    </div>
  );
}
