'use client';

import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';

import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { Density, SurfaceAppearance } from '../../types';
import { useDensity } from '../density-provider';

export interface FilterBarState extends Record<string, unknown> {
  appearance: SurfaceAppearance;
  density: Density;
}

export interface FilterBarProps extends Omit<
  useRender.ComponentProps<'div', FilterBarState>,
  'children' | 'className'
> {
  actions?: React.ReactNode;
  appearance?: SurfaceAppearance;
  children: React.ReactNode;
  className?: StateClassName<FilterBarState>;
  density?: Density;
}

const appearanceClasses: Record<SurfaceAppearance, string> = {
  plain: 'bg-transparent',
  band: 'bg-city-muted',
  outline: 'rounded-city-md border-city-border bg-city-surface border',
};

const densityClasses: Record<Density, string> = {
  comfortable: 'gap-4 p-4',
  compact: 'gap-3 p-3',
};

const contentDensityClasses: Record<Density, string> = {
  comfortable: 'gap-3',
  compact: 'gap-2',
};

export const FilterBar = React.forwardRef<HTMLDivElement, FilterBarProps>(
  (
    {
      actions,
      appearance = 'band',
      children,
      className,
      density: densityProp,
      render,
      role = 'group',
      ...props
    },
    ref,
  ) => {
    const density = useDensity(densityProp);
    const state = React.useMemo<FilterBarState>(
      () => ({ appearance, density }),
      [appearance, density],
    );

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
                'flex min-w-0 flex-1 flex-col items-stretch sm:flex-row sm:flex-wrap sm:items-center',
                contentDensityClasses[density],
              )}
              data-city-filter-bar-content=""
            >
              {children}
            </div>
            {actions ? (
              <div
                className={cn(
                  'flex min-w-0 flex-wrap items-center justify-between sm:ml-auto sm:justify-end',
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
          'text-city-foreground flex min-w-0 max-w-full flex-col items-stretch sm:flex-row sm:flex-wrap sm:items-center',
          appearanceClasses[appearance],
          densityClasses[density],
          resolveClassName(className, state),
        ),
        'data-appearance': appearance,
        'data-city-filter-bar': '',
        'data-city-density': density,
      },
    });
  },
);

FilterBar.displayName = 'FilterBar';
