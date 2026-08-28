'use client';

import * as React from 'react';
import { Toast as BaseToast } from '@base-ui/react/toast';
import type {
  ToastActionProps as BaseToastActionProps,
  ToastArrowProps as BaseToastArrowProps,
  ToastCloseProps as BaseToastCloseProps,
  ToastContentProps as BaseToastContentProps,
  ToastDescriptionProps as BaseToastDescriptionProps,
  ToastManager as BaseToastManager,
  ToastObject as BaseToastObject,
  ToastPortalProps as BaseToastPortalProps,
  ToastPositionerProps as BaseToastPositionerProps,
  ToastProviderProps as BaseToastProviderProps,
  ToastRootProps as BaseToastRootProps,
  ToastTitleProps as BaseToastTitleProps,
  ToastViewportProps as BaseToastViewportProps,
  UseToastManagerReturnValue as BaseUseToastManagerReturnValue,
} from '@base-ui/react/toast';
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { feedbackToneStyles } from '../../lib/feedback-tone-styles';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { FeedbackTone } from '../../types';

function classes<State>(className: StateClassName<State> | undefined, defaults: string) {
  return (state: State) => cn(defaults, resolveClassName(className, state));
}

const ToastToneContext = React.createContext<FeedbackTone>('neutral');

const defaultIcons: Record<FeedbackTone, React.ComponentType<{ className?: string }>> = {
  neutral: Info,
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  destructive: CircleAlert,
};

export type ToastProviderProps = BaseToastProviderProps;
export type ToastViewportProps = BaseToastViewportProps;
export type ToastRootProps = Omit<BaseToastRootProps, 'className'> & {
  className?: BaseToastRootProps['className'];
  tone?: FeedbackTone;
};
export type ToastContentProps = BaseToastContentProps;
export type ToastTitleProps = BaseToastTitleProps;
export type ToastDescriptionProps = BaseToastDescriptionProps;
export type ToastActionProps = BaseToastActionProps;
export type ToastCloseProps = BaseToastCloseProps;
export type ToastPortalProps = BaseToastPortalProps;
export type ToastPositionerProps = BaseToastPositionerProps;
export type ToastArrowProps = BaseToastArrowProps;
export type ToastManager<Data extends object = Record<string, unknown>> = BaseToastManager<Data>;
export type ToastObject<Data extends object = Record<string, unknown>> = BaseToastObject<Data>;
export type UseToastManagerReturnValue<Data extends object = Record<string, unknown>> =
  BaseUseToastManagerReturnValue<Data>;

export const ToastProvider: React.FC<ToastProviderProps> = BaseToast.Provider;
export const ToastPortal: React.ForwardRefExoticComponent<
  Omit<ToastPortalProps, 'ref'> & React.RefAttributes<HTMLDivElement>
> = BaseToast.Portal;
export const useToastManager: <
  Data extends object = Record<string, unknown>,
>() => UseToastManagerReturnValue<Data> = BaseToast.useToastManager;
export const createToastManager: <
  Data extends object = Record<string, unknown>,
>() => ToastManager<Data> = BaseToast.createToastManager;

export const ToastViewport = React.forwardRef<HTMLDivElement, ToastViewportProps>(
  ({ className, ...props }, ref) => (
    <BaseToast.Viewport
      {...props}
      ref={ref}
      className={classes(
        className,
        'fixed right-4 bottom-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col-reverse gap-2 outline-none',
      )}
    />
  ),
);

function getToastTone(type: string | undefined): FeedbackTone {
  if (type === 'error' || type === 'destructive') {
    return 'destructive';
  }

  if (type === 'info' || type === 'success' || type === 'warning') {
    return type;
  }

  return 'neutral';
}

export const ToastRoot = React.forwardRef<HTMLDivElement, ToastRootProps>(
  ({ className, toast, tone: toneProp, ...props }, ref) => {
    const tone = toneProp ?? getToastTone(toast.type);
    const toneStyles = feedbackToneStyles[tone];

    return (
      <ToastToneContext.Provider value={tone}>
        <BaseToast.Root
          {...props}
          ref={ref}
          toast={toast}
          data-city-toast-root=""
          data-tone={tone}
          className={classes(
            className,
            cn(
              'city-toast-surface rounded-city-md shadow-city-popup w-full border border-current data-[limited]:hidden',
              toneStyles.indicator,
            ),
          )}
        />
      </ToastToneContext.Provider>
    );
  },
);

