import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AlertDialog } from '../../src/components/alert-dialog';
import { Button } from '../../src/components/button';
import { Dialog } from '../../src/components/dialog';
import { Drawer } from '../../src/components/drawer';
import { Menu } from '../../src/components/menu';
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
    expect(document.querySelector('.bg-city-backdrop')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveClass('bg-city-accent');

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('applies dialog size and body-scroll shell contracts', async () => {
    const user = userEvent.setup();

    render(
      <Dialog.Root>
        <Dialog.Trigger>Open activity</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Viewport>
            <Dialog.Popup scroll="body" size="lg">
              <Dialog.Header>
                <div>
                  <Dialog.Title>Project activity</Dialog.Title>
                  <Dialog.Description>Recent project updates.</Dialog.Description>
                </div>
              </Dialog.Header>
              <Dialog.Body>Scrollable activity</Dialog.Body>
              <Dialog.Footer>
                <Dialog.Close>Close</Dialog.Close>
              </Dialog.Footer>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>,
    );

    await user.click(screen.getByRole('button', { name: 'Open activity' }));

    const dialog = await screen.findByRole('dialog', { name: 'Project activity' });
    const body = screen.getByText('Scrollable activity');

    expect(dialog).toHaveAttribute('data-size', 'lg');
    expect(dialog).toHaveAttribute('data-scroll', 'body');
    expect(dialog).toHaveClass('max-w-2xl', 'flex', 'overflow-hidden', 'p-0');
    expect(
      screen.getByText('Recent project updates.').closest('[data-city-dialog-header]'),
    ).toHaveClass('border-b', 'px-5');
    expect(body).toHaveAttribute('data-city-dialog-body');
    expect(body).toHaveClass('min-h-0', 'overflow-y-auto', 'p-5');
    expect(screen.getByRole('button', { name: 'Close' })).toHaveClass('text-xs');
    expect(screen.getByRole('button', { name: 'Close' }).parentElement).toHaveAttribute(
      'data-city-dialog-footer',
    );
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
    expect(document.querySelector('.bg-city-backdrop')).toBeInTheDocument();
    expect(screen.getByText('Move between product areas.')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Done' })).toHaveClass('hover:bg-city-accent');

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('applies drawer size and header, body, and footer shell contracts', async () => {
    const user = userEvent.setup();

    render(
      <Drawer.Root>
        <Drawer.Trigger>Open asset details</Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Backdrop />
          <Drawer.Viewport side="right">
            <Drawer.Popup side="right" size="lg">
              <Drawer.Header>
                <Drawer.Title>Asset details</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>Asset health</Drawer.Body>
              <Drawer.Footer>
                <Drawer.Close>Close asset details</Drawer.Close>
              </Drawer.Footer>
            </Drawer.Popup>
          </Drawer.Viewport>
        </Drawer.Portal>
      </Drawer.Root>,
    );

    await user.click(screen.getByRole('button', { name: 'Open asset details' }));

    const drawer = await screen.findByRole('dialog', { name: 'Asset details' });
    const body = screen.getByText('Asset health');

    expect(drawer).toHaveAttribute('data-size', 'lg');
    expect(drawer).toHaveAttribute('data-side', 'right');
    expect(drawer).toHaveClass('w-[min(32rem,calc(100vw-2rem))]');
    expect(screen.getByText('Asset details').parentElement).toHaveAttribute(
      'data-city-drawer-header',
    );
    expect(body).toHaveAttribute('data-city-drawer-body');
    expect(screen.getByRole('button', { name: 'Close asset details' })).toHaveClass('text-xs');
    expect(
      screen.getByRole('button', { name: 'Close asset details' }).parentElement,
    ).toHaveAttribute('data-city-drawer-footer');
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

  it('opens an alert dialog with alertdialog semantics, keyboard close, and focus restore', async () => {
    const user = userEvent.setup();

    render(
      <AlertDialog.Root>
        <AlertDialog.Trigger render={<Button variant="destructive" />}>
          Delete project
        </AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Backdrop />
          <AlertDialog.Viewport>
            <AlertDialog.Popup>
              <AlertDialog.Title>Delete this project?</AlertDialog.Title>
              <AlertDialog.Description>This action cannot be undone.</AlertDialog.Description>
              <AlertDialog.Cancel render={<Button variant="secondary" />}>
                Cancel
              </AlertDialog.Cancel>
              <AlertDialog.Action destructive>Delete</AlertDialog.Action>
            </AlertDialog.Popup>
          </AlertDialog.Viewport>
        </AlertDialog.Portal>
      </AlertDialog.Root>,
    );

    const trigger = screen.getByRole('button', { name: 'Delete project' });
    expect(trigger).toHaveClass('h-(--city-control-md)', 'bg-city-destructive');
    expect(trigger).not.toHaveClass('bg-city-surface-raised');
    await user.click(trigger);

    const dialog = await screen.findByRole('alertdialog', { name: 'Delete this project?' });
    expect(dialog).toBeVisible();
    expect(screen.getByText('This action cannot be undone.')).toBeVisible();
    const cancel = screen.getByRole('button', { name: 'Cancel' });
    expect(cancel).toHaveClass('h-(--city-control-md)', 'bg-city-accent');
    expect(cancel).not.toHaveClass('bg-city-background');
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass(
      'bg-city-destructive',
      'hover:bg-city-destructive-hover',
      'active:bg-city-destructive-active',
      'text-xs',
    );
    await waitFor(() => expect(cancel).toHaveFocus());

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('keeps alert dialog controlled state details and closes before continuing action work', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onConfirm = vi.fn();

    render(
      <AlertDialog.Root onOpenChange={onOpenChange}>
        <AlertDialog.Trigger render={<button type="button" />}>Publish changes</AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Backdrop />
          <AlertDialog.Viewport>
            <AlertDialog.Popup>
              <AlertDialog.Title>Publish these changes?</AlertDialog.Title>
              <AlertDialog.Description>Everyone with access will see them.</AlertDialog.Description>
              <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
              <AlertDialog.Action render={<Button />} onClick={onConfirm}>
                Publish
              </AlertDialog.Action>
            </AlertDialog.Popup>
          </AlertDialog.Viewport>
        </AlertDialog.Portal>
      </AlertDialog.Root>,
    );

    await user.click(screen.getByRole('button', { name: 'Publish changes' }));
    const dialog = await screen.findByRole('alertdialog', { name: 'Publish these changes?' });
    expect(dialog).toBeVisible();
    expect(screen.getByRole('button', { name: 'Publish' })).toHaveClass(
      'h-(--city-control-md)',
      'bg-city-primary',
    );
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveClass('text-xs');
    expect(onOpenChange).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ reason: 'trigger-press' }),
    );

    await user.click(screen.getByRole('button', { name: 'Publish' }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    expect(onOpenChange).toHaveBeenCalledWith(
      false,
      expect.objectContaining({ reason: 'close-press' }),
    );
  });

  it('opens a popover, closes on Escape, and restores trigger focus', async () => {
    const user = userEvent.setup();

    render(
      <Popover.Root>
        <Popover.Trigger render={<Button variant="outline" />}>Open filters</Popover.Trigger>
        <Popover.Portal>
          <Popover.Backdrop />
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
    expect(document.querySelector('.bg-city-backdrop-subtle')).toBeInTheDocument();
    expect(screen.getByText('Refine the deployments list.')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Done' })).toHaveClass('text-xs');

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
    const icon = trigger.querySelector('[data-city-select-icon]');
    expect(trigger).toHaveClass('is-closed');
    expect(icon).toHaveClass('border-l', 'w-(--city-control-md)');
    await user.click(trigger.firstElementChild as HTMLElement);
    const published = await screen.findByRole('option', { name: 'Published' });
    expect(trigger).toHaveClass('is-open');
    expect(icon).toHaveAttribute('data-popup-open');
    expect(screen.getByRole('listbox').parentElement).toHaveClass(
      'min-w-(--anchor-width)',
      'data-[side=bottom]:-mt-px',
      'data-[side=bottom]:rounded-t-none',
    );
    await user.click(published);

    expect(onValueChange).toHaveBeenCalledWith(
      'published',
      expect.objectContaining({ reason: 'item-press' }),
    );
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
  });

  it('opens a menu, supports keyboard selection, and restores trigger focus', async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    const onArchive = vi.fn();

    render(
      <Menu.Root onOpenChange={onOpen}>
        <Menu.Trigger aria-label="Row actions">Actions</Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner>
            <Menu.Popup>
              <Menu.ScrollUpIndicator data-testid="menu-scroll-up" />
              <Menu.Item variant="destructive" onClick={onArchive}>
                Archive
              </Menu.Item>
              <Menu.Item>Duplicate</Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>,
    );

    const trigger = screen.getByRole('button', { name: 'Row actions' });
    expect(trigger).toHaveClass('hover:bg-city-accent', 'active:bg-city-accent-active');
    await user.click(trigger);

    expect(await screen.findByRole('menu')).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('menu')).toHaveClass(
      'max-h-(--available-height)',
      'overflow-y-auto',
      'overscroll-contain',
    );
    const scrollUpIndicator = screen.getByTestId('menu-scroll-up');
    expect(scrollUpIndicator).not.toHaveAttribute('data-visible');
    fireEvent.scroll(screen.getByRole('menu'), { target: { scrollTop: 16 } });
    expect(scrollUpIndicator).toHaveAttribute('data-visible');
    fireEvent.scroll(screen.getByRole('menu'), { target: { scrollTop: 0 } });
    expect(scrollUpIndicator).not.toHaveAttribute('data-visible');
    expect(screen.getByRole('menuitem', { name: 'Archive' })).toHaveClass(
      'pl-2',
      'text-city-destructive',
      'hover:bg-city-accent',
      'data-[highlighted]:bg-city-accent',
      'data-[highlighted]:text-city-destructive',
    );
    expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveClass('pl-2');
    expect(onOpen).toHaveBeenCalledWith(true, expect.objectContaining({ reason: 'trigger-press' }));

    await user.keyboard('{ArrowDown}{Enter}');

    expect(onArchive).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('propagates compact density through menu surfaces and items', async () => {
    const user = userEvent.setup();

    render(
      <Menu.Root density="compact">
        <Menu.Trigger>Compact actions</Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner>
            <Menu.Popup>
              <Menu.Group>
                <Menu.GroupLabel>Project</Menu.GroupLabel>
                <Menu.Item>Open</Menu.Item>
              </Menu.Group>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>,
    );

    await user.click(screen.getByRole('button', { name: 'Compact actions' }));

    const menu = await screen.findByRole('menu');
    const item = screen.getByRole('menuitem', { name: 'Open' });

    expect(menu).toHaveAttribute('data-city-density', 'compact');
    expect(menu).toHaveClass('p-0.5', 'text-xs');
    expect(item).toHaveAttribute('data-city-density', 'compact');
    expect(item).toHaveClass('min-h-7', 'text-xs');
    expect(screen.getByText('Project')).toHaveClass('py-1', 'text-2xs');
  });

  it('toggles menu checkbox items and selects radio items without closing the menu', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    const onValueChange = vi.fn();

    render(
      <Menu.Root>
        <Menu.Trigger>View options</Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner>
            <Menu.Popup>
              <Menu.CheckboxItem onCheckedChange={onCheckedChange}>
                <Menu.CheckboxItemIndicator />
                Show archived
              </Menu.CheckboxItem>
              <Menu.RadioGroup defaultValue="list" onValueChange={onValueChange}>
                <Menu.RadioItem value="list">
                  <Menu.RadioItemIndicator />
                  List
                </Menu.RadioItem>
                <Menu.RadioItem value="grid">
                  <Menu.RadioItemIndicator />
                  Grid
                </Menu.RadioItem>
              </Menu.RadioGroup>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>,
    );

    await user.click(screen.getByRole('button', { name: 'View options' }));
    const checkboxItem = await screen.findByRole('menuitemcheckbox', { name: 'Show archived' });
    expect(checkboxItem).toHaveClass('pl-8');
    expect(screen.getByRole('menuitemradio', { name: 'List' })).toHaveClass('pl-8');
    await user.hover(checkboxItem);
    expect(checkboxItem).toHaveAttribute('data-highlighted');
    await user.click(checkboxItem);
    await user.click(screen.getByRole('menuitemradio', { name: 'Grid' }));

    expect(onCheckedChange).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ reason: 'item-press' }),
    );
    expect(onValueChange).toHaveBeenCalledWith(
      'grid',
      expect.objectContaining({ reason: 'item-press' }),
    );
    expect(screen.getByRole('menu')).toBeVisible();
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

  it('propagates compact density through tabs and panels', () => {
    render(
      <Tabs.Root defaultValue="overview" density="compact">
        <Tabs.List>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="activity">Activity</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="overview">Overview panel</Tabs.Panel>
        <Tabs.Panel value="activity">Activity panel</Tabs.Panel>
      </Tabs.Root>,
    );

    const tablist = screen.getByRole('tablist');
    const selectedTab = screen.getByRole('tab', { name: 'Overview' });
    const panel = screen.getByRole('tabpanel');

    expect(tablist).toHaveAttribute('data-city-density', 'compact');
    expect(tablist).toHaveClass('h-(--city-control-sm)', 'gap-0.5', 'p-0.5');
    expect(selectedTab).toHaveAttribute('data-city-density', 'compact');
    expect(selectedTab).toHaveClass('h-6', 'text-xs');
    expect(panel).toHaveAttribute('data-city-density', 'compact');
    expect(panel).toHaveClass('mt-2', 'text-xs');
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

    expect(await screen.findByRole('tooltip')).toHaveClass(
      'bg-city-inverse',
      'text-city-inverse-foreground',
    );
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
    const notification = screen.getByRole('dialog', { name: 'Changes saved' });
    expect(notification).toHaveAttribute('data-city-toast-root');
    expect(notification).toHaveAttribute('data-tone', 'success');
    expect(notification).toHaveAttribute('data-appearance', 'outline');
    expect(notification).toHaveClass('border-city-success-border');
    await user.hover(notification);
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
          manager.add({
            title: 'Changes saved',
            description: 'Your project is up to date.',
            type: 'success',
          })
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
