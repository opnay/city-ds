'use client';

import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';

import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';

export const EMPTY_STATE_DENSITIES = ['default', 'compact'] as const;
export type EmptyStateDensity = (typeof EMPTY_STATE_DENSITIES)[number];

export interface EmptyStateState extends Record<string, unknown> {
  density: EmptyStateDensity;
}

interface EmptyStateContextValue {
  density: EmptyStateDensity;
  descriptionId: string;
  titleId: string;
}

const EmptyStateContext = React.createContext<EmptyStateContextValue | null>(null);

function useEmptyStateContext(componentName: string): EmptyStateContextValue {
  const context = React.useContext(EmptyStateContext);

  if (context === null) {
    throw new Error(`${componentName} must be used within EmptyState.Root`);
  }

  return context;
}

const rootDensityClasses: Record<EmptyStateDensity, string> = {
  default: 'gap-4 p-8',
  compact: 'gap-3 p-4',
};

const iconDensityClasses: Record<EmptyStateDensity, string> = {
  default: 'size-12 [&>svg]:size-6',
  compact: 'size-9 [&>svg]:size-5',
};

export interface EmptyStateRootProps extends Omit<
  useRender.ComponentProps<'section', EmptyStateState>,
  'className'
> {
  className?: StateClassName<EmptyStateState>;
  density?: EmptyStateDensity;
}

export const EmptyStateRoot = React.forwardRef<HTMLElement, EmptyStateRootProps>(
  function EmptyStateRoot(
    {
      'aria-describedby': ariaDescribedBy,
      'aria-labelledby': ariaLabelledBy,
      className,
      density = 'default',
      render,
      ...props
    },
    ref,
  ) {
    const titleId = React.useId();
    const descriptionId = React.useId();
    const state: EmptyStateState = { density };

    return (
      <EmptyStateContext.Provider value={{ density, descriptionId, titleId }}>
        {useRender({
          defaultTagName: 'section',
          ref,
          render,
          state,
          props: {
            ...props,
            'aria-describedby': ariaDescribedBy ?? descriptionId,
            'aria-labelledby': ariaLabelledBy ?? titleId,
            'data-density': density,
            className: cn(
              'border-city-border bg-city-background text-city-foreground flex flex-col items-center justify-center rounded-city-lg border border-dashed text-center',
              rootDensityClasses[density],
              resolveClassName(className, state),
            ),
          },
        })}
      </EmptyStateContext.Provider>
    );
  },
);

EmptyStateRoot.displayName = 'EmptyState.Root';

export interface EmptyStateIconProps extends Omit<
  useRender.ComponentProps<'div', EmptyStateState>,
  'className'
> {
  className?: StateClassName<EmptyStateState>;
}

export const EmptyStateIcon = React.forwardRef<HTMLDivElement, EmptyStateIconProps>(
  function EmptyStateIcon({ className, render, ...props }, ref) {
    const context = useEmptyStateContext('EmptyState.Icon');
    const state: EmptyStateState = { density: context.density };

    return useRender({
      defaultTagName: 'div',
      ref,
      render,
      state,
      props: {
        ...props,
        'aria-hidden': props['aria-hidden'] ?? true,
        className: cn(
          'bg-city-muted text-city-muted-foreground inline-flex shrink-0 items-center justify-center rounded-full',
          iconDensityClasses[context.density],
          resolveClassName(className, state),
        ),
      },
    });
  },
);

EmptyStateIcon.displayName = 'EmptyState.Icon';

export interface EmptyStateTitleProps extends Omit<
  useRender.ComponentProps<'h2', EmptyStateState>,
  'className'
> {
  className?: StateClassName<EmptyStateState>;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const EmptyStateTitle = React.forwardRef<HTMLHeadingElement, EmptyStateTitleProps>(
  function EmptyStateTitle({ className, id, level = 2, render, ...props }, ref) {
    const context = useEmptyStateContext('EmptyState.Title');
    const state: EmptyStateState = { density: context.density };

    return useRender({
      defaultTagName: `h${level}` as 'h2',
      ref,
      render,
      state,
      props: {
        ...props,
        id: id ?? context.titleId,
        className: cn(
          'text-city-foreground max-w-prose text-base font-semibold tracking-tight',
          context.density === 'compact' && 'text-sm',
          resolveClassName(className, state),
        ),
      },
    });
  },
);

EmptyStateTitle.displayName = 'EmptyState.Title';

export interface EmptyStateDescriptionProps extends Omit<
  useRender.ComponentProps<'p', EmptyStateState>,
  'className'
> {
  className?: StateClassName<EmptyStateState>;
}

export const EmptyStateDescription = React.forwardRef<
  HTMLParagraphElement,
  EmptyStateDescriptionProps
>(function EmptyStateDescription({ className, id, render, ...props }, ref) {
  const context = useEmptyStateContext('EmptyState.Description');
  const state: EmptyStateState = { density: context.density };

  return useRender({
    defaultTagName: 'p',
    ref,
    render,
    state,
    props: {
      ...props,
      id: id ?? context.descriptionId,
      className: cn(
        'text-city-muted-foreground max-w-prose text-sm',
        context.density === 'compact' && 'text-xs',
        resolveClassName(className, state),
      ),
    },
  });
});

EmptyStateDescription.displayName = 'EmptyState.Description';

export interface EmptyStateActionsProps extends Omit<
  useRender.ComponentProps<'div', EmptyStateState>,
  'className'
> {
  className?: StateClassName<EmptyStateState>;
}

export const EmptyStateActions = React.forwardRef<HTMLDivElement, EmptyStateActionsProps>(
  function EmptyStateActions({ className, render, ...props }, ref) {
    const context = useEmptyStateContext('EmptyState.Actions');
    const state: EmptyStateState = { density: context.density };

    return useRender({
      defaultTagName: 'div',
      ref,
      render,
      state,
      props: {
        ...props,
        className: cn(
          'flex flex-wrap items-center justify-center gap-2',
          context.density === 'default' && 'pt-1',
          resolveClassName(className, state),
        ),
      },
    });
  },
);

EmptyStateActions.displayName = 'EmptyState.Actions';

export const EmptyState = {
  Root: EmptyStateRoot,
  Icon: EmptyStateIcon,
  Title: EmptyStateTitle,
  Description: EmptyStateDescription,
  Actions: EmptyStateActions,
};
