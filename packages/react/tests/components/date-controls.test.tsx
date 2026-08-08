import * as React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Calendar } from '../../src/components/calendar';
import { DateField } from '../../src/components/date-field';
import { DatePicker } from '../../src/components/date-picker';
import { formatLocalDate, normalizeLocalDate, parseLocalDate } from '../../src/lib/local-date';

describe('local date values', () => {
  it('parses strict calendar dates and normalizes time components', () => {
    expect(formatLocalDate(parseLocalDate('2024-02-29'))).toBe('2024-02-29');
    expect(parseLocalDate('2023-02-29')).toBeNull();
    expect(parseLocalDate('2024-2-9')).toBeNull();
    expect(formatLocalDate(normalizeLocalDate(new Date(2026, 6, 15, 18, 45)))).toBe('2026-07-15');
  });
});

describe('DateField', () => {
  it('keeps partial input and emits only empty or valid local dates', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <DateField.Root defaultValue={new Date(2026, 6, 15, 16)} onValueChange={onValueChange}>
        <DateField.Label>Release date</DateField.Label>
        <DateField.Input />
        <DateField.Error>Enter an available date.</DateField.Error>
      </DateField.Root>,
    );

    const input = screen.getByRole('textbox', { name: 'Release date' });
    expect(input).toHaveValue('2026-07-15');

    await user.clear(input);
    expect(onValueChange).toHaveBeenLastCalledWith(null);

    await user.type(input, '2026-0');
    expect(input).toHaveValue('2026-0');
    expect(onValueChange).toHaveBeenCalledTimes(1);

    await user.type(input, '8-03');
    expect(onValueChange).toHaveBeenLastCalledWith(new Date(2026, 7, 3));
    expect(input).toHaveValue('2026-08-03');
  });

  it('marks impossible and unavailable dates invalid on blur', async () => {
    const user = userEvent.setup();

    render(
      <DateField.Root
        isDateUnavailable={(date) => date.getDay() === 0}
        maxValue={new Date(2026, 6, 31)}
        minValue={new Date(2026, 6, 1)}
        required
      >
        <DateField.Label>Deployment date</DateField.Label>
        <DateField.Input />
        <DateField.Error>Date is outside the deployment window.</DateField.Error>
      </DateField.Root>,
    );

    const input = screen.getByRole('textbox', { name: 'Deployment date' });

    await user.type(input, '2026-07-32');
    await user.tab();
    expect(input).toBeInvalid();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Date is outside the deployment window.')).toBeVisible();

    await user.click(input);
    await user.clear(input);
    await user.type(input, '2026-06-30');
    await user.tab();
    expect(input).toBeInvalid();

    await user.click(input);
    await user.clear(input);
    await user.type(input, '2026-07-18');
    await user.tab();
    expect(input).toBeValid();

    await user.click(input);
    await user.clear(input);
    await user.type(input, '2026-07-19');
    await user.tab();
    expect(input).toBeInvalid();
  });

  it('submits a valid value as YYYY-MM-DD', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    });

    render(
      <form aria-label="Release form" onSubmit={onSubmit}>
        <DateField.Root name="releaseDate">
          <DateField.Label>Release date</DateField.Label>
          <DateField.Input />
        </DateField.Root>
        <button type="submit">Submit</button>
      </form>,
    );

    await user.type(screen.getByRole('textbox', { name: 'Release date' }), '2026-08-03');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const form = screen.getByRole<HTMLFormElement>('form', { name: 'Release form' });
    expect(new FormData(form).get('releaseDate')).toBe('2026-08-03');
  });

  it('blocks form submission for an invalid date and exposes the linked error', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    });

    render(
      <form onSubmit={onSubmit}>
        <DateField.Root name="invoiceDate" required>
          <DateField.Label>Invoice date</DateField.Label>
          <DateField.Input />
          <DateField.Description>Use a real calendar date.</DateField.Description>
          <DateField.Error>Enter a valid date.</DateField.Error>
        </DateField.Root>
        <button type="submit">Submit invoice</button>
      </form>,
    );

    const input = screen.getByRole('textbox', { name: 'Invoice date' });
    await user.type(input, '2023-02-29');
    await user.click(screen.getByRole('button', { name: 'Submit invoice' }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(input).toBeInvalid();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Use a real calendar date. Enter a valid date.');
  });

  it('syncs externally controlled values and exposes field states', async () => {
    const user = userEvent.setup();

    function ControlledDateField() {
      const [value, setValue] = React.useState<Date | null>(new Date(2026, 6, 15, 18));

      return (
        <>
          <DateField.Root onValueChange={setValue} value={value}>
            <DateField.Label>Controlled date</DateField.Label>
            <DateField.Input />
          </DateField.Root>
          <button type="button" onClick={() => setValue(new Date(2026, 7, 3, 9))}>
            Use August
          </button>
        </>
      );
    }

    render(
      <>
        <ControlledDateField />
        <DateField.Root disabled>
          <DateField.Label>Disabled date</DateField.Label>
          <DateField.Input />
        </DateField.Root>
        <DateField.Root readOnly>
          <DateField.Label>Read-only date</DateField.Label>
          <DateField.Input />
        </DateField.Root>
        <DateField.Root invalid required>
          <DateField.Label>Required date</DateField.Label>
          <DateField.Input />
          <DateField.Error>Choose a date.</DateField.Error>
        </DateField.Root>
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'Use August' }));

    expect(screen.getByRole('textbox', { name: 'Controlled date' })).toHaveValue('2026-08-03');
    expect(screen.getByRole('textbox', { name: 'Disabled date' })).toBeDisabled();
    expect(screen.getByRole('textbox', { name: 'Read-only date' })).toHaveAttribute('readonly');
    expect(screen.getByRole('textbox', { name: 'Required date' })).toBeRequired();
    expect(screen.getByRole('textbox', { name: 'Required date' })).toHaveAttribute('data-invalid');
    expect(screen.getByText('Choose a date.')).toBeVisible();
  });

  it('uses exact Outline Frame height tokens at every size', () => {
    render(
      <>
        {(['xsm', 'sm', 'md', 'lg', 'xlg'] as const).map((size) => (
          <DateField.Root key={`field-${size}`} size={size}>
            <DateField.Input aria-label={`${size} date field`} />
          </DateField.Root>
        ))}
        {(['xsm', 'sm', 'md', 'lg', 'xlg'] as const).map((size) => (
          <DatePicker.Root key={`picker-${size}`} size={size}>
            <DatePicker.Group data-testid={`${size}-date-picker`}>
              <DatePicker.Input aria-label={`${size} date picker`} />
              <DatePicker.Trigger />
            </DatePicker.Group>
          </DatePicker.Root>
        ))}
      </>,
    );

    for (const size of ['xsm', 'sm', 'md', 'lg', 'xlg'] as const) {
      expect(screen.getByRole('textbox', { name: `${size} date field` })).toHaveClass(
        `h-(--city-control-${size})`,
      );
      expect(screen.getByTestId(`${size}-date-picker`)).toHaveClass(`h-(--city-control-${size})`);
    }
  });
});

