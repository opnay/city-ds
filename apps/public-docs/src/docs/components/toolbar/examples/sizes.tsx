import { Toolbar } from '@opnay/city-ds-react/toolbar';

const sizes = ['sm', 'md', 'lg'] as const;

export default function ToolbarSizesExample() {
  return (
    <div className="city-docs-example-stack">
      {sizes.map((size) => (
        <Toolbar.Root aria-label={`${size} 도구`} key={size} size={size}>
          <Toolbar.Group>
            <Toolbar.Button>저장</Toolbar.Button>
            <Toolbar.Button>공유</Toolbar.Button>
          </Toolbar.Group>
        </Toolbar.Root>
      ))}
    </div>
  );
}
