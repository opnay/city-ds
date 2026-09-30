import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Switch } from '../../src/components/switch';

describe('Switch', () => {
  it('toggles Switch while leaving disabled Switch unchanged', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <>
        <Switch aria-label="Notifications" onCheckedChange={onCheckedChange} />
        <Switch aria-label="Locked notifications" disabled />
      </>,
    );

    const switchControl = screen.getByRole('switch', { name: 'Notifications' });
    const disabledSwitch = screen.getByRole('switch', { name: 'Locked notifications' });
    const switchThumb = switchControl.querySelector('span');

    expect(switchControl).toHaveClass(
      'bg-city-background',
      'before:border-city-input',
      'data-[checked]:bg-city-primary',
      'data-[checked]:before:border-city-primary',
    );
    expect(switchControl).not.toHaveClass('bg-city-muted');
    expect(switchThumb).toHaveClass('bg-city-input', 'data-[checked]:bg-city-background');

    await user.click(switchControl);
    await user.click(disabledSwitch);

    expect(switchControl).toHaveAttribute('aria-checked', 'true');
    expect(disabledSwitch).toHaveAttribute('aria-checked', 'false');
    expect(onCheckedChange).toHaveBeenLastCalledWith(
      true,
      expect.objectContaining({ reason: 'none' }),
    );
  });
});
