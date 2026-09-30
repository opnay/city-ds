import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Menu } from '../../src/components/menu';

describe('Menu', () => {
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
              <Menu.Arrow data-testid="menu-arrow" />
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
      'bg-city-background',
      'max-h-(--available-height)',
      'overflow-y-auto',
      'overscroll-contain',
    );
    const scrollUpIndicator = screen.getByTestId('menu-scroll-up');
    expect(scrollUpIndicator.firstElementChild).toHaveClass('bg-city-background');
    expect(scrollUpIndicator).not.toHaveAttribute('data-visible');
    fireEvent.scroll(screen.getByRole('menu'), { target: { scrollTop: 16 } });
    expect(scrollUpIndicator).toHaveAttribute('data-visible');
    fireEvent.scroll(screen.getByRole('menu'), { target: { scrollTop: 0 } });
    expect(scrollUpIndicator).not.toHaveAttribute('data-visible');
    expect(screen.getByRole('menuitem', { name: 'Archive' })).toHaveClass(
      'pl-2',
      'text-city-destructive',
      'hover:bg-city-accent-hover',
      'data-[highlighted]:bg-city-accent-hover',
      'data-[highlighted]:text-city-destructive',
    );
    expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveClass('pl-2');
    expect(screen.getByTestId('menu-arrow')).toHaveClass(
      'overflow-clip',
      'data-[side=left]:rotate-90',
      'data-[side=right]:-rotate-90',
      'before:size-[8.5px]',
      'before:border-city-border',
      'text-city-background',
    );
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
});
