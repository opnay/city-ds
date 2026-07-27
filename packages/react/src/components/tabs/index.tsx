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
import type { Density } from '../../types';
import { useDensity } from '../density-provider';

function classes<State>(className: StateClassName<State> | undefined, defaults: string) {
  return (state: State) => cn(defaults, resolveClassName(className, state));
}

export type TabsRootProps = BaseTabsRootProps & {
  density?: Density;
};
export type TabsListProps = BaseTabsListProps;
export type TabsTabProps = BaseTabsTabProps;
export type TabsPanelProps = BaseTabsPanelProps;
export type TabsIndicatorProps = BaseTabsIndicatorProps;

const TabsDensityContext = React.createContext<Density>('comfortable');

export const TabsRoot = React.forwardRef<HTMLDivElement, TabsRootProps>(
  ({ className, density: densityProp, ...props }, ref) => {
    const density = useDensity(densityProp);

    return (
      <TabsDensityContext.Provider value={density}>
        <BaseTabs.Root
          {...props}
          ref={ref}
          data-city-density={density}
          className={classes(className, 'w-full')}
        />
      </TabsDensityContext.Provider>
    );
  },
);

TabsRoot.displayName = 'Tabs.Root';

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, ...props }, ref) => {
    const density = React.useContext(TabsDensityContext);

    return (
      <BaseTabs.List
        {...props}
        ref={ref}
        data-city-density={density}
        className={classes(
          className,
          cn(
            'rounded-city-sm border-city-border bg-city-muted text-city-muted-foreground inline-flex items-center border',
            density === 'compact'
              ? 'h-(--city-control-sm) gap-0.5 p-0.5'
              : 'h-(--city-control-md) gap-1 p-1',
          ),
        )}
      />
    );
  },
);

export const TabsTab = React.forwardRef<HTMLElement, TabsTabProps>(
  ({ className, ...props }, ref) => {
    const density = React.useContext(TabsDensityContext);

    return (
      <BaseTabs.Tab
        {...props}
        ref={ref}
        data-city-density={density}
        className={classes(
          className,
          cn(
            'rounded-city-xs data-[active]:bg-city-surface-raised data-[active]:text-city-foreground hover:text-city-foreground focus-visible:ring-city-ring inline-flex items-center justify-center font-medium transition-colors outline-none focus-visible:ring-2 data-[active]:shadow-sm data-[disabled]:pointer-events-none data-[disabled]:opacity-45',
            density === 'compact' ? 'h-6 px-2 text-xs' : 'h-7 px-2.5 text-sm',
          ),
        )}
      />
    );
  },
);

export const TabsPanel = React.forwardRef<HTMLDivElement, TabsPanelProps>(
  ({ className, ...props }, ref) => {
    const density = React.useContext(TabsDensityContext);

    return (
      <BaseTabs.Panel
        {...props}
        ref={ref}
        data-city-density={density}
        className={classes(
          className,
          cn(
            'text-city-foreground outline-none',
            density === 'compact' ? 'mt-2 text-xs' : 'mt-3 text-sm',
          ),
        )}
      />
    );
  },
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
