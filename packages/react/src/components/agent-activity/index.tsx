'use client';

import * as React from 'react';
import { Collapsible } from '@base-ui/react/collapsible';
import { useRender } from '@base-ui/react/use-render';
import { ChevronDown, LoaderCircle } from 'lucide-react';
import { cn } from '../../lib/cn';
import { resolveClassName } from '../../lib/resolve-class-name';
import type { Density } from '../../types';
import { useDensity } from '../density-provider';

const ActivityContext = React.createContext<{ density: Density; pending: boolean }>({
  density: 'comfortable',
  pending: false,
});

export interface AgentActivityRootProps extends Collapsible.Root.Props {
  pending?: boolean;
  density?: Density;
}

export const AgentActivityRoot = React.forwardRef<HTMLDivElement, AgentActivityRootProps>(
  function AgentActivityRoot({ pending = false, density: densityProp, className, ...props }, ref) {
    const density = useDensity(densityProp);
    const context = React.useMemo(() => ({ density, pending }), [density, pending]);
    return (
      <ActivityContext.Provider value={context}>
        <Collapsible.Root
          {...props}
          ref={ref}
          data-city-agent-activity=""
          data-city-pending={pending ? '' : undefined}
          data-city-density={density}
          className={(state) =>
            cn(
              'grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-2 gap-y-1 text-sm leading-6 text-city-muted-foreground',
              density === 'compact' ? 'py-1' : 'py-2',
              resolveClassName(className, state),
            )
          }
        />
      </ActivityContext.Provider>
    );
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
  const { pending } = React.useContext(ActivityContext);
  return useRender({
    defaultTagName: 'span',
    ref,
    render,
    props: {
      'aria-hidden': true,
      ...props,
      'data-city-agent-activity-indicator': '',
      className: cn(
        'inline-flex size-6 shrink-0 items-center justify-center self-start [&_svg]:size-4',
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
  useRender.ComponentProps<'span'>,
  'className'
> {
  className?: string;
}
export const AgentActivityContent = React.forwardRef<HTMLSpanElement, AgentActivityContentProps>(
  function AgentActivityContent({ className, render, ...props }, ref) {
    return useRender({
      defaultTagName: 'span',
      ref,
      render,
      props: {
        ...props,
        'data-city-agent-activity-content': '',
        className: cn('min-w-0 [overflow-wrap:anywhere]', className),
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
        className: cn(
          'min-w-0 max-w-full self-start text-xs leading-6 [overflow-wrap:anywhere]',
          className,
        ),
      },
    });
  },
);

export type AgentActivityTriggerProps = Collapsible.Trigger.Props;
export const AgentActivityTrigger = React.forwardRef<HTMLButtonElement, AgentActivityTriggerProps>(
  function AgentActivityTrigger({ children, className, ...props }, ref) {
    return (
      <Collapsible.Trigger
        {...props}
        ref={ref}
        data-city-agent-activity-trigger=""
        className={(state) =>
          cn(
            'group/city-agent-activity-trigger col-span-3 grid min-h-(--city-hit-target-min) min-w-0 grid-cols-[auto_minmax(0,1fr)_auto_auto] items-start gap-x-2 gap-y-1 rounded-city-sm px-2 text-start text-sm leading-6 text-city-muted-foreground outline-none hover:text-city-foreground focus-visible:ring-2 focus-visible:ring-city-ring data-[disabled]:pointer-events-none data-[disabled]:opacity-45',
            resolveClassName(className, state),
          )
        }
      >
        {children}
        <ChevronDown
          aria-hidden="true"
          data-city-agent-activity-trigger-icon=""
          className="mt-1 size-4 shrink-0 text-city-muted-foreground transition-transform duration-(--city-duration-normal) group-data-[panel-open]/city-agent-activity-trigger:rotate-180 motion-reduce:transition-none"
        />
      </Collapsible.Trigger>
    );
  },
);

export type AgentActivityDetailsProps = Collapsible.Panel.Props;
export const AgentActivityDetails = React.forwardRef<HTMLDivElement, AgentActivityDetailsProps>(
  function AgentActivityDetails({ className, ...props }, ref) {
    const { density } = React.useContext(ActivityContext);
    return (
      <Collapsible.Panel
        {...props}
        ref={ref}
        data-city-agent-activity-details=""
        className={(state) =>
          cn(
            'col-span-2 col-start-2 min-w-0 text-sm leading-6 text-city-muted-foreground [&_pre]:max-w-full [&_pre]:overflow-x-auto',
            density === 'compact' ? 'pb-1' : 'pb-2',
            resolveClassName(className, state),
          )
        }
      />
    );
  },
);

export const AgentActivity = {
  Root: AgentActivityRoot,
  Indicator: AgentActivityIndicator,
  Content: AgentActivityContent,
  Meta: AgentActivityMeta,
  Trigger: AgentActivityTrigger,
  Details: AgentActivityDetails,
};
