'use client';

import * as React from 'react';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import type {
  TooltipArrowProps as BaseTooltipArrowProps,
  TooltipPopupProps as BaseTooltipPopupProps,
  TooltipPortalProps as BaseTooltipPortalProps,
  TooltipPositionerProps as BaseTooltipPositionerProps,
  TooltipProviderProps as BaseTooltipProviderProps,
  TooltipRootProps as BaseTooltipRootProps,
  TooltipTriggerProps as BaseTooltipTriggerProps,
  TooltipViewportProps as BaseTooltipViewportProps,
} from '@base-ui/react/tooltip';
import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';

function classes<State>(className: StateClassName<State> | undefined, defaults: string) {
  return (state: State) => cn(defaults, resolveClassName(className, state));
}

export type TooltipProviderProps = BaseTooltipProviderProps;
export type TooltipRootProps<Payload = unknown> = BaseTooltipRootProps<Payload>;
export type TooltipTriggerProps<Payload = unknown> = BaseTooltipTriggerProps<Payload>;
export type TooltipPortalProps = BaseTooltipPortalProps;
export type TooltipPositionerProps = BaseTooltipPositionerProps;
export type TooltipPopupProps = BaseTooltipPopupProps;
export type TooltipViewportProps = BaseTooltipViewportProps;
export type TooltipArrowProps = BaseTooltipArrowProps;

export const TooltipProvider = BaseTooltip.Provider;
export const TooltipRoot = BaseTooltip.Root;
export const TooltipPortal = BaseTooltip.Portal;

export const TooltipTrigger = React.forwardRef<HTMLButtonElement, TooltipTriggerProps>(
  ({ className, render, ...props }, ref) => (
    <BaseTooltip.Trigger
      {...props}
      ref={ref}
      render={render}
      className={classes(
        className,
        render == null
          ? 'rounded-city-sm border-city-border bg-city-surface-raised text-city-foreground hover:bg-city-accent active:bg-city-accent-active focus-visible:ring-city-ring inline-flex h-(--city-control-md) items-center justify-center border px-3 text-sm font-medium transition-colors outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50'
          : '',
      )}
    />
  ),
);

export const TooltipPositioner = React.forwardRef<HTMLDivElement, TooltipPositionerProps>(
  ({ className, ...props }, ref) => (
    <BaseTooltip.Positioner {...props} ref={ref} className={classes(className, 'z-50')} />
  ),
);

export const TooltipPopup = React.forwardRef<HTMLDivElement, TooltipPopupProps>(
  ({ className, role, ...props }, ref) => (
    <BaseTooltip.Popup
      {...props}
      ref={ref}
      role={role ?? 'tooltip'}
      className={classes(
        className,
        'rounded-city-sm bg-city-foreground text-city-background shadow-city-popup max-w-64 px-2.5 py-1.5 text-xs leading-4',
      )}
    />
  ),
);

export const TooltipViewport = React.forwardRef<HTMLDivElement, TooltipViewportProps>(
  ({ className, ...props }, ref) => (
    <BaseTooltip.Viewport {...props} ref={ref} className={classes(className, 'overflow-hidden')} />
  ),
);

export const TooltipArrow = React.forwardRef<HTMLDivElement, TooltipArrowProps>(
  ({ className, ...props }, ref) => (
    <BaseTooltip.Arrow
      {...props}
      ref={ref}
      className={classes(className, 'bg-city-foreground size-2 rotate-45')}
    />
  ),
);

export const Tooltip = {
  Provider: TooltipProvider,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Portal: TooltipPortal,
  Positioner: TooltipPositioner,
  Popup: TooltipPopup,
  Viewport: TooltipViewport,
  Arrow: TooltipArrow,
  createHandle: BaseTooltip.createHandle,
};
