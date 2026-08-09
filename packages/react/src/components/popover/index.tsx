'use client';

import * as React from 'react';
import { Popover as BasePopover } from '@base-ui/react/popover';
import type {
  PopoverArrowProps as BasePopoverArrowProps,
  PopoverBackdropProps as BasePopoverBackdropProps,
  PopoverCloseProps as BasePopoverCloseProps,
  PopoverDescriptionProps as BasePopoverDescriptionProps,
  PopoverPopupProps as BasePopoverPopupProps,
  PopoverPortalProps as BasePopoverPortalProps,
  PopoverPositionerProps as BasePopoverPositionerProps,
  PopoverRootProps as BasePopoverRootProps,
  PopoverTitleProps as BasePopoverTitleProps,
  PopoverTriggerProps as BasePopoverTriggerProps,
  PopoverViewportProps as BasePopoverViewportProps,
} from '@base-ui/react/popover';
import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';

function classes<State>(className: StateClassName<State> | undefined, defaults: string) {
  return (state: State) => cn(defaults, resolveClassName(className, state));
}

export type PopoverRootProps<Payload = unknown> = BasePopoverRootProps<Payload>;
export type PopoverTriggerProps<Payload = unknown> = BasePopoverTriggerProps<Payload>;
export type PopoverPortalProps = BasePopoverPortalProps;
export type PopoverPositionerProps = BasePopoverPositionerProps;
export type PopoverPopupProps = BasePopoverPopupProps;
export type PopoverArrowProps = BasePopoverArrowProps;
export type PopoverBackdropProps = BasePopoverBackdropProps;
export type PopoverTitleProps = BasePopoverTitleProps;
export type PopoverDescriptionProps = BasePopoverDescriptionProps;
export type PopoverCloseProps = BasePopoverCloseProps;
export type PopoverViewportProps = BasePopoverViewportProps;

export const PopoverRoot = BasePopover.Root;
export const PopoverPortal = BasePopover.Portal;

export const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ className, render, ...props }, ref) => (
    <BasePopover.Trigger
      {...props}
      ref={ref}
      render={render}
      className={classes(
        className,
        render == null
          ? 'rounded-city-sm border-city-border bg-city-surface-raised text-city-foreground hover:bg-city-accent active:bg-city-accent-active focus-visible:ring-city-ring inline-flex h-(--city-control-md) items-center justify-center border px-2.5 text-xs font-medium transition-colors outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50'
          : '',
      )}
    />
  ),
);

export const PopoverPositioner = React.forwardRef<HTMLDivElement, PopoverPositionerProps>(
  ({ className, ...props }, ref) => (
    <BasePopover.Positioner {...props} ref={ref} className={classes(className, 'z-50')} />
  ),
);

export const PopoverPopup = React.forwardRef<HTMLDivElement, PopoverPopupProps>(
  ({ className, ...props }, ref) => (
    <BasePopover.Popup
      {...props}
      ref={ref}
      className={classes(
        className,
        'rounded-city-md border-city-border bg-city-surface-raised text-city-foreground shadow-city-popup w-80 max-w-[calc(100vw-2rem)] border p-4 outline-none',
      )}
    />
  ),
);

export const PopoverArrow = React.forwardRef<HTMLDivElement, PopoverArrowProps>(
  ({ className, ...props }, ref) => (
    <BasePopover.Arrow
      {...props}
      ref={ref}
      className={classes(
        className,
        'border-city-border bg-city-surface-raised size-2 rotate-45 border-r border-b',
      )}
    />
  ),
);

export const PopoverBackdrop = React.forwardRef<HTMLDivElement, PopoverBackdropProps>(
  ({ className, ...props }, ref) => (
    <BasePopover.Backdrop
      {...props}
      ref={ref}
      className={classes(className, 'bg-city-backdrop-subtle fixed inset-0 z-40')}
    />
  ),
);

export const PopoverTitle = React.forwardRef<HTMLHeadingElement, PopoverTitleProps>(
  ({ className, ...props }, ref) => (
    <BasePopover.Title
      {...props}
      ref={ref}
      className={classes(className, 'text-city-foreground text-sm leading-5 font-semibold')}
    />
  ),
);

export const PopoverDescription = React.forwardRef<HTMLParagraphElement, PopoverDescriptionProps>(
  ({ className, ...props }, ref) => (
    <BasePopover.Description
      {...props}
      ref={ref}
      className={classes(className, 'text-city-muted-foreground mt-1 text-sm leading-5')}
    />
  ),
);

export const PopoverClose = React.forwardRef<HTMLButtonElement, PopoverCloseProps>(
  ({ className, render, ...props }, ref) => (
    <BasePopover.Close
      {...props}
      ref={ref}
      render={render}
      className={classes(
        className,
        render == null
          ? 'rounded-city-sm border-city-border bg-city-surface-raised text-city-foreground hover:bg-city-accent active:bg-city-accent-active focus-visible:ring-city-ring inline-flex h-(--city-control-sm) items-center justify-center border px-2 text-xs font-medium transition-colors outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50'
          : '',
      )}
    />
  ),
);

export const PopoverViewport = React.forwardRef<HTMLDivElement, PopoverViewportProps>(
  ({ className, ...props }, ref) => (
    <BasePopover.Viewport {...props} ref={ref} className={classes(className, 'overflow-hidden')} />
  ),
);

export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Portal: PopoverPortal,
  Positioner: PopoverPositioner,
  Popup: PopoverPopup,
  Arrow: PopoverArrow,
  Backdrop: PopoverBackdrop,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Close: PopoverClose,
  Viewport: PopoverViewport,
  createHandle: BasePopover.createHandle,
};
