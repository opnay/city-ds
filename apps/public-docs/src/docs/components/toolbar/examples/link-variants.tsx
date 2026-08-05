import { Link } from '@tanstack/react-router';
import { Toolbar } from '@opnay/city-ds-react/toolbar';

const variants = ['secondary', 'outline', 'ghost'] as const;

export default function ToolbarLinkVariantsExample() {
  return (
    <Toolbar.Root aria-label="링크 표면">
      <Toolbar.Group>
        {variants.map((variant) => (
          <Toolbar.Link key={variant} render={<Link to="/components" />} variant={variant}>
            {variant} 링크
          </Toolbar.Link>
        ))}
      </Toolbar.Group>
    </Toolbar.Root>
  );
}
