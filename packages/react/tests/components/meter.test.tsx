import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  Meter,
  type MeterIndicatorProps,
  type MeterLabelProps,
  type MeterRootProps,
  type MeterTrackProps,
  type MeterValueProps,
  type MeterRange,
} from '../../src/components/meter';

function assertMeterPropsContract() {
  const root: MeterRootProps = {
    format: { style: 'unit', unit: 'gigabyte', unitDisplay: 'narrow' },
    locale: 'en-US',
    max: 256,
    min: 0,
    size: 'lg',
    value: 192,
  };
  const label: MeterLabelProps = { children: 'Storage used' };
  const value: MeterValueProps = { children: (formattedValue) => formattedValue };
  const track: MeterTrackProps = { id: 'track' };
  const indicator: MeterIndicatorProps = { id: 'indicator' };

  // @ts-expect-error Meter represents a determinate measurement and requires a number.
  const indeterminate: MeterRootProps = { value: null };
  // @ts-expect-error Meter sizes are limited to the shared control-size scale.
  const invalidSize: MeterRootProps = { size: 'xxl', value: 50 };

  void root;
  void label;
  void value;
  void track;
  void indicator;
  void indeterminate;
  void invalidSize;
}

void assertMeterPropsContract;

describe('Meter', () => {
  const ranges = [
    { from: 0, to: 20, label: '부족', color: 'var(--city-color-destructive)' },
    { from: 20, to: 50, label: '보통', color: 'var(--city-color-warning)' },
    { from: 50, to: 80, label: '충분', color: 'var(--city-color-info)' },
    { from: 80, to: 100, label: '여유', color: 'var(--city-color-success)' },
  ] as const satisfies readonly MeterRange[];

  it('supports arbitrary stages and chooses the higher interval at a shared boundary', () => {
    const view = (value: number) => (
      <Meter.Root value={value} ranges={ranges} aria-label="배정 가능량">
        <Meter.RangeLabel />
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>
    );
    const { rerender } = render(view(19));
    const meter = screen.getByRole('meter');
    expect(screen.getByText('부족')).toBeVisible();
    expect(meter).toHaveStyle('--city-meter-color: var(--city-color-destructive)');
    rerender(view(20));
    expect(screen.getByText('보통')).toBeVisible();
    expect(meter).toHaveAttribute('aria-valuetext', '20%, 보통');
    rerender(view(100));
    expect(screen.getByText('여유')).toBeVisible();
    expect(meter).toHaveStyle('--city-meter-color: var(--city-color-success)');
    rerender(view(150));
    expect(meter).toHaveAttribute('aria-valuenow', '100');
    expect(screen.getByText('여유')).toBeVisible();
  });

  it('supports reversed colors, removed stages, gaps, and removing all ranges', () => {
    const view = (value: number, configured: readonly MeterRange[]) => (
      <Meter.Root value={value} ranges={configured} aria-label="사용량">
        <Meter.RangeLabel />
      </Meter.Root>
    );
    const reversed = ranges.map((range, index) => ({
      ...range,
      color: ranges[ranges.length - index - 1]?.color ?? range.color,
    }));
    const { rerender } = render(view(10, reversed));
    const meter = screen.getByRole('meter');
    expect(meter).toHaveStyle('--city-meter-color: var(--city-color-success)');
    rerender(view(60, [ranges[0], ranges[3]]));
    expect(meter).toHaveStyle('--city-meter-color: var(--city-color-primary)');
    expect(meter.querySelector('[data-city-meter-range-label]')).toBeNull();
    expect(meter).toHaveAttribute('aria-valuetext', '60%');
    rerender(view(10, []));
    expect(meter).toHaveStyle('--city-meter-color: var(--city-color-primary)');
    expect(meter.querySelector('[data-city-meter-range-label]')).toBeNull();
  });

  it('uses actual min/max units, skips invalid intervals, and resolves overlaps by declaration order', () => {
    render(
      <Meter.Root
        min={100}
        max={300}
        value={200}
        aria-label="용량"
        ranges={[
          { from: NaN, to: 300, label: 'invalid', color: 'red' },
          { from: 210, to: 100, label: 'backward', color: 'red' },
          { from: 200, to: 200, label: 'empty', color: 'red' },
          { from: 150, to: 250, label: '맞춤 구간', color: 'rebeccapurple' },
          { from: 100, to: 300, label: '전체', color: 'blue' },
        ]}
      >
        <Meter.RangeLabel />
      </Meter.Root>,
    );
    const meter = screen.getByRole('meter');
    expect(meter).toHaveAttribute('aria-valuetext', '50%, 맞춤 구간');
    expect(meter).toHaveStyle('--city-meter-color: rebeccapurple');
  });

  it('preserves explicit value text, user styles, and RangeLabel render/ref composition', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(
      <Meter.Root
        value={30}
        ranges={ranges}
        aria-label="Custom"
        getAriaValueText={() => '서른 개'}
        style={() => ({ '--city-meter-color': 'orange' }) as React.CSSProperties}
      >
        <Meter.RangeLabel ref={ref} render={<strong data-testid="range-label" />} />
      </Meter.Root>,
    );
    expect(screen.getByRole('meter')).toHaveAttribute('aria-valuetext', '서른 개');
    expect(screen.getByRole('meter')).toHaveStyle('--city-meter-color: orange');
    expect(screen.getByTestId('range-label').tagName).toBe('STRONG');
    expect(ref.current).toBe(screen.getByTestId('range-label'));
  });

  it('does not leak a parent range color or label into an unconfigured nested meter', () => {
    render(
      <Meter.Root value={10} ranges={ranges} aria-label="Outer">
        <Meter.Root value={50} aria-label="Inner">
          <Meter.RangeLabel />
        </Meter.Root>
      </Meter.Root>,
    );
    const inner = screen.getByRole('meter', { name: 'Inner' });
    expect(inner).toHaveStyle('--city-meter-color: var(--city-color-primary)');
    expect(inner.querySelector('[data-city-meter-range-label]')).toBeNull();
    expect(inner).toHaveAttribute('aria-valuetext', '50%');
  });

  it('connects Label with the native meter role and exposes its selected range', () => {
    render(
      <Meter.Root max={256} min={64} size="lg" value={160}>
        <div className="flex justify-between gap-3">
          <Meter.Label>스토리지 사용량</Meter.Label>
          <Meter.Value />
        </div>
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>,
    );

    const meter = screen.getByRole('meter', { name: '스토리지 사용량' });
    const track = meter.querySelector('[data-city-meter-track]');
    const indicator = meter.querySelector('[data-city-meter-indicator]');

    expect(meter).toHaveAttribute('aria-valuemin', '64');
    expect(meter).toHaveAttribute('aria-valuemax', '256');
    expect(meter).toHaveAttribute('aria-valuenow', '160');
    expect(meter).toHaveAttribute('data-city-meter', '');
    expect(meter).toHaveAttribute('data-city-size', 'lg');
    expect(track).toHaveClass('h-2', 'bg-city-muted');
    expect(indicator).toHaveStyle({ width: '50%' });
  });

  it('keeps Base UI formatting, locale, and aria value text behavior', () => {
    const getAriaValueText = vi.fn(
      (formattedValue: string, value: number) => `${formattedValue} 사용됨 (${value})`,
    );
    const format = {
      style: 'unit' as const,
      unit: 'gigabyte' as const,
      unitDisplay: 'narrow' as const,
    };
    const formattedValue = new Intl.NumberFormat('de-DE', format).format(192);

    render(
      <Meter.Root
        format={format}
        getAriaValueText={getAriaValueText}
        locale="de-DE"
        max={256}
        value={192}
      >
        <Meter.Label>Speicher</Meter.Label>
        <Meter.Value>{(value, rawValue) => `${value} / ${rawValue}`}</Meter.Value>
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>,
    );

    const meter = screen.getByRole('meter', { name: 'Speicher' });
    const value = meter.querySelector('[data-city-meter-value]');

    expect(value).toHaveAttribute('aria-hidden', 'true');
    expect(value?.textContent).toBe(`${formattedValue} / 192`);
    expect(getAriaValueText).toHaveBeenLastCalledWith(formattedValue, 192);
    expect(meter).toHaveAttribute('aria-valuetext', `${formattedValue} 사용됨 (192)`);
  });

  it('preserves Base UI render composition and refs for every compound part', () => {
    const rootRef = React.createRef<HTMLDivElement>();
    const labelRef = React.createRef<HTMLSpanElement>();
    const valueRef = React.createRef<HTMLSpanElement>();
    const trackRef = React.createRef<HTMLDivElement>();
    const indicatorRef = React.createRef<HTMLDivElement>();

    render(
      <Meter.Root ref={rootRef} render={<section data-testid="root" />} value={40}>
        <Meter.Label ref={labelRef} render={<strong data-testid="label" />}>
          Capacity
        </Meter.Label>
        <Meter.Value ref={valueRef} render={<output data-testid="value" />} />
        <Meter.Track ref={trackRef} render={<section data-testid="track" />}>
          <Meter.Indicator ref={indicatorRef} render={<span data-testid="indicator" />} />
        </Meter.Track>
      </Meter.Root>,
    );

    const root = screen.getByRole('meter', { name: 'Capacity' });
    const label = screen.getByTestId('label');
    const value = screen.getByTestId('value');
    const track = screen.getByTestId('track');
    const indicator = screen.getByTestId('indicator');

    expect(root.tagName).toBe('SECTION');
    expect(rootRef.current).toBe(root);
    expect(labelRef.current).toBe(label);
    expect(valueRef.current).toBe(value);
    expect(trackRef.current).toBe(track);
    expect(indicatorRef.current).toBe(indicator);
    expect(track).toHaveClass('h-1.5');
    expect(indicator).toHaveStyle({ width: '40%' });
  });
});
