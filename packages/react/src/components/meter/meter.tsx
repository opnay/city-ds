'use client';

import * as React from 'react';
import { Meter as BaseMeter } from '@base-ui/react/meter';

import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { ControlSize } from '../../types';

export interface MeterRootProps extends Omit<BaseMeter.Root.Props, 'className'> {
  className?: StateClassName<BaseMeter.Root.State>;
  size?: ControlSize;
}

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
  { className, size = 'md', ...props },
  ref,
) {
  return (
    <MeterSizeContext.Provider value={size}>
      <BaseMeter.Root
        {...props}
        ref={ref}
        data-city-meter=""
        data-city-size={size}
        className={(state) => cn('grid gap-1', resolveClassName(className, state))}
      />
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
          cn('bg-city-primary rounded-full', resolveClassName(className, state))
        }
      />
    );
  },
);

MeterIndicator.displayName = 'Meter.Indicator';

export const Meter = {
  Root: MeterRoot,
  Label: MeterLabel,
  Value: MeterValue,
  Track: MeterTrack,
  Indicator: MeterIndicator,
} as const;