describe('Calendar', () => {
  it('selects one normalized date and applies min, max, and unavailable constraints', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Calendar
        aria-label="Release calendar"
        defaultMonth={new Date(2026, 6, 1)}
        isDateUnavailable={(date) => date.getDate() === 20}
        maxValue={new Date(2026, 6, 25)}
        minValue={new Date(2026, 6, 10)}
        onValueChange={onValueChange}
        today={new Date(2026, 6, 1)}
      />,
    );

    const calendar = screen.getByLabelText('Release calendar');
    const availableDay = screen.getByRole('button', { name: /Wednesday, July 15th, 2026/ });
    const unavailableDay = screen.getByRole('button', { name: /Monday, July 20th, 2026/ });

    expect(calendar).toHaveClass('text-city-foreground');
    expect(unavailableDay).toBeDisabled();

    await user.click(availableDay);
    expect(onValueChange).toHaveBeenLastCalledWith(new Date(2026, 6, 15));
  });

  it('moves focus with arrow keys and selects with Enter', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Calendar
        aria-label="Keyboard calendar"
        autoFocus
        defaultValue={new Date(2026, 6, 15)}
        onValueChange={onValueChange}
        today={new Date(2026, 6, 15)}
      />,
    );

    expect(screen.getByRole('button', { name: /Wednesday, July 15th, 2026/ })).toHaveFocus();
    await user.keyboard('{ArrowRight}{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith(new Date(2026, 6, 16));
  });

  it('uses matching day and navigation sizes and exposes invalid styling', () => {
    render(
      <>
        {(['xsm', 'sm', 'md', 'lg', 'xlg'] as const).map((size) => (
          <Calendar
            key={size}
            aria-label={`${size} calendar`}
            defaultValue={new Date(2026, 6, 15)}
            invalid={size === 'lg'}
            size={size}
            today={new Date(2026, 6, 15)}
          />
        ))}
      </>,
    );

    for (const size of ['xsm', 'sm', 'md', 'lg', 'xlg'] as const) {
      const calendar = screen.getByLabelText(`${size} calendar`);
      expect(
        within(calendar).getByRole('button', { name: /Wednesday, July 15th, 2026/ }),
      ).toHaveClass(`size-(--city-control-${size})`);
      expect(
        within(calendar).getByRole('button', { name: 'Go to the Previous Month' }),
      ).toHaveClass(`size-(--city-control-${size})`);
    }

    expect(screen.getByLabelText('lg calendar')).toHaveClass('ring-city-destructive/30', 'ring-2');
  });
});

