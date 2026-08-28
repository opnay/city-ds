'use client';

import * as React from 'react';
import { CircleAlert, CircleCheck, Info, LoaderCircle, TriangleAlert, X } from 'lucide-react';
import {
  Toaster as SonnerToaster,
  toast as sonnerToast,
  useSonner,
  type Action as SonnerAction,
  type ExternalToast as SonnerToastOptions,
  type ToastClassnames as SonnerToastClassNames,
  type ToastT as SonnerToastData,
  type ToasterProps as SonnerToasterProps,
} from 'sonner';
import { cn } from '../../lib/cn';

export type ToastAction = SonnerAction;
export type ToastClassNames = SonnerToastClassNames;
export type ToastData = SonnerToastData;
export type ToastOptions = SonnerToastOptions;
export type ToasterProps = SonnerToasterProps;

const iconProps = {
  'aria-hidden': true,
  className: 'size-5',
  'data-city-toast-default-icon': '',
} as const;

const defaultIcons = {
  close: <X aria-hidden className="size-4" />,
  error: <CircleAlert {...iconProps} />,
  info: <Info {...iconProps} />,
  loading: <LoaderCircle {...iconProps} className="size-5 animate-spin" />,
  success: <CircleCheck {...iconProps} />,
  warning: <TriangleAlert {...iconProps} />,
};

const baseClassNames: ToastClassNames = {
  actionButton:
    'rounded-city-xs hover:bg-city-accent active:bg-city-accent-active focus-visible:ring-city-ring order-2 shrink-0 px-2 py-1 text-sm font-medium underline underline-offset-2 outline-none focus-visible:ring-2',
  cancelButton:
    'rounded-city-xs hover:bg-city-accent active:bg-city-accent-active focus-visible:ring-city-ring order-2 shrink-0 px-2 py-1 text-sm font-medium outline-none focus-visible:ring-2',
  closeButton:
    'rounded-city-xs hover:bg-city-accent hover:text-city-accent-foreground active:bg-city-accent-active focus-visible:ring-city-ring order-3 ml-auto inline-flex size-7 shrink-0 items-center justify-center outline-none focus-visible:ring-2',
  content: 'order-1 min-w-0 flex-1',
  default: 'text-city-muted-foreground',
  description: 'mt-0.5 text-sm leading-5',
  error: 'text-city-destructive',
  icon: 'city-toast-icon order-0 mt-0.5 size-5 shrink-0',
  info: 'text-city-info',
  loader: 'relative inline-flex size-5',
  loading: 'text-city-muted-foreground',
  success: 'text-city-success',
  title: 'text-sm leading-5 font-medium',
  toast:
    'city-toast-root city-toast-surface rounded-city-md shadow-city-popup flex w-full items-start gap-3 border border-current p-3 outline-none',
  warning: 'text-city-warning',
};

function mergeClassNames(classNames: ToastClassNames | undefined): ToastClassNames {
  return {
    ...classNames,
    ...Object.fromEntries(
      Object.entries(baseClassNames).map(([name, className]) => [
        name,
        cn(className, classNames?.[name as keyof ToastClassNames]),
      ]),
    ),
  };
}

export const Toaster = React.forwardRef<HTMLElement, ToasterProps>(
  (
    {
      className,
      closeButton = true,
      duration = 5000,
      gap = 8,
      id,
      icons,
      mobileOffset = 16,
      offset = 16,
      style,
      toastOptions,
      visibleToasts = 3,
      ...props
    },
    ref,
  ) => {
    return (
      <SonnerToaster
        {...props}
        ref={ref}
        className={cn('city-toast-viewport', className)}
        closeButton={closeButton}
        duration={duration}
        gap={gap}
        icons={{ ...defaultIcons, ...icons }}
        mobileOffset={mobileOffset}
        offset={offset}
        style={{ '--width': '24rem', ...style } as React.CSSProperties}
        toastOptions={{
          ...toastOptions,
          classNames: mergeClassNames(toastOptions?.classNames),
          closeButtonAriaLabel: toastOptions?.closeButtonAriaLabel ?? 'Close notification',
          unstyled: true,
        }}
        visibleToasts={visibleToasts}
        {...(id === undefined ? {} : { id })}
      />
    );
  },
);

type ActionElementProps = {
  'data-action'?: string;
};

function withActionMarker(options: ToastOptions | undefined): ToastOptions | undefined {
  if (!React.isValidElement<ActionElementProps>(options?.action)) return options;

  return {
    ...options,
    action: React.cloneElement(options.action, { 'data-action': '' }),
  };
}

function withNeutralIcon(options: ToastOptions | undefined): ToastOptions {
  const markedOptions = withActionMarker(options);
  if (markedOptions?.icon !== undefined) return markedOptions;

  return {
    ...markedOptions,
    icon: <Info {...iconProps} />,
  };
}

const showNeutralToast = (message: Parameters<typeof sonnerToast>[0], options?: ToastOptions) =>
  sonnerToast(message, withNeutralIcon(options));

const showSuccessToast: typeof sonnerToast.success = (message, options) =>
  sonnerToast.success(message, withActionMarker(options));
const showInfoToast: typeof sonnerToast.info = (message, options) =>
  sonnerToast.info(message, withActionMarker(options));
const showWarningToast: typeof sonnerToast.warning = (message, options) =>
  sonnerToast.warning(message, withActionMarker(options));
const showErrorToast: typeof sonnerToast.error = (message, options) =>
  sonnerToast.error(message, withActionMarker(options));
const showLoadingToast: typeof sonnerToast.loading = (message, options) =>
  sonnerToast.loading(message, withActionMarker(options));
const showCustomToast: typeof sonnerToast.custom = (jsx, options) =>
  sonnerToast.custom(jsx, withActionMarker(options));

export const toast: typeof sonnerToast = Object.assign(showNeutralToast, {
  custom: showCustomToast,
  dismiss: sonnerToast.dismiss,
  error: showErrorToast,
  getHistory: sonnerToast.getHistory,
  getToasts: sonnerToast.getToasts,
  info: showInfoToast,
  loading: showLoadingToast,
  message: showNeutralToast,
  promise: sonnerToast.promise,
  success: showSuccessToast,
  warning: showWarningToast,
});

export { useSonner };
