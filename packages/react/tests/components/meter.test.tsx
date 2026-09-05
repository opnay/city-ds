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
