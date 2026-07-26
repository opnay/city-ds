'use client';

import * as React from 'react';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type {
  DialogBackdropProps as BaseDialogBackdropProps,
  DialogCloseProps as BaseDialogCloseProps,
  DialogDescriptionProps as BaseDialogDescriptionProps,
  DialogPopupProps as BaseDialogPopupProps,
  DialogPortalProps as BaseDialogPortalProps,
  DialogRootProps as BaseDialogRootProps,
  DialogTitleProps as BaseDialogTitleProps,
  DialogTriggerProps as BaseDialogTriggerProps,
  DialogViewportProps as BaseDialogViewportProps,
} from '@base-ui/react/dialog';
import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';

function classes<State>(className: StateClassName<State> | undefined, defaults: string) {
  return (state: State) => cn(defaults, resolveClassName(className, state));
}

export type DialogRootProps<Payload = unknown> = BaseDialogRootProps<Payload>;
export type DialogTriggerProps<Payload = unknown> = BaseDialogTriggerProps<Payload>;
export type DialogPortalProps = BaseDialogPortalProps;
export type DialogBackdropProps = BaseDialogBackdropProps;
export type DialogViewportProps = BaseDialogViewportProps;
export type DialogPopupProps = BaseDialogPopupProps;
export type DialogTitleProps = BaseDialogTitleProps;
export type DialogDescriptionProps = BaseDialogDescriptionProps;
export type DialogCloseProps = BaseDialogCloseProps;

export const DialogRoot = BaseDialog.Root;
export const DialogPortal = BaseDialog.Portal;

export const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ className, render, ...props }, ref) => (
    <BaseDialog.Trigger
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

export const DialogBackdrop = React.forwardRef<HTMLDivElement, DialogBackdropProps>(
  ({ className, ...props }, ref) => (
    <BaseDialog.Backdrop
      {...props}
      ref={ref}
      className={classes(className, 'fixed inset-0 z-50 bg-black/45')}
    />
  ),
);

export const DialogViewport = React.forwardRef<HTMLDivElement, DialogViewportProps>(
  ({ className, ...props }, ref) => (
    <BaseDialog.Viewport
      {...props}
      ref={ref}
      className={classes(
        className,
        'fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4',
      )}
    />
  ),
);

export const DialogPopup = React.forwardRef<HTMLDivElement, DialogPopupProps>(
  ({ className, ...props }, ref) => (
    <BaseDialog.Popup
      {...props}
      ref={ref}
      className={classes(
        className,
        'rounded-city-md border-city-border bg-city-surface-raised text-city-foreground shadow-city-popup w-full max-w-lg border p-5 outline-none',
      )}
    />
  ),
);

export const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, ...props }, ref) => (
    <BaseDialog.Title
      {...props}
      ref={ref}
      className={classes(className, 'text-city-foreground text-base leading-6 font-semibold')}
    />
  ),
);

export const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className, ...props }, ref) => (
    <BaseDialog.Description
      {...props}
      ref={ref}
      className={classes(className, 'text-city-muted-foreground mt-1.5 text-sm leading-5')}
    />
  ),
);

export const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ className, render, ...props }, ref) => (
    <BaseDialog.Close
      {...props}
      ref={ref}
      render={render}
      className={classes(
        className,
        render == null
          ? 'rounded-city-sm border-city-border bg-city-surface-raised text-city-foreground hover:bg-city-accent active:bg-city-accent-active focus-visible:ring-city-ring inline-flex h-(--city-control-sm) items-center justify-center border px-2.5 text-sm font-medium transition-colors outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50'
          : '',
      )}
    />
  ),
);

export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Backdrop: DialogBackdrop,
  Viewport: DialogViewport,
  Popup: DialogPopup,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
  createHandle: BaseDialog.createHandle,
};
