'use client';

import * as React from 'react';
import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import type {
  DrawerBackdropProps as BaseDrawerBackdropProps,
  DrawerCloseProps as BaseDrawerCloseProps,
  DrawerContentProps as BaseDrawerContentProps,
  DrawerDescriptionProps as BaseDrawerDescriptionProps,
  DrawerPopupProps as BaseDrawerPopupProps,
  DrawerPortalProps as BaseDrawerPortalProps,
  DrawerProviderProps as BaseDrawerProviderProps,
  DrawerRootProps as BaseDrawerRootProps,
  DrawerSwipeAreaProps as BaseDrawerSwipeAreaProps,
  DrawerTitleProps as BaseDrawerTitleProps,
  DrawerTriggerProps as BaseDrawerTriggerProps,
  DrawerViewportProps as BaseDrawerViewportProps,
} from '@base-ui/react/drawer';
import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';

function classes<State>(className: StateClassName<State> | undefined, defaults: string) {
  return (state: State) => cn(defaults, resolveClassName(className, state));
}

export const DRAWER_SIDES = ['left', 'right', 'bottom'] as const;
export type DrawerSide = (typeof DRAWER_SIDES)[number];
export const DRAWER_SIZES = ['sm', 'md', 'lg', 'xl', 'full'] as const;
export type DrawerSize = (typeof DRAWER_SIZES)[number];

export type DrawerProviderProps = BaseDrawerProviderProps;
export type DrawerRootProps<Payload = unknown> = BaseDrawerRootProps<Payload>;
export type DrawerTriggerProps<Payload = unknown> = BaseDrawerTriggerProps<Payload>;
export type DrawerPortalProps = BaseDrawerPortalProps;
export type DrawerBackdropProps = BaseDrawerBackdropProps;
export type DrawerTitleProps = BaseDrawerTitleProps;
export type DrawerDescriptionProps = BaseDrawerDescriptionProps;
export type DrawerCloseProps = BaseDrawerCloseProps;
export type DrawerContentProps = BaseDrawerContentProps;
export type DrawerSwipeAreaProps = BaseDrawerSwipeAreaProps;
export type DrawerHeaderProps = React.ComponentPropsWithoutRef<'div'>;
export type DrawerFooterProps = React.ComponentPropsWithoutRef<'div'>;
export interface DrawerViewportProps extends BaseDrawerViewportProps {
  side?: DrawerSide;
}
export interface DrawerPopupProps extends BaseDrawerPopupProps {
  side?: DrawerSide;
  size?: DrawerSize;
}

const viewportSideClasses: Record<DrawerSide, string> = {
  left: 'items-stretch justify-start',
  right: 'items-stretch justify-end',
  bottom: 'items-end justify-center',
};

const popupSideClasses: Record<DrawerSide, string> = {
  left: 'h-full max-h-dvh rounded-r-city-lg border-r',
  right: 'h-full max-h-dvh rounded-l-city-lg border-l',
  bottom: 'w-full rounded-t-city-lg border-t',
};

const popupMotionClasses: Record<DrawerSide, string> = {
  left: '[transform:translateX(var(--drawer-swipe-movement-x))] data-[starting-style]:[transform:translateX(-100%)] data-[ending-style]:[transform:translateX(-100%)]',
  right:
    '[transform:translateX(var(--drawer-swipe-movement-x))] data-[starting-style]:[transform:translateX(100%)] data-[ending-style]:[transform:translateX(100%)]',
  bottom:
    '[transform:translateY(var(--drawer-swipe-movement-y))] data-[starting-style]:[transform:translateY(100%)] data-[ending-style]:[transform:translateY(100%)]',
};

const popupSizeClasses: Record<DrawerSide, Record<DrawerSize, string>> = {
  left: {
    sm: 'w-[min(20rem,calc(100vw-2rem))]',
    md: 'w-[min(26rem,calc(100vw-2rem))]',
    lg: 'w-[min(32rem,calc(100vw-2rem))]',
    xl: 'w-[min(40rem,calc(100vw-2rem))]',
    full: 'w-full',
  },
  right: {
    sm: 'w-[min(20rem,calc(100vw-2rem))]',
    md: 'w-[min(26rem,calc(100vw-2rem))]',
    lg: 'w-[min(32rem,calc(100vw-2rem))]',
    xl: 'w-[min(40rem,calc(100vw-2rem))]',
    full: 'w-full',
  },
  bottom: {
    sm: 'max-h-[50dvh]',
    md: 'max-h-[min(42rem,calc(100dvh-2rem))]',
    lg: 'max-h-[calc(100dvh-4rem)]',
    xl: 'max-h-[calc(100dvh-2rem)]',
    full: 'h-full max-h-dvh',
  },
};

export const DrawerProvider: React.FC<DrawerProviderProps> = BaseDrawer.Provider;
export const DrawerRoot = BaseDrawer.Root;
export const DrawerPortal = BaseDrawer.Portal;

