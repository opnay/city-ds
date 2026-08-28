import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Panel } from '../../src/components/panel';

describe('Panel', () => {
  it('separates header context and actions from a surface-neutral body', () => {
    render(
      <Panel.Root aria-label="Deployment panel" render={<section />}>
        <Panel.Header actions={<button type="button">Refresh</button>}>
          <h2>Deployment</h2>
        </Panel.Header>
        <Panel.Body>Production status</Panel.Body>
      </Panel.Root>,
    );

    const panel = screen.getByRole('region', { name: 'Deployment panel' });
    const header = panel.querySelector('[data-city-panel-header]');
    const body = panel.querySelector('[data-city-panel-body]');

    expect(panel.tagName).toBe('SECTION');
    expect(panel).toHaveClass('grid', 'min-w-0');
    expect(header).toHaveClass('flex', 'flex-wrap', 'items-center');
    expect(header?.querySelector('[data-city-panel-header-content]')).toContainElement(
      screen.getByRole('heading', { name: 'Deployment' }),
    );
    expect(header?.querySelector('[data-city-panel-header-actions]')).toContainElement(
      screen.getByRole('button', { name: 'Refresh' }),
    );
    expect(body).toHaveClass('min-w-0');
    expect(body).not.toHaveClass(
      'bg-city-background',
      'bg-city-surface',
      'border',
      'rounded-city-md',
      'p-4',
      'overflow-hidden',
    );
  });

  it('omits the actions group when the header has no actions', () => {
    render(
      <Panel.Root>
        <Panel.Header>Activity</Panel.Header>
        <Panel.Body>Nothing changed.</Panel.Body>
      </Panel.Root>,
    );

    expect(document.querySelector('[data-city-panel-header-actions]')).not.toBeInTheDocument();
  });
});
