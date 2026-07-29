import { Badge } from '@opnay/city-ds-react/badge';

import { Showcase } from './showcase';

export default function Page() {
  return (
    <main className="smoke-shell">
      <header className="smoke-header">
        <div>
          <p className="smoke-eyebrow">Next.js consumer</p>
          <h1>city-ds</h1>
        </div>
        <Badge variant="outline">App Router</Badge>
      </header>
      <Showcase />
    </main>
  );
}
