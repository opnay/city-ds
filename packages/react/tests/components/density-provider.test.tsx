import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { DensityProvider } from '../../src/components/density-provider';
import { FileUpload } from '../../src/components/file-upload';
import { Menu } from '../../src/components/menu';
import { Pagination } from '../../src/components/pagination';
import { Tabs } from '../../src/components/tabs';

describe('DensityProvider', () => {
  it('provides compact density to composite controls', async () => {
    const user = userEvent.setup();

    render(
      <DensityProvider density="compact">
        <Tabs.Root defaultValue="overview">
          <Tabs.List>
            <Tabs.Tab value="overview">Overview</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="overview">Overview panel</Tabs.Panel>
        </Tabs.Root>
        <Pagination.Root onPageChange={() => undefined} page={1} totalPages={2} />
        <FileUpload.Root>
          <FileUpload.Trigger />
        </FileUpload.Root>
        <Menu.Root>
          <Menu.Trigger>Actions</Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner>
              <Menu.Popup>
                <Menu.Item>Open</Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </DensityProvider>,
    );

    expect(screen.getByRole('tablist')).toHaveAttribute('data-city-density', 'compact');
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toHaveAttribute(
      'data-city-density',
      'compact',
    );
    expect(screen.getByRole('button', { name: 'Choose files' })).toHaveAttribute(
      'data-city-density',
      'compact',
    );

    await user.click(screen.getByRole('button', { name: 'Actions' }));
    expect(await screen.findByRole('menu')).toHaveAttribute('data-city-density', 'compact');
  });

  it('allows an explicit composite density to override the provider', () => {
    render(
      <DensityProvider density="compact">
        <Tabs.Root defaultValue="overview" density="comfortable">
          <Tabs.List>
            <Tabs.Tab value="overview">Overview</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="overview">Overview panel</Tabs.Panel>
        </Tabs.Root>
      </DensityProvider>,
    );

    expect(screen.getByRole('tablist')).toHaveAttribute('data-city-density', 'comfortable');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveClass('h-7', 'text-sm');
  });
});