export const ToastContent = React.forwardRef<HTMLDivElement, ToastContentProps>(
  ({ children, className, ...props }, ref) => {
    const tone = React.useContext(ToastToneContext);
    const DefaultIcon = defaultIcons[tone];

    return (
      <BaseToast.Content
        {...props}
        ref={ref}
        data-city-toast-content=""
        className={classes(className, 'flex items-start gap-3 p-3')}
      >
        <span aria-hidden className="mt-0.5 inline-flex size-5 shrink-0" data-city-toast-icon="">
          <DefaultIcon className="size-5" />
        </span>
        {children}
      </BaseToast.Content>
    );
  },
);

export const ToastTitle = React.forwardRef<HTMLHeadingElement, ToastTitleProps>(
  ({ className, ...props }, ref) => (
    <BaseToast.Title
      {...props}
      ref={ref}
      className={classes(className, 'text-sm leading-5 font-medium')}
    />
  ),
);

export const ToastDescription = React.forwardRef<HTMLParagraphElement, ToastDescriptionProps>(
  ({ className, ...props }, ref) => (
    <BaseToast.Description
      {...props}
      ref={ref}
      className={classes(className, 'mt-0.5 text-sm leading-5')}
    />
  ),
);

export const ToastAction = React.forwardRef<HTMLButtonElement, ToastActionProps>(
  ({ className, ...props }, ref) => (
    <BaseToast.Action
      {...props}
      ref={ref}
      data-city-toast-action=""
      className={classes(
        className,
        'rounded-city-xs hover:bg-city-accent active:bg-city-accent-active focus-visible:ring-city-ring shrink-0 px-2 py-1 text-sm font-medium underline underline-offset-2 outline-none focus-visible:ring-2',
      )}
    />
  ),
);

export const ToastClose = React.forwardRef<HTMLButtonElement, ToastCloseProps>(
  ({ className, children, 'aria-label': ariaLabel, ...props }, ref) => (
    <BaseToast.Close
      {...props}
      ref={ref}
      aria-label={ariaLabel ?? 'Close notification'}
      className={classes(
        className,
        'rounded-city-xs hover:bg-city-accent hover:text-city-accent-foreground active:bg-city-accent-active focus-visible:ring-city-ring ml-auto inline-flex size-7 shrink-0 items-center justify-center outline-none focus-visible:ring-2',
      )}
    >
      {children ?? <X aria-hidden="true" size={16} strokeWidth={1.8} />}
    </BaseToast.Close>
  ),
);

export const ToastPositioner = React.forwardRef<HTMLDivElement, ToastPositionerProps>(
  ({ className, ...props }, ref) => (
    <BaseToast.Positioner {...props} ref={ref} className={classes(className, 'z-50')} />
  ),
);

export const ToastArrow = React.forwardRef<HTMLDivElement, ToastArrowProps>(
  ({ className, ...props }, ref) => (
    <BaseToast.Arrow
      {...props}
      ref={ref}
      className={classes(className, 'border-current bg-inherit size-2 rotate-45 border-t border-l')}
    />
  ),
);

export interface ToastComponents {
  Provider: typeof ToastProvider;
  Viewport: typeof ToastViewport;
  Root: typeof ToastRoot;
  Content: typeof ToastContent;
  Title: typeof ToastTitle;
  Description: typeof ToastDescription;
  Action: typeof ToastAction;
  Close: typeof ToastClose;
  Portal: typeof ToastPortal;
  Positioner: typeof ToastPositioner;
  Arrow: typeof ToastArrow;
  useToastManager: typeof useToastManager;
  createToastManager: typeof createToastManager;
}

export const Toast: ToastComponents = {
  Provider: ToastProvider,
  Viewport: ToastViewport,
  Root: ToastRoot,
  Content: ToastContent,
  Title: ToastTitle,
  Description: ToastDescription,
  Action: ToastAction,
  Close: ToastClose,
  Portal: ToastPortal,
  Positioner: ToastPositioner,
  Arrow: ToastArrow,
  useToastManager,
  createToastManager,
};
