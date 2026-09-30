import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { RadioGroup } from '../../src/components/radio-group';

describe('RadioGroup', () => {
  it('changes RadioGroup values through labels and reports Base UI details', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <RadioGroup defaultValue="system" onValueChange={onValueChange}>
        <RadioGroup.Item value="system">System</RadioGroup.Item>
        <RadioGroup.Item value="dark">Dark</RadioGroup.Item>
      </RadioGroup>,
    );

    expect(screen.getByRole('radio', { name: 'System' })).toHaveAttribute('aria-checked', 'true');
    await user.click(screen.getByText('Dark'));

    expect(screen.getByRole('radio', { name: 'Dark' })).toHaveAttribute('aria-checked', 'true');
    expect(onValueChange).toHaveBeenLastCalledWith(
      'dark',
      expect.objectContaining({ reason: 'none' }),
    );
  });

  it('inherits RadioGroup root size while preserving item overrides', () => {
    render(
      <RadioGroup aria-label="Density" defaultValue="comfortable" size="lg">
        <RadioGroup.Item value="comfortable">Comfortable</RadioGroup.Item>
        <RadioGroup.Item size="sm" value="compact">
          Compact
        </RadioGroup.Item>
      </RadioGroup>,
    );

    const comfortable = screen.getByRole('radio', { name: 'Comfortable' });
    const compact = screen.getByRole('radio', { name: 'Compact' });

    expect(comfortable).toHaveAttribute('data-city-size', 'lg');
    expect(comfortable).toHaveClass('size-4');
    expect(comfortable.querySelector('span')).toHaveClass('size-2');
    expect(compact).toHaveAttribute('data-city-size', 'sm');
    expect(compact).toHaveClass('size-3');
  });
});
