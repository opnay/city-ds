import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Input, InputGroup, Textarea } from '../../src/components/input';

describe('Input and InputGroup', () => {
  it('preserves Input and Textarea uncontrolled value changes', async () => {
    const user = userEvent.setup();
    const onInputValueChange = vi.fn();

    render(
      <>
        <Input aria-label="Project" defaultValue="City" onValueChange={onInputValueChange} />
        <Textarea aria-label="Notes" defaultValue="Initial" />
      </>,
    );

    const input = screen.getByRole('textbox', { name: 'Project' });
    const textarea = screen.getByRole('textbox', { name: 'Notes' });

    await user.clear(input);
    await user.type(input, 'Metro');
    await user.clear(textarea);
    await user.type(textarea, 'Updated');

    expect(input).toHaveValue('Metro');
    expect(textarea).toHaveValue('Updated');
    expect(onInputValueChange).toHaveBeenLastCalledWith(
      'Metro',
      expect.objectContaining({ reason: 'none' }),
    );
  });

  it('renders leading and trailing InputGroup slots around its input', () => {
    render(
      <>
        <InputGroup.Root data-testid="affixed-input-group" size="lg">
          <InputGroup.Addon>https://</InputGroup.Addon>
          <Input aria-label="Domain" />
          <InputGroup.Addon position="trailing">.dev</InputGroup.Addon>
        </InputGroup.Root>
        <InputGroup.Root data-testid="textarea-group" size="lg">
          <Textarea aria-label="Grouped notes" />
        </InputGroup.Root>
      </>,
    );

    expect(screen.getByText('https://')).toHaveAttribute('data-city-position', 'leading');
    expect(screen.getByText('https://')).toHaveAttribute('data-city-size', 'lg');
    expect(screen.getByText('https://')).toHaveClass('pl-3');
    expect(screen.getByText('https://')).not.toHaveClass('px-2');
    expect(screen.getByText('.dev')).toHaveAttribute('data-city-position', 'trailing');
    expect(screen.getByText('.dev')).toHaveAttribute('data-city-size', 'lg');
    expect(screen.getByText('.dev')).toHaveClass('order-last', 'pr-2.5');
    expect(screen.getByText('.dev')).not.toHaveClass('px-2');
    expect(screen.getByTestId('affixed-input-group')).toHaveClass(
      'gap-1',
      '[&:has(>[data-city-position=leading])>input]:pl-0',
      '[&:has(>[data-city-position=trailing])>input]:pr-0',
    );
    expect(screen.getByRole('textbox', { name: 'Domain' })).toHaveClass(
      'h-(--city-control-lg)',
      'px-3',
      'text-sm',
    );
    expect(screen.getByTestId('textarea-group')).toHaveClass(
      'has-[textarea]:h-auto',
      'has-[textarea]:min-h-(--city-control-lg)',
    );
  });
});
