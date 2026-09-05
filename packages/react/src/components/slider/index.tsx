'use client';

import * as React from 'react';
import { Slider as BaseSlider } from '@base-ui/react/slider';

import { atomicRoundShapeClass } from '../../lib/atomic-shape';
import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { ControlSize } from '../../types';

export type SliderRootProps<Value extends number | readonly number[] = number> = Omit<
  BaseSlider.Root.Props<Value>,
  'className'
> & {
  className?: StateClassName<BaseSlider.Root.State>;
  size?: ControlSize;
};

const SliderSizeContext = React.createContext<ControlSize>('md');

const trackSizeClasses: Record<ControlSize, string> = {
  xsm: 'h-0.5',
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2',
  xlg: 'h-3',
};

const trackWidthClasses: Record<ControlSize, string> = {
  xsm: 'w-0.5',
  sm: 'w-1',
  md: 'w-1.5',
  lg: 'w-2',
  xlg: 'w-3',
};

const thumbSizeClasses: Record<ControlSize, string> = {
  xsm: 'size-3',
  sm: 'size-3.5',
  md: 'size-4',
  lg: 'size-5',
  xlg: 'size-6',
};

const SliderRootBase = React.forwardRef(function SliderRoot<
  Value extends number | readonly number[] = number,
>(
  { className, size = 'md', ...props }: SliderRootProps<Value>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  return (
    <SliderSizeContext.Provider value={size}>
      <BaseSlider.Root
        {...props}
        ref={ref}
        data-city-size={size}
        data-city-slider=""
        className={(state) =>
          cn(
            state.orientation === 'vertical'
              ? 'inline-flex h-full flex-col items-center gap-2'
              : 'grid w-full gap-1.5',
            resolveClassName(className, state),
          )
        }
      />
    </SliderSizeContext.Provider>
  );
});

SliderRootBase.displayName = 'Slider.Root';

export const SliderRoot = SliderRootBase as <Value extends number | readonly number[] = number>(
  props: SliderRootProps<Value> & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element;

export interface SliderControlProps extends Omit<BaseSlider.Control.Props, 'className'> {
  className?: StateClassName<BaseSlider.Control.State>;
}

export const SliderControl = React.forwardRef<HTMLDivElement, SliderControlProps>(
  function SliderControl({ className, ...props }, ref) {
    return (
      <BaseSlider.Control
        {...props}
        ref={ref}
        data-city-slider-control=""
        className={(state) =>
          cn(
            'relative flex touch-none select-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
            state.orientation === 'vertical'
              ? 'h-full min-h-32 w-5 items-center justify-center'
              : 'h-5 w-full items-center',
            resolveClassName(className, state),
          )
        }
      />
    );
  },
);

SliderControl.displayName = 'Slider.Control';

export interface SliderTrackProps extends Omit<BaseSlider.Track.Props, 'className'> {
  className?: StateClassName<BaseSlider.Track.State>;
}

export const SliderTrack = React.forwardRef<HTMLDivElement, SliderTrackProps>(function SliderTrack(
  { className, ...props },
  ref,
) {
  const size = React.useContext(SliderSizeContext);

  return (
    <BaseSlider.Track
      {...props}
      ref={ref}
      className={(state) =>
        cn(
          'bg-city-muted relative overflow-hidden rounded-city-full',
          state.orientation === 'vertical'
            ? `h-full ${trackWidthClasses[size]}`
            : `w-full ${trackSizeClasses[size]}`,
          resolveClassName(className, state),
        )
      }
    />
  );
});

SliderTrack.displayName = 'Slider.Track';

export interface SliderIndicatorProps extends Omit<BaseSlider.Indicator.Props, 'className'> {
  className?: StateClassName<BaseSlider.Indicator.State>;
}

export const SliderIndicator = React.forwardRef<HTMLDivElement, SliderIndicatorProps>(
  function SliderIndicator({ className, ...props }, ref) {
    return (
      <BaseSlider.Indicator
        {...props}
        ref={ref}
        className={(state) =>
          cn(
            'bg-city-primary rounded-city-full',
            state.orientation === 'vertical' ? 'w-full' : 'h-full',
            resolveClassName(className, state),
          )
        }
      />
    );
  },
);

SliderIndicator.displayName = 'Slider.Indicator';

export interface SliderThumbProps extends Omit<BaseSlider.Thumb.Props, 'className'> {
  className?: StateClassName<BaseSlider.Thumb.State>;
}

export const SliderThumb = React.forwardRef<HTMLDivElement, SliderThumbProps>(function SliderThumb(
  { className, ...props },
  ref,
) {
  const size = React.useContext(SliderSizeContext);

  return (
    <BaseSlider.Thumb
      {...props}
      ref={ref}
      data-city-slider-thumb=""
      className={(state) =>
        cn(
          atomicRoundShapeClass,
          'border-city-primary bg-city-background hover:bg-city-accent focus-within:ring-city-ring focus-within:ring-offset-city-background border-2 shadow-sm transition-colors outline-none focus-within:ring-2 focus-within:ring-offset-2 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
          thumbSizeClasses[size],
          resolveClassName(className, state),
        )
      }
    />
  );
});

SliderThumb.displayName = 'Slider.Thumb';

export interface SliderValueProps extends Omit<BaseSlider.Value.Props, 'className'> {
  className?: StateClassName<BaseSlider.Value.State>;
}

export const SliderValue = React.forwardRef<HTMLOutputElement, SliderValueProps>(
  function SliderValue({ className, ...props }, ref) {
    return (
      <BaseSlider.Value
        {...props}
        ref={ref}
        className={(state) =>
          cn('text-city-muted-foreground text-sm tabular-nums', resolveClassName(className, state))
        }
      />
    );
  },
);

SliderValue.displayName = 'Slider.Value';

export const Slider = {
  Root: SliderRoot,
  Control: SliderControl,
  Track: SliderTrack,
  Indicator: SliderIndicator,
  Thumb: SliderThumb,
  Value: SliderValue,
} as const;
