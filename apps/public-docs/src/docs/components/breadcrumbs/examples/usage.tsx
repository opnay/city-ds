import { Link } from '@tanstack/react-router';
import { Breadcrumbs } from '@opnay/city-ds-react/breadcrumbs';

export default function BreadcrumbsUsageExample() {
  return (
    <Breadcrumbs.Root aria-label="문서 경로">
      <Breadcrumbs.List>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link render={<Link to="/" />}>홈</Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Ellipsis />
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Link render={<Link to="/components" />}>컴포넌트</Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Page>Breadcrumbs</Breadcrumbs.Page>
        </Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs.Root>
  );
}
