import * as React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Item } from '../../src/components/item';
import { DensityProvider } from '../../src/components/density-provider';

describe('Item', () => {
  it('keeps native list items, link semantics and decorative separators when composed', async () => {
    const user = userEvent.setup();
    const click = vi.fn((event: React.MouseEvent) => event.preventDefault());
    const root = React.createRef<HTMLDivElement>();

    render(
      <Item.Group aria-label="Resources">
        <Item.Root
          ref={root}
          render={<a href="/guide" onClick={click} />}
          className="consumer-item"
        >
          <Item.Content>
            <Item.Title>Guide</Item.Title>
            <Item.Description>Getting started</Item.Description>
          </Item.Content>
        </Item.Root>
        <Item.Separator />
        <Item.Root>
          <Item.Content>
            <Item.Title>Account</Item.Title>
          </Item.Content>
          <Item.Actions>
            <button type="button">Edit</button>
          </Item.Actions>
        </Item.Root>
      </Item.Group>,
    );

    const list = screen.getByRole('list', { name: 'Resources' });
    const entries = within(list).getAllByRole('listitem');
    const link = screen.getByRole('link', { name: 'Guide Getting started' });
    expect(list.tagName).toBe('UL');
    expect(entries).toHaveLength(2);
    expect(entries.every((entry) => entry.tagName === 'LI' && entry.parentElement === list)).toBe(
      true,
    );
    expect(entries[0]).toContainElement(link);
    expect(root.current).toBe(link);
    expect(link).toHaveAttribute('href', '/guide');
    expect(link).toHaveClass('consumer-item');
    expect(screen.queryByRole('separator')).toBeNull();

    await user.tab();
    expect(link).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(click).toHaveBeenCalledOnce();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Edit' })).toHaveFocus();
  });

  it('inherits density and exposes local overrides to render and className callbacks', () => {
    render(
      <DensityProvider density="compact">
        <Item.Root aria-label="Inherited" />
        <Item.Root
          aria-label="Override"
          appearance="outline"
          density="comfortable"
          className={(state) => `consumer-${state.appearance}-${state.density}`}
          render={(props, state) => <section {...props} data-consumer-density={state.density} />}
        >
          <Item.Media variant="image">
            <img alt="Preview" src="/preview.png" />
          </Item.Media>
        </Item.Root>
      </DensityProvider>,
    );

    expect(screen.getByLabelText('Inherited')).toHaveAttribute('data-city-density', 'compact');
    const override = screen.getByRole('region', { name: 'Override' });
    expect(override).toHaveAttribute('data-consumer-density', 'comfortable');
    expect(override).toHaveClass('consumer-outline-comfortable');
    expect(screen.getByRole('img', { name: 'Preview' }).parentElement).toHaveClass('size-10');
    expect(screen.queryByRole('listitem')).toBeNull();
  });

  it('isolates nested groups and does not turn nested standalone content into list entries', () => {
    render(
      <Item.Group aria-label="Outer">
        <Item.Root>
          <Item.Header>Collection</Item.Header>
          <Item.Content>
            <Item.Root>
              <Item.Title>Summary</Item.Title>
            </Item.Root>
            <Item.Group aria-label="Inner">
              <Item.Root>
                <Item.Title>Child</Item.Title>
              </Item.Root>
            </Item.Group>
          </Item.Content>
        </Item.Root>
      </Item.Group>,
    );

    const outer = screen.getByRole('list', { name: 'Outer' });
    const inner = screen.getByRole('list', { name: 'Inner' });
    expect(outer.querySelectorAll(':scope > li')).toHaveLength(1);
    expect(inner.querySelectorAll(':scope > li')).toHaveLength(1);
    expect(within(outer).getAllByRole('listitem')).toHaveLength(2);
  });
});
