'use client';

import * as React from 'react';
import { ArrowLeftRight } from 'lucide-react';

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
  hint?: React.ReactNode;
  hintId?: string;
  label: string;
  scrollAreaClassName?: string;
  showHint?: boolean;
}

export const DataTableRegion = React.forwardRef<HTMLDivElement, DataTableRegionProps>(
  (
    {
      appearance = 'plain',
      children,
      className,
      hint,
      hintId,
      label,
      scrollAreaClassName,
      showHint = true,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const resolvedHintId = hintId ?? `${generatedId}-scroll-hint`;
    const hasVisibleHint = showHint && hint !== undefined;

    return (
      <div
        {...props}
        ref={ref}
        className={cn('max-w-full min-w-0 overflow-x-clip [contain:inline-size_paint]', className)}
        data-city-data-table-region=""
      >
        {hasVisibleHint ? (
          <p
            className="hidden items-center gap-2 border-b border-city-border bg-city-muted px-4 py-2 text-xs text-city-muted-foreground max-lg:flex"
            data-city-data-table-region-hint=""
            id={resolvedHintId}
          >
            <ArrowLeftRight aria-hidden="true" className="size-4 shrink-0" />
            {hint}
          </p>
        ) : null}
        <div
          {...(hasVisibleHint ? { 'aria-describedby': resolvedHintId } : {})}
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
