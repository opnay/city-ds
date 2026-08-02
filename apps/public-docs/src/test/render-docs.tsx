import { render } from '@testing-library/react';
import { createMemoryHistory, RouterProvider, type RouterHistory } from '@tanstack/react-router';

import { createDocsRouter } from '../router';

export async function renderDocs(initialEntries: string[] = ['/']) {
  const history: RouterHistory = createMemoryHistory({ initialEntries });
  const router = createDocsRouter(history);

  await router.load();

  return {
    history,
    router,
    ...render(<RouterProvider router={router} />),
  };
}
