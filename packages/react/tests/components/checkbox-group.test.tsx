import * as React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { CheckboxGroup } from '../../src/components/checkbox-group';
import { Field } from '../../src/components/field';

describe('CheckboxGroup', () => {
  it('groups CheckboxGroup items with shared label, value changes, keyboard, and form values', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      return Array.from(formData.getAll('channels'));
    });

    render(
      <form onSubmit={onSubmit}>
        <div id="channels-label">Notification channels</div>
        <div id="channels-description">Choose at least one channel.</div>
        <CheckboxGroup
          aria-describedby="channels-description"
          aria-labelledby="channels-label"
          defaultValue={['email']}
          onValueChange={onValueChange}
        >
          <CheckboxGroup.Item name="channels" value="email">
            Email
          </CheckboxGroup.Item>
          <CheckboxGroup.Item name="channels" value="sms">
            SMS
          </CheckboxGroup.Item>
        </CheckboxGroup>
        <button type="submit">Submit</button>
      </form>,
    );

    const group = screen.getByRole('group', { name: 'Notification channels' });
    const email = screen.getByRole('checkbox', { name: 'Email' });
    const sms = screen.getByRole('checkbox', { name: 'SMS' });

    expect(group).toHaveAccessibleDescription('Choose at least one channel.');
    expect(email).toHaveAttribute('aria-checked', 'true');

    sms.focus();
    await user.keyboard('[Space]');

    expect(sms).toHaveAttribute('aria-checked', 'true');
    expect(onValueChange).toHaveBeenLastCalledWith(
      ['email', 'sms'],
      expect.objectContaining({ reason: 'none' }),
    );

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveReturnedWith(['email', 'sms']);
  });

  it('labels CheckboxGroup items independently and inherits group state and size', () => {
    render(
      <Field.Root invalid>
        <Field.Label>Notification channels</Field.Label>
        <CheckboxGroup disabled size="lg">
          <CheckboxGroup.Item value="email">Email</CheckboxGroup.Item>
          <CheckboxGroup.Item size="sm" value="sms">
            SMS
          </CheckboxGroup.Item>
        </CheckboxGroup>
      </Field.Root>,
    );

    const group = screen.getByRole('group', { name: 'Notification channels' });
    const email = within(group).getByRole('checkbox', { name: 'Email' });
    const sms = within(group).getByRole('checkbox', { name: 'SMS' });

    expect(group).toHaveAttribute('data-invalid');
    expect(group).not.toHaveClass('data-[disabled]:opacity-50');
    expect(email).toHaveAttribute('data-disabled');
    expect(email).toHaveAttribute('data-invalid');
    expect(email).toHaveClass('data-[disabled]:opacity-100');
    expect(email).toHaveClass('size-4');
    expect(sms).toHaveClass('size-3');
  });
});
