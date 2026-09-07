import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from '../../src/components/checkbox';
import { RadioGroup } from '../../src/components/radio-group';
import { SelectionCard } from '../../src/components/selection-card';

function Plans({ disabled = false }: { disabled?: boolean }) {
  return (
    <RadioGroup name="plan" aria-label="Plan" defaultValue="starter" disabled={disabled} size="lg">
      {['starter', 'pro', 'enterprise'].map((value) => (
        <SelectionCard key={value} data-testid={`${value}-card`}>
          <SelectionCard.Content>
            <SelectionCard.Title id={`${value}-title`}>{value}</SelectionCard.Title>
            <SelectionCard.Description id={`${value}-description`}>
              {value} features
            </SelectionCard.Description>
          </SelectionCard.Content>
          <RadioGroup.Control
            value={value}
            disabled={value === 'enterprise'}
            aria-labelledby={`${value}-title`}
            aria-describedby={`${value}-description`}
          />
        </SelectionCard>
      ))}
    </RadioGroup>
  );
}

describe('SelectionCard', () => {
  it('selects a radio from card content or padding and submits the group value', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <Plans />
      </form>,
    );
    await user.click(screen.getByText('pro features'));
    expect(screen.getByRole('radio', { name: 'pro' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'starter' })).not.toBeChecked();
    expect(new FormData(container.querySelector('form')!).get('plan')).toBe('pro');
    await user.click(screen.getByTestId('starter-card'));
    expect(screen.getByRole('radio', { name: 'starter' })).toBeChecked();
    expect(container.querySelector('label label')).toBeNull();
  });

  it('preserves group keyboard navigation, size inheritance and disabled items', async () => {
    const user = userEvent.setup();
    render(<Plans />);
    const starter = screen.getByRole('radio', { name: 'starter' });
    const pro = screen.getByRole('radio', { name: 'pro' });
    await user.tab();
    expect(starter).toHaveFocus();
    expect(starter).toHaveAttribute('data-city-size', 'lg');
    await user.keyboard('[ArrowRight]');
    expect(pro).toHaveFocus();
    expect(pro).toBeChecked();
    await user.click(screen.getByText('enterprise features'));
    expect(screen.getByRole('radio', { name: 'enterprise' })).not.toBeChecked();
    expect(pro).toBeChecked();
  });

  it('preserves a short accessible name with a separate description', () => {
    render(<Plans />);
    expect(screen.getByRole('radio', { name: 'pro' })).toHaveAccessibleDescription('pro features');
  });

  it('leaves a disabled group unchanged when its card is clicked', async () => {
    const user = userEvent.setup();
    render(<Plans disabled />);
    await user.click(screen.getByTestId('pro-card'));
    expect(screen.getByRole('radio', { name: 'pro' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'starter' })).toBeChecked();
  });

  it('toggles a checkbox exactly once from the card and the control', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    const ref = React.createRef<HTMLLabelElement>();
    render(
      <SelectionCard ref={ref}>
        <Checkbox aria-labelledby="backup-title" onCheckedChange={onCheckedChange} />
        <SelectionCard.Title id="backup-title">Backup</SelectionCard.Title>
      </SelectionCard>,
    );
    expect(ref.current?.tagName).toBe('LABEL');
    await user.click(screen.getByText('Backup'));
    expect(screen.getByRole('checkbox', { name: 'Backup' })).toBeChecked();
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole('checkbox', { name: 'Backup' }));
    expect(screen.getByRole('checkbox', { name: 'Backup' })).not.toBeChecked();
    expect(onCheckedChange).toHaveBeenCalledTimes(2);
    await user.keyboard('[Space]');
    expect(screen.getByRole('checkbox', { name: 'Backup' })).toBeChecked();
  });

  it('keeps controlled, disabled and read-only checkbox states owned by the input', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <>
        <SelectionCard>
          <Checkbox checked onCheckedChange={onCheckedChange} aria-labelledby="controlled-title" />
          <span id="controlled-title">Controlled</span>
          <span>Controlled details</span>
        </SelectionCard>
        <SelectionCard>
          <Checkbox disabled aria-labelledby="disabled-title" />
          <span id="disabled-title">Disabled</span>
          <span>Disabled details</span>
        </SelectionCard>
        <SelectionCard>
          <Checkbox readOnly aria-labelledby="readonly-title" />
          <span id="readonly-title">Read only</span>
          <span>Read only details</span>
        </SelectionCard>
      </>,
    );
    await user.click(screen.getByText('Controlled details'));
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('checkbox', { name: 'Controlled' })).toBeChecked();
    await user.click(screen.getByText('Disabled details'));
    await user.click(screen.getByText('Read only details'));
    expect(screen.getByRole('checkbox', { name: 'Disabled' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Read only' })).not.toBeChecked();
  });
});
