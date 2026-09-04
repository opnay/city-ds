import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Divider as RootDivider } from '../../src';
import { Divider, type DividerProps } from '../../src/components/divider';

function assertDividerPropsContract() {
  const labeled: DividerProps = { children: '구분', plain: true };
  const vertical: DividerProps = { orientation: 'vertical', plain: false };
  const emptyPlain: DividerProps = { plain: true };

  // @ts-expect-error Children are only available in plain mode.
  const childrenWithoutPlain: DividerProps = { children: '구분' };
  // @ts-expect-error Plain mode is horizontal-only.
  const verticalWithPlain: DividerProps = { orientation: 'vertical', plain: true };

  void labeled;
  void vertical;
  void emptyPlain;
  void childrenWithoutPlain;
  void verticalWithPlain;
}

void assertDividerPropsContract;

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

  it('renders a vertical separator with Base UI orientation state', () => {
    render(
      <Divider
        orientation="vertical"
        className={(state) => (state.orientation === 'vertical' ? 'state-vertical' : undefined)}
      />,
    );

    const divider = screen.getByRole('separator');

    expect(divider).toHaveAttribute('aria-orientation', 'vertical');
    expect(divider).toHaveAttribute('data-city-divider', '');
    expect(divider).not.toHaveAttribute('data-city-divider-labeled');
    expect(divider).toHaveClass(
      'bg-city-border',
      'h-full',
      'min-h-0',
      'w-px',
      'shrink-0',
      'self-stretch',
      'state-vertical',
    );
  });

  it('renders equal lines and a centered ReactNode label as its accessible name', () => {
    render(
      <Divider plain>
        <strong>결제 수단</strong>
      </Divider>,
    );

    const divider = screen.getByRole('separator', { name: '결제 수단' });
    const lines = divider.querySelectorAll('[data-city-divider-line]');
    const label = divider.querySelector('[data-city-divider-label]');

    expect(divider).toHaveAttribute('data-city-divider', '');
    expect(divider).toHaveAttribute('data-city-divider-labeled', '');
    expect(divider).toHaveAttribute('aria-orientation', 'horizontal');
    expect(divider).toHaveClass('flex', 'w-full', 'min-w-0', 'items-center');
    expect(lines).toHaveLength(2);
    for (const line of lines) {
      expect(line).toHaveAttribute('aria-hidden', 'true');
      expect(line).toHaveClass('bg-city-border', 'h-px', 'min-w-0', 'flex-1');
    }
    expect(label).toHaveTextContent('결제 수단');
    expect(label).toHaveAttribute('id');
    expect(divider).toHaveAttribute('aria-labelledby', label?.id);
    expect(label).toHaveClass(
      'min-w-0',
      'truncate',
      'text-xs',
      'leading-none',
      'font-medium',
      'text-city-muted-foreground',
    );
  });

  it('forces plain mode to horizontal for untyped consumers', () => {
    render(
      // @ts-expect-error Plain rejects vertical orientation while protecting JavaScript callers.
      <Divider plain orientation="vertical">
        선택 사항
      </Divider>,
    );

    const divider = screen.getByRole('separator', { name: '선택 사항' });
    const label = divider.querySelector('[data-city-divider-label]');

    expect(divider).toHaveAttribute('aria-orientation', 'horizontal');
    expect(divider).toHaveAttribute('data-city-divider-plain', '');
    expect(label).toHaveClass('font-medium', 'text-city-muted-foreground');
  });

  it('keeps plain mode horizontal without children', () => {
    render(<Divider plain />);

    const divider = screen.getByRole('separator');

    expect(divider).toHaveAttribute('aria-orientation', 'horizontal');
    expect(divider).toHaveAttribute('data-city-divider-plain', '');
    expect(divider).not.toHaveAttribute('data-city-divider-labeled');
    expect(divider).toHaveClass('h-px', 'w-full');
  });

  it('prefers an explicit accessible name and lets aria-labelledby take precedence', () => {
    render(
      <>
        <span id="divider-reference">연결된 이름</span>
        <Divider plain aria-label="명시된 이름" data-testid="explicit">
          표시 이름
        </Divider>
        <Divider
          plain
          aria-label="무시되는 이름"
          aria-labelledby="divider-reference"
          data-testid="labelledby"
        >
          표시 이름
        </Divider>
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
    const ref = React.createRef<HTMLDivElement>();

    render(
      <Divider plain ref={ref} render={<div data-composed="true" />}>
        구성된 구분선
      </Divider>,
    );

    const divider = screen.getByRole('separator', { name: '구성된 구분선' });

    expect(ref.current).toBe(divider);
    expect(divider).toHaveAttribute('data-composed', 'true');
    expect(divider).toHaveAttribute('data-city-divider-labeled', '');
  });
});
