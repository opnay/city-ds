import { createFileRoute, notFound } from '@tanstack/react-router';
import { getBlockDoc } from '../blocks/block-catalog';
import { BlockPage } from '../components/block-pages';

export const Route = createFileRoute('/blocks/$slug')({
  loader: async ({ params }) => {
    const entry = getBlockDoc(params.slug);
    if (!entry) throw notFound();
    return { entry, ...(await entry.load()) };
  },
  component: BlockRoute,
});

function BlockRoute() {
  const data = Route.useLoaderData();
  return <BlockPage key={data.entry.slug} {...data} />;
}
