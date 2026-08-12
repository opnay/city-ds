'use client';

import * as React from 'react';
import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';
import { useRender } from '@base-ui/react/use-render';

import { cn } from '../../lib/cn';
import { feedbackToneStyles } from '../../lib/feedback-tone-styles';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { FeedbackTone } from '../../types';

export const ALERT_VARIANTS = ['info', 'success', 'warning', 'error'] as const;
export type AlertVariant = (typeof ALERT_VARIANTS)[number];
export const ALERT_APPEARANCES = ['subtle', 'outline'] as const;
export type AlertAppearance = (typeof ALERT_APPEARANCES)[number];

export interface AlertState extends Record<string, unknown> {
  appearance: AlertAppearance;
  tone: FeedbackTone;
  variant: AlertVariant;
}

interface AlertContextValue {
  appearance: AlertAppearance;
  descriptionId: string;
  titleId: string;
  tone: FeedbackTone;
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

const defaultLiveByTone: Record<FeedbackTone, React.AriaAttributes['aria-live']> = {
  neutral: 'polite',
  info: 'polite',
  success: 'polite',
  warning: 'polite',
  destructive: 'assertive',
};

const defaultRoleByTone: Record<FeedbackTone, React.AriaRole> = {
  neutral: 'status',
  info: 'status',
  success: 'status',
  warning: 'status',
  destructive: 'alert',
};

const defaultIcons: Record<FeedbackTone, React.ComponentType<{ className?: string }>> = {
  neutral: Info,
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  destructive: CircleAlert,
};

const variantTones: Record<AlertVariant, FeedbackTone> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'destructive',
};

const toneVariants: Record<FeedbackTone, AlertVariant> = {
  neutral: 'info',
  info: 'info',
  success: 'success',
  warning: 'warning',
  destructive: 'error',
};

export interface AlertRootProps extends Omit<
  useRender.ComponentProps<'div', AlertState>,
  'className'
> {
  appearance?: AlertAppearance;
  className?: StateClassName<AlertState>;
  icon?: React.ReactNode;
  showIcon?: boolean;
  tone?: FeedbackTone;
  variant?: AlertVariant;
}

export const AlertRoot = React.forwardRef<HTMLDivElement, AlertRootProps>(function AlertRoot(
  {
    'aria-describedby': ariaDescribedBy,
    'aria-labelledby': ariaLabelledBy,
    'aria-live': ariaLive,
    appearance = 'subtle',
    children,
    className,
    icon,
    render,
    role,
    showIcon = true,
    tone: toneProp,
    variant: variantProp,
    ...props
  },
  ref,
) {
  const titleId = React.useId();
  const descriptionId = React.useId();
  const tone = toneProp ?? variantTones[variantProp ?? 'info'];
  const variant = variantProp ?? toneVariants[tone];
  const state: AlertState = { appearance, tone, variant };
  const toneStyles = feedbackToneStyles[tone];
  const DefaultIcon = defaultIcons[tone];

  return (
    <AlertContext.Provider value={{ appearance, descriptionId, titleId, tone, variant }}>
      {useRender({
        defaultTagName: 'div',
        ref,
        render,
        state,
        props: {
          ...props,
          'aria-describedby': ariaDescribedBy ?? descriptionId,
          'aria-labelledby': ariaLabelledBy ?? titleId,
          'aria-live': ariaLive ?? defaultLiveByTone[tone],
          'data-appearance': appearance,
          'data-city-alert-root': '',
          'data-tone': tone,
          'data-variant': variant,
          role: role ?? defaultRoleByTone[tone],
          className: cn(
            'text-city-foreground grid w-full grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-city-md border p-4 text-sm',
            !showIcon && 'grid-cols-1',
            toneStyles.border,
            appearance === 'subtle' ? toneStyles.surface : 'bg-city-surface-raised',
            resolveClassName(className, state),
          ),
          children: (
            <>
              {showIcon && (
                <span
                  className={cn('mt-0.5 inline-flex size-5 shrink-0', toneStyles.indicator)}
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
  const state: AlertState = {
    appearance: context.appearance,
    tone: context.tone,
    variant: context.variant,
  };

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
    const state: AlertState = {
      appearance: context.appearance,
      tone: context.tone,
      variant: context.variant,
    };

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
  const state: AlertState = {
    appearance: context.appearance,
    tone: context.tone,
    variant: context.variant,
  };

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
