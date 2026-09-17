'use client';

import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';

import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { Density } from '../../types';
import { useDensity } from '../density-provider';

export interface FilterBarState extends Record<string, unknown> {
  density: Density;
}

export interface FilterBarProps extends Omit<
  useRender.ComponentProps<'div', FilterBarState>,
  'children' | 'className'
> {
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: StateClassName<FilterBarState>;
  density?: Density;
}

const densityClasses: Record<Density, string> = {
  comfortable: 'gap-4',
  compact: 'gap-3',
};

const contentDensityClasses: Record<Density, string> = {
  comfortable: 'gap-3',
  compact: 'gap-2',
};

export const FilterBar = React.forwardRef<HTMLDivElement, FilterBarProps>(
  (
    { actions, children, className, density: densityProp, render, role = 'group', ...props },
    ref,
  ) => {
    const density = useDensity(densityProp);
    const state = React.useMemo<FilterBarState>(() => ({ density }), [density]);

    return useRender<FilterBarState, HTMLDivElement>({
      defaultTagName: 'div',
      ref,
      render,
      state,
      props: {
        ...props,
        role,
        children: (
          <>
            <div
              className={cn(
                'flex min-w-0 flex-auto flex-wrap items-end',
                contentDensityClasses[density],
              )}
              data-city-filter-bar-content=""
            >
              {React.Children.map(children, (child) =>
                child == null ? null : (
                  <div className="max-w-full min-w-0" data-city-filter-bar-condition="">
                    {child}
                  </div>
                ),
              )}
            </div>
            {actions ? (
              <div
                className={cn(
                  'ml-auto flex min-w-0 flex-wrap items-center justify-end',
                  contentDensityClasses[density],
                )}
                data-city-filter-bar-actions=""
              >
                {actions}
              </div>
            ) : null}
          </>
        ),
        className: cn(
          'text-city-foreground flex min-w-0 max-w-full flex-wrap items-end',
          densityClasses[density],
          resolveClassName(className, state),
        ),
        'data-city-filter-bar': '',
        'data-city-density': density,
      },
    });
  },
);

FilterBar.displayName = 'FilterBar';
