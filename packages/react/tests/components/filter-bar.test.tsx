import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { DensityProvider } from '../../src/components/density-provider';
import { FilterBar } from '../../src/components/filter-bar';

describe('FilterBar', () => {
  it('groups mixed filters without toolbar roving-focus semantics', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();

    render(
      <FilterBar actions={<button onClick={onReset}>Reset</button>} aria-label="Project filters">
        <input aria-label="Search projects" />
        <select aria-label="Project status">
          <option>All</option>
        </select>
      </FilterBar>,
    );

    const filterBar = screen.getByRole('group', { name: 'Project filters' });
    expect(filterBar).toHaveAttribute('data-appearance', 'band');
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();

    await user.tab();
    expect(screen.getByRole('textbox', { name: 'Search projects' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('combobox', { name: 'Project status' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Reset' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('supports surface appearances and inherited density', () => {
    render(
      <DensityProvider density="compact">
        <FilterBar appearance="outline" aria-label="Compact filters">
          <input aria-label="Query" />
        </FilterBar>
      </DensityProvider>,
    );

    expect(screen.getByRole('group', { name: 'Compact filters' })).toHaveAttribute(
      'data-city-density',
      'compact',
    );
    expect(screen.getByRole('group', { name: 'Compact filters' })).toHaveClass(
      'rounded-city-md',
      'border',
      'py-2',
    );
  });
});
