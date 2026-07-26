import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../../src/components/button';
import { Dialog } from '../../src/components/dialog';
import { Drawer } from '../../src/components/drawer';
import { Popover } from '../../src/components/popover';
import { Select } from '../../src/components/select';
import { Tabs } from '../../src/components/tabs';
import { Tooltip } from '../../src/components/tooltip';
import { Toast } from '../../src/components/toast';

describe('overlay and selection controls', () => {
  it('opens a dialog, restores trigger focus, and exposes a labelled dialog', async () => {
    const user = userEvent.setup();

    render(
      <Dialog.Root>
        <Dialog.Trigger render={<Button />}>Open dialog</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Viewport>
            <Dialog.Popup>
              <Dialog.Title>Delete project</Dialog.Title>
              <Dialog.Description>This action cannot be undone.</Dialog.Description>
              <Dialog.Close render={<Button variant="secondary" />}>Cancel</Dialog.Close>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>,
    );

    const trigger = screen.getByRole('button', { name: 'Open dialog' });
    expect(trigger).toHaveClass('bg-city-primary');
    expect(trigger).not.toHaveClass('bg-city-surface-raised');
    await user.click(trigger);

    expect(await screen.findByRole('dialog', { name: 'Delete project' })).toBeVisible();
    expect(screen.getByText('This action cannot be undone.')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveClass('bg-city-accent');

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('opens a drawer, closes on Escape, and restores trigger focus', async () => {
    const user = userEvent.setup();

    render(
      <Drawer.Root>
        <Drawer.Trigger render={<Button variant="outline" />}>Open drawer</Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Backdrop />
          <Drawer.Viewport>
            <Drawer.Popup>
              <Drawer.Content>
                <Drawer.Title>Navigation</Drawer.Title>
                <Drawer.Description>Move between product areas.</Drawer.Description>
                <Drawer.Close render={<Button variant="ghost" />}>Done</Drawer.Close>
              </Drawer.Content>
            </Drawer.Popup>
          </Drawer.Viewport>
        </Drawer.Portal>
      </Drawer.Root>,
    );

    const trigger = screen.getByRole('button', { name: 'Open drawer' });
    expect(trigger).toHaveClass('bg-city-background', 'border-city-border');
    expect(trigger).not.toHaveClass('bg-city-surface-raised');
    await user.click(trigger);

    expect(await screen.findByRole('dialog', { name: 'Navigation' })).toBeVisible();
    expect(screen.getByText('Move between product areas.')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Done' })).toHaveClass('hover:bg-city-accent');

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('keeps outside controls available for non-modal drawers', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <Drawer.Root modal={false}>
          <Drawer.Trigger>Open task panel</Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Viewport>
              <Drawer.Popup>
                <Drawer.Content>
                  <Drawer.Title>Task panel</Drawer.Title>
                  <Drawer.Close>Close task panel</Drawer.Close>
                </Drawer.Content>
              </Drawer.Popup>
            </Drawer.Viewport>
          </Drawer.Portal>
        </Drawer.Root>
        <button type="button">Outside action</button>
      </div>,
    );

    await user.click(screen.getByRole('button', { name: 'Open task panel' }));

    expect(await screen.findByRole('dialog', { name: 'Task panel' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Outside action' })).toBeVisible();
  });

  it('opens a popover, closes on Escape, and restores trigger focus', async () => {
    const user = userEvent.setup();

    render(
      <Popover.Root>
        <Popover.Trigger render={<Button variant="outline" />}>Open filters</Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner sideOffset={8}>
            <Popover.Popup>
              <Popover.Title>Filters</Popover.Title>
              <Popover.Description>Refine the deployments list.</Popover.Description>
              <Popover.Close>Done</Popover.Close>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>,
    );

    const trigger = screen.getByRole('button', { name: 'Open filters' });
    expect(trigger).toHaveClass('bg-city-background', 'border-city-border');
    expect(trigger).not.toHaveClass('bg-city-surface-raised');
    await user.click(trigger);

    expect(await screen.findByRole('dialog', { name: 'Filters' })).toBeVisible();
    expect(screen.getByText('Refine the deployments list.')).toBeVisible();

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('closes a popover after outside interaction and supports controlled state details', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <div>
        <Popover.Root onOpenChange={onOpenChange}>
          <Popover.Trigger>Open settings</Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner>
              <Popover.Popup>
                <Popover.Title>Settings</Popover.Title>
                <button type="button">Focusable action</button>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
        <button type="button">Outside target</button>
      </div>,
    );

    await user.click(screen.getByRole('button', { name: 'Open settings' }));
    expect(await screen.findByRole('dialog', { name: 'Settings' })).toBeVisible();
    expect(onOpenChange).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ reason: 'trigger-press' }),
    );

    await user.click(screen.getByRole('button', { name: 'Outside target' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(onOpenChange).toHaveBeenCalledWith(
      false,
      expect.objectContaining({ reason: 'outside-press' }),
    );
  });

  it('selects an option and passes Base UI event details', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Select.Root defaultValue="draft" onValueChange={onValueChange}>
        <Select.Trigger
          aria-label="Status"
          className={(state) => (state.open ? 'is-open' : 'is-closed')}
        >
          <Select.Value placeholder="Choose status" />
          <Select.Icon />
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner>
            <Select.Popup>
              <Select.List>
                <Select.Item value="draft">
                  <Select.ItemIndicator />
                  <Select.ItemText>Draft</Select.ItemText>
                </Select.Item>
                <Select.Item value="published">
                  <Select.ItemIndicator />
                  <Select.ItemText>Published</Select.ItemText>
                </Select.Item>
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>,
    );

    const trigger = screen.getByRole('combobox', { name: 'Status' });
    expect(trigger).toHaveClass('is-closed');
    await user.click(trigger);
    const published = await screen.findByRole('option', { name: 'Published' });
    expect(trigger).toHaveClass('is-open');
    await user.click(published);

    expect(onValueChange).toHaveBeenCalledWith(
      'published',
      expect.objectContaining({ reason: 'item-press' }),
    );
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
  });

  it('activates tabs with keyboard navigation when activateOnFocus is enabled', async () => {
    const user = userEvent.setup();

    render(
      <Tabs.Root defaultValue="overview">
        <Tabs.List activateOnFocus>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="activity">Activity</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="overview">Overview panel</Tabs.Panel>
        <Tabs.Panel value="activity">Activity panel</Tabs.Panel>
      </Tabs.Root>,
    );

    const overview = screen.getByRole('tab', { name: 'Overview' });
    overview.focus();
    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('tab', { name: 'Activity' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Activity panel');
  });

  it('shows a tooltip on hover with the supplied zero delay', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip.Provider delay={0}>
        <Tooltip.Root>
          <Tooltip.Trigger render={<Button variant="ghost" />}>More info</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Positioner>
              <Tooltip.Popup>Helpful context</Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    const trigger = screen.getByRole('button', { name: 'More info' });
    expect(trigger).toHaveClass('hover:bg-city-accent');
    expect(trigger).not.toHaveClass('bg-city-surface-raised');

    await user.hover(trigger);

    expect(await screen.findByRole('tooltip')).toHaveTextContent('Helpful context');
  });

  it('adds and dismisses a toast through the Base UI toast manager', async () => {
    const user = userEvent.setup();

    render(
      <Toast.Provider timeout={0}>
        <ToastExample />
      </Toast.Provider>,
    );

    await user.click(screen.getByRole('button', { name: 'Show notification' }));

    expect(await screen.findByText('Changes saved')).toBeVisible();
    await user.hover(screen.getByRole('dialog', { name: 'Changes saved' }));
    await user.click(screen.getByRole('button', { name: 'Close notification' }));

    await waitFor(() => expect(screen.queryByText('Changes saved')).not.toBeInTheDocument());
  });
});

function ToastExample() {
  const manager = Toast.useToastManager();

  return (
    <>
      <button
        type="button"
        onClick={() =>
          manager.add({ title: 'Changes saved', description: 'Your project is up to date.' })
        }
      >
        Show notification
      </button>
      <Toast.Portal>
        <Toast.Viewport>
          {manager.toasts.map((toast) => (
            <Toast.Root key={toast.id} toast={toast}>
              <Toast.Content>
                <div>
                  <Toast.Title />
                  <Toast.Description />
                </div>
                <Toast.Close />
              </Toast.Content>
            </Toast.Root>
          ))}
        </Toast.Viewport>
      </Toast.Portal>
    </>
  );
}
