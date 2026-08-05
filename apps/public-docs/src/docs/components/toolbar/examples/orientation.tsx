import { Toolbar } from '@opnay/city-ds-react/toolbar';

export default function ToolbarOrientationExample() {
  return (
    <div className="city-docs-example-row">
      <Toolbar.Root aria-label="가로 도구" orientation="horizontal">
        <Toolbar.Button>저장</Toolbar.Button>
        <Toolbar.Button>공유</Toolbar.Button>
      </Toolbar.Root>
      <Toolbar.Root aria-label="세로 도구" orientation="vertical">
        <Toolbar.Button>저장</Toolbar.Button>
        <Toolbar.Button>공유</Toolbar.Button>
      </Toolbar.Root>
    </div>
  );
}
