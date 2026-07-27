import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DataTableRegion } from '../../src/components/data-table-region';
import { Table } from '../../src/components/table';

describe('DataTableRegion', () => {
  it('associates an overflow hint with the focusable scroll region', () => {
    render(
      <DataTableRegion
        hint="Scroll horizontally to see every column."
        hintId="projects-table-hint"
        label="Project table scroll area"
      >
        <Table.Root aria-label="Projects">
          <Table.Body>
            <Table.Row>
              <Table.Cell>Beacon</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </DataTableRegion>,
    );

    expect(screen.getByRole('region', { name: 'Project table scroll area' })).toHaveAttribute(
      'aria-describedby',
      'projects-table-hint',
    );
    expect(screen.getByText('Scroll horizontally to see every column.')).toHaveAttribute(
      'data-city-data-table-region-hint',
    );
    expect(screen.getByRole('region', { name: 'Project table scroll area' })).toHaveAttribute(
      'tabindex',
      '0',
    );
  });

  it('omits the hint relationship when no overflow guidance is needed', () => {
    render(
      <DataTableRegion
        appearance="outline"
        hint="Scroll horizontally."
        label="Short table scroll area"
        showHint={false}
      >
        <Table.Root aria-label="Short table" />
      </DataTableRegion>,
    );

    const region = screen.getByRole('region', { name: 'Short table scroll area' });
    expect(region).not.toHaveAttribute('aria-describedby');
    expect(region).toHaveAttribute('data-appearance', 'outline');
    expect(screen.queryByText('Scroll horizontally.')).not.toBeInTheDocument();
  });
});
