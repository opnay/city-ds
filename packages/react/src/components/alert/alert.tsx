'use client';

import * as React from 'react';
import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';
import { useRender } from '@base-ui/react/use-render';

import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';

export const ALERT_VARIANTS = ['info', 'success', 'warning', 'error'] as const;
export type AlertVariant = (typeof ALERT_VARIANTS)[number];

export interface AlertState extends Record<string, unknown> {
  variant: AlertVariant;
}

interface AlertContextValue {
  descriptionId: string;
  titleId: string;
  variant: AlertVariant;
}

const AlertContext = React.createContext<AlertContextValue | null>(null);

function useAlertContext(componentName: string): AlertContextValue {
  const context = React.useContext(AlertContext);

  if (context === null) {
    throw new Error(`${componentName} must be used within Alert.Root`);
  }

  return context;
}

const variantClasses: Record<AlertVariant, string> = {
  info: 'border-city-info/30 bg-city-info/10 text-city-foreground',
  success: 'border-city-success/30 bg-city-success/10 text-city-foreground',
  warning: 'border-city-warning/30 bg-city-warning/10 text-city-foreground',
  error: 'border-city-destructive/30 bg-city-destructive/10 text-city-foreground',
};

const iconClasses: Record<AlertVariant, string> = {
  info: 'text-city-info',
  success: 'text-city-success',
  warning: 'text-city-warning',
  error: 'text-city-destructive',
};

const defaultLiveByVariant: Record<AlertVariant, React.AriaAttributes['aria-live']> = {
  info: 'polite',
  success: 'polite',
  warning: 'polite',
  error: 'assertive',
};

const defaultRoleByVariant: Record<AlertVariant, React.AriaRole> = {
  info: 'status',
  success: 'status',
  warning: 'status',
  error: 'alert',
};

const defaultIcons: Record<AlertVariant, React.ComponentType<{ className?: string }>> = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  error: CircleAlert,
};

export interface AlertRootProps extends Omit<
  useRender.ComponentProps<'div', AlertState>,
  'className'
> {
  className?: StateClassName<AlertState>;
  icon?: React.ReactNode;
  showIcon?: boolean;
  variant?: AlertVariant;
}

export const AlertRoot = React.forwardRef<HTMLDivElement, AlertRootProps>(function AlertRoot(
  {
    'aria-describedby': ariaDescribedBy,
    'aria-labelledby': ariaLabelledBy,
    'aria-live': ariaLive,
    children,
    className,
    icon,
    render,
    role,
    showIcon = true,
    variant = 'info',
    ...props
  },
  ref,
) {
  const titleId = React.useId();
  const descriptionId = React.useId();
  const state: AlertState = { variant };
  const DefaultIcon = defaultIcons[variant];

  return (
    <AlertContext.Provider value={{ descriptionId, titleId, variant }}>
      {useRender({
        defaultTagName: 'div',
        ref,
        render,
        state,
        props: {
          ...props,
          'aria-describedby': ariaDescribedBy ?? descriptionId,
          'aria-labelledby': ariaLabelledBy ?? titleId,
          'aria-live': ariaLive ?? defaultLiveByVariant[variant],
          'data-variant': variant,
          role: role ?? defaultRoleByVariant[variant],
          className: cn(
            'grid w-full grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-city-md border p-4 text-sm',
            !showIcon && 'grid-cols-1',
            variantClasses[variant],
            resolveClassName(className, state),
          ),
          children: (
            <>
              {showIcon && (
                <span
                  className={cn('mt-0.5 inline-flex size-5 shrink-0', iconClasses[variant])}
                  aria-hidden
                >
                  {icon ?? <DefaultIcon className="size-5" />}
                </span>
              )}
              <div className="min-w-0 space-y-1">{children}</div>
            </>
          ),
        },
      })}
    </AlertContext.Provider>
  );
});

AlertRoot.displayName = 'Alert.Root';

export interface AlertTitleProps extends Omit<
  useRender.ComponentProps<'h2', AlertState>,
  'className'
> {
  className?: StateClassName<AlertState>;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTitleProps>(function AlertTitle(
  { className, id, level = 2, render, ...props },
  ref,
) {
  const context = useAlertContext('Alert.Title');
  const state: AlertState = { variant: context.variant };

  return useRender({
    defaultTagName: `h${level}` as 'h2',
    ref,
    render,
    state,
    props: {
      ...props,
      id: id ?? context.titleId,
      className: cn(
        'text-city-foreground font-medium leading-none',
        resolveClassName(className, state),
      ),
    },
  });
});

AlertTitle.displayName = 'Alert.Title';

export interface AlertDescriptionProps extends Omit<
  useRender.ComponentProps<'div', AlertState>,
  'className'
> {
  className?: StateClassName<AlertState>;
}

export const AlertDescription = React.forwardRef<HTMLDivElement, AlertDescriptionProps>(
  function AlertDescription({ className, id, render, ...props }, ref) {
    const context = useAlertContext('Alert.Description');
    const state: AlertState = { variant: context.variant };

    return useRender({
      defaultTagName: 'div',
      ref,
      render,
      state,
      props: {
        ...props,
        id: id ?? context.descriptionId,
        className: cn('text-city-foreground leading-6', resolveClassName(className, state)),
      },
    });
  },
);

AlertDescription.displayName = 'Alert.Description';

export interface AlertActionProps extends Omit<
  useRender.ComponentProps<'div', AlertState>,
  'className'
> {
  className?: StateClassName<AlertState>;
}

export const AlertAction = React.forwardRef<HTMLDivElement, AlertActionProps>(function AlertAction(
  { className, render, ...props },
  ref,
) {
  const context = useAlertContext('Alert.Action');
  const state: AlertState = { variant: context.variant };

  return useRender({
    defaultTagName: 'div',
    ref,
    render,
    state,
    props: {
      ...props,
      className: cn('pt-2', resolveClassName(className, state)),
    },
  });
});

AlertAction.displayName = 'Alert.Action';

export const Alert = {
  Root: AlertRoot,
  Title: AlertTitle,
  Description: AlertDescription,
  Action: AlertAction,
};

export const Callout = Alert;
