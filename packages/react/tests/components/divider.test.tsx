import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Divider as RootDivider } from '../../src';
import { Divider } from '../../src/components/divider';

describe('Divider', () => {
  it('exports the same component from the package root', () => {
    expect(RootDivider).toBe(Divider);
  });

  it('renders an unlabeled horizontal separator as a full-width border line', () => {
    render(
      <Divider
        className={(state) => (state.orientation === 'horizontal' ? 'state-horizontal' : undefined)}
      />,
    );

    const divider = screen.getByRole('separator');

    expect(divider).toHaveAttribute('aria-orientation', 'horizontal');
    expect(divider).toHaveAttribute('data-city-divider', '');
    expect(divider).not.toHaveAttribute('data-city-divider-labeled');
    expect(divider).toHaveClass('bg-city-border', 'h-px', 'w-full', 'state-horizontal');
    expect(divider.querySelector('[data-city-divider-line]')).not.toBeInTheDocument();
    expect(divider.querySelector('[data-city-divider-label]')).not.toBeInTheDocument();
  });

  it('renders equal lines and a centered label with the label as its accessible name', () => {
    render(<Divider label="결제 수단" />);

    const divider = screen.getByRole('separator', { name: '결제 수단' });
    const lines = divider.querySelectorAll('[data-city-divider-line]');
    const label = divider.querySelector('[data-city-divider-label]');

    expect(divider).toHaveAttribute('data-city-divider', '');
    expect(divider).toHaveAttribute('data-city-divider-labeled', '');
    expect(divider).toHaveAttribute('aria-label', '결제 수단');
    expect(divider).toHaveClass('flex', 'w-full', 'min-w-0', 'items-center');
    expect(lines).toHaveLength(2);
    for (const line of lines) {
      expect(line).toHaveAttribute('aria-hidden', 'true');
      expect(line).toHaveClass('bg-city-border', 'h-px', 'min-w-0', 'flex-1');
    }
    expect(label).toHaveAttribute('aria-hidden', 'true');
    expect(label).toHaveTextContent('결제 수단');
    expect(label).toHaveClass(
      'text-city-muted-foreground',
      'min-w-0',
      'truncate',
      'text-xs',
      'leading-none',
      'font-medium',
    );
  });

  it('prefers an explicit accessible name and lets aria-labelledby take precedence', () => {
    render(
      <>
        <span id="divider-reference">연결된 이름</span>
        <Divider aria-label="명시된 이름" data-testid="explicit" label="표시 이름" />
        <Divider
          aria-label="무시되는 이름"
          aria-labelledby="divider-reference"
          data-testid="labelledby"
          label="표시 이름"
        />
      </>,
    );

    const explicit = screen.getByTestId('explicit');
    const labelledBy = screen.getByTestId('labelledby');

    expect(explicit).toHaveAccessibleName('명시된 이름');
    expect(explicit).toHaveAttribute('aria-label', '명시된 이름');
    expect(labelledBy).toHaveAccessibleName('연결된 이름');
    expect(labelledBy).toHaveAttribute('aria-labelledby', 'divider-reference');
    expect(labelledBy).toHaveAttribute('aria-label', '무시되는 이름');
  });

  it('preserves the Base UI render composition contract', () => {
    render(<Divider label="구성된 구분선" render={<div data-composed="true" />} />);

    const divider = screen.getByRole('separator', { name: '구성된 구분선' });

    expect(divider).toHaveAttribute('data-composed', 'true');
    expect(divider).toHaveAttribute('data-city-divider-labeled', '');
  });
});
