import { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Field,
  Input,
  Menu,
  Popover,
  Progress,
  Switch,
  Tabs,
  type CityTheme,
} from '@city-ds/react';

const THEMES: readonly CityTheme[] = ['system', 'light', 'dark'];

export function App() {
  const [theme, setTheme] = useState<CityTheme>('system');
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    if (theme === 'system') {
      delete document.documentElement.dataset.theme;
      return;
    }

    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <main className="smoke-shell">
      <header className="smoke-header">
        <div>
          <p className="smoke-eyebrow">Vite consumer</p>
          <h1>city-ds</h1>
        </div>
        <Badge variant="outline">workspace package</Badge>
      </header>

      <section className="smoke-card" aria-labelledby="preferences-title">
        <div className="smoke-section-heading">
          <div>
            <h2 id="preferences-title">Workspace preferences</h2>
            <p>Public exports and compiled package CSS, consumed without source aliases.</p>
          </div>
          <Switch
            aria-label="Use compact density"
            checked={compact}
            onCheckedChange={setCompact}
            size={compact ? 'sm' : 'md'}
          />
        </div>

        <Field.Root>
          <Field.Label>Project name</Field.Label>
          <Input defaultValue="Seoul operations" size={compact ? 'sm' : 'md'} />
          <Field.Description>Shared Base UI behavior with city-ds tokens.</Field.Description>
        </Field.Root>

        <div className="smoke-row" aria-label="Theme">
          {THEMES.map((item) => (
            <Button
              key={item}
              aria-pressed={theme === item}
              onClick={() => setTheme(item)}
              size={compact ? 'sm' : 'md'}
              variant={theme === item ? 'primary' : 'outline'}
            >
              {item}
            </Button>
          ))}
        </div>

        <Progress.Root aria-label="Migration progress" value={72}>
          <div className="smoke-progress-label">
            <Progress.Label>Migration</Progress.Label>
            <Progress.Value />
          </div>
          <Progress.Track>
            <Progress.Indicator />
          </Progress.Track>
        </Progress.Root>

        <Popover.Root>
          <Popover.Trigger>Inspect filters</Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner sideOffset={8}>
              <Popover.Popup>
                <Popover.Title>Smoke popover</Popover.Title>
                <Popover.Description>
                  Root exports include styled popover primitives.
                </Popover.Description>
                <Popover.Close className="mt-4">Close</Popover.Close>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>

        <Menu.Root>
          <Menu.Trigger aria-label="Workspace actions">Actions</Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner sideOffset={6}>
              <Menu.Popup>
                <Menu.Item>Open command palette</Menu.Item>
                <Menu.Item>Export report</Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>

        <Tabs.Root defaultValue="activity">
          <Tabs.List aria-label="Workspace view">
            <Tabs.Tab value="activity">Activity</Tabs.Tab>
            <Tabs.Tab value="settings">Settings</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="activity">All consumer checks are ready to run.</Tabs.Panel>
          <Tabs.Panel value="settings">
            Theme: {theme}. Density: {compact ? 'compact' : 'default'}.
          </Tabs.Panel>
        </Tabs.Root>
      </section>
    </main>
  );
}
