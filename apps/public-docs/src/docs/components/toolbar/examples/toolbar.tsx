import { Link } from '@tanstack/react-router';
import { Toolbar } from '@opnay/city-ds-react/toolbar';

const itemVariants = ['primary', 'secondary', 'outline', 'ghost', 'destructive'] as const;
const linkVariants = ['secondary', 'outline', 'ghost'] as const;

function Items() {
  return (
    <>
      <Toolbar.Group>
        <Toolbar.Button>저장</Toolbar.Button>
        <Toolbar.Button disabled>공유</Toolbar.Button>
      </Toolbar.Group>
      <Toolbar.Separator />
      <Toolbar.ToggleGroup aria-label="정렬" defaultValue={['left']}>
        <Toolbar.Toggle value="left">왼쪽</Toolbar.Toggle>
        <Toolbar.Toggle value="center">가운데</Toolbar.Toggle>
      </Toolbar.ToggleGroup>
    </>
  );
}
export default function ToolbarExample() {
  return (
    <div className="city-docs-example-stack">
      <Toolbar.Root aria-label="작은 일반 도구" appearance="plain" size="sm">
        <Items />
      </Toolbar.Root>
      <Toolbar.Root aria-label="중간 띠 도구" appearance="band" size="md">
        <Items />
      </Toolbar.Root>
      <Toolbar.Root aria-label="큰 세로 도구" appearance="outline" orientation="vertical" size="lg">
        <Items />
      </Toolbar.Root>
      <Toolbar.Root aria-label="도구 항목 표현" appearance="plain" size="md">
        <Toolbar.Group>
          {itemVariants.map((variant) => (
            <Toolbar.Button key={variant} variant={variant}>
              {variant}
            </Toolbar.Button>
          ))}
        </Toolbar.Group>
        <Toolbar.Separator />
        <Toolbar.Group>
          {linkVariants.map((variant) => (
            <Toolbar.Link key={variant} render={<Link to="/components" />} variant={variant}>
              {variant} 링크
            </Toolbar.Link>
          ))}
        </Toolbar.Group>
        <Toolbar.Separator />
        <Toolbar.ToggleGroup aria-label="도구 토글 표현" defaultValue={['ghost']} multiple>
          {itemVariants.map((variant) => (
            <Toolbar.Toggle key={variant} value={variant} variant={variant}>
              {variant}
            </Toolbar.Toggle>
          ))}
        </Toolbar.ToggleGroup>
      </Toolbar.Root>
    </div>
  );
}
