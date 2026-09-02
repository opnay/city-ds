import * as React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Badge } from '../../src/components/badge';
import { Button } from '../../src/components/button';
import { Checkbox } from '../../src/components/checkbox';
import { CheckboxGroup } from '../../src/components/checkbox-group';
import { Combobox } from '../../src/components/combobox';
import { Field } from '../../src/components/field';
import { Fieldset } from '../../src/components/fieldset';
import { Input, InputGroup, Textarea } from '../../src/components/input';
import { RadioGroup } from '../../src/components/radio-group';
import { SearchField } from '../../src/components/search-field';
import { Select } from '../../src/components/select';
import { Switch } from '../../src/components/switch';
import { Toggle } from '../../src/components/toggle';
import { ToggleGroup } from '../../src/components/toggle-group';

describe('form and display controls', () => {
  it('runs button actions and prevents disabled interaction', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <>
        <Button onClick={onClick}>Save</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button aria-label="Open settings" iconOnly size="sm" variant="ghost">
          <span aria-hidden="true">S</span>
        </Button>
        <Button disabled onClick={onClick}>
          Disabled
        </Button>
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'Save' }));
    await user.click(screen.getByRole('button', { name: 'Disabled' }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Save' })).toHaveClass(
      'bg-city-primary',
      'hover:bg-city-primary-hover',
      'active:bg-city-primary-active',
      'focus-visible:ring-2',
      'focus-visible:ring-offset-2',
    );
    expect(screen.getByRole('button', { name: 'Secondary' })).toHaveClass(
      'bg-city-accent',
      'hover:bg-city-accent-hover',
      'active:bg-city-accent-active',
    );
    expect(screen.getByRole('button', { name: 'Outline' })).toHaveClass('border-city-border');
    expect(screen.getByRole('button', { name: 'Ghost' })).toHaveClass(
      'hover:bg-city-accent',
      'active:bg-city-accent-active',
    );
    expect(screen.getByRole('button', { name: 'Open settings' })).toHaveAttribute(
      'data-city-icon-only',
      '',
    );
    expect(screen.getByRole('button', { name: 'Open settings' })).toHaveClass(
      'city-button',
      'h-(--city-control-sm)',
      'w-(--city-control-sm)',
      'px-0',
    );
  });

  it('uses the five-step shared control size scale', () => {
    render(
      <>
        <Button size="xsm">Extra small button</Button>
        <Button size="sm">Small button</Button>
        <Toggle aria-label="Medium toggle" size="md" />
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
    expect(screen.getByRole('button', { name: 'Medium toggle' })).toHaveClass(
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
        <Toggle aria-label="Rectangular toggle" size="lg" />
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
    expect(screen.getByRole('button', { name: 'Rectangular toggle' })).toHaveClass(
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
          <Combobox.Root items={comboboxProjects} size="lg">
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

  it('renders Badge through the Base UI render API', () => {
    render(
      <>
        <Badge render={<a href="/release" />} variant="outline">
          v1
        </Badge>
        <Badge aria-hidden="true" count={7} size="sm" variant="destructive" />
        <Badge data-testid="status-dot" dot />
        <Badge appearance="outline" tone="warning">
          Attention
        </Badge>
        <Badge aria-label="Healthy" data-testid="success-dot" dot tone="success" />
        <Badge appearance="solid" data-testid="success-solid" tone="success">
          Healthy
        </Badge>
      </>,
    );

    expect(screen.getByRole('link', { name: 'v1' })).toHaveAttribute('href', '/release');
    expect(screen.getByRole('link', { name: 'v1' })).toHaveClass('border-city-border');
    expect(screen.getByRole('link', { name: 'v1' })).toHaveAttribute('data-city-badge', 'label');
    expect(screen.getByText('7')).toHaveAttribute('data-city-badge', 'count');
    expect(screen.getByText('7')).toHaveAttribute('data-city-size', 'sm');
    expect(screen.getByText('7')).toHaveClass('h-5', 'min-w-5', 'rounded-city-full');
    expect(screen.getByText('7')).not.toHaveClass('rounded-city-xs');
    expect(screen.getByTestId('status-dot')).toHaveAttribute('data-city-badge', 'dot');
    expect(screen.getByTestId('status-dot')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByTestId('status-dot')).toHaveClass('size-2', 'rounded-city-full');
    expect(screen.getByTestId('status-dot')).not.toHaveClass('rounded-city-xs');
    expect(screen.getByText('Attention')).toHaveAttribute('data-appearance', 'outline');
    expect(screen.getByText('Attention')).toHaveAttribute('data-tone', 'warning');
    expect(screen.getByText('Attention')).toHaveClass('border-city-warning-border');
    expect(screen.getByTestId('success-dot')).toHaveAttribute('data-tone', 'success');
    expect(screen.getByTestId('success-dot')).toHaveClass('bg-city-success');
    expect(screen.getByTestId('success-solid')).toHaveClass(
      'bg-city-success',
      'text-city-success-foreground',
    );
    expect(screen.getByRole('img', { name: 'Healthy' })).toBe(screen.getByTestId('success-dot'));
  });

  it('adds one vertical spacing step to label and count Badge sizes without resizing dots', () => {
    render(
      <>
        <Badge appearance="solid" data-testid="label-sm" size="sm">
          Small
        </Badge>
        <Badge appearance="subtle" data-testid="label-md" size="md">
          Medium
        </Badge>
        <Badge appearance="outline" data-testid="label-lg" size="lg">
          Large
        </Badge>
        <Badge aria-hidden="true" count={1} data-testid="count-sm" size="sm" />
        <Badge aria-hidden="true" count={2} data-testid="count-md" size="md" />
        <Badge aria-hidden="true" count={3} data-testid="count-lg" size="lg" />
        <Badge data-testid="dot-lg" dot size="lg" />
      </>,
    );

    expect(screen.getByTestId('label-sm')).toHaveClass('h-5', 'text-2xs');
    expect(screen.getByTestId('label-md')).toHaveClass('h-6', 'text-2xs');
    expect(screen.getByTestId('label-lg')).toHaveClass('h-7', 'text-xs');
    expect(screen.getByTestId('count-sm')).toHaveClass('h-5', 'min-w-5', 'text-2xs');
    expect(screen.getByTestId('count-md')).toHaveClass('h-6', 'min-w-6', 'text-2xs');
    expect(screen.getByTestId('count-lg')).toHaveClass('h-7', 'min-w-7', 'text-xs');
    expect(screen.getByTestId('dot-lg')).toHaveClass('size-2.5');
    expect(screen.getByTestId('dot-lg')).not.toHaveClass('h-7');
  });

  it('connects Field label, description, error, and Input state', () => {
    render(
      <Field.Root invalid>
        <Field.Label>Email</Field.Label>
        <Input type="email" />
        <Field.Description>Work account only</Field.Description>
        <Field.Error match>Enter a work email.</Field.Error>
      </Field.Root>,
    );

    const input = screen.getByRole('textbox', { name: 'Email' });

    expect(input).toHaveAttribute('data-invalid');
    expect(input).toHaveAccessibleDescription('Work account only Enter a work email.');
    expect(screen.getByText('Enter a work email.')).toBeVisible();
  });

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
    expect(plain).toHaveClass('border-0', 'p-0');
    expect(band).toHaveClass('border-y', 'py-4');
    expect(outline).toHaveAttribute('data-appearance', 'outline');
    expect(outline).toHaveClass('rounded-city-md', 'border', 'p-4');
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

  it('supports SearchField typing, clear, Escape, and native form submission', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <SearchField.Root onSubmit={onSubmit}>
        <SearchField.Label>Search projects</SearchField.Label>
        <SearchField.Group data-testid="search-group">
          <SearchField.Input />
          <SearchField.Clear />
          <SearchField.Submit />
        </SearchField.Group>
      </SearchField.Root>,
    );

    const input = screen.getByRole('searchbox', { name: 'Search projects' });
    const searchButton = screen.getByRole('button', { name: 'Search' });

    expect(screen.getByTestId('search-group')).toContainElement(input);
    expect(screen.getByTestId('search-group')).toHaveClass('h-(--city-control-md)');
    expect(searchButton).toHaveClass('hover:bg-city-accent', 'active:bg-city-accent-active');
    expect(searchButton).toHaveClass('h-full', 'w-(--city-control-md)');
    expect(input).toHaveAttribute('type', 'search');
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();

    await user.type(input, 'city');
    expect(input).toHaveValue('city');
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(input).toHaveValue('');
    expect(input).toHaveFocus();

    await user.type(input, 'metro');
    await user.keyboard('{Escape}');
    expect(input).toHaveValue('');

    await user.type(input, 'roads{Enter}');
    expect(onSubmit).toHaveBeenLastCalledWith('roads', expect.anything());

    await user.clear(input);
    await user.type(input, 'bridges');
    await user.click(searchButton);
    expect(onSubmit).toHaveBeenLastCalledWith('bridges', expect.anything());
  });

  it('supports SearchField controlled values and loading status', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    function ControlledSearch() {
      const [value, setValue] = React.useState('city');

      return (
        <SearchField.Root
          loading
          onValueChange={(nextValue) => {
            setValue(nextValue);
            onValueChange(nextValue);
          }}
          value={value}
        >
          <SearchField.Label>Search packages</SearchField.Label>
          <SearchField.Group>
            <SearchField.Input />
            <SearchField.Clear />
            <SearchField.Submit />
          </SearchField.Group>
          <SearchField.Loading>Searching…</SearchField.Loading>
        </SearchField.Root>
      );
    }

    render(<ControlledSearch />);

    const input = screen.getByRole('searchbox', { name: 'Search packages' });
    expect(input).toHaveValue('city');
    expect(screen.getByText('Searching…')).toBeVisible();

    await user.type(input, ' ds');
    expect(input).toHaveValue('city ds');
    expect(onValueChange).toHaveBeenLastCalledWith('city ds');

    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
  });

  it('propagates SearchField disabled and invalid states to its inline controls', () => {
    render(
      <>
        <SearchField.Root defaultValue="archived" disabled>
          <SearchField.Label>Disabled search</SearchField.Label>
          <SearchField.Group data-testid="disabled-search-group">
            <SearchField.Input disabled={false} />
            <SearchField.Clear disabled={false} />
            <SearchField.Submit disabled={false} />
          </SearchField.Group>
        </SearchField.Root>
        <SearchField.Root defaultValue="x" invalid>
          <SearchField.Label>Invalid search</SearchField.Label>
          <SearchField.Group data-testid="invalid-search-group">
            <SearchField.Input />
            <SearchField.Clear />
            <SearchField.Submit />
          </SearchField.Group>
          <SearchField.Error match>Enter at least 2 characters.</SearchField.Error>
        </SearchField.Root>
      </>,
    );

    const disabledGroup = screen.getByTestId('disabled-search-group');
    expect(disabledGroup).toHaveAttribute('data-disabled');
    expect(disabledGroup).toHaveClass('data-[disabled]:opacity-50');
    expect(within(disabledGroup).getByRole('searchbox')).toBeDisabled();
    expect(within(disabledGroup).getByRole('button', { name: 'Clear search' })).toBeDisabled();
    expect(within(disabledGroup).getByRole('button', { name: 'Search' })).toBeDisabled();

    const invalidGroup = screen.getByTestId('invalid-search-group');
    expect(invalidGroup).toHaveAttribute('data-invalid');
    expect(invalidGroup).toHaveClass('data-[invalid]:border-city-destructive');
    expect(within(invalidGroup).getByRole('searchbox')).toHaveAttribute('data-invalid');
    expect(screen.getByText('Enter at least 2 characters.')).toBeVisible();
  });

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

  it('toggles Toggle pressed state with pointer and keyboard interaction', async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();

    render(
      <>
        <Toggle aria-label="Bold" onPressedChange={onPressedChange}>
          B
        </Toggle>
        <Toggle aria-label="Pinned" defaultPressed />
        <Toggle aria-label="Locked" disabled onPressedChange={onPressedChange}>
          Locked
        </Toggle>
      </>,
    );

    const toggle = screen.getByRole('button', { name: 'Bold' });
    expect(toggle).toHaveClass('hover:bg-city-accent', 'active:bg-city-accent-active');
    await user.click(toggle);
    toggle.focus();
    await user.keyboard('[Space]');
    await user.click(screen.getByRole('button', { name: 'Locked' }));

    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Pinned' })).toHaveAttribute('aria-pressed', 'true');
    expect(onPressedChange).toHaveBeenCalledTimes(2);
    expect(onPressedChange).toHaveBeenLastCalledWith(
      false,
      expect.objectContaining({ reason: 'none' }),
    );
  });

  it('changes ToggleGroup single selection values', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <ToggleGroup aria-label="View mode" defaultValue={['grid']} onValueChange={onValueChange}>
        <ToggleGroup.Item value="grid">Grid</ToggleGroup.Item>
        <ToggleGroup.Item value="list">List</ToggleGroup.Item>
      </ToggleGroup>,
    );

    await user.click(screen.getByRole('button', { name: 'List' }));

    expect(screen.getByRole('button', { name: 'Grid' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'true');
    expect(onValueChange).toHaveBeenLastCalledWith(
      ['list'],
      expect.objectContaining({ reason: 'none' }),
    );
  });

  it('changes ToggleGroup multiple values and leaves disabled groups unchanged', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <>
        <ToggleGroup
          aria-label="Text style"
          defaultValue={['bold']}
          multiple
          onValueChange={onValueChange}
        >
          <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
          <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
        </ToggleGroup>
        <ToggleGroup aria-label="Locked view mode" defaultValue={['grid']} disabled>
          <ToggleGroup.Item value="grid">Grid</ToggleGroup.Item>
          <ToggleGroup.Item value="list">List</ToggleGroup.Item>
        </ToggleGroup>
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'Italic' }));
    await user.click(screen.getByRole('button', { name: 'List' }));

    const disabledGroup = screen.getByRole('group', { name: 'Locked view mode' });
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Italic' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Grid' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'false');
    expect(disabledGroup).not.toHaveClass('data-[disabled]:opacity-50');
    expect(screen.getByRole('button', { name: 'Grid' })).toHaveClass('data-[disabled]:opacity-50');
    expect(onValueChange).toHaveBeenLastCalledWith(
      ['bold', 'italic'],
      expect.objectContaining({ reason: 'none' }),
    );
  });

  it('inherits ToggleGroup styles, preserves item overrides, and forwards the root ref', () => {
    const ref = React.createRef<HTMLDivElement>();

    render(
      <ToggleGroup
        ref={ref}
        aria-label="Formatting"
        defaultValue={['bold']}
        size="lg"
        variant="primary"
      >
        <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
        <ToggleGroup.Item size="sm" value="italic" variant="ghost">
          Italic
        </ToggleGroup.Item>
      </ToggleGroup>,
    );

    const group = screen.getByRole('group', { name: 'Formatting' });
    const inheritedItem = screen.getByRole('button', { name: 'Bold' });
    const overriddenItem = screen.getByRole('button', { name: 'Italic' });

    expect(ref.current).toBe(group);
    expect(inheritedItem).toHaveClass('h-(--city-control-lg)', 'bg-city-primary');
    expect(overriddenItem).toHaveClass('h-(--city-control-sm)', 'hover:bg-city-accent');
  });

  it('moves ToggleGroup focus with arrow keys', async () => {
    const user = userEvent.setup();

    render(
      <ToggleGroup aria-label="View mode" defaultValue={['grid']}>
        <ToggleGroup.Item value="grid">Grid</ToggleGroup.Item>
        <ToggleGroup.Item value="list">List</ToggleGroup.Item>
        <ToggleGroup.Item value="split">Split</ToggleGroup.Item>
      </ToggleGroup>,
    );

    const grid = screen.getByRole('button', { name: 'Grid' });
    const list = screen.getByRole('button', { name: 'List' });

    grid.focus();
    await user.keyboard('[ArrowRight]');

    expect(list).toHaveFocus();
  });

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

