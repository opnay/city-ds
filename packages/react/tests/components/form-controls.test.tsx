import * as React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Badge } from '../../src/components/badge';
import { Button } from '../../src/components/button';
import { Checkbox } from '../../src/components/checkbox';
import { Combobox } from '../../src/components/combobox';
import { Field } from '../../src/components/field';
import { Fieldset } from '../../src/components/fieldset';
import { Input, InputGroup, Textarea } from '../../src/components/input';
import { RadioGroup } from '../../src/components/radio-group';
import { SearchField } from '../../src/components/search-field';
import { Switch } from '../../src/components/switch';
import { Toggle } from '../../src/components/toggle';

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
  });

  it('renders Badge through the Base UI render API', () => {
    render(
      <Badge render={<a href="/release" />} variant="outline">
        v1
      </Badge>,
    );

    expect(screen.getByRole('link', { name: 'v1' })).toHaveAttribute('href', '/release');
    expect(screen.getByRole('link', { name: 'v1' })).toHaveClass('border-city-border');
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
      <InputGroup.Root>
        <InputGroup.Addon>https://</InputGroup.Addon>
        <Input aria-label="Domain" />
        <InputGroup.Addon position="trailing">.dev</InputGroup.Addon>
      </InputGroup.Root>,
    );

    expect(screen.getByText('https://')).toHaveAttribute('data-city-position', 'leading');
    expect(screen.getByText('.dev')).toHaveAttribute('data-city-position', 'trailing');
    expect(screen.getByRole('textbox', { name: 'Domain' })).toBeVisible();
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
    expect(searchButton).toHaveClass('hover:bg-city-accent', 'active:bg-city-accent-active');
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

    expect(screen.getByRole('option', { name: 'Transit Map' })).toBeVisible();
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
          <Combobox.InputGroup className="flex-col items-stretch">
            <Combobox.Chips>
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
            <div className="flex w-full items-center">
              <Combobox.Input />
            </div>
          </Combobox.InputGroup>
        </Combobox.Root>
      </Field.Root>,
    );

    expect(screen.getByText('Civic Portal')).toBeVisible();
    expect(screen.getByRole('toolbar')).not.toContainElement(
      screen.getByRole('combobox', { name: 'Projects' }),
    );
    await user.click(screen.getByRole('button', { name: 'Remove Civic Portal' }));

    expect(screen.queryByText('Civic Portal')).not.toBeInTheDocument();
    expect(screen.getByText('Transit Map')).toBeVisible();
  });
});
