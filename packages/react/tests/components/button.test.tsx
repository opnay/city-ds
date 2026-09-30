import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '../../src/components/button';

describe('Button', () => {
  it('runs button actions and prevents disabled interaction', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <>
        <Button onClick={onClick}>Save</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button aria-label="Open settings" iconOnly size="sm" variant="ghost">
          <span aria-hidden="true">S</span>
        </Button>
        <Button disabled onClick={onClick}>
          Disabled
        </Button>
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'Save' }));
    await user.click(screen.getByRole('button', { name: 'Disabled' }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Save' })).toHaveClass(
      'bg-city-primary',
      'hover:bg-city-primary-hover',
      'active:bg-city-primary-active',
      'focus-visible:ring-2',
      'focus-visible:ring-offset-2',
    );
    expect(screen.getByRole('button', { name: 'Secondary' })).toHaveClass(
      'bg-city-accent',
      'hover:bg-city-accent-hover',
      'active:bg-city-accent-active',
    );
    expect(screen.getByRole('button', { name: 'Outline' })).toHaveClass('border-city-border');
    expect(screen.getByRole('button', { name: 'Ghost' })).toHaveClass(
      'hover:bg-city-accent',
      'active:bg-city-accent-active',
    );
    expect(screen.getByRole('button', { name: 'Open settings' })).toHaveAttribute(
      'data-city-icon-only',
      '',
    );
    expect(screen.getByRole('button', { name: 'Open settings' })).toHaveClass(
      'city-button',
      'h-(--city-control-sm)',
      'w-(--city-control-sm)',
      'px-0',
    );
  });
});
