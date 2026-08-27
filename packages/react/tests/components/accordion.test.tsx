import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Accordion } from '../../src/components/accordion';

function Example(props: React.ComponentProps<typeof Accordion.Root>) {
  return (
    <Accordion.Root {...props}>
      <Accordion.Item value="profile">
        <Accordion.Header>
          <Accordion.Trigger>Profile</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>Profile details</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="billing">
        <Accordion.Header>
          <Accordion.Trigger>Billing</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>Billing details</Accordion.Panel>
      </Accordion.Item>
    </Accordion.Root>
  );
}

function getPanelByText(text: string): HTMLElement {
  const panel = screen.getByText(text).closest<HTMLElement>('[role="region"]');

  if (panel == null) {
    throw new Error(`Accordion panel not found for: ${text}`);
  }

  return panel;
}

describe('Accordion', () => {
  it('uses content feedback without separating trigger and panel surfaces', () => {
    render(<Example defaultValue={['profile']} />);

    const trigger = screen.getByRole('button', { name: 'Profile' });
    const label = screen.getByText('Profile');
    const icon = trigger.querySelector('svg');

    expect(trigger).toHaveClass('group/city-accordion-trigger', 'active:opacity-70');
    expect(trigger).not.toHaveClass('hover:bg-city-accent', 'active:bg-city-accent-active');
    expect(label).toHaveClass('underline-offset-4', 'group-hover/city-accordion-trigger:underline');
    expect(icon).toHaveClass('group-hover/city-accordion-trigger:text-city-foreground');
  });

  it('links headings, triggers, and panels', () => {
    render(<Example defaultValue={['profile']} />);

    const heading = screen.getByRole('heading', { level: 3, name: 'Profile' });
    const trigger = screen.getByRole('button', { name: 'Profile' });
    const panel = getPanelByText('Profile details');

    expect(heading).toContainElement(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveAttribute('role', 'region');
  });

  it('animates intrinsic panel height with an interruptible grid track transition', () => {
    render(<Example defaultValue={['profile']} />);

    const panel = getPanelByText('Profile details');
    const content = panel.querySelector('[data-city-accordion-panel-content]');

    expect(panel).toHaveClass(
      'grid',
      'grid-rows-[1fr]',
      'transition-[grid-template-rows,padding-bottom]',
      'duration-(--city-duration-slow)',
      'ease-city-standard',
      'data-[starting-style]:grid-rows-[0fr]',
      'data-[ending-style]:grid-rows-[0fr]',
    );
    expect(panel).not.toHaveClass('transition-[height]');
    expect(content).toHaveClass('min-h-0', 'overflow-hidden');
  });

  it('toggles a single open item by default', async () => {
    const user = userEvent.setup();
    render(<Example defaultValue={['profile']} />);

    await user.click(screen.getByRole('button', { name: 'Billing' }));

    expect(screen.getByRole('button', { name: 'Profile' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.getByRole('button', { name: 'Billing' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('supports multiple open items', async () => {
    const user = userEvent.setup();
    render(<Example multiple defaultValue={['profile']} />);

    await user.click(screen.getByRole('button', { name: 'Billing' }));

    expect(screen.getByRole('button', { name: 'Profile' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Billing' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('prevents disabled items from opening', async () => {
    const user = userEvent.setup();
    render(
      <Accordion.Root>
        <Accordion.Item disabled value="locked">
          <Accordion.Header>
            <Accordion.Trigger>Locked</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>Locked details</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>,
    );

    const trigger = screen.getByRole('button', { name: 'Locked' });
    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('preserves controlled value and Base UI event details', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} value={['profile']} />);

    await user.click(screen.getByRole('button', { name: 'Billing' }));

    expect(screen.getByRole('button', { name: 'Profile' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(onValueChange).toHaveBeenCalledWith(
      ['billing'],
      expect.objectContaining({ reason: 'trigger-press' }),
    );
  });

  it('supports keyboard activation and the Base UI render contract', async () => {
    const user = userEvent.setup();

    render(
      <Accordion.Root>
        <Accordion.Item value="advanced">
          <Accordion.Header>
            <Accordion.Trigger
              render={<button type="button" data-testid="custom-accordion-trigger" />}
            >
              Advanced settings
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel render={<section data-testid="custom-accordion-panel" />}>
            Advanced details
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>,
    );

    const trigger = screen.getByTestId('custom-accordion-trigger');
    trigger.focus();
    await user.keyboard('{Enter}');

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger.tagName).toBe('BUTTON');
    expect(screen.getByTestId('custom-accordion-panel').tagName).toBe('SECTION');

    await user.keyboard(' ');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});
