import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AlertDialog } from '../../src/components/alert-dialog';
import { Button } from '../../src/components/button';

describe('AlertDialog', () => {
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
    expect(document.querySelector('.bg-city-backdrop')).toHaveClass('backdrop-blur-[8px]');
    expect(dialog).toHaveClass(
      'transition-[opacity,transform]',
      'duration-(--city-duration-normal)',
      'data-[starting-style]:[transform:translateY(3%)_scale(0.97)]',
      'data-[ending-style]:[transform:translateY(3%)_scale(0.97)]',
      'motion-reduce:transition-none',
    );
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
});
