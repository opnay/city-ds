import * as React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Field } from '../../src/components/field';
import { OtpInput } from '../../src/components/otp-input';

function CodeField(props: React.ComponentProps<typeof OtpInput.Root>) {
  return (
    <Field.Root>
      <Field.Label>Verification code</Field.Label>
      <OtpInput.Root {...props} />
      <Field.Description>Enter the code from your email.</Field.Description>
    </Field.Root>
  );
}

describe('OtpInput', () => {
  it('renders six numeric slots with a field label and one-time-code autofill', () => {
    render(<CodeField />);
    const group = screen.getByRole('group', { name: 'Verification code' });
    const inputs = within(group).getAllByRole('textbox');
    expect(inputs).toHaveLength(6);
    expect(inputs[0]).toHaveAccessibleName('Verification code');
    expect(inputs[0]).toHaveAttribute('autocomplete', 'one-time-code');
    expect(inputs[0]).toHaveAttribute('inputmode', 'numeric');
    expect(group).toHaveAccessibleDescription('Enter the code from your email.');
  });

  it('advances focus, reports completion and leaves form submission to the consumer', async () => {
    const user = userEvent.setup();
    const complete = vi.fn();
    const submit = vi.fn((event: React.FormEvent) => event.preventDefault());
    const { container } = render(
      <form onSubmit={submit}>
        <CodeField name="code" onValueComplete={complete} />
        <button type="submit">Verify</button>
      </form>,
    );
    const inputs = screen.getAllByRole('textbox');
    await user.click(inputs[0]!);
    await user.keyboard('012345');
    expect(inputs.map((input) => (input as HTMLInputElement).value).join('')).toBe('012345');
    expect(inputs[5]).toHaveFocus();
    expect(complete).toHaveBeenCalledTimes(1);
    expect(complete.mock.calls[0]?.[0]).toBe('012345');
    expect(submit).not.toHaveBeenCalled();
    expect(new FormData(container.querySelector('form')!).get('code')).toBe('012345');
    await user.click(screen.getByRole('button', { name: 'Verify' }));
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it('filters pasted text, clamps its length and preserves leading zeroes', async () => {
    const user = userEvent.setup();
    const invalid = vi.fn();
    render(<CodeField onValueInvalid={invalid} />);
    const inputs = screen.getAllByRole('textbox');
    await user.click(inputs[0]!);
    await user.paste('01 2a-34567');
    expect(inputs.map((input) => (input as HTMLInputElement).value).join('')).toBe('012345');
    expect(invalid).toHaveBeenCalled();
  });

  it('keeps arrow, Home, End and Backspace editing behavior', async () => {
    const user = userEvent.setup();
    render(<CodeField defaultValue="123456" />);
    const inputs = screen.getAllByRole('textbox');
    await user.click(inputs[5]!);
    await user.keyboard('[Backspace]');
    expect(inputs[4]).toHaveFocus();
    expect(inputs[5]).toHaveValue('');
    await user.keyboard('[Home]');
    expect(inputs[0]).toHaveFocus();
    await user.keyboard('[ArrowRight]');
    expect(inputs[1]).toHaveFocus();
    await user.keyboard('[End]');
    expect(inputs[5]).toHaveFocus();
  });

  it('updates controlled values and supports alphanumeric codes', async () => {
    const user = userEvent.setup();
    function ControlledCode() {
      const [value, setValue] = React.useState('');
      return (
        <CodeField
          length={4}
          validationType="alphanumeric"
          normalizeValue={(text) => text.toUpperCase()}
          value={value}
          onValueChange={setValue}
        />
      );
    }
    render(<ControlledCode />);
    const inputs = screen.getAllByRole('textbox');
    await user.click(inputs[0]!);
    await user.paste('ab12');
    expect(inputs.map((input) => (input as HTMLInputElement).value).join('')).toBe('AB12');
    expect(inputs[0]).toHaveAttribute('inputmode', 'text');
  });

  it('reflects Field invalid and disabled states and prevents read-only edits', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <Field.Root invalid>
        <Field.Label>Code</Field.Label>
        <OtpInput.Root defaultValue="123456" />
      </Field.Root>,
    );
    expect(screen.getAllByRole('textbox')[0]).toHaveAttribute('aria-invalid', 'true');
    rerender(
      <Field.Root disabled>
        <Field.Label>Code</Field.Label>
        <OtpInput.Root defaultValue="123456" />
      </Field.Root>,
    );
    expect(
      screen.getAllByRole('textbox').every((input) => (input as HTMLInputElement).disabled),
    ).toBe(true);
    rerender(<CodeField defaultValue="123456" readOnly />);
    const inputs = screen.getAllByRole('textbox');
    await user.click(inputs[0]!);
    await user.keyboard('9[Backspace]');
    expect(inputs.map((input) => (input as HTMLInputElement).value).join('')).toBe('123456');
  });

  it('supports explicit grouped slots, inherited sizes, masking and input refs', () => {
    const ref = React.createRef<HTMLInputElement>();
    const { container } = render(
      <CodeField length={4} size="lg" mask defaultValue="1234">
        <OtpInput.Input ref={ref} />
        <OtpInput.Input />
        <span aria-hidden="true">–</span>
        <OtpInput.Input size="sm" />
        <OtpInput.Input />
      </CodeField>,
    );
    expect(container.querySelectorAll('[data-city-otp-input-slot]')).toHaveLength(4);
    expect(ref.current).toHaveAttribute('type', 'password');
    expect(ref.current).toHaveAttribute('data-city-size', 'lg');
    expect(container.querySelectorAll('[data-city-otp-input-slot]')[2]).toHaveAttribute(
      'data-city-size',
      'sm',
    );
  });

  it('accepts an autofill-style multi-character input event', () => {
    const change = vi.fn();
    render(<CodeField onValueChange={change} />);
    fireEvent.change(screen.getAllByRole('textbox')[0]!, { target: { value: '654321' } });
    expect(change.mock.calls.at(-1)?.[0]).toBe('654321');
  });
});