export const DrawerTrigger = React.forwardRef<HTMLButtonElement, DrawerTriggerProps>(
  ({ className, render, ...props }, ref) => (
    <BaseDrawer.Trigger
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

export const DrawerBackdrop = React.forwardRef<HTMLDivElement, DrawerBackdropProps>(
  ({ className, ...props }, ref) => (
    <BaseDrawer.Backdrop
      {...props}
      ref={ref}
      className={classes(
        className,
        'bg-city-backdrop fixed inset-0 z-50 opacity-[calc(1-var(--drawer-swipe-progress))] backdrop-blur-[8px] transition-opacity duration-(--city-duration-normal) ease-city-standard data-[swiping]:duration-0 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 data-[ending-style]:duration-[calc(var(--drawer-swipe-strength,1)*var(--city-duration-normal))] motion-reduce:transition-none',
      )}
    />
  ),
);

export const DrawerViewport = React.forwardRef<HTMLDivElement, DrawerViewportProps>(
  ({ className, side = 'right', ...props }, ref) => (
    <BaseDrawer.Viewport
      {...props}
      ref={ref}
      data-side={side}
      className={classes(
        className,
        cn('fixed inset-0 z-50 flex overflow-hidden', viewportSideClasses[side]),
      )}
    />
  ),
);

export const DrawerPopup = React.forwardRef<HTMLDivElement, DrawerPopupProps>(
  ({ className, side = 'right', size = 'md', ...props }, ref) => (
    <BaseDrawer.Popup
      {...props}
      ref={ref}
      data-city-drawer-popup=""
      data-side={side}
      data-size={size}
      className={classes(
        className,
        cn(
          'border-city-border bg-city-surface-raised text-city-foreground shadow-city-popup flex flex-col transition-transform duration-(--city-duration-normal) ease-city-standard outline-none data-[swiping]:duration-0 data-[swiping]:select-none data-[ending-style]:duration-[calc(var(--drawer-swipe-strength,1)*var(--city-duration-normal))] motion-reduce:transition-none',
          popupSideClasses[side],
          popupMotionClasses[side],
          popupSizeClasses[side][size],
        ),
      )}
    />
  ),
);

DrawerPopup.displayName = 'Drawer.Popup';

export const DrawerHeader = React.forwardRef<HTMLDivElement, DrawerHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      className={cn(
        'border-city-border flex shrink-0 items-start justify-between gap-4 border-b p-5',
        className,
      )}
      data-city-drawer-header=""
    />
  ),
);

DrawerHeader.displayName = 'Drawer.Header';

export const DrawerContent = React.forwardRef<HTMLDivElement, DrawerContentProps>(
  ({ className, ...props }, ref) => (
    <BaseDrawer.Content
      {...props}
      ref={ref}
      className={classes(className, 'flex-1 overflow-auto p-5')}
      data-city-drawer-body=""
    />
  ),
);

DrawerContent.displayName = 'Drawer.Content';

export const DrawerFooter = React.forwardRef<HTMLDivElement, DrawerFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      className={cn(
        'border-city-border bg-city-surface-raised flex shrink-0 justify-end gap-2 border-t px-5 py-4',
        className,
      )}
      data-city-drawer-footer=""
    />
  ),
);

DrawerFooter.displayName = 'Drawer.Footer';

export const DrawerSwipeArea = React.forwardRef<HTMLDivElement, DrawerSwipeAreaProps>(
  ({ className, ...props }, ref) => (
    <BaseDrawer.SwipeArea
      {...props}
      ref={ref}
      className={classes(className, 'fixed inset-x-0 bottom-0 h-6')}
    />
  ),
);

export const DrawerTitle = React.forwardRef<HTMLHeadingElement, DrawerTitleProps>(
  ({ className, ...props }, ref) => (
    <BaseDrawer.Title
      {...props}
      ref={ref}
      className={classes(className, 'text-city-foreground text-base leading-6 font-semibold')}
    />
  ),
);

export const DrawerDescription = React.forwardRef<HTMLParagraphElement, DrawerDescriptionProps>(
  ({ className, ...props }, ref) => (
    <BaseDrawer.Description
      {...props}
      ref={ref}
      className={classes(className, 'text-city-muted-foreground mt-1.5 text-sm leading-5')}
    />
  ),
);

export const DrawerClose = React.forwardRef<HTMLButtonElement, DrawerCloseProps>(
  ({ className, render, ...props }, ref) => (
    <BaseDrawer.Close
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

export const Drawer = {
  Provider: DrawerProvider,
  Root: DrawerRoot,
  Trigger: DrawerTrigger,
  Portal: DrawerPortal,
  Backdrop: DrawerBackdrop,
  Viewport: DrawerViewport,
  Popup: DrawerPopup,
  Header: DrawerHeader,
  Footer: DrawerFooter,
  Content: DrawerContent,
  SwipeArea: DrawerSwipeArea,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Close: DrawerClose,
  createHandle: BaseDrawer.createHandle,
};
