import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Timeline } from '../../src/components/timeline';
import { DensityProvider } from '../../src/components/density-provider';

describe('Timeline', () => {
  it('preserves list semantics, native time and consumer-provided children', () => {
    const root = React.createRef<HTMLOListElement>();
    const item = React.createRef<HTMLLIElement>();
    const time = React.createRef<HTMLTimeElement>();
    render(
      <Timeline.Root ref={root} aria-label="History">
        <Timeline.Item ref={item}>
          <Timeline.Indicator data-testid="indicator" />
          <Timeline.Connector data-testid="connector" />
          <Timeline.Content>
            <Timeline.Time ref={time} dateTime="2026-09-09T10:00:00+09:00">
              <span>Just now</span>
            </Timeline.Time>
            <Timeline.Title>Created</Timeline.Title>
            <Timeline.Description>Project created</Timeline.Description>
          </Timeline.Content>
        </Timeline.Item>
      </Timeline.Root>,
    );
    expect(screen.getByRole('list', { name: 'History' })).toBe(root.current);
    expect(root.current?.tagName).toBe('OL');
    expect(screen.getByRole('listitem')).toBe(item.current);
    expect(item.current?.parentElement).toBe(root.current);
    expect(time.current?.tagName).toBe('TIME');
    expect(time.current).toHaveAttribute('datetime', '2026-09-09T10:00:00+09:00');
    expect(time.current).toHaveTextContent('Just now');
    expect(screen.getByTestId('indicator')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByTestId('connector')).toHaveAttribute('aria-hidden', 'true');
  });

  it('inherits density and scopes explicit overrides to the local timeline', () => {
    render(
      <DensityProvider density="compact">
        <Timeline.Root aria-label="Outer">
          <Timeline.Item>
            <Timeline.Content>
              <Timeline.Root aria-label="Inner" density="comfortable">
                <Timeline.Item>
                  <Timeline.Content>Nested</Timeline.Content>
                </Timeline.Item>
              </Timeline.Root>
            </Timeline.Content>
          </Timeline.Item>
        </Timeline.Root>
      </DensityProvider>,
    );
    expect(screen.getByRole('list', { name: 'Outer' })).toHaveAttribute(
      'data-city-density',
      'compact',
    );
    expect(screen.getByRole('list', { name: 'Inner' })).toHaveAttribute(
      'data-city-density',
      'comfortable',
    );
  });

  it('merges render props and keeps content actions keyboard accessible', async () => {
    const user = userEvent.setup();
    const click = vi.fn();
    render(
      <Timeline.Root render={<ol data-testid="history" />} className="consumer-list">
        <Timeline.Item>
          <Timeline.Content>
            <Timeline.Title render={<h3 />}>Review</Timeline.Title>
            <button onClick={click}>Open details</button>
          </Timeline.Content>
        </Timeline.Item>
      </Timeline.Root>,
    );
    expect(screen.getByTestId('history')).toHaveClass('consumer-list');
    expect(screen.getByRole('heading', { name: 'Review', level: 3 })).toBeInTheDocument();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Open details' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(click).toHaveBeenCalledOnce();
  });
});
