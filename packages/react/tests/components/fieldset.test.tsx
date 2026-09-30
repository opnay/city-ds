import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from '../../src/components/checkbox';
import { Fieldset } from '../../src/components/fieldset';
import { Input } from '../../src/components/input';
import { RadioGroup } from '../../src/components/radio-group';

describe('Fieldset', () => {
  it('uses Fieldset legend as the group accessible name', () => {
    render(
      <Fieldset.Root>
        <Fieldset.Legend>Release channels</Fieldset.Legend>
        <Fieldset.Description>Choose every channel this project can use.</Fieldset.Description>
        <label>
          <Checkbox aria-label="Stable" />
          Stable
        </label>
      </Fieldset.Root>,
    );

    expect(screen.getByRole('group', { name: 'Release channels' })).toBeVisible();
    expect(screen.getByText('Choose every channel this project can use.')).toHaveClass(
      'text-city-muted-foreground',
    );
  });

  it('supports plain and band Fieldset appearances while preserving outline defaults', () => {
    render(
      <>
        <Fieldset.Root appearance="plain">
          <Fieldset.Legend>Plain group</Fieldset.Legend>
        </Fieldset.Root>
        <Fieldset.Root appearance="band">
          <Fieldset.Legend>Band group</Fieldset.Legend>
        </Fieldset.Root>
        <Fieldset.Root>
          <Fieldset.Legend>Outline group</Fieldset.Legend>
        </Fieldset.Root>
      </>,
    );

    const plain = screen.getByRole('group', { name: 'Plain group' });
    const band = screen.getByRole('group', { name: 'Band group' });
    const outline = screen.getByRole('group', { name: 'Outline group' });

    expect(plain).toHaveAttribute('data-appearance', 'plain');
    expect(plain).toHaveClass('w-full', 'min-w-0', 'border-0', 'p-0');
    expect(band).toHaveClass('w-full', 'min-w-0', 'border-y', 'p-4');
    expect(outline).toHaveAttribute('data-appearance', 'outline');
    expect(outline).toHaveClass('w-full', 'min-w-0', 'rounded-city-md', 'border', 'p-4');
  });

  it('propagates disabled Fieldset state to native controls and composed radio groups', async () => {
    const user = userEvent.setup();
    const onRadioValueChange = vi.fn();

    render(
      <>
        <Fieldset.Root disabled>
          <Fieldset.Legend>Locked profile</Fieldset.Legend>
          <Input aria-label="Workspace" defaultValue="City" />
          <input aria-label="Native token" defaultValue="abc123" />
        </Fieldset.Root>
        <Fieldset.Root
          render={<RadioGroup defaultValue="standard" onValueChange={onRadioValueChange} />}
          disabled
        >
          <Fieldset.Legend>Locked plan</Fieldset.Legend>
          <RadioGroup.Item value="standard">Standard</RadioGroup.Item>
          <RadioGroup.Item value="enterprise">Enterprise</RadioGroup.Item>
        </Fieldset.Root>
      </>,
    );

    expect(screen.getByRole('group', { name: 'Locked profile' })).toBeDisabled();
    expect(screen.getByRole('textbox', { name: 'Workspace' })).toBeDisabled();
    expect(screen.getByRole('textbox', { name: 'Native token' })).toBeDisabled();

    await user.click(screen.getByRole('radio', { name: 'Enterprise' }));

    expect(screen.getByRole('radiogroup', { name: 'Locked plan' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(screen.getByRole('radio', { name: 'Standard' })).toHaveAttribute('aria-checked', 'true');
    expect(onRadioValueChange).not.toHaveBeenCalled();
  });
});
