import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Button } from '../../src/components/button';
import { Drawer } from '../../src/components/drawer';

describe('Drawer', () => {
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
    expect(document.querySelector('.bg-city-backdrop')).toHaveClass(
      'backdrop-blur-[8px]',
      'opacity-[calc(1-var(--drawer-swipe-progress))]',
      'duration-(--city-duration-normal)',
      'ease-city-standard',
      'data-[starting-style]:opacity-0',
      'data-[ending-style]:opacity-0',
      'motion-reduce:transition-none',
    );
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
              <Drawer.Content>Asset health</Drawer.Content>
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
    expect(drawer).toHaveClass(
      'w-[min(32rem,calc(100vw-2rem))]',
      'transition-transform',
      '[transform:translateX(var(--drawer-swipe-movement-x))]',
      'data-[starting-style]:[transform:translateX(100%)]',
      'data-[ending-style]:[transform:translateX(100%)]',
      'duration-(--city-duration-normal)',
      'ease-city-standard',
      'data-[swiping]:duration-0',
      'motion-reduce:transition-none',
    );
    expect(screen.getByText('Asset details').parentElement).toHaveAttribute(
      'data-city-drawer-header',
    );
    expect(body).toHaveAttribute('data-city-drawer-body');
    expect(screen.getByRole('button', { name: 'Close asset details' })).toHaveClass('text-xs');
    expect(
      screen.getByRole('button', { name: 'Close asset details' }).parentElement,
    ).toHaveAttribute('data-city-drawer-footer');
  });

  it('slides left and bottom drawers in from outside their owning edges', async () => {
    render(
      <>
        <Drawer.Root defaultOpen modal={false} swipeDirection="left">
          <Drawer.Portal>
            <Drawer.Viewport side="left">
              <Drawer.Popup data-testid="left-drawer" side="left">
                <Drawer.Title>Left navigation</Drawer.Title>
              </Drawer.Popup>
            </Drawer.Viewport>
          </Drawer.Portal>
        </Drawer.Root>
        <Drawer.Root defaultOpen modal={false} swipeDirection="down">
          <Drawer.Portal>
            <Drawer.Viewport side="bottom">
              <Drawer.Popup data-testid="bottom-drawer" side="bottom">
                <Drawer.Title>Bottom actions</Drawer.Title>
              </Drawer.Popup>
            </Drawer.Viewport>
          </Drawer.Portal>
        </Drawer.Root>
      </>,
    );

    expect(await screen.findByTestId('left-drawer')).toHaveClass(
      '[transform:translateX(var(--drawer-swipe-movement-x))]',
      'data-[starting-style]:[transform:translateX(-100%)]',
      'data-[ending-style]:[transform:translateX(-100%)]',
    );
    expect(screen.getByTestId('bottom-drawer')).toHaveClass(
      '[transform:translateY(var(--drawer-swipe-movement-y))]',
      'data-[starting-style]:[transform:translateY(100%)]',
      'data-[ending-style]:[transform:translateY(100%)]',
    );
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
});
