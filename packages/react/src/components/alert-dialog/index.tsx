'use client';

import * as React from 'react';
import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import type {
  AlertDialogBackdropProps as BaseAlertDialogBackdropProps,
  AlertDialogCloseProps as BaseAlertDialogCloseProps,
  AlertDialogDescriptionProps as BaseAlertDialogDescriptionProps,
  AlertDialogPopupProps as BaseAlertDialogPopupProps,
  AlertDialogPortalProps as BaseAlertDialogPortalProps,
  AlertDialogRootProps as BaseAlertDialogRootProps,
  AlertDialogTitleProps as BaseAlertDialogTitleProps,
  AlertDialogTriggerProps as BaseAlertDialogTriggerProps,
  AlertDialogViewportProps as BaseAlertDialogViewportProps,
} from '@base-ui/react/alert-dialog';
import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import {
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogPortal,
  DialogTitle,
  DialogViewport,
} from '../dialog';

function classes<State>(className: StateClassName<State> | undefined, defaults: string) {
  return (state: State) => cn(defaults, resolveClassName(className, state));
}

export type AlertDialogRootProps<Payload = unknown> = BaseAlertDialogRootProps<Payload>;
export type AlertDialogTriggerProps<Payload = unknown> = BaseAlertDialogTriggerProps<Payload>;
export type AlertDialogPortalProps = BaseAlertDialogPortalProps;
export type AlertDialogBackdropProps = BaseAlertDialogBackdropProps;
export type AlertDialogViewportProps = BaseAlertDialogViewportProps;
export type AlertDialogPopupProps = BaseAlertDialogPopupProps;
export type AlertDialogTitleProps = BaseAlertDialogTitleProps;
export type AlertDialogDescriptionProps = BaseAlertDialogDescriptionProps;
export type AlertDialogCloseProps = BaseAlertDialogCloseProps;
export type AlertDialogCancelProps = AlertDialogCloseProps;
export type AlertDialogActionProps = AlertDialogCloseProps & { destructive?: boolean };

export const AlertDialogRoot = BaseAlertDialog.Root;
export const AlertDialogPortal = DialogPortal;

export const AlertDialogTrigger = React.forwardRef<HTMLButtonElement, AlertDialogTriggerProps>(
  ({ className, render, ...props }, ref) => (
    <BaseAlertDialog.Trigger
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

export const AlertDialogBackdrop = DialogBackdrop;
export const AlertDialogViewport = DialogViewport;
export const AlertDialogPopup = DialogPopup;
export const AlertDialogTitle = DialogTitle;
export const AlertDialogDescription = DialogDescription;
export const AlertDialogClose = DialogClose;

export const AlertDialogCancel = React.forwardRef<HTMLButtonElement, AlertDialogCancelProps>(
  ({ className, render, ...props }, ref) => (
    <BaseAlertDialog.Close
      {...props}
      ref={ref}
      render={render}
      className={classes(
        className,
        render == null
          ? 'rounded-city-sm border-city-border bg-city-background text-city-foreground hover:bg-city-accent active:bg-city-accent-active focus-visible:ring-city-ring focus-visible:ring-offset-city-background inline-flex h-(--city-control-sm) items-center justify-center border px-2 text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
          : '',
      )}
    />
  ),
);

export const AlertDialogAction = React.forwardRef<HTMLButtonElement, AlertDialogActionProps>(
  ({ className, destructive = false, render, ...props }, ref) => (
    <BaseAlertDialog.Close
      {...props}
      ref={ref}
      render={render}
      className={classes(
        className,
        render == null
          ? cn(
              'rounded-city-sm focus-visible:ring-city-ring focus-visible:ring-offset-city-background inline-flex h-(--city-control-sm) items-center justify-center px-2 text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
              destructive
                ? 'bg-city-destructive text-city-destructive-foreground hover:bg-city-destructive-hover active:bg-city-destructive-active'
                : 'bg-city-primary text-city-primary-foreground hover:bg-city-primary-hover active:bg-city-primary-active',
            )
          : '',
      )}
    />
  ),
);

export const AlertDialog = {
  Root: AlertDialogRoot,
  Trigger: AlertDialogTrigger,
  Portal: AlertDialogPortal,
  Backdrop: AlertDialogBackdrop,
  Viewport: AlertDialogViewport,
  Popup: AlertDialogPopup,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
  Close: AlertDialogClose,
  Cancel: AlertDialogCancel,
  Action: AlertDialogAction,
  createHandle: BaseAlertDialog.createHandle,
};
