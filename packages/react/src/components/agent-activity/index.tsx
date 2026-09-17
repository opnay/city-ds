'use client';

import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';
import { LoaderCircle } from 'lucide-react';
import { cn } from '../../lib/cn';
import type { Density } from '../../types';
import { useDensity } from '../density-provider';

const PendingContext = React.createContext(false);

export interface AgentActivityRootProps extends Omit<useRender.ComponentProps<'div'>, 'className'> {
  className?: string;
  pending?: boolean;
  density?: Density;
}

export const AgentActivityRoot = React.forwardRef<HTMLDivElement, AgentActivityRootProps>(
  function AgentActivityRoot(
    { pending = false, density: densityProp, className, render, ...props },
    ref,
  ) {
    const density = useDensity(densityProp);
    const element = useRender({
      defaultTagName: 'div',
      ref,
      render,
      props: {
        ...props,
        'data-city-agent-activity': '',
        'data-city-pending': pending ? '' : undefined,
        'data-city-density': density,
        className: cn(
          'flex min-w-0 flex-wrap items-start gap-x-2 gap-y-1 text-sm leading-6 text-city-muted-foreground',
          density === 'compact' ? 'py-1' : 'py-2',
          className,
        ),
      },
    });
    return <PendingContext.Provider value={pending}>{element}</PendingContext.Provider>;
  },
);

export interface AgentActivityIndicatorProps extends Omit<
  useRender.ComponentProps<'span'>,
  'className'
> {
  className?: string;
}
export const AgentActivityIndicator = React.forwardRef<
  HTMLSpanElement,
  AgentActivityIndicatorProps
>(function AgentActivityIndicator({ children, className, render, ...props }, ref) {
  const pending = React.useContext(PendingContext);
  return useRender({
    defaultTagName: 'span',
    ref,
    render,
    props: {
      'aria-hidden': true,
      ...props,
      'data-city-agent-activity-indicator': '',
      className: cn(
        'inline-flex size-6 shrink-0 items-center justify-center [&_svg]:size-4',
        className,
      ),
      children:
        children === undefined ? (
          pending ? (
            <LoaderCircle className="motion-safe:animate-spin" />
          ) : (
            <span className="size-1.5 rounded-full bg-current" />
          )
        ) : (
          children
        ),
    },
  });
});

export interface AgentActivityContentProps extends Omit<
  useRender.ComponentProps<'div'>,
  'className'
> {
  className?: string;
}
export const AgentActivityContent = React.forwardRef<HTMLDivElement, AgentActivityContentProps>(
  function AgentActivityContent({ className, render, ...props }, ref) {
    return useRender({
      defaultTagName: 'div',
      ref,
      render,
      props: {
        ...props,
        'data-city-agent-activity-content': '',
        className: cn('min-w-0 flex-1 [overflow-wrap:anywhere]', className),
      },
    });
  },
);

export interface AgentActivityMetaProps extends Omit<
  useRender.ComponentProps<'span'>,
  'className'
> {
  className?: string;
}
export const AgentActivityMeta = React.forwardRef<HTMLSpanElement, AgentActivityMetaProps>(
  function AgentActivityMeta({ className, render, ...props }, ref) {
    return useRender({
      defaultTagName: 'span',
      ref,
      render,
      props: {
        ...props,
        'data-city-agent-activity-meta': '',
        className: cn('min-w-0 max-w-full text-xs leading-6 [overflow-wrap:anywhere]', className),
      },
    });
  },
);

export const AgentActivity = {
  Root: AgentActivityRoot,
  Indicator: AgentActivityIndicator,
  Content: AgentActivityContent,
  Meta: AgentActivityMeta,
};
