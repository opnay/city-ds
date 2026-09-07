import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { DataTableRegion } from '../../src/components/data-table-region';
import { Table } from '../../src/components/table';

describe('DataTableRegion', () => {
  it('keeps the named native scroll container keyboard focusable', async () => {
    const user = userEvent.setup();
    render(
      <DataTableRegion label="Wide projects" appearance="band">
        <Table.Root aria-label="Projects" />
      </DataTableRegion>,
    );
    const region = screen.getByRole('region', { name: 'Wide projects' });
    await user.tab();
    expect(region).toHaveFocus();
    expect(region).toHaveAttribute('data-appearance', 'band');
  });
});
