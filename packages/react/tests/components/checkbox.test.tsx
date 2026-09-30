import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from '../../src/components/checkbox';

describe('Checkbox', () => {
  it('supports Checkbox checked, indeterminate, and disabled states', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <>
        <Checkbox aria-label="Terms" onCheckedChange={onCheckedChange} />
        <Checkbox aria-label="Partial" indeterminate />
        <Checkbox aria-label="Locked" disabled onCheckedChange={onCheckedChange} />
      </>,
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Terms' });
    await user.click(checkbox);
    await user.click(screen.getByRole('checkbox', { name: 'Locked' }));

    expect(checkbox).toHaveAttribute('aria-checked', 'true');
    expect(checkbox).toHaveClass('inline-grid');
    expect(checkbox).not.toHaveClass('grid');
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('checkbox', { name: 'Partial' })).toHaveAttribute(
      'aria-checked',
      'mixed',
    );
  });
});
