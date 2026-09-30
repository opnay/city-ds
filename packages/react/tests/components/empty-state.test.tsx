import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EmptyState } from '../../src/components/empty-state';

describe('EmptyState', () => {
  it('connects title and description to the root region and honors heading level', () => {
    render(
      <EmptyState.Root density="compact">
        <EmptyState.Title level={3}>No invoices</EmptyState.Title>
        <EmptyState.Description>Create an invoice to get started.</EmptyState.Description>
      </EmptyState.Root>,
    );

    const region = screen.getByRole('region', {
      name: 'No invoices',
      description: 'Create an invoice to get started.',
    });

    expect(region).toHaveAttribute('data-density', 'compact');
    expect(region).toHaveClass('gap-3', 'p-3');
    expect(region).toHaveAccessibleDescription('Create an invoice to get started.');
    expect(screen.getByRole('heading', { level: 3, name: 'No invoices' })).toBeInTheDocument();
  });

  it('keeps action controls keyboard accessible', async () => {
    const user = userEvent.setup();
    const onPrimary = vi.fn();
    const onSecondary = vi.fn();

    render(
      <EmptyState.Root>
        <EmptyState.Title>No reports</EmptyState.Title>
        <EmptyState.Description>
          Generate a report or learn how reports work.
        </EmptyState.Description>
        <EmptyState.Actions>
          <button onClick={onPrimary}>Generate report</button>
          <button onClick={onSecondary}>Read guide</button>
        </EmptyState.Actions>
      </EmptyState.Root>,
    );

    const region = screen.getByRole('region', { name: 'No reports' });
    const actions = screen.getByRole('button', { name: 'Generate report' }).parentElement;

    expect(region).toHaveClass('gap-4', 'p-6');
    expect(actions).toHaveClass('gap-3');
    expect(actions).not.toHaveClass('pt-1');

    await user.tab();
    expect(screen.getByRole('button', { name: 'Generate report' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onPrimary).toHaveBeenCalledTimes(1);

    await user.tab();
    expect(screen.getByRole('button', { name: 'Read guide' })).toHaveFocus();
    await user.keyboard(' ');
    expect(onSecondary).toHaveBeenCalledTimes(1);
  });
});
