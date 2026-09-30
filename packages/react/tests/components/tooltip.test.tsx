import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Button } from '../../src/components/button';
import { Tooltip } from '../../src/components/tooltip';

describe('Tooltip', () => {
  it('shows a tooltip on hover with the supplied zero delay', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip.Provider delay={0}>
        <Tooltip.Root>
          <Tooltip.Trigger render={<Button variant="ghost" />}>More info</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Positioner>
              <Tooltip.Popup>
                Helpful context
                <Tooltip.Arrow data-testid="tooltip-arrow" />
              </Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );

    const trigger = screen.getByRole('button', { name: 'More info' });
    expect(trigger).toHaveClass('hover:bg-city-accent');
    expect(trigger).not.toHaveClass('bg-city-surface-raised');

    await user.hover(trigger);

    expect(await screen.findByRole('tooltip')).toHaveClass(
      'bg-city-inverse',
      'text-city-inverse-foreground',
    );
    expect(screen.getByTestId('tooltip-arrow')).toHaveClass(
      'overflow-clip',
      'data-[side=bottom]:-top-1.5',
      'data-[side=top]:-bottom-1.5',
      'before:size-[8.5px]',
      'before:bg-current',
      'text-city-inverse',
    );
  });
});
