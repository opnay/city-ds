import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Button } from '../../src/components/button';
import { Dialog } from '../../src/components/dialog';

describe('Dialog', () => {
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

    const dialog = await screen.findByRole('dialog', { name: 'Delete project' });
    expect(dialog).toBeVisible();
    expect(dialog).toHaveClass(
      'origin-center',
      'transition-[opacity,transform]',
      'duration-(--city-duration-normal)',
      'ease-city-standard',
      'data-[starting-style]:opacity-0',
      'data-[starting-style]:[transform:translateY(3%)_scale(0.97)]',
      'data-[ending-style]:opacity-0',
      'data-[ending-style]:[transform:translateY(3%)_scale(0.97)]',
      'motion-reduce:transition-none',
    );
    expect(document.querySelector('.bg-city-backdrop')).toHaveClass(
      'backdrop-blur-[8px]',
      'transition-opacity',
      'duration-(--city-duration-normal)',
      'ease-city-standard',
      'data-[starting-style]:opacity-0',
      'data-[ending-style]:opacity-0',
      'motion-reduce:transition-none',
    );
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
});
