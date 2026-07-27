'use client';

import * as React from 'react';
import { ArrowLeftRight } from 'lucide-react';

import { cn } from '../../lib/cn';
import type { SurfaceAppearance } from '../../types';
import { Table, type TableScrollAreaProps } from '../table';

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
  scrollAreaClassName?: TableScrollAreaProps['className'];
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
            className="border-city-border bg-city-muted text-city-muted-foreground hidden items-center gap-2 border-b px-4 py-2 text-xs max-lg:flex"
            data-city-data-table-region-hint=""
            id={resolvedHintId}
          >
            <ArrowLeftRight aria-hidden="true" className="size-4 shrink-0" />
            {hint}
          </p>
        ) : null}
        <Table.ScrollArea
          {...(hasVisibleHint ? { 'aria-describedby': resolvedHintId } : {})}
          {...(scrollAreaClassName !== undefined ? { className: scrollAreaClassName } : {})}
          appearance={appearance}
          aria-label={label}
          role="region"
        >
          {children}
        </Table.ScrollArea>
      </div>
    );
  },
);

DataTableRegion.displayName = 'DataTableRegion';
