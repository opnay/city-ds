'use client';

import * as React from 'react';
import { Progress as BaseProgress } from '@base-ui/react/progress';
import { useRender } from '@base-ui/react/use-render';
import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { ControlSize } from '../../types';

export type ProgressStatus = 'indeterminate' | 'progressing' | 'complete';

export interface ProgressState extends Record<string, unknown> {
  status: ProgressStatus;
  value: number | null;
  max: number;
  invalidMax: boolean;
  invalidValue: boolean;
}

interface NormalizedProgress {
  max: number;
  value: number | null;
  invalidMax: boolean;
  invalidValue: boolean;
}

const DEFAULT_MAX = 100;
const CIRCULAR_RADIUS = 14;
const CIRCULAR_CIRCUMFERENCE = 2 * Math.PI * CIRCULAR_RADIUS;

function normalizeProgress(value: number | null, max: number | undefined): NormalizedProgress {
  const invalidMax = max !== undefined && (!Number.isFinite(max) || max <= 0);
  const normalizedMax = invalidMax || max === undefined ? DEFAULT_MAX : max;
  const invalidValue = value !== null && !Number.isFinite(value);

  return {
    max: normalizedMax,
    value: value === null ? null : Math.min(Math.max(invalidValue ? 0 : value, 0), normalizedMax),
    invalidMax,
    invalidValue,
  };
}

function getProgressState(progress: NormalizedProgress): ProgressState {
  return {
    ...progress,
    status:
      progress.value === null
        ? 'indeterminate'
        : progress.value === progress.max
          ? 'complete'
          : 'progressing',
  };
}

function getStateAttributes(state: ProgressState): Record<string, string | undefined> {
  return {
    'data-indeterminate': state.status === 'indeterminate' ? '' : undefined,
    'data-progressing': state.status === 'progressing' ? '' : undefined,
    'data-complete': state.status === 'complete' ? '' : undefined,
  };
}

const ProgressStyleContext = React.createContext<ControlSize>('md');

const TRACK_HEIGHT: Record<ControlSize, string> = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
};

const CIRCULAR_SIZE: Record<ControlSize, string> = {
  sm: 'size-5',
  md: 'size-7',
  lg: 'size-9',
};

type BaseProgressRootProps = React.ComponentPropsWithoutRef<typeof BaseProgress.Root>;

export interface ProgressRootProps extends Omit<
  BaseProgressRootProps,
  'className' | 'max' | 'min' | 'value'
> {
  className?: StateClassName<ProgressState>;
  max?: number;
  size?: ControlSize;
  value: number | null;
}

export const ProgressRoot = React.forwardRef<HTMLDivElement, ProgressRootProps>(
  ({ className, max, size = 'md', value, ...props }, ref) => {
    const normalized = normalizeProgress(value, max);
    const state = getProgressState(normalized);
    const ariaLabel =
      props['aria-label'] ?? (props['aria-labelledby'] === undefined ? 'Progress' : undefined);

    return (
      <ProgressStyleContext.Provider value={size}>
        <BaseProgress.Root
          {...props}
          aria-label={ariaLabel}
          className={(baseState) =>
            cn('grid gap-1', resolveClassName(className, { ...state, status: baseState.status }))
          }
          data-invalid-max={state.invalidMax ? '' : undefined}
          data-invalid-value={state.invalidValue ? '' : undefined}
          max={state.max}
          min={0}
          ref={ref}
          value={state.value}
        />
      </ProgressStyleContext.Provider>
    );
  },
);

ProgressRoot.displayName = 'Progress.Root';

type BaseProgressTrackProps = React.ComponentPropsWithoutRef<typeof BaseProgress.Track>;

export interface ProgressTrackProps extends Omit<BaseProgressTrackProps, 'className'> {
  className?: StateClassName<Pick<ProgressState, 'status'>>;
}

export const ProgressTrack = React.forwardRef<HTMLDivElement, ProgressTrackProps>(
  ({ className, ...props }, ref) => {
    const size = React.useContext(ProgressStyleContext);

    return (
      <BaseProgress.Track
        {...props}
        className={(state) =>
          cn(
            'bg-city-muted relative w-full overflow-hidden rounded-full',
            TRACK_HEIGHT[size],
            resolveClassName(className, state),
          )
        }
        ref={ref}
      />
    );
  },
);

ProgressTrack.displayName = 'Progress.Track';

type BaseProgressIndicatorProps = React.ComponentPropsWithoutRef<typeof BaseProgress.Indicator>;

export interface ProgressIndicatorProps extends Omit<BaseProgressIndicatorProps, 'className'> {
  className?: StateClassName<Pick<ProgressState, 'status'>>;
}

export const ProgressIndicator = React.forwardRef<HTMLDivElement, ProgressIndicatorProps>(
  ({ className, ...props }, ref) => (
    <BaseProgress.Indicator
      {...props}
      className={(state) =>
        cn(
          'bg-city-primary transition-[width] duration-200 ease-out data-[indeterminate]:w-2/5 data-[indeterminate]:animate-pulse',
          resolveClassName(className, state),
        )
      }
      ref={ref}
    />
  ),
);

