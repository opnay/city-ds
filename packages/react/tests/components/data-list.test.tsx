import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DataList } from '../../src/components/data-list';
import { DensityProvider } from '../../src/components/density-provider';

describe('DataList', () => {
  it('preserves native description-list groups and ref targets without adding widget roles', () => {
    const root = React.createRef<HTMLDListElement>();
    const item = React.createRef<HTMLDivElement>();
    const label = React.createRef<HTMLElement>();
    const value = React.createRef<HTMLElement>();
    render(
      <DataList.Root ref={root} aria-label="Account">
        <DataList.Item ref={item}>
          <DataList.Label ref={label}>Name</DataList.Label>
          <DataList.Value ref={value}>Seoyeon</DataList.Value>
        </DataList.Item>
      </DataList.Root>,
    );
    expect(root.current?.tagName).toBe('DL');
    expect(root.current).not.toHaveAttribute('role');
    expect(item.current?.parentElement).toBe(root.current);
    expect(label.current?.tagName).toBe('DT');
    expect(value.current?.tagName).toBe('DD');
    expect(label.current?.nextElementSibling).toBe(value.current);
    expect(screen.getByRole('term')).toHaveTextContent('Name');
    expect(screen.getByRole('definition')).toHaveTextContent('Seoyeon');
  });

  it('inherits density, allows local overrides, and isolates nested lists', () => {
    render(
      <DensityProvider density="compact">
        <DataList.Root aria-label="Outer" orientation="vertical" dividers>
          <DataList.Item>
            <DataList.Label>Details</DataList.Label>
            <DataList.Value>
              <DataList.Root aria-label="Inner" density="comfortable">
                <DataList.Item>
                  <DataList.Label>State</DataList.Label>
                  <DataList.Value>Active</DataList.Value>
                </DataList.Item>
              </DataList.Root>
            </DataList.Value>
          </DataList.Item>
        </DataList.Root>
      </DensityProvider>,
    );
    const outer = screen.getByLabelText('Outer');
    const inner = screen.getByLabelText('Inner');
    expect(outer).toHaveAttribute('data-city-density', 'compact');
    expect(outer).toHaveAttribute('data-orientation', 'vertical');
    expect(outer).toHaveAttribute('data-dividers');
    expect(inner).toHaveAttribute('data-city-density', 'comfortable');
    expect(inner).toHaveAttribute('data-orientation', 'horizontal');
    expect(inner).not.toHaveAttribute('data-dividers');
  });

  it('keeps value actions keyboard-accessible and merges render props', async () => {
    const user = userEvent.setup();
    const click = vi.fn();
    render(
      <DataList.Root render={<dl data-consumer="details" />} className="consumer-list">
        <DataList.Item>
          <DataList.Label>Profile</DataList.Label>
          <DataList.Value render={<dd data-consumer="value" />}>
            <button onClick={click}>Edit</button>
          </DataList.Value>
        </DataList.Item>
      </DataList.Root>,
    );
    expect(screen.getByText('Profile').closest('dl')).toHaveAttribute('data-consumer', 'details');
    expect(screen.getByText('Profile').closest('dl')).toHaveClass('consumer-list');
    expect(screen.getByRole('definition')).toHaveAttribute('data-consumer', 'value');
    await user.tab();
    expect(screen.getByRole('button', { name: 'Edit' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(click).toHaveBeenCalledOnce();
  });
});
