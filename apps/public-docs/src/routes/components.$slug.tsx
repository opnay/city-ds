import { createFileRoute, notFound } from '@tanstack/react-router';

import { ComponentDocPage } from '../components/doc-page';
import { getComponentDoc } from '../docs/doc-catalog';

export const Route = createFileRoute('/components/$slug')({
  component: ComponentRoute,
  loader: async ({ params }) => {
    const entry = getComponentDoc(params.slug);
    if (!entry) throw notFound();

    const module = await entry.load();
    return { Content: module.default, entry };
  },
});

function ComponentRoute() {
  const { Content, entry } = Route.useLoaderData();
  return <ComponentDocPage Content={Content} entry={entry} />;
}
