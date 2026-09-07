'use client';

import * as React from 'react';

import { cn } from '../../lib/cn';
import type { SurfaceAppearance } from '../../types';

const scrollAppearanceClasses: Record<SurfaceAppearance, string> = {
  plain: '',
  band: 'border-city-border border-y',
  outline: 'rounded-city-md border-city-border border',
};

export interface DataTableRegionProps extends Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'children' | 'className'
> {
  appearance?: SurfaceAppearance;
  children: React.ReactNode;
  className?: string;
  label: string;
  scrollAreaClassName?: string;
}

export const DataTableRegion = React.forwardRef<HTMLDivElement, DataTableRegionProps>(
  ({ appearance = 'plain', children, className, label, scrollAreaClassName, ...props }, ref) => {
    return (
      <div
        {...props}
        ref={ref}
        className={cn('max-w-full min-w-0 overflow-x-clip [contain:inline-size_paint]', className)}
        data-city-data-table-region=""
      >
        <div
          className={cn(
            'focus-visible:ring-city-ring w-full overflow-x-auto outline-none focus-visible:ring-2 focus-visible:ring-inset',
            scrollAppearanceClasses[appearance],
            scrollAreaClassName,
          )}
          data-appearance={appearance}
          data-city-data-table-scroll=""
          aria-label={label}
          role="region"
          tabIndex={0}
        >
          {children}
        </div>
      </div>
    );
  },
);

DataTableRegion.displayName = 'DataTableRegion';
