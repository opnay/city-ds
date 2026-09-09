'use client';

import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';
import { Button as BaseButton, type ButtonProps as BaseButtonProps } from '@base-ui/react/button';
import { Check, X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { resolveClassName } from '../../lib/resolve-class-name';

export type StepperStatus = 'pending' | 'completed' | 'error';
type Orientation = 'horizontal' | 'vertical';
const OrientationContext = React.createContext<Orientation>('horizontal');
const ItemContext = React.createContext<{ status: StepperStatus; current: boolean }>({
  status: 'pending',
  current: false,
});

export interface StepperRootProps extends Omit<useRender.ComponentProps<'ol'>, 'className'> {
  className?: string;
  orientation?: Orientation;
}

export const StepperRoot = React.forwardRef<HTMLOListElement, StepperRootProps>(
  function StepperRoot({ orientation = 'horizontal', className, render, ...props }, ref) {
    const element = useRender({
      defaultTagName: 'ol',
      ref,
      render,
      props: {
        ...props,
        // Preserve list semantics when the browser suppresses unstyled list markers.
        role: 'list',
        'data-city-stepper': '',
        'data-orientation': orientation,
        className: cn(
          'm-0 flex min-w-0 list-none p-0 text-sm text-city-foreground',
          orientation === 'vertical' ? 'flex-col' : 'flex-row',
          className,
        ),
      },
    });
    return <OrientationContext.Provider value={orientation}>{element}</OrientationContext.Provider>;
  },
);

export interface StepperItemProps extends Omit<useRender.ComponentProps<'li'>, 'className'> {
  className?: string;
  status?: StepperStatus;
  current?: boolean;
  statusLabel?: string;
}

export const StepperItem = React.forwardRef<HTMLLIElement, StepperItemProps>(function StepperItem(
  {
    status = 'pending',
    current = false,
    statusLabel = status === 'completed' ? 'Completed' : status === 'error' ? 'Error' : undefined,
    children,
    className,
    render,
    ...props
  },
  ref,
) {
  const orientation = React.useContext(OrientationContext);
  const context = React.useMemo(() => ({ status, current }), [status, current]);
  const element = useRender({
    defaultTagName: 'li',
    ref,
    render,
    props: {
      ...props,
      'aria-current': current ? 'step' : undefined,
      'data-city-stepper-item': '',
      children: (
        <>
          {children}
          {statusLabel && <span className="sr-only">{statusLabel}</span>}
        </>
      ),
      'data-status': status,
      'data-current': current ? '' : undefined,
      className: cn(
        'relative min-w-0',
        orientation === 'vertical'
          ? 'grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-3 pb-6 last:pb-0 after:absolute after:inset-s-3 after:top-8 after:bottom-1 after:w-px after:bg-city-border last:after:hidden'
          : 'flex flex-1 flex-col items-center gap-2 px-1 text-center after:absolute after:start-[calc(50%+1rem)] after:w-[calc(100%-2rem)] after:top-3 after:h-px after:bg-city-border last:after:hidden',
        className,
      ),
    },
  });
  return <ItemContext.Provider value={context}>{element}</ItemContext.Provider>;
});

export interface StepperIndicatorProps extends Omit<useRender.ComponentProps<'span'>, 'className'> {
  className?: string;
}
export const StepperIndicator = React.forwardRef<HTMLSpanElement, StepperIndicatorProps>(
  function StepperIndicator({ className, render, children, ...props }, ref) {
    const { status, current } = React.useContext(ItemContext);
    const orientation = React.useContext(OrientationContext);
    return useRender({
      defaultTagName: 'span',
      ref,
      render,
      props: {
        ...props,
        'aria-hidden': true,
        className: cn(
          'relative z-1 inline-flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium',
          orientation === 'vertical' && 'mt-1',
          status === 'error'
            ? 'border-city-destructive text-city-destructive bg-city-background'
            : current || status === 'completed'
              ? 'border-city-primary bg-city-primary text-city-primary-foreground'
              : 'border-city-border bg-city-background text-city-muted-foreground',
          className,
        ),
        children:
          status === 'completed' ? (
            <Check className="size-3" />
          ) : status === 'error' ? (
            <X className="size-3" />
          ) : (
            children
          ),
      },
    });
  },
);

export interface StepperContentProps extends Omit<useRender.ComponentProps<'div'>, 'className'> {
  className?: string;
}
export const StepperContent = React.forwardRef<HTMLDivElement, StepperContentProps>(
  function StepperContent({ className, render, ...props }, ref) {
    const orientation = React.useContext(OrientationContext);
    return useRender({
      defaultTagName: 'div',
      ref,
      render,
      props: {
        ...props,
        className: cn(
          'flex min-w-0 flex-col gap-0.5 [overflow-wrap:anywhere]',
          orientation === 'horizontal' && 'items-center text-center',
          className,
        ),
      },
    });
  },
);

export interface StepperTitleProps extends Omit<useRender.ComponentProps<'span'>, 'className'> {
  className?: string;
}
export const StepperTitle = React.forwardRef<HTMLSpanElement, StepperTitleProps>(
  function StepperTitle({ className, render, ...props }, ref) {
    const { current } = React.useContext(ItemContext);
    return useRender({
      defaultTagName: 'span',
      ref,
      render,
      props: {
        ...props,
        className: cn(
          'flex min-h-8 items-center font-medium',
          current ? 'text-city-foreground' : 'text-city-foreground/60',
          className,
        ),
      },
    });
  },
);

export interface StepperDescriptionProps extends Omit<useRender.ComponentProps<'p'>, 'className'> {
  className?: string;
}
export const StepperDescription = React.forwardRef<HTMLParagraphElement, StepperDescriptionProps>(
  function StepperDescription({ className, render, ...props }, ref) {
    const { status, current } = React.useContext(ItemContext);
    const orientation = React.useContext(OrientationContext);
    const element = useRender({
      defaultTagName: 'p',
      ref,
      render,
      props: { ...props, className: cn('m-0 text-city-foreground/60', className) },
    });
    return orientation === 'vertical' && status === 'completed' && !current ? element : null;
  },
);

export type StepperTriggerProps = BaseButtonProps;
export const StepperTrigger = React.forwardRef<HTMLElement, StepperTriggerProps>(
  function StepperTrigger({ className, ...props }, ref) {
    const { current } = React.useContext(ItemContext);
    const orientation = React.useContext(OrientationContext);
    return (
      <BaseButton
        ref={ref}
        {...props}
        className={(state) =>
          cn(
            'inline-flex min-h-8 max-w-full items-center rounded-sm text-start font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-city-ring disabled:cursor-not-allowed disabled:text-city-muted-foreground disabled:no-underline',
            orientation === 'horizontal' && 'justify-center text-center',
            current ? 'text-city-foreground' : 'text-city-foreground/60',
            resolveClassName(className, state),
          )
        }
      />
    );
  },
);

export const Stepper = {
  Root: StepperRoot,
  Item: StepperItem,
  Indicator: StepperIndicator,
  Content: StepperContent,
  Title: StepperTitle,
  Description: StepperDescription,
  Trigger: StepperTrigger,
};
