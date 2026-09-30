import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../../src/components/button';
import { Popover } from '../../src/components/popover';

describe('Popover', () => {
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
              <Popover.Arrow data-testid="popover-arrow" />
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
    expect(document.querySelector('.bg-city-backdrop-subtle')).toHaveClass('backdrop-blur-[8px]');
    expect(screen.getByText('Refine the deployments list.')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Done' })).toHaveClass('text-xs');
    expect(screen.getByTestId('popover-arrow')).toHaveClass(
      'overflow-clip',
      'data-[side=left]:-right-[9px]',
      'data-[side=right]:-left-[9px]',
      'before:size-[8.5px]',
      'before:border-city-border',
      'text-city-surface-raised',
    );

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
});
