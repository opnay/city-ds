'use client';

import * as React from 'react';
import { Slider as BaseSlider } from '@base-ui/react/slider';
import { Button as BaseButton } from '@base-ui/react/button';
import { useRender } from '@base-ui/react/use-render';

import { atomicRoundShapeClass } from '../../lib/atomic-shape';
import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { ControlSize } from '../../types';
import { Tooltip } from '../tooltip';

export type SliderRootProps<Value extends number | readonly number[] = number> = Omit<
  BaseSlider.Root.Props<Value>,
  'className'
> & {
  className?: StateClassName<BaseSlider.Root.State>;
  size?: ControlSize;
};

const SliderSizeContext = React.createContext<ControlSize>('md');
const SliderAlignmentContext =
  React.createContext<BaseSlider.Root.Props['thumbAlignment']>('center');
const SliderStateContext = React.createContext<BaseSlider.Root.State | null>(null);

function SliderRootElement({
  elementProps,
  render,
  state,
}: {
  elementProps: React.ComponentPropsWithRef<'div'>;
  render: BaseSlider.Root.Props['render'];
  state: BaseSlider.Root.State;
}) {
  const element = useRender({
    render: typeof render === 'function' ? (props) => render(props, state) : render,
    props: { ...elementProps },
  });
  return <SliderStateContext.Provider value={state}>{element}</SliderStateContext.Provider>;
}

function useSliderState() {
  const state = React.useContext(SliderStateContext);
  if (!state) throw new Error('Slider parts must be used inside Slider.Root.');
  return state;
}

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

const thumbLengths: Record<ControlSize, string> = {
  xsm: '0.75rem',
  sm: '0.875rem',
  md: '1rem',
  lg: '1.25rem',
  xlg: '1.5rem',
};

