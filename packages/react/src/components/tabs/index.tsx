'use client';

import * as React from 'react';
import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import type {
  TabsIndicatorProps as BaseTabsIndicatorProps,
  TabsListProps as BaseTabsListProps,
  TabsPanelProps as BaseTabsPanelProps,
  TabsRootProps as BaseTabsRootProps,
  TabsTabProps as BaseTabsTabProps,
} from '@base-ui/react/tabs';
import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';

function classes<State>(className: StateClassName<State> | undefined, defaults: string) {
  return (state: State) => cn(defaults, resolveClassName(className, state));
}

export type TabsRootProps = BaseTabsRootProps;
export type TabsListProps = BaseTabsListProps;
export type TabsTabProps = BaseTabsTabProps;
export type TabsPanelProps = BaseTabsPanelProps;
export type TabsIndicatorProps = BaseTabsIndicatorProps;

export const TabsRoot = React.forwardRef<HTMLDivElement, TabsRootProps>(
  ({ className, ...props }, ref) => (
    <BaseTabs.Root {...props} ref={ref} className={classes(className, 'w-full')} />
  ),
);

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, ...props }, ref) => (
    <BaseTabs.List
      {...props}
      ref={ref}
      className={classes(
        className,
        'rounded-city-sm border-city-border bg-city-muted text-city-muted-foreground inline-flex h-(--city-control-md) items-center gap-1 border p-1',
      )}
    />
  ),
);

export const TabsTab = React.forwardRef<HTMLElement, TabsTabProps>(
  ({ className, ...props }, ref) => (
    <BaseTabs.Tab
      {...props}
      ref={ref}
      className={classes(
        className,
        'rounded-city-xs data-[active]:bg-city-surface-raised data-[active]:text-city-foreground hover:text-city-foreground focus-visible:ring-city-ring inline-flex h-7 items-center justify-center px-2.5 text-sm font-medium transition-colors outline-none focus-visible:ring-2 data-[active]:shadow-sm data-[disabled]:pointer-events-none data-[disabled]:opacity-45',
      )}
    />
  ),
);

export const TabsPanel = React.forwardRef<HTMLDivElement, TabsPanelProps>(
  ({ className, ...props }, ref) => (
    <BaseTabs.Panel
      {...props}
      ref={ref}
      className={classes(className, 'text-city-foreground mt-3 text-sm outline-none')}
    />
  ),
);

export const TabsIndicator = React.forwardRef<HTMLSpanElement, TabsIndicatorProps>(
  ({ className, ...props }, ref) => (
    <BaseTabs.Indicator {...props} ref={ref} className={classes(className, 'bg-city-foreground')} />
  ),
);

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Tab: TabsTab,
  Panel: TabsPanel,
  Indicator: TabsIndicator,
};
