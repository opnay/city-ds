import { createRouter, type RouterHistory } from '@tanstack/react-router';

import { routeTree } from './routeTree.gen';

export function createDocsRouter(history?: RouterHistory) {
  return createRouter({
    defaultPreload: 'intent',
    ...(history === undefined ? {} : { history }),
    routeTree,
    scrollRestoration: true,
  });
}

export const router = createDocsRouter();

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