ProgressIndicator.displayName = 'Progress.Indicator';

type BaseProgressLabelProps = React.ComponentPropsWithoutRef<typeof BaseProgress.Label>;

export interface ProgressLabelProps extends Omit<BaseProgressLabelProps, 'className'> {
  className?: StateClassName<Pick<ProgressState, 'status'>>;
}

export const ProgressLabel = React.forwardRef<HTMLSpanElement, ProgressLabelProps>(
  ({ className, ...props }, ref) => (
    <BaseProgress.Label
      {...props}
      className={(state) => cn('text-city-foreground text-sm', resolveClassName(className, state))}
      ref={ref}
    />
  ),
);

ProgressLabel.displayName = 'Progress.Label';

type BaseProgressValueProps = React.ComponentPropsWithoutRef<typeof BaseProgress.Value>;

export interface ProgressValueProps extends Omit<BaseProgressValueProps, 'className'> {
  className?: StateClassName<Pick<ProgressState, 'status'>>;
}

export const ProgressValue = React.forwardRef<HTMLSpanElement, ProgressValueProps>(
  ({ className, ...props }, ref) => (
    <BaseProgress.Value
      {...props}
      className={(state) =>
        cn('text-city-muted-foreground text-sm tabular-nums', resolveClassName(className, state))
      }
      ref={ref}
    />
  ),
);

ProgressValue.displayName = 'Progress.Value';

export interface ProgressCircularProps extends Omit<
  React.ComponentPropsWithoutRef<'svg'>,
  'children' | 'className' | 'format' | 'max' | 'value'
> {
  'aria-valuetext'?: string;
  children?: React.ReactNode;
  className?: string;
  format?: Intl.NumberFormatOptions;
  getAriaValueText?: (formattedValue: string | null, value: number | null) => string;
  locale?: Intl.LocalesArgument;
  max?: number;
  render?: useRender.ComponentProps<'svg', ProgressState>['render'];
  size?: ControlSize;
  value: number | null;
}

export const ProgressCircular = React.forwardRef<SVGSVGElement, ProgressCircularProps>(
  (
    {
      'aria-valuetext': ariaValueText,
      children,
      className,
      format,
      getAriaValueText,
      locale,
      max,
      render,
      size = 'md',
      value,
      ...props
    },
    ref,
  ) => {
    const normalized = normalizeProgress(value, max);
    const state = getProgressState(normalized);
    const formattedValue =
      state.value === null ? null : new Intl.NumberFormat(locale, format).format(state.value);
    const defaultAriaValueText =
      state.value === null ? 'indeterminate progress' : (formattedValue ?? `${state.value}%`);
    const resolvedAriaValueText =
      ariaValueText ?? getAriaValueText?.(formattedValue, state.value) ?? defaultAriaValueText;
    const percent = state.value === null ? 0.45 : state.value / state.max;
    const dashOffset = CIRCULAR_CIRCUMFERENCE * (1 - percent);
    const ariaLabel =
      props['aria-label'] ?? (props['aria-labelledby'] === undefined ? 'Progress' : undefined);
    return useRender<ProgressState, SVGSVGElement>({
      defaultTagName: 'svg',
      ref,
      render,
      state,
      props: {
        ...props,
        ...getStateAttributes(state),
        'aria-label': ariaLabel,
        'aria-valuemax': state.max,
        'aria-valuemin': 0,
        'aria-valuenow': state.value ?? undefined,
        'aria-valuetext': resolvedAriaValueText,
        children: (
          <>
            <circle
              className="stroke-city-muted"
              cx="16"
              cy="16"
              fill="none"
              r={CIRCULAR_RADIUS}
              strokeWidth="4"
            />
            <circle
              className={cn(
                'stroke-city-primary origin-center -rotate-90 transition-[stroke-dashoffset] duration-200 ease-out',
                state.status === 'indeterminate' && 'animate-spin',
              )}
              cx="16"
              cy="16"
              fill="none"
              r={CIRCULAR_RADIUS}
              strokeDasharray={
                state.status === 'indeterminate'
                  ? `${CIRCULAR_CIRCUMFERENCE * 0.4} ${CIRCULAR_CIRCUMFERENCE}`
                  : CIRCULAR_CIRCUMFERENCE
              }
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              strokeWidth="4"
            />
            {children}
          </>
        ),
        className: cn(CIRCULAR_SIZE[size], className),
        'data-city-progress-circular': '',
        'data-invalid-max': state.invalidMax ? '' : undefined,
        'data-invalid-value': state.invalidValue ? '' : undefined,
        role: 'progressbar',
        viewBox: '0 0 32 32',
      },
    });
  },
);

ProgressCircular.displayName = 'Progress.Circular';

export const Progress = {
  Root: ProgressRoot,
  Track: ProgressTrack,
  Indicator: ProgressIndicator,
  Label: ProgressLabel,
  Value: ProgressValue,
  Circular: ProgressCircular,
} as const;