const comboboxProjects = ['Civic Portal', 'Transit Map', 'Permit Tracker'];

function TestCombobox() {
  return (
    <Field.Root>
      <Combobox.Root items={comboboxProjects}>
        <Field.Label>Project</Field.Label>
        <Combobox.InputGroup>
          <Combobox.Input placeholder="Search projects" />
          <Combobox.Clear />
          <Combobox.Trigger />
        </Combobox.InputGroup>
        <Combobox.Portal>
          <Combobox.Positioner>
            <Combobox.Popup>
              <Combobox.Empty>No projects found.</Combobox.Empty>
              <Combobox.List>
                {(project: string) => (
                  <Combobox.Item key={project} value={project}>
                    {project}
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </Field.Root>
  );
}

describe('Combobox', () => {
  it('filters input, selects with keyboard, and clears the value', async () => {
    const user = userEvent.setup();
    render(<TestCombobox />);

    const input = screen.getByRole('combobox', { name: 'Project' });
    await user.type(input, 'Transit');

    const transitOption = screen.getByRole('option', { name: 'Transit Map' });
    expect(transitOption).toBeVisible();
    expect(transitOption).toHaveClass('data-[highlighted]:bg-city-accent-hover');
    expect(screen.getByRole('listbox').parentElement).toHaveClass('bg-city-background');
    expect(screen.queryByRole('option', { name: 'Civic Portal' })).not.toBeInTheDocument();
    expect(screen.getByRole('status')).not.toHaveClass('py-6');
    expect(screen.getByRole('status')).toBeEmptyDOMElement();

    await user.keyboard('[ArrowDown][Enter]');
    expect(input).toHaveValue('Transit Map');

    await user.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(input).toHaveValue('');
  });

  it('supports multiple selected chips and chip removal', async () => {
    const user = userEvent.setup();
    render(
      <Field.Root>
        <Combobox.Root
          items={comboboxProjects}
          multiple
          defaultValue={['Civic Portal', 'Transit Map']}
        >
          <Field.Label>Projects</Field.Label>
          <Combobox.InputGroup data-testid="multiple-combobox-group">
            <Combobox.Chips data-testid="multiple-combobox-chips">
              <Combobox.InputRow data-testid="multiple-combobox-input-row">
                <Combobox.Input />
                <Combobox.Clear />
                <Combobox.Trigger />
              </Combobox.InputRow>
              <Combobox.Value>
                {(selectedProjects: string[]) =>
                  selectedProjects.map((project) => (
                    <Combobox.Chip key={project}>
                      {project}
                      <Combobox.ChipRemove aria-label={`Remove ${project}`} />
                    </Combobox.Chip>
                  ))
                }
              </Combobox.Value>
            </Combobox.Chips>
          </Combobox.InputGroup>
          <Combobox.Portal>
            <Combobox.Positioner>
              <Combobox.Popup>
                <Combobox.List>
                  {(project: string) => (
                    <Combobox.Item key={project} value={project}>
                      {project}
                    </Combobox.Item>
                  )}
                </Combobox.List>
              </Combobox.Popup>
            </Combobox.Positioner>
          </Combobox.Portal>
        </Combobox.Root>
      </Field.Root>,
    );

    expect(screen.getByText('Civic Portal')).toBeVisible();
    const multipleInput = screen.getByRole('combobox', { name: 'Projects' });
    const group = screen.getByTestId('multiple-combobox-group');
    const chips = screen.getByTestId('multiple-combobox-chips');
    const inputRow = screen.getByTestId('multiple-combobox-input-row');
    const trigger = screen.getByRole('button', { name: 'Projects' });
    const chipBand = group.querySelector('[data-city-combobox-chip-band]');

    expect(group).toHaveClass('min-h-(--city-control-md)', 'flex-col', 'items-stretch');
    expect(group).not.toHaveClass('h-(--city-control-md)', 'px-2.5', 'py-1');
    expect(chips).toHaveAttribute('role', 'toolbar');
    expect(chips).toContainElement(inputRow);
    expect(inputRow).toContainElement(multipleInput);
    expect(inputRow).toHaveClass(
      'h-[calc(var(--city-control-md)-2px)]',
      'items-center',
      'shrink-0',
    );
    expect(multipleInput).toHaveClass('px-2.5');
    expect(multipleInput).not.toHaveClass('min-w-20');
    expect(screen.getByRole('button', { name: 'Clear all selections' })).toBeVisible();
    expect(trigger).toHaveClass('h-full', 'border-l', 'w-(--city-control-md)');
    expect(chipBand).toHaveClass('border-t', 'px-2.5', 'py-1', 'empty:hidden');
    expect(chipBand).toContainElement(
      screen.getByRole('button', { name: 'Remove Civic Portal' }).parentElement,
    );

    await user.type(multipleInput, 'Permit');
    await user.keyboard('[ArrowDown][Enter]');

    expect(chipBand).toContainElement(
      screen.getByRole('button', { name: 'Remove Permit Tracker' }).parentElement,
    );
    await user.keyboard('[Backspace]');
    expect(screen.queryByText('Permit Tracker')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Remove Civic Portal' }));

    expect(screen.queryByText('Civic Portal')).not.toBeInTheDocument();
    expect(screen.getByText('Transit Map')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Clear all selections' }));

    expect(chipBand).toBeEmptyDOMElement();
    expect(chipBand).toHaveClass('empty:hidden');
  });
});
