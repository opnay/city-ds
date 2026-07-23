import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Dialog } from '../../src/components/dialog';
import { Select } from '../../src/components/select';
import { Tabs } from '../../src/components/tabs';
import { Tooltip } from '../../src/components/tooltip';
import { Toast } from '../../src/components/toast';

describe('overlay and selection controls', () => {
  it('opens a dialog, restores trigger focus, and exposes a labelled dialog', async () => {
    const user = userEvent.setup();

    render(
      <Dialog.Root>
        <Dialog.Trigger render={<button type="button" />}>Open dialog</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Viewport>
            <Dialog.Popup>
              <Dialog.Title>Delete project</Dialog.Title>
              <Dialog.Description>This action cannot be undone.</Dialog.Description>
              <Dialog.Close>Cancel</Dialog.Close>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>,
    );

    const trigger = screen.getByRole('button', { name: 'Open dialog' });
    await user.click(trigger);

    expect(await screen.findByRole('dialog', { name: 'Delete project' })).toBeVisible();
    expect(screen.getByText('This action cannot be undone.')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
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
          <Tooltip.Trigger>More info</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Positioner>
              <Tooltip.Popup>Helpful context</Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    await user.hover(screen.getByRole('button', { name: 'More info' }));

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
