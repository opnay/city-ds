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
import { useRender } from '@base-ui/react/use-render';
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
export type DialogTitleProps = BaseDialogTitleProps;
export type DialogDescriptionProps = BaseDialogDescriptionProps;
export type DialogCloseProps = BaseDialogCloseProps;

export const DIALOG_SIZES = ['sm', 'md', 'lg', 'xl', 'full'] as const;
export type DialogSize = (typeof DIALOG_SIZES)[number];
export const DIALOG_SCROLL_MODES = ['none', 'body'] as const;
export type DialogScrollMode = (typeof DIALOG_SCROLL_MODES)[number];

export interface DialogShellState extends Record<string, unknown> {
  scroll: DialogScrollMode;
  size: DialogSize;
}

export interface DialogPopupProps extends BaseDialogPopupProps {
  scroll?: DialogScrollMode;
  size?: DialogSize;
}

type DialogSectionProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> & {
  className?: StateClassName<DialogShellState>;
  render?: useRender.ComponentProps<'div', DialogShellState>['render'];
};

export type DialogHeaderProps = DialogSectionProps;
export type DialogBodyProps = DialogSectionProps;
export type DialogFooterProps = DialogSectionProps;

const dialogSizeClasses: Record<DialogSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[calc(100vw-2rem)]',
};

const defaultDialogShellState: DialogShellState = {
  scroll: 'none',
  size: 'md',
};

const DialogShellContext = React.createContext<DialogShellState>(defaultDialogShellState);

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
  ({ className, scroll = 'none', size = 'md', ...props }, ref) => {
    const shellState = React.useMemo<DialogShellState>(() => ({ scroll, size }), [scroll, size]);

    return (
      <DialogShellContext.Provider value={shellState}>
        <BaseDialog.Popup
          {...props}
          ref={ref}
          data-city-dialog-popup=""
          data-scroll={scroll}
          data-size={size}
          className={classes(
            className,
            cn(
              'rounded-city-md border-city-border bg-city-surface-raised text-city-foreground shadow-city-popup w-full border outline-none',
              dialogSizeClasses[size],
              scroll === 'body'
                ? 'flex max-h-[calc(100dvh-2rem)] flex-col overflow-hidden p-0'
                : 'p-5',
            ),
          )}
        />
      </DialogShellContext.Provider>
    );
  },
);

DialogPopup.displayName = 'Dialog.Popup';

function useDialogSection(
  componentName: string,
  defaults: (state: DialogShellState) => string,
  props: DialogSectionProps,
  ref: React.ForwardedRef<HTMLDivElement>,
): React.ReactElement {
  const state = React.useContext(DialogShellContext);
  const { children, className, render, ...sectionProps } = props;

  return useRender<DialogShellState, HTMLDivElement>({
    defaultTagName: 'div',
    ref,
    render,
    state,
    props: {
      ...sectionProps,
      children,
      className: cn(defaults(state), resolveClassName(className, state)),
      [`data-city-dialog-${componentName}`]: '',
      'data-scroll': state.scroll,
    },
  });
}

export const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>((props, ref) =>
  useDialogSection(
    'header',
    (state) =>
      cn(
        'flex items-start justify-between gap-4',
        state.scroll === 'body' && 'border-city-border shrink-0 border-b px-5 py-4',
      ),
    props,
    ref,
  ),
);

DialogHeader.displayName = 'Dialog.Header';

export const DialogBody = React.forwardRef<HTMLDivElement, DialogBodyProps>((props, ref) =>
  useDialogSection(
    'body',
    (state) =>
      state.scroll === 'body'
        ? 'min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 [scrollbar-gutter:stable]'
        : 'mt-4',
    props,
    ref,
  ),
);

DialogBody.displayName = 'Dialog.Body';

export const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>((props, ref) =>
  useDialogSection(
    'footer',
    (state) =>
      cn(
        'flex justify-end gap-2',
        state.scroll === 'body'
          ? 'border-city-border bg-city-surface-raised shrink-0 border-t px-5 py-4'
          : 'mt-5',
      ),
    props,
    ref,
  ),
);

DialogFooter.displayName = 'Dialog.Footer';

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
  Header: DialogHeader,
  Body: DialogBody,
  Footer: DialogFooter,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
  createHandle: BaseDialog.createHandle,
};
