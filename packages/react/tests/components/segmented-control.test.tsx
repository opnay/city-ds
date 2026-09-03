import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SegmentedControl } from '../../src/components/segmented-control';

describe('SegmentedControl', () => {
  it('keeps exactly one option selected', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <SegmentedControl aria-label="View mode" defaultValue="grid" onValueChange={onValueChange}>
        <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
        <SegmentedControl.Item value="list">List</SegmentedControl.Item>
        <SegmentedControl.Item disabled value="map">
          Map
        </SegmentedControl.Item>
      </SegmentedControl>,
    );

    const group = screen.getByRole('radiogroup', { name: 'View mode' });
    const grid = screen.getByRole('radio', { name: 'Grid' });
    const list = screen.getByRole('radio', { name: 'List' });
    const map = screen.getByRole('radio', { name: 'Map' });

    expect(group).toHaveAttribute('aria-required', 'true');
    expect(group).toHaveAttribute('data-city-size', 'md');
    expect(grid).toHaveAttribute('aria-checked', 'true');
    await user.click(list);
    expect(grid).toHaveAttribute('aria-checked', 'false');
    expect(list).toHaveAttribute('aria-checked', 'true');
    await user.click(list);
    await user.click(map);
    expect(list).toHaveAttribute('aria-checked', 'true');
    expect(map).toHaveAttribute('aria-checked', 'false');
    expect(onValueChange).toHaveBeenLastCalledWith(
      'list',
      expect.objectContaining({ reason: 'none' }),
    );
  });

  it('selects the next option with arrow-key navigation', async () => {
    const user = userEvent.setup();

    render(
      <SegmentedControl aria-label="Density" defaultValue="comfortable">
        <SegmentedControl.Item value="comfortable">Comfortable</SegmentedControl.Item>
        <SegmentedControl.Item value="compact">Compact</SegmentedControl.Item>
      </SegmentedControl>,
    );

    const comfortable = screen.getByRole('radio', { name: 'Comfortable' });
    const compact = screen.getByRole('radio', { name: 'Compact' });

    comfortable.focus();
    await user.keyboard('[ArrowRight]');

    expect(compact).toHaveFocus();
    expect(compact).toHaveAttribute('aria-checked', 'true');
  });

  it('inherits the root size while allowing an item override', () => {
    const ref = React.createRef<HTMLDivElement>();

    render(
      <SegmentedControl ref={ref} aria-label="Period" defaultValue="week" size="lg">
        <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
        <SegmentedControl.Item size="sm" value="month">
          Month
        </SegmentedControl.Item>
      </SegmentedControl>,
    );

    const group = screen.getByRole('radiogroup', { name: 'Period' });
    expect(ref.current).toBe(group);
    expect(screen.getByRole('radio', { name: 'Week' })).toHaveClass(
      'h-(--city-control-lg)',
      'data-[checked]:bg-city-inverse',
    );
    expect(screen.getByRole('radio', { name: 'Month' })).toHaveClass('h-(--city-control-sm)');
  });
});
