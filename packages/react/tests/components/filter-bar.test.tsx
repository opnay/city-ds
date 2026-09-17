import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { DensityProvider } from '../../src/components/density-provider';
import { FilterBar } from '../../src/components/filter-bar';
import { FilterPanel } from '../../src/components/filter-panel';
import { Select } from '../../src/components/select';

describe('FilterBar', () => {
  it('keeps each compound label and control within one condition', () => {
    render(
      <FilterBar aria-label="Mixed conditions">
        <input aria-label="Query" />
        <Select.Root defaultValue="all" items={{ all: 'All' }}>
          <Select.Label>Status</Select.Label>
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
        </Select.Root>
      </FilterBar>,
    );
    const queryCondition = screen
      .getByRole('textbox', { name: 'Query' })
      .closest('[data-city-filter-bar-condition]');
    const selectCondition = screen
      .getByRole('combobox', { name: 'Status' })
      .closest('[data-city-filter-bar-condition]');
    expect(queryCondition).not.toBe(selectCondition);
    expect(selectCondition).toContainElement(screen.getByText('Status'));
    expect(selectCondition?.parentElement).toBe(queryCondition?.parentElement);
  });

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
    expect(filterBar).not.toHaveAttribute('data-appearance');
    expect(filterBar).toHaveClass('gap-4');
    expect(filterBar).not.toHaveClass('p-4', 'p-3', 'bg-city-muted');
    expect(filterBar.querySelector('[data-city-filter-bar-content]')).toHaveClass('gap-3');
    expect(filterBar.querySelector('[data-city-filter-bar-actions]')).toHaveClass('gap-3');
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

  it('uses inherited density without adding an outer surface or padding', () => {
    render(
      <DensityProvider density="compact">
        <FilterBar aria-label="Compact filters">
          <input aria-label="Query" />
        </FilterBar>
      </DensityProvider>,
    );

    expect(screen.getByRole('group', { name: 'Compact filters' })).toHaveAttribute(
      'data-city-density',
      'compact',
    );
    const filterBar = screen.getByRole('group', { name: 'Compact filters' });
    expect(filterBar).toHaveClass('gap-3');
    expect(filterBar).not.toHaveClass('rounded-city-md', 'border', 'p-3');
    expect(filterBar.querySelector('[data-city-filter-bar-content]')).toHaveClass('gap-2');
  });

  it('keeps independent filter surfaces and padding in FilterPanel', () => {
    render(
      <DensityProvider density="compact">
        <FilterPanel appearance="outline" aria-label="Compact filters">
          <input aria-label="Query" />
        </FilterPanel>
      </DensityProvider>,
    );

    const filterPanel = screen.getByRole('group', { name: 'Compact filters' });
    expect(filterPanel).toHaveAttribute('data-appearance', 'outline');
    expect(filterPanel).toHaveClass('rounded-city-md', 'border', 'gap-3', 'p-3');
    expect(filterPanel.querySelector('[data-city-filter-panel-content]')).toHaveClass('gap-2');
  });
});
