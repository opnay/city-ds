'use client';

import * as React from 'react';
import { Meter as BaseMeter } from '@base-ui/react/meter';
import { useRender } from '@base-ui/react/use-render';

import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { ControlSize } from '../../types';

export interface MeterRootProps extends Omit<BaseMeter.Root.Props, 'className'> {
  className?: StateClassName<BaseMeter.Root.State>;
  size?: ControlSize;
  ranges?: readonly MeterRange[];
}

export interface MeterRange {
  from: number;
  to: number;
  label: string;
  color: string;
}

export type MeterRangeLabelProps = useRender.ComponentProps<'span'>;

const MeterRangeContext = React.createContext<MeterRange | undefined>(undefined);

export interface MeterLabelProps extends Omit<BaseMeter.Label.Props, 'className'> {
  className?: StateClassName<BaseMeter.Label.State>;
}

export interface MeterValueProps extends Omit<BaseMeter.Value.Props, 'className'> {
  className?: StateClassName<BaseMeter.Value.State>;
}

export interface MeterTrackProps extends Omit<BaseMeter.Track.Props, 'className'> {
  className?: StateClassName<BaseMeter.Track.State>;
}

export interface MeterIndicatorProps extends Omit<BaseMeter.Indicator.Props, 'className'> {
  className?: StateClassName<BaseMeter.Indicator.State>;
}

const MeterSizeContext = React.createContext<ControlSize>('md');

const trackHeightClasses: Record<ControlSize, string> = {
  xsm: 'h-0.5',
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2',
  xlg: 'h-3',
};

export const MeterRoot = React.forwardRef<HTMLDivElement, MeterRootProps>(function MeterRoot(
  { className, size = 'md', ranges, value, min = 0, max = 100, style, getAriaValueText, ...props },
  ref,
) {
  // Match the range against the same clamped value Base UI exposes to assistive technology.
  const clampedValue = Math.min(max, Math.max(min, Number.isNaN(value) ? min : value));
  const range =
    Number.isFinite(min) && Number.isFinite(max) && min < max
      ? ranges?.find(
          (candidate) =>
            Number.isFinite(candidate.from) &&
            Number.isFinite(candidate.to) &&
            candidate.from < candidate.to &&
            clampedValue >= candidate.from &&
            (clampedValue < candidate.to || (clampedValue === max && candidate.to === max)),
        )
      : undefined;

  return (
    <MeterSizeContext.Provider value={size}>
      <MeterRangeContext.Provider value={range}>
        <BaseMeter.Root
          {...props}
          value={value}
          min={min}
          max={max}
          getAriaValueText={
            getAriaValueText ??
            (range ? (formattedValue) => `${formattedValue}, ${range.label}` : undefined)
          }
          style={(state) => ({
            '--city-meter-color': range?.color ?? 'var(--city-color-primary)',
            ...(typeof style === 'function' ? style(state) : style),
          })}
          ref={ref}
          data-city-meter=""
          data-city-size={size}
          className={(state) => cn('grid gap-1', resolveClassName(className, state))}
        />
      </MeterRangeContext.Provider>
    </MeterSizeContext.Provider>
  );
});

MeterRoot.displayName = 'Meter.Root';

export const MeterLabel = React.forwardRef<HTMLSpanElement, MeterLabelProps>(function MeterLabel(
  { className, ...props },
  ref,
) {
  return (
    <BaseMeter.Label
      {...props}
      ref={ref}
      data-city-meter-label=""
      className={(state) => cn('text-city-foreground text-sm', resolveClassName(className, state))}
    />
  );
});

MeterLabel.displayName = 'Meter.Label';

export const MeterValue = React.forwardRef<HTMLSpanElement, MeterValueProps>(function MeterValue(
  { className, ...props },
  ref,
) {
  return (
    <BaseMeter.Value
      {...props}
      ref={ref}
      data-city-meter-value=""
      className={(state) =>
        cn('text-city-muted-foreground text-sm tabular-nums', resolveClassName(className, state))
      }
    />
  );
});

MeterValue.displayName = 'Meter.Value';

export const MeterTrack = React.forwardRef<HTMLDivElement, MeterTrackProps>(function MeterTrack(
  { className, ...props },
  ref,
) {
  const size = React.useContext(MeterSizeContext);

  return (
    <BaseMeter.Track
      {...props}
      ref={ref}
      data-city-meter-track=""
      className={(state) =>
        cn(
          'bg-city-muted relative w-full overflow-hidden rounded-full',
          trackHeightClasses[size],
          resolveClassName(className, state),
        )
      }
    />
  );
});

MeterTrack.displayName = 'Meter.Track';

export const MeterIndicator = React.forwardRef<HTMLDivElement, MeterIndicatorProps>(
  function MeterIndicator({ className, ...props }, ref) {
    return (
      <BaseMeter.Indicator
        {...props}
        ref={ref}
        data-city-meter-indicator=""
        className={(state) =>
          cn('bg-(--city-meter-color) rounded-full', resolveClassName(className, state))
        }
      />
    );
  },
);

MeterIndicator.displayName = 'Meter.Indicator';

export const MeterRangeLabel = React.forwardRef<HTMLSpanElement, MeterRangeLabelProps>(
  function MeterRangeLabel({ className, render, children, ...props }, ref) {
    const range = React.useContext(MeterRangeContext);
    const element = useRender({
      defaultTagName: 'span',
      ref,
      render,
      props: {
        ...props,
        'data-city-meter-range-label': '',
        className: cn('text-city-muted-foreground text-sm', className),
        children: children ?? range?.label,
      },
    });
    return range ? element : null;
  },
);

MeterRangeLabel.displayName = 'Meter.RangeLabel';

export const Meter = {
  Root: MeterRoot,
  Label: MeterLabel,
  Value: MeterValue,
  Track: MeterTrack,
  Indicator: MeterIndicator,
  RangeLabel: MeterRangeLabel,
} as const;
