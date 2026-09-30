import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Badge } from '../../src/components/badge';
import { Button } from '../../src/components/button';
import { Checkbox } from '../../src/components/checkbox';
import { Combobox } from '../../src/components/combobox';
import { Field } from '../../src/components/field';
import { Input, InputGroup } from '../../src/components/input';
import { RadioGroup } from '../../src/components/radio-group';
import { SegmentedControl } from '../../src/components/segmented-control';
import { Select } from '../../src/components/select';
import { Switch } from '../../src/components/switch';

describe('shared control contracts', () => {
  it('uses the five-step shared control size scale', () => {
    render(
      <>
        <Button size="xsm">Extra small button</Button>
        <Button size="sm">Small button</Button>
        <SegmentedControl aria-label="Medium view" defaultValue="grid" size="md">
          <SegmentedControl.Item value="grid">Medium segment</SegmentedControl.Item>
        </SegmentedControl>
        <Input aria-label="Large input" size="lg" />
        <Input aria-label="Extra large input" size="xlg" />
        <InputGroup.Root data-testid="small-input-group" size="sm">
          <Input aria-label="Grouped input" />
        </InputGroup.Root>
      </>,
    );

    expect(screen.getByRole('button', { name: 'Extra small button' })).toHaveClass(
      'h-(--city-control-xsm)',
      'text-xs',
    );
    expect(screen.getByRole('button', { name: 'Small button' })).toHaveClass(
      'h-(--city-control-sm)',
      'text-xs',
    );
    expect(screen.getByRole('radio', { name: 'Medium segment' })).toHaveClass(
      'h-(--city-control-md)',
      'text-xs',
    );
    expect(screen.getByRole('textbox', { name: 'Large input' })).toHaveClass(
      'h-(--city-control-lg)',
      'text-sm',
    );
    expect(screen.getByRole('textbox', { name: 'Extra large input' })).toHaveClass(
      'h-(--city-control-xlg)',
      'text-sm',
    );
    expect(screen.getByTestId('small-input-group')).toHaveClass('h-(--city-control-sm)');
    expect(screen.getByRole('textbox', { name: 'Grouped input' })).toHaveClass(
      'h-(--city-control-sm)',
      'px-2',
      'text-xs',
    );
  });

  it('derives atomic radius from final height and preserves semantic round shapes', () => {
    render(
      <>
        <Button size="sm">Rectangular button</Button>
        <SegmentedControl aria-label="Rectangular view" defaultValue="grid" size="lg">
          <SegmentedControl.Item value="grid">Rectangular segment</SegmentedControl.Item>
        </SegmentedControl>
        <Input aria-label="Rectangular input" size="md" />
        <Checkbox aria-label="Compact checkbox" size="lg" />
        <Badge data-testid="badge-sm" size="sm">
          Small
        </Badge>
        <Badge data-testid="badge-md" size="md">
          Medium
        </Badge>
        <Badge data-testid="badge-lg" size="lg">
          Large
        </Badge>
        <Badge aria-hidden="true" count={3} data-testid="count-badge" />
        <RadioGroup defaultValue="round">
          <RadioGroup.Item value="round">Round radio</RadioGroup.Item>
        </RadioGroup>
        <Switch aria-label="Round switch" />
      </>,
    );

    expect(screen.getByRole('button', { name: 'Rectangular button' })).toHaveClass(
      'rounded-city-sm',
    );
    expect(screen.getByRole('radio', { name: 'Rectangular segment' })).toHaveClass(
      'rounded-city-sm',
    );
    expect(screen.getByRole('textbox', { name: 'Rectangular input' })).toHaveClass(
      'rounded-city-sm',
    );
    expect(screen.getByRole('checkbox', { name: 'Compact checkbox' })).toHaveClass(
      'rounded-city-xs',
    );
    expect(screen.getByTestId('badge-sm')).toHaveClass('h-5', 'rounded-city-xs');
    expect(screen.getByTestId('badge-md')).toHaveClass('h-6', 'rounded-city-sm');
    expect(screen.getByTestId('badge-lg')).toHaveClass('h-7', 'rounded-city-sm');
    expect(screen.getByTestId('count-badge')).toHaveClass('rounded-city-full');
    expect(screen.getByRole('radio', { name: 'Round radio' })).toHaveClass('rounded-city-full');
    expect(screen.getByRole('switch', { name: 'Round switch' })).toHaveClass('rounded-city-full');
  });

  it('sizes Select and Combobox from their roots and styles invalid fields', () => {
    render(
      <>
        <Field.Root invalid>
          <Select.Root defaultValue="central" items={{ central: 'Central' }} size="sm">
            <Field.Label>District</Field.Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Icon />
            </Select.Trigger>
          </Select.Root>
        </Field.Root>
        <Field.Root invalid>
          <Combobox.Root items={['Civic Portal', 'Transit Map', 'Permit Tracker']} size="lg">
            <Field.Label>Facility</Field.Label>
            <Combobox.InputGroup>
              <Combobox.Input />
              <Combobox.Trigger />
            </Combobox.InputGroup>
          </Combobox.Root>
        </Field.Root>
      </>,
    );

    const select = screen.getByRole('combobox', { name: 'District' });
    const combobox = screen.getByRole('combobox', { name: 'Facility' });
    const comboboxGroup = combobox.parentElement;
    const comboboxTrigger = screen.getByRole('button', { name: 'Facility' });

    expect(select).toHaveAttribute('data-city-size', 'sm');
    expect(select).toHaveAttribute('data-invalid');
    expect(select).toHaveClass(
      'bg-city-background',
      'h-(--city-control-sm)',
      'overflow-hidden',
      'data-[invalid]:border-city-destructive',
    );
    expect(select).not.toHaveClass('bg-city-surface-raised', 'gap-1.5', 'px-2');
    expect(select).toHaveClass('group');
    const selectIcon = select.querySelector('[data-city-select-icon]');
    expect(selectIcon).toHaveAttribute('data-city-size', 'sm');
    expect(selectIcon).toHaveClass(
      'h-full',
      'border-l',
      'w-(--city-control-sm)',
      'group-hover:bg-city-accent',
      'group-active:bg-city-accent-active',
      'data-[popup-open]:[&>svg]:rotate-180',
    );
    expect(selectIcon).not.toHaveAttribute('role', 'button');
    expect(selectIcon).not.toHaveAttribute('tabindex');
    expect(selectIcon?.previousElementSibling).toHaveClass('px-2');
    expect(combobox).toHaveAttribute('data-city-size', 'lg');
    expect(combobox).toHaveClass('self-stretch', 'px-3');
    expect(comboboxGroup).toHaveAttribute('data-city-size', 'lg');
    expect(comboboxGroup).toHaveAttribute('data-invalid');
    expect(comboboxGroup).toHaveClass(
      'h-(--city-control-lg)',
      'data-[invalid]:border-city-destructive',
    );
    expect(comboboxGroup).not.toHaveClass('px-3', 'gap-2');
    expect(comboboxTrigger).toHaveAttribute('data-city-size', 'lg');
    expect(comboboxTrigger).toHaveClass(
      'h-full',
      'self-stretch',
      'border-l',
      'w-(--city-control-lg)',
      'data-[popup-open]:[&>svg]:rotate-180',
    );
  });
});
