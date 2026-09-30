import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Table } from '../../src/components/table';

describe('Table', () => {
  it.each(['xsm', 'sm', 'md', 'lg', 'xlg'] as const)(
    'keeps a 16px region gutter at the %s table edges',
    (size) => {
      render(
        <Table.Root aria-label={`${size} table`} size={size}>
          <Table.Header>
            <Table.Row>
              <Table.Head>First heading</Table.Head>
              <Table.Head>Last heading</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>First value</Table.Cell>
              <Table.Cell>Last value</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>,
      );

      for (const cell of [
        screen.getByRole('columnheader', { name: 'First heading' }),
        screen.getByRole('columnheader', { name: 'Last heading' }),
        screen.getByRole('cell', { name: 'First value' }),
        screen.getByRole('cell', { name: 'Last value' }),
      ]) {
        expect(cell).toHaveClass('first:ps-4', 'last:pe-4');
      }
    },
  );

  it('keeps native table semantics and applies size and variant state', () => {
    render(
      <Table.Root size="sm" variant="surface">
        <Table.Caption>Recent jobs</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.Head>Job</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Build</Table.Cell>
          </Table.Row>
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.Cell>1 job</Table.Cell>
          </Table.Row>
        </Table.Footer>
      </Table.Root>,
    );

    const table = screen.getByRole('table', { name: 'Recent jobs' });

    expect(table).toHaveAttribute('data-size', 'sm');
    expect(table).toHaveAttribute('data-variant', 'surface');
    expect(screen.getByRole('columnheader', { name: 'Job' })).toHaveAttribute('scope', 'col');
    expect(screen.getByRole('cell', { name: 'Build' })).toBeInTheDocument();
  });

  it('supports controlled sorting and keyboard activation', async () => {
    const user = userEvent.setup();
    const onDirectionChange = vi.fn();

    render(
      <Table.Root aria-label="Projects">
        <Table.Header>
          <Table.Row>
            <Table.Head aria-sort="ascending">
              <Table.SortButton direction="asc" onDirectionChange={onDirectionChange}>
                Project
              </Table.SortButton>
            </Table.Head>
          </Table.Row>
        </Table.Header>
      </Table.Root>,
    );

    const button = screen.getByRole('button', { name: 'Project (sorted ascending)' });

    expect(screen.getByRole('columnheader', { name: /Project/ })).toHaveAttribute(
      'aria-sort',
      'ascending',
    );

    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard('{Enter}');

    expect(onDirectionChange).toHaveBeenCalledWith('desc');
  });

  it('supports selectable header, row cells, and indeterminate state', async () => {
    const user = userEvent.setup();
    const onAllChange = vi.fn();
    const onRowChange = vi.fn();

    render(
      <Table.Root aria-label="Projects">
        <Table.Header>
          <Table.Row>
            <Table.SelectionHead checked="indeterminate" onCheckedChange={onAllChange} />
            <Table.Head>Project</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.SelectionCell label="Select Beacon" onCheckedChange={onRowChange} />
            <Table.Cell>Beacon</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );

    expect(screen.getByRole('checkbox', { name: 'Select all rows' })).toHaveAttribute(
      'aria-checked',
      'mixed',
    );

    await user.click(screen.getByRole('checkbox', { name: 'Select all rows' }));
    await user.click(screen.getByRole('checkbox', { name: 'Select Beacon' }));

    expect(onAllChange).toHaveBeenCalledWith(true);
    expect(onRowChange).toHaveBeenCalledWith(true);
  });

  it('renders empty and loading state rows across all columns', () => {
    render(
      <Table.Root aria-label="Projects">
        <Table.Body>
          <Table.StateRow colSpan={3}>No projects</Table.StateRow>
          <Table.StateRow colSpan={3} status="loading">
            Loading projects
          </Table.StateRow>
        </Table.Body>
      </Table.Root>,
    );

    expect(screen.getByRole('cell', { name: 'No projects' })).toHaveAttribute('colspan', '3');
    expect(screen.getByRole('status')).toHaveAttribute('data-city-table-state', 'loading');
  });
});
