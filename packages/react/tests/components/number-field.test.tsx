import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Field } from '../../src/components/field';
import { NumberField } from '../../src/components/number-field';

function QuantityField(props: React.ComponentProps<typeof NumberField.Root>) {
  return (
    <Field.Root>
      <Field.Label>Quantity</Field.Label>
      <NumberField.Root {...props}>
        <NumberField.Group>
          <NumberField.Input />
          <NumberField.Decrement aria-label="Decrease quantity" />
          <NumberField.Increment aria-label="Increase quantity" />
        </NumberField.Group>
      </NumberField.Root>
    </Field.Root>
  );
}

describe('NumberField', () => {
  it('accepts typed values and emits numeric changes', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(<QuantityField defaultValue={2} onValueChange={onValueChange} />);

    const input = screen.getByRole('textbox', { name: 'Quantity' });
    await user.clear(input);
    await user.type(input, '42');

    expect(input).toHaveValue('42');
    expect(onValueChange).toHaveBeenLastCalledWith(
      42,
      expect.objectContaining({ reason: 'input-change' }),
    );
  });

  it('increments and decrements with stepper buttons', async () => {
    const user = userEvent.setup();

    render(<QuantityField defaultValue={5} step={2} />);

    const input = screen.getByRole('textbox', { name: 'Quantity' });
    const increment = screen.getByRole('button', { name: 'Increase quantity' });
    expect(increment).toHaveClass('hover:bg-city-accent', 'active:bg-city-accent-active');

    await user.click(increment);
    expect(input).toHaveValue('7');

    await user.click(screen.getByRole('button', { name: 'Decrease quantity' }));
    expect(input).toHaveValue('5');
  });

  it('clamps arrow-key changes to the configured range', async () => {
    const user = userEvent.setup();

    render(<QuantityField defaultValue={10} max={10} min={0} />);

    const input = screen.getByRole('textbox', { name: 'Quantity' });
    input.focus();
    await user.keyboard('[ArrowUp]');
    expect(input).toHaveValue('10');

    await user.keyboard('[ControlLeft>][KeyA][/ControlLeft]0[ArrowDown]');
    expect(input).toHaveValue('0');
  });

  it('supports controlled and uncontrolled value contracts', async () => {
    const user = userEvent.setup();

    function ControlledField() {
      const [value, setValue] = React.useState<number | null>(1);

      return <QuantityField value={value} onValueChange={setValue} />;
    }

    render(
      <>
        <ControlledField />
        <NumberField.Root defaultValue={3}>
          <NumberField.Group>
            <NumberField.Input aria-label="Uncontrolled quantity" />
            <NumberField.Increment aria-label="Increase uncontrolled quantity" />
          </NumberField.Group>
        </NumberField.Root>
      </>,
    );

    const controlledInput = screen.getByRole('textbox', { name: 'Quantity' });
    await user.click(screen.getByRole('button', { name: 'Increase quantity' }));
    expect(controlledInput).toHaveValue('2');

    const uncontrolledInput = screen.getByRole('textbox', { name: 'Uncontrolled quantity' });
    await user.click(screen.getByRole('button', { name: 'Increase uncontrolled quantity' }));
    expect(uncontrolledInput).toHaveValue('4');
  });

  it('inherits the root size while allowing leaf overrides', () => {
    render(
      <Field.Root>
        <Field.Label>Capacity</Field.Label>
        <NumberField.Root defaultValue={8} size="lg">
          <NumberField.Group data-testid="capacity-group">
            <NumberField.Input />
            <NumberField.Decrement aria-label="Decrease capacity" />
            <NumberField.Increment aria-label="Increase capacity" size="sm" />
          </NumberField.Group>
        </NumberField.Root>
      </Field.Root>,
    );

    const input = screen.getByRole('textbox', { name: 'Capacity' });
    const decrement = screen.getByRole('button', { name: 'Decrease capacity' });
    const increment = screen.getByRole('button', { name: 'Increase capacity' });

    expect(screen.getByTestId('capacity-group')).toHaveClass('min-h-(--city-control-lg)');
    expect(input).toHaveClass('h-(--city-control-lg)');
    expect(decrement).toHaveClass('h-(--city-control-lg)', 'w-(--city-control-lg)');
    expect(increment).toHaveAttribute('data-city-size', 'sm');
    expect(increment).toHaveClass('h-(--city-control-sm)', 'w-(--city-control-sm)');
  });
});
