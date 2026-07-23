'use client';

import { useState } from 'react';
import { Button } from '@city-ds/react/button';
import { Field } from '@city-ds/react/field';
import { Input } from '@city-ds/react/input';
import { Progress } from '@city-ds/react/progress';
import { Tabs } from '@city-ds/react/tabs';

export function Showcase() {
  const [saved, setSaved] = useState(false);

  return (
    <section className="smoke-card" aria-labelledby="deployment-title">
      <div>
        <h2 id="deployment-title">Deployment settings</h2>
        <p>Subpath exports rendered across a server and client component boundary.</p>
      </div>

      <Field.Root>
        <Field.Label>Environment</Field.Label>
        <Input defaultValue="production" />
        <Field.Description>Rendered by a city-ds Base UI input.</Field.Description>
      </Field.Root>

      <Progress.Root aria-label="Release readiness" value={84}>
        <div className="smoke-progress-label">
          <Progress.Label>Release readiness</Progress.Label>
          <Progress.Value />
        </div>
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>

      <Tabs.Root defaultValue="summary">
        <Tabs.List aria-label="Deployment details">
          <Tabs.Tab value="summary">Summary</Tabs.Tab>
          <Tabs.Tab value="checks">Checks</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="summary">
          React Server Components can import city-ds subpaths.
        </Tabs.Panel>
        <Tabs.Panel value="checks">
          Client interactions remain isolated behind “use client”.
        </Tabs.Panel>
      </Tabs.Root>

      <div className="smoke-actions">
        <span aria-live="polite">{saved ? 'Settings saved.' : 'No pending changes.'}</span>
        <Button onClick={() => setSaved(true)}>Save settings</Button>
      </div>
    </section>
  );
}