describe('DatePicker', () => {
  it('opens the calendar, selects one date, closes, and restores trigger focus', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <DatePicker.Root defaultValue={new Date(2026, 6, 15)} onValueChange={onValueChange}>
        <DatePicker.Label>Release date</DatePicker.Label>
        <DatePicker.Group data-testid="date-picker-group">
          <DatePicker.Input />
          <DatePicker.Trigger />
        </DatePicker.Group>
        <DatePicker.Portal>
          <DatePicker.Positioner>
            <DatePicker.Popup>
              <DatePicker.Calendar aria-label="Release calendar" today={new Date(2026, 6, 15)} />
            </DatePicker.Popup>
          </DatePicker.Positioner>
        </DatePicker.Portal>
      </DatePicker.Root>,
    );

    const trigger = screen.getByRole('button', { name: 'Open calendar' });
    expect(screen.getByTestId('date-picker-group')).toHaveClass('h-(--city-control-md)');

    await user.click(trigger);
    expect(await screen.findByLabelText('Release calendar')).toBeVisible();

    await user.click(screen.getByRole('button', { name: /Thursday, July 16th, 2026/ }));
    expect(onValueChange).toHaveBeenLastCalledWith(new Date(2026, 6, 16));
    await waitFor(() =>
      expect(screen.queryByLabelText('Release calendar')).not.toBeInTheDocument(),
    );
    expect(trigger).toHaveFocus();
    expect(screen.getByRole('textbox', { name: 'Release date' })).toHaveValue('2026-07-16');
  });

  it('closes on Escape and supports controlled open state', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    function ControlledPicker() {
      const [open, setOpen] = React.useState(false);
      return (
        <DatePicker.Root
          onOpenChange={(nextOpen, details) => {
            setOpen(nextOpen);
            onOpenChange(nextOpen, details);
          }}
          open={open}
        >
          <DatePicker.Label>Start date</DatePicker.Label>
          <DatePicker.Group>
            <DatePicker.Input />
            <DatePicker.Trigger />
          </DatePicker.Group>
          <DatePicker.Portal>
            <DatePicker.Positioner>
              <DatePicker.Popup>
                <DatePicker.Calendar aria-label="Start calendar" />
              </DatePicker.Popup>
            </DatePicker.Positioner>
          </DatePicker.Portal>
        </DatePicker.Root>
      );
    }

    render(<ControlledPicker />);

    const trigger = screen.getByRole('button', { name: 'Open calendar' });
    await user.click(trigger);
    expect(await screen.findByLabelText('Start calendar')).toBeVisible();

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByLabelText('Start calendar')).not.toBeInTheDocument());
    expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.any(Object));
    expect(trigger).toHaveFocus();
  });

  it('keeps a read-only calendar inspectable without changing the value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <DatePicker.Root
        defaultValue={new Date(2026, 6, 15)}
        onValueChange={onValueChange}
        readOnly
        size="lg"
      >
        <DatePicker.Label>Audit date</DatePicker.Label>
        <DatePicker.Group data-testid="readonly-date-picker">
          <DatePicker.Input />
          <DatePicker.Trigger />
        </DatePicker.Group>
        <DatePicker.Portal>
          <DatePicker.Positioner>
            <DatePicker.Popup>
              <DatePicker.Calendar aria-label="Audit calendar" today={new Date(2026, 6, 15)} />
            </DatePicker.Popup>
          </DatePicker.Positioner>
        </DatePicker.Portal>
      </DatePicker.Root>,
    );

    expect(screen.getByTestId('readonly-date-picker')).toHaveClass('h-(--city-control-lg)');
    await user.click(screen.getByRole('button', { name: 'Open calendar' }));
    await user.click(await screen.findByRole('button', { name: /Thursday, July 16th, 2026/ }));

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Audit calendar')).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Audit date' })).toHaveValue('2026-07-15');
  });

  it('propagates invalid, disabled, and required states to composed controls', async () => {
    const user = userEvent.setup();

    render(
      <>
        <DatePicker.Root disabled>
          <DatePicker.Label>Disabled picker</DatePicker.Label>
          <DatePicker.Group>
            <DatePicker.Input />
            <DatePicker.Trigger aria-label="Open disabled calendar" />
          </DatePicker.Group>
        </DatePicker.Root>
        <DatePicker.Root invalid required>
          <DatePicker.Label>Required picker</DatePicker.Label>
          <DatePicker.Group data-testid="invalid-picker-group">
            <DatePicker.Input />
            <DatePicker.Trigger aria-label="Open required calendar" />
          </DatePicker.Group>
          <DatePicker.Portal>
            <DatePicker.Positioner>
              <DatePicker.Popup>
                <DatePicker.Calendar aria-label="Required calendar" />
              </DatePicker.Popup>
            </DatePicker.Positioner>
          </DatePicker.Portal>
        </DatePicker.Root>
      </>,
    );

    expect(screen.getByRole('textbox', { name: 'Disabled picker' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Open disabled calendar' })).toBeDisabled();
    expect(screen.getByRole('textbox', { name: 'Required picker' })).toBeRequired();
    expect(screen.getByTestId('invalid-picker-group')).toHaveAttribute('data-invalid');

    await user.click(screen.getByRole('button', { name: 'Open required calendar' }));
    expect(await screen.findByLabelText('Required calendar')).toHaveClass(
      'ring-city-destructive/30',
      'ring-2',
    );
  });
});
