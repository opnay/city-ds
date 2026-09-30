import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Combobox } from '../../src/components/combobox';
import { Field } from '../../src/components/field';

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
