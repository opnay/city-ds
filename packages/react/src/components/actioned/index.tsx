'use client';

import * as React from 'react';
import { Collapsible } from '@base-ui/react/collapsible';
import { useRender } from '@base-ui/react/use-render';
import {
  Ban,
  Check,
  ChevronDown,
  CircleAlert,
  Clock,
  LoaderCircle,
  ShieldQuestion,
  X,
} from 'lucide-react';
import { cn } from '../../lib/cn';
import { resolveClassName } from '../../lib/resolve-class-name';
import type { Density } from '../../types';
import { useDensity } from '../density-provider';

export const ACTIONED_STATUSES = [
  'queued',
  'approval-required',
  'running',
  'completed',
  'failed',
  'cancelled',
  'rejected',
] as const;
export type ActionedStatus = (typeof ACTIONED_STATUSES)[number];

const STATUS_CONTENT = {
  queued: { Icon: Clock, label: 'Queued' },
  'approval-required': { Icon: ShieldQuestion, label: 'Approval required' },
  running: { Icon: LoaderCircle, label: 'Running' },
  completed: { Icon: Check, label: 'Completed' },
  failed: { Icon: CircleAlert, label: 'Failed' },
  cancelled: { Icon: Ban, label: 'Cancelled' },
  rejected: { Icon: X, label: 'Rejected' },
} satisfies Record<ActionedStatus, { Icon: typeof Clock; label: string }>;

const ActionedContext = React.createContext<{ status: ActionedStatus; density: Density }>({
  status: 'queued',
  density: 'comfortable',
});

export interface ActionedRootProps extends Collapsible.Root.Props {
  status: ActionedStatus;
  density?: Density;
}

export const ActionedRoot = React.forwardRef<HTMLDivElement, ActionedRootProps>(
  function ActionedRoot({ status, density: densityProp, className, ...props }, ref) {
    const density = useDensity(densityProp);
    const context = React.useMemo(() => ({ status, density }), [status, density]);
    return (
      <ActionedContext.Provider value={context}>
        <Collapsible.Root
          {...props}
          ref={ref}
          data-city-actioned=""
          data-city-status={status}
          data-city-density={density}
          className={(state) =>
            cn(
              'min-w-0 rounded-city-md border border-city-border bg-city-surface text-sm text-city-foreground [overflow-wrap:anywhere]',
              resolveClassName(className, state),
            )
          }
        />
      </ActionedContext.Provider>
    );
  },
);

export interface ActionedHeaderProps extends Omit<useRender.ComponentProps<'div'>, 'className'> {
  className?: string;
}
export const ActionedHeader = React.forwardRef<HTMLDivElement, ActionedHeaderProps>(
  function ActionedHeader({ className, render, ...props }, ref) {
    const { density } = React.useContext(ActionedContext);
    return useRender({
      defaultTagName: 'div',
      ref,
      render,
      props: {
        ...props,
        'data-city-actioned-header': '',
        className: cn(
          'flex min-w-0 flex-wrap items-center gap-2',
          density === 'compact' ? 'p-2' : 'p-3',
          className,
        ),
      },
    });
  },
);

export type ActionedTriggerProps = Collapsible.Trigger.Props;
export const ActionedTrigger = React.forwardRef<HTMLButtonElement, ActionedTriggerProps>(
  function ActionedTrigger({ children, className, ...props }, ref) {
    return (
      <Collapsible.Trigger
        {...props}
        ref={ref}
        data-city-actioned-trigger=""
        className={(state) =>
          cn(
            'group/city-actioned-trigger flex min-h-8 min-w-0 flex-[1_1_12rem] items-center gap-2 rounded-city-sm text-start font-medium outline-none hover:underline focus-visible:ring-2 focus-visible:ring-city-ring data-[disabled]:pointer-events-none data-[disabled]:opacity-45',
            resolveClassName(className, state),
          )
        }
      >
        <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">{children}</span>
        <ChevronDown
          aria-hidden="true"
          className="size-4 shrink-0 text-city-muted-foreground transition-transform duration-(--city-duration-normal) group-data-[panel-open]/city-actioned-trigger:rotate-180 motion-reduce:transition-none"
        />
      </Collapsible.Trigger>
    );
  },
);

export interface ActionedStatusProps extends Omit<useRender.ComponentProps<'span'>, 'className'> {
  className?: string;
}
export const ActionedStatus = React.forwardRef<HTMLSpanElement, ActionedStatusProps>(
  function ActionedStatus({ children, className, render, ...props }, ref) {
    const { status } = React.useContext(ActionedContext);
    const { Icon, label } = STATUS_CONTENT[status];
    return useRender({
      defaultTagName: 'span',
      ref,
      render,
      props: {
        ...props,
        'data-city-actioned-status': '',
        className: cn(
          'inline-flex min-w-0 max-w-full items-center gap-1.5 text-xs text-city-muted-foreground [overflow-wrap:anywhere]',
          className,
        ),
        children: (
          <>
            <Icon
              aria-hidden="true"
              className={cn(
                'size-3.5 shrink-0',
                status === 'running' && 'motion-safe:animate-spin',
              )}
            />
            <span className="min-w-0">{children === undefined ? label : children}</span>
          </>
        ),
      },
    });
  },
);

export type ActionedContentProps = Collapsible.Panel.Props;
export const ActionedContent = React.forwardRef<HTMLDivElement, ActionedContentProps>(
  function ActionedContent({ className, ...props }, ref) {
    const { density } = React.useContext(ActionedContext);
    return (
      <Collapsible.Panel
        {...props}
        ref={ref}
        data-city-actioned-content=""
        className={(state) =>
          cn(
            'min-w-0 border-t border-city-border leading-6 [&_pre]:max-w-full [&_pre]:overflow-x-auto',
            density === 'compact' ? 'p-2' : 'p-3',
            resolveClassName(className, state),
          )
        }
      />
    );
  },
);

export interface ActionedApprovalProps extends Omit<useRender.ComponentProps<'div'>, 'className'> {
  className?: string;
}
export const ActionedApproval = React.forwardRef<HTMLDivElement, ActionedApprovalProps>(
  function ActionedApproval({ className, render, ...props }, ref) {
    const { density } = React.useContext(ActionedContext);
    return useRender({
      defaultTagName: 'div',
      ref,
      render,
      props: {
        ...props,
        'data-city-actioned-approval': '',
        className: cn(
          'grid min-w-0 gap-3 border-t border-city-border leading-6',
          density === 'compact' ? 'p-2' : 'p-3',
          className,
        ),
      },
    });
  },
);

export interface ActionedActionsProps extends Omit<useRender.ComponentProps<'div'>, 'className'> {
  className?: string;
}
export const ActionedActions = React.forwardRef<HTMLDivElement, ActionedActionsProps>(
  function ActionedActions({ className, render, ...props }, ref) {
    return useRender({
      defaultTagName: 'div',
      ref,
      render,
      props: {
        ...props,
        'data-city-actioned-actions': '',
        className: cn('flex min-w-0 flex-wrap items-center gap-2', className),
      },
    });
  },
);

export const Actioned = {
  Root: ActionedRoot,
  Header: ActionedHeader,
  Trigger: ActionedTrigger,
  Status: ActionedStatus,
  Content: ActionedContent,
  Approval: ActionedApproval,
  Actions: ActionedActions,
};
