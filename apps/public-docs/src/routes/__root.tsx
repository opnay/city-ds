import { createRootRoute } from '@tanstack/react-router';
import { Toast } from '@opnay/city-ds-react/toast';

import { DocsMdxProvider } from '../components/docs-mdx';
import { DocsError, DocsNotFound, DocsPending, DocsShell } from '../components/docs-shell';

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: DocsError,
  notFoundComponent: DocsNotFound,
  pendingComponent: DocsPending,
});

function RootComponent() {
  return (
    <Toast.Provider limit={3} timeout={5000}>
      <DocsMdxProvider>
        <DocsShell />
      </DocsMdxProvider>
    </Toast.Provider>
  );
}
