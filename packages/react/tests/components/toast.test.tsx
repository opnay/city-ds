import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { Toaster, toast } from '../../src/components/toast';

afterEach(() => {
  toast.dismiss();
});

describe('Toast', () => {
  it('adds and dismisses a toast through Sonner', async () => {
    const user = userEvent.setup();

    render(<ToastExample />);

    await user.click(screen.getByRole('button', { name: 'Show notification' }));

    const title = await screen.findByText('Changes saved');
    expect(title).toBeVisible();
    const notification = title.closest<HTMLElement>('[data-sonner-toast]');
    expect(notification).not.toBeNull();
    expect(notification).toHaveAttribute('data-type', 'success');
    expect(notification).not.toHaveAttribute('data-appearance');
    expect(notification).toHaveClass(
      'city-toast-root',
      'city-toast-surface',
      'border',
      'border-current',
      'text-city-success',
    );
    expect(notification).not.toHaveClass(
      'border-city-success-border',
      'bg-city-success-surface',
      'text-city-foreground',
    );
    expect(
      notification?.querySelector('[data-icon] [data-city-toast-default-icon]'),
    ).not.toBeNull();
    expect(notification?.querySelector('[data-content]')).toHaveClass('pt-0.5');
    fireEvent.click(screen.getByRole('button', { name: 'Close notification' }));

    await waitFor(() => expect(screen.queryByText('Changes saved')).not.toBeInTheDocument());
  });

  it('keeps the default toast icon when an action is present', async () => {
    const user = userEvent.setup();

    render(<ToastExample />);

    await user.click(screen.getByRole('button', { name: 'Show actionable notification' }));

    const title = await screen.findByText('Review required');
    const notification = title.closest<HTMLElement>('[data-sonner-toast]');
    expect(notification).toHaveAttribute('data-type', 'warning');
    expect(
      notification?.querySelector('[data-icon] [data-city-toast-default-icon]'),
    ).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Review' })).toHaveAttribute('data-action');
  });

  it('keeps a custom toast icon when a custom action is present', async () => {
    const user = userEvent.setup();

    render(
      <>
        <button
          type="button"
          onClick={() =>
            toast.warning('Custom notification', {
              action: <button type="button">Open details</button>,
              icon: <span data-custom-toast-icon="" />,
            })
          }
        >
          Show custom notification
        </button>
        <Toaster duration={Infinity} />
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'Show custom notification' }));

    const title = await screen.findByText('Custom notification');
    const notification = title.closest<HTMLElement>('[data-sonner-toast]');
    expect(notification?.querySelector('[data-icon] [data-custom-toast-icon]')).not.toBeNull();
    expect(notification?.querySelector('[data-city-toast-default-icon]')).toBeNull();
    expect(screen.getByRole('button', { name: 'Open details' })).toHaveAttribute('data-action');
  });
});

function ToastExample() {
  return (
    <>
      <button
        type="button"
        onClick={() =>
          toast.success('Changes saved', {
            description: 'Your project is up to date.',
          })
        }
      >
        Show notification
      </button>
      <button
        type="button"
        onClick={() =>
          toast.warning('Review required', {
            action: {
              label: 'Review',
              onClick: () => undefined,
            },
            description: 'Check the deployment status.',
          })
        }
      >
        Show actionable notification
      </button>
      <Toaster duration={Infinity} />
    </>
  );
}
