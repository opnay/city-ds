'use client';

import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';

import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { Density, SurfaceAppearance } from '../../types';
import { useDensity } from '../density-provider';

export interface FilterPanelState extends Record<string, unknown> {
  appearance: SurfaceAppearance;
  density: Density;
}

export interface FilterPanelProps extends Omit<
  useRender.ComponentProps<'div', FilterPanelState>,
  'children' | 'className'
> {
  actions?: React.ReactNode;
  appearance?: SurfaceAppearance;
  children: React.ReactNode;
  className?: StateClassName<FilterPanelState>;
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

export const FilterPanel = React.forwardRef<HTMLDivElement, FilterPanelProps>(
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
    const state = React.useMemo<FilterPanelState>(
      () => ({ appearance, density }),
      [appearance, density],
    );

    return useRender<FilterPanelState, HTMLDivElement>({
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
              data-city-filter-panel-content=""
            >
              {React.Children.map(children, (child) =>
                child == null ? null : (
                  <div className="max-w-full min-w-0" data-city-filter-panel-condition="">
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
                data-city-filter-panel-actions=""
              >
                {actions}
              </div>
            ) : null}
          </>
        ),
        className: cn(
          'text-city-foreground flex min-w-0 max-w-full flex-wrap items-end',
          appearanceClasses[appearance],
          densityClasses[density],
          resolveClassName(className, state),
        ),
        'data-appearance': appearance,
        'data-city-density': density,
        'data-city-filter-panel': '',
      },
    });
  },
);

FilterPanel.displayName = 'FilterPanel';
