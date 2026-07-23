'use client';

import * as React from 'react';
import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import type {
  CollapsiblePanelProps as BaseCollapsiblePanelProps,
  CollapsibleRootProps as BaseCollapsibleRootProps,
  CollapsibleTriggerProps as BaseCollapsibleTriggerProps,
} from '@base-ui/react/collapsible';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';

function classes<State>(className: StateClassName<State> | undefined, defaults: string) {
  return (state: State) => cn(defaults, resolveClassName(className, state));
}

const CollapsiblePanelIdContext = React.createContext<string | undefined>(undefined);

export type CollapsibleRootProps = BaseCollapsibleRootProps;
export type CollapsibleTriggerProps = BaseCollapsibleTriggerProps;
export type CollapsiblePanelProps = BaseCollapsiblePanelProps;

export const CollapsibleRoot = React.forwardRef<HTMLDivElement, CollapsibleRootProps>(
  ({ className, ...props }, ref) => {
    const panelId = React.useId();

    return (
      <CollapsiblePanelIdContext.Provider value={panelId}>
        <BaseCollapsible.Root
          {...props}
          ref={ref}
          className={classes(
            className,
            'rounded-city-md border-city-border bg-city-surface text-city-foreground w-full border',
          )}
        />
      </CollapsiblePanelIdContext.Provider>
    );
  },
);

export const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const panelId = React.useContext(CollapsiblePanelIdContext);

    return (
      <BaseCollapsible.Trigger
        aria-controls={panelId}
        {...props}
        ref={ref}
        className={classes(
          className,
          'focus-visible:ring-city-ring hover:bg-city-muted flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium transition-colors outline-none focus-visible:ring-2 data-[disabled]:pointer-events-none data-[disabled]:opacity-45',
        )}
      >
        <span className="min-w-0 flex-1">{children}</span>
        <ChevronDown
          aria-hidden="true"
          className="text-city-muted-foreground shrink-0 transition-transform [[data-open]_&]:rotate-180"
          size={16}
          strokeWidth={1.8}
        />
      </BaseCollapsible.Trigger>
    );
  },
);

export const CollapsiblePanel = React.forwardRef<HTMLDivElement, CollapsiblePanelProps>(
  ({ className, id, ...props }, ref) => {
    const panelId = React.useContext(CollapsiblePanelIdContext);

    return (
      <BaseCollapsible.Panel
        id={id ?? panelId}
        {...props}
        ref={ref}
        className={classes(
          className,
          'border-city-border text-city-muted-foreground border-t px-4 py-3 text-sm leading-6',
        )}
      />
    );
  },
);

export const Collapsible = {
  Root: CollapsibleRoot,
  Trigger: CollapsibleTrigger,
  Panel: CollapsiblePanel,
};