const SliderRootBase = React.forwardRef(function SliderRoot<
  Value extends number | readonly number[] = number,
>(
  { className, render, size = 'md', thumbAlignment = 'center', ...props }: SliderRootProps<Value>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  return (
    <SliderSizeContext.Provider value={size}>
      <SliderAlignmentContext.Provider value={thumbAlignment}>
        <BaseSlider.Root
          {...props}
          thumbAlignment={thumbAlignment}
          ref={ref}
          render={(elementProps, state) => (
            <SliderRootElement elementProps={elementProps} render={render} state={state} />
          )}
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
      </SliderAlignmentContext.Provider>
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
          'bg-city-muted relative rounded-city-full',
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
  /** Displays the current formatted value on hover, focus, and drag. */
  tooltip?: boolean;
}

function SliderThumbSurface({
  elementProps,
  render,
  state,
}: {
  elementProps: React.ComponentPropsWithRef<'div'>;
  render: BaseSlider.Thumb.Props['render'];
  state: BaseSlider.Thumb.State;
}) {
  const element = useRender({
    render: typeof render === 'function' ? (props) => render(props, state) : render,
    props: { ...elementProps },
  });
  return (
    <Tooltip.Trigger
      id={elementProps.id}
      render={element}
      tabIndex={-1}
      delay={0}
      closeOnClick={false}
    />
  );
}

export const SliderThumb = React.forwardRef<HTMLDivElement, SliderThumbProps>(function SliderThumb(
  { className, tooltip = true, ...props },
  ref,
) {
  const size = React.useContext(SliderSizeContext);
  const state = useSliderState();
  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  const thumbRef = React.useRef<HTMLDivElement | null>(null);
  const index = props.index ?? Number(thumbRef.current?.dataset.index ?? 0);
  const dragging = state.dragging && state.activeThumbIndex === index;

  const thumb = (
    <BaseSlider.Thumb
      {...props}
      ref={(element) => {
        thumbRef.current = element;
        if (typeof ref === 'function') return ref(element);
        if (ref) ref.current = element;
      }}
      render={
        tooltip
          ? (elementProps, thumbState) => (
              <SliderThumbSurface
                elementProps={elementProps}
                render={props.render}
                state={thumbState}
              />
            )
          : props.render
      }
      data-city-slider-thumb=""
      className={(state) =>
        cn(
          atomicRoundShapeClass,
          'border-city-primary bg-city-background hover:bg-city-accent focus-within:ring-city-ring focus-within:ring-offset-city-background z-10 border-2 shadow-sm transition-colors outline-none focus-within:ring-2 focus-within:ring-offset-2 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
          thumbSizeClasses[size],
          resolveClassName(className, state),
        )
      }
    />
  );

  if (!tooltip) return thumb;

  return (
    <Tooltip.Root
      open={!state.disabled && !props.disabled && (tooltipOpen || dragging)}
      onOpenChange={setTooltipOpen}
    >
      {thumb}
      <Tooltip.Portal>
        <Tooltip.Positioner
          side={state.orientation === 'vertical' ? 'right' : 'top'}
          sideOffset={8}
        >
          <Tooltip.Popup className="tabular-nums">
            <BaseSlider.Value render={<span />}>
              {(formattedValues) => formattedValues[index]}
            </BaseSlider.Value>
            <Tooltip.Arrow />
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
});

SliderThumb.displayName = 'Slider.Thumb';

export interface SliderAnchorProps extends Omit<BaseButton.Props, 'value'> {
  /** A preset value, within min/max and aligned to step. */
  value: number;
}

export const SliderAnchor = React.forwardRef<HTMLElement, SliderAnchorProps>(function SliderAnchor(
  {
    value,
    className,
    style,
    disabled,
    onClick,
    onPointerDown,
    onTouchStartCapture,
    children,
    ...props
  },
  ref,
) {
  const state = useSliderState();
  const vertical = state.orientation === 'vertical';
  const size = React.useContext(SliderSizeContext);
  const alignment = React.useContext(SliderAlignmentContext);
  const position = ((value - state.min) / (state.max - state.min)) * 100;
  const offset =
    alignment === 'center'
      ? `${position}%`
      : `calc(${thumbLengths[size]} / 2 + (100% - ${thumbLengths[size]}) * ${position / 100})`;
  const stepPosition = (value - state.min) / state.step;
  const valid =
    Number.isFinite(position) &&
    position >= 0 &&
    position <= 100 &&
    Math.abs(stepPosition - Math.round(stepPosition)) < 1e-7;

  if (!valid) return null;

  return (
    <BaseButton
      {...props}
      ref={ref}
      type="button"
      aria-label={props['aria-label'] ?? String(value)}
      disabled={disabled || state.disabled}
      data-city-slider-anchor=""
      data-value={value}
      className={(buttonState) =>
        cn(
          'absolute flex size-6 items-center justify-center rounded-city-full bg-transparent text-city-muted-foreground hover:text-city-foreground focus-visible:ring-2 focus-visible:ring-city-ring outline-none disabled:pointer-events-none',
          vertical
            ? '-translate-x-1/2 translate-y-1/2'
            : '-translate-x-1/2 -translate-y-1/2 rtl:translate-x-1/2',
          resolveClassName(className, buttonState),
        )
      }
      style={(buttonState) => ({
        ...(vertical ? { bottom: offset, left: '50%' } : { insetInlineStart: offset, top: '50%' }),
        ...(typeof style === 'function' ? style(buttonState) : style),
      })}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        // A preset click must not also be handled as a continuous track press.
        event.stopPropagation();
      }}
      onTouchStartCapture={(event) => {
        onTouchStartCapture?.(event);
        // Base UI listens for native touchstart on Control, before React's bubble phase.
        event.stopPropagation();
      }}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        const root = event.currentTarget.closest('[data-city-slider]');
        const inputs = Array.from(
          root?.querySelectorAll<HTMLInputElement>(
            '[data-city-slider-thumb] input[type="range"]',
          ) ?? [],
        ).filter((input) => !input.disabled && input.closest('[data-city-slider]') === root);
        const input = inputs.reduce<HTMLInputElement | undefined>(
          (nearest, candidate) =>
            !nearest ||
            Math.abs(candidate.valueAsNumber - value) < Math.abs(nearest.valueAsNumber - value)
              ? candidate
              : nearest,
          undefined,
        );
        if (!input) return;
        const view = input.ownerDocument.defaultView;
        if (!view) return;
        // Use the native range input so Base UI owns value changes, cancellation,
        // range constraints, form state, and onValueCommitted.
        Object.getOwnPropertyDescriptor(view.HTMLInputElement.prototype, 'value')?.set?.call(
          input,
          String(value),
        );
        input.dispatchEvent(new view.Event('input', { bubbles: true }));
      }}
    >
      {children ?? (
        <span
          aria-hidden="true"
          className="size-1.5 rounded-city-full bg-current ring-2 ring-city-background"
        />
      )}
    </BaseButton>
  );
});

SliderAnchor.displayName = 'Slider.Anchor';

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
  Anchor: SliderAnchor,
  Thumb: SliderThumb,
  Value: SliderValue,
} as const;
