'use client';

import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { useRender } from '@base-ui/react/use-render';
import { cn } from '../../lib/cn';
import type { Density } from '../../types';
import { useDensity } from '../density-provider';

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function toPositiveInteger(value: number, fallback: number): number {
  return Number.isFinite(value) && value >= 1 ? Math.floor(value) : fallback;
}

function toNonNegativeInteger(value: number, fallback: number): number {
  return Number.isFinite(value) && value >= 0 ? Math.floor(value) : fallback;
}

type PaginationRangeItem = number | 'start-gap' | 'end-gap';

function range(start: number, end: number): number[] {
  const pages: number[] = [];

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  return pages;
}

function getPageRange(
  page: number,
  totalPages: number,
  siblingCount: number,
  boundaryCount: number,
): PaginationRangeItem[] {
  const visiblePageCount = boundaryCount * 2 + siblingCount * 2 + 3;

  if (totalPages <= visiblePageCount) {
    return range(1, totalPages);
  }

  const firstBoundary = range(1, boundaryCount);
  const lastBoundary = range(totalPages - boundaryCount + 1, totalPages);
  const siblingStart = Math.max(
    boundaryCount + 1,
    Math.min(page - siblingCount, totalPages - boundaryCount - siblingCount * 2 - 1),
  );
  const siblingEnd = Math.min(
    totalPages - boundaryCount,
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
  );
  const pages: PaginationRangeItem[] = [...firstBoundary];

  if (siblingStart > boundaryCount + 1) {
    pages.push('start-gap');
  } else {
    pages.push(...range(boundaryCount + 1, siblingStart - 1));
  }

  pages.push(...range(siblingStart, siblingEnd));

  if (siblingEnd < totalPages - boundaryCount) {
    pages.push('end-gap');
  } else {
    pages.push(...range(siblingEnd + 1, totalPages - boundaryCount));
  }

  pages.push(...lastBoundary);

  return pages;
}

export interface PaginationState extends Record<string, unknown> {
  page: number;
  totalPages: number;
  siblingCount: number;
  boundaryCount: number;
  density: Density;
  groupSize: number;
}

export interface PaginationLabels {
  navigation: string;
  first: string;
  previous: string;
  previousGroup: (count: number) => string;
  page: (page: number) => string;
  nextGroup: (count: number) => string;
  next: string;
  last: string;
}

export const DEFAULT_PAGINATION_LABELS: PaginationLabels = {
  navigation: 'Pagination',
  first: 'Go to first page',
  previous: 'Go to previous page',
  previousGroup: (count) => `Go back ${count} pages`,
  page: (page) => `Page ${page}`,
  nextGroup: (count) => `Go forward ${count} pages`,
  next: 'Go to next page',
  last: 'Go to last page',
};

interface PaginationContextValue extends PaginationState {
  labels: PaginationLabels;
  onPageChange: (page: number) => void;
}

const PaginationContext = React.createContext<PaginationContextValue | null>(null);

function usePaginationContext(componentName: string): PaginationContextValue {
  const context = React.useContext(PaginationContext);

  if (!context) {
    throw new Error(`${componentName} must be used within Pagination.Root.`);
  }

  return context;
}

export interface PaginationRootProps extends Omit<
  React.ComponentPropsWithoutRef<'nav'>,
  'children' | 'className'
> {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  children?: React.ReactNode;
  className?: string;
  density?: Density;
  labels?: Partial<PaginationLabels>;
  render?: useRender.ComponentProps<'nav', PaginationState>['render'];
  siblingCount?: number;
  boundaryCount?: number;
  groupSize?: number;
}

export const PaginationRoot = React.forwardRef<HTMLElement, PaginationRootProps>(
  (
    {
      page,
      totalPages,
      onPageChange,
      children,
      className,
      density: densityProp,
      render,
      siblingCount = 1,
      boundaryCount = 1,
      groupSize = 5,
      labels,
      ...props
    },
    ref,
  ) => {
    const density = useDensity(densityProp);
    const normalizedTotalPages = toPositiveInteger(totalPages, 1);
    const normalizedPage = clamp(toPositiveInteger(page, 1), 1, normalizedTotalPages);
    const normalizedSiblingCount = toNonNegativeInteger(siblingCount, 1);
    const normalizedBoundaryCount = toNonNegativeInteger(boundaryCount, 1);
    const normalizedGroupSize = toPositiveInteger(groupSize, 5);
    const resolvedLabels = React.useMemo(
      () => ({ ...DEFAULT_PAGINATION_LABELS, ...labels }),
      [labels],
    );
    const state = React.useMemo<PaginationState>(
      () => ({
        page: normalizedPage,
        totalPages: normalizedTotalPages,
        siblingCount: normalizedSiblingCount,
        boundaryCount: normalizedBoundaryCount,
        density,
        groupSize: normalizedGroupSize,
      }),
      [
        normalizedBoundaryCount,
        density,
        normalizedGroupSize,
        normalizedPage,
        normalizedSiblingCount,
        normalizedTotalPages,
      ],
    );
    const context = React.useMemo<PaginationContextValue>(
      () => ({ ...state, labels: resolvedLabels, onPageChange }),
      [onPageChange, resolvedLabels, state],
    );
    const content = children ?? <PaginationList />;
    const navigation = useRender<PaginationState, HTMLElement>({
      defaultTagName: 'nav',
      ref,
      render,
      state,
      props: {
        ...props,
        children: content,
        className: cn('flex min-w-0 max-w-full items-center overflow-x-auto', className),
        'aria-label': props['aria-label'] ?? resolvedLabels.navigation,
        'data-city-pagination-root': '',
        'data-city-density': density,
        'data-invalid-page': normalizedPage !== page ? '' : undefined,
        'data-invalid-total-pages': normalizedTotalPages !== totalPages ? '' : undefined,
      },
    });

    return <PaginationContext.Provider value={context}>{navigation}</PaginationContext.Provider>;
  },
);

PaginationRoot.displayName = 'Pagination.Root';

export interface PaginationListProps extends Omit<
  React.ComponentPropsWithoutRef<'ul'>,
  'className'
> {
  className?: string;
  render?: useRender.ComponentProps<'ul', PaginationState>['render'];
}

export const PaginationList = React.forwardRef<HTMLUListElement, PaginationListProps>(
  ({ children, className, render, ...props }, ref) => {
    const state = usePaginationContext('Pagination.List');
    const pageRange = getPageRange(
      state.page,
      state.totalPages,
      state.siblingCount,
      state.boundaryCount,
    );
    const content = children ?? (
      <>
        <PaginationItem>
          <PaginationFirst className="hidden sm:inline-flex" />
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious />
        </PaginationItem>
        {pageRange.map((item) => {
          if (item === 'start-gap') {
            return (
              <PaginationItem key={item}>
                <PaginationPreviousGroup />
              </PaginationItem>
            );
          }

          if (item === 'end-gap') {
            return (
              <PaginationItem key={item}>
                <PaginationNextGroup />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={item}>
              <PaginationPage page={item} />
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext />
        </PaginationItem>
        <PaginationItem>
          <PaginationLast className="hidden sm:inline-flex" />
        </PaginationItem>
      </>
    );
    return useRender<PaginationState, HTMLUListElement>({
      defaultTagName: 'ul',
      ref,
      render,
      state,
      props: {
        ...props,
        children: content,
        className: cn(
          'flex list-none items-center p-0',
          state.density === 'compact' ? 'gap-0.5' : 'gap-1',
          className,
        ),
        'data-city-density': state.density,
        'data-city-pagination-list': '',
      },
    });
  },
);

PaginationList.displayName = 'Pagination.List';

export interface PaginationItemProps extends Omit<
  React.ComponentPropsWithoutRef<'li'>,
  'className'
> {
  className?: string;
  render?: useRender.ComponentProps<'li', PaginationState>['render'];
}

export const PaginationItem = React.forwardRef<HTMLLIElement, PaginationItemProps>(
  ({ children, className, render, ...props }, ref) => {
    const state = usePaginationContext('Pagination.Item');
    return useRender<PaginationState, HTMLLIElement>({
      defaultTagName: 'li',
      ref,
      render,
      state,
      props: {
        ...props,
        children,
        className,
        'data-city-pagination-item': '',
      },
    });
  },
);

PaginationItem.displayName = 'Pagination.Item';

type PaginationButtonProps = Omit<
  React.ComponentPropsWithoutRef<typeof BaseButton>,
  'children' | 'className' | 'disabled' | 'onClick'
> & {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
};

interface PaginationControlProps extends PaginationButtonProps {
  children: React.ReactNode;
  defaultAriaLabel: string;
  targetPage: (state: PaginationState) => number;
}

const PaginationControl = React.forwardRef<HTMLElement, PaginationControlProps>(
  ({ children, className, defaultAriaLabel, disabled, onClick, targetPage, ...props }, ref) => {
    const context = usePaginationContext('Pagination control');
    const target = clamp(targetPage(context), 1, context.totalPages);
    const isDisabled = disabled || target === context.page;

    return (
      <BaseButton
        {...props}
        aria-label={props['aria-label'] ?? defaultAriaLabel}
        className={cn(
          'rounded-city-sm text-city-foreground hover:bg-city-accent active:bg-city-accent-active focus-visible:outline-city-ring inline-flex items-center justify-center border border-transparent transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-40',
          context.density === 'compact' ? 'size-7 text-xs' : 'size-8 text-sm',
          className,
        )}
        data-city-density={context.density}
        disabled={isDisabled}
        onClick={(event) => {
          onClick?.(event);

          if (!event.defaultPrevented && !isDisabled) {
            context.onPageChange(target);
          }
        }}
        ref={ref}
        type="button"
      >
        {children}
      </BaseButton>
    );
  },
);

PaginationControl.displayName = 'Pagination.Control';

export type PaginationFirstProps = PaginationButtonProps;

export const PaginationFirst = React.forwardRef<HTMLElement, PaginationFirstProps>((props, ref) => {
  const { labels } = usePaginationContext('Pagination.First');

  return (
    <PaginationControl {...props} defaultAriaLabel={labels.first} ref={ref} targetPage={() => 1}>
      <span aria-hidden="true">«</span>
    </PaginationControl>
  );
});

PaginationFirst.displayName = 'Pagination.First';

export type PaginationPreviousProps = PaginationButtonProps;

export const PaginationPrevious = React.forwardRef<HTMLElement, PaginationPreviousProps>(
  (props, ref) => {
    const { labels } = usePaginationContext('Pagination.Previous');

    return (
      <PaginationControl
        {...props}
        defaultAriaLabel={labels.previous}
        ref={ref}
        targetPage={(state) => state.page - 1}
      >
        <span aria-hidden="true">‹</span>
      </PaginationControl>
    );
  },
);

PaginationPrevious.displayName = 'Pagination.Previous';

export type PaginationPreviousGroupProps = PaginationButtonProps;

export const PaginationPreviousGroup = React.forwardRef<HTMLElement, PaginationPreviousGroupProps>(
  (props, ref) => {
    const { groupSize, labels } = usePaginationContext('Pagination.PreviousGroup');

    return (
      <PaginationControl
        {...props}
        defaultAriaLabel={labels.previousGroup(groupSize)}
        ref={ref}
        targetPage={(state) => state.page - state.groupSize}
      >
        <span aria-hidden="true">…</span>
      </PaginationControl>
    );
  },
);

PaginationPreviousGroup.displayName = 'Pagination.PreviousGroup';

export interface PaginationPageProps extends PaginationButtonProps {
  page: number;
}

export const PaginationPage = React.forwardRef<HTMLElement, PaginationPageProps>(
  ({ page, ...props }, ref) => {
    const context = usePaginationContext('Pagination.Page');
    const target = clamp(toPositiveInteger(page, 1), 1, context.totalPages);
    const isCurrent = target === context.page;

    return (
      <PaginationControl
        {...props}
        aria-current={isCurrent ? 'page' : undefined}
        defaultAriaLabel={context.labels.page(target)}
        className={cn(
          isCurrent &&
            'border-city-border bg-city-primary text-city-primary-foreground hover:bg-city-primary',
          props.className,
        )}
        ref={ref}
        targetPage={() => target}
      >
        {target}
      </PaginationControl>
    );
  },
);

PaginationPage.displayName = 'Pagination.Page';

export type PaginationNextGroupProps = PaginationButtonProps;

export const PaginationNextGroup = React.forwardRef<HTMLElement, PaginationNextGroupProps>(
  (props, ref) => {
    const { groupSize, labels } = usePaginationContext('Pagination.NextGroup');

    return (
      <PaginationControl
        {...props}
        defaultAriaLabel={labels.nextGroup(groupSize)}
        ref={ref}
        targetPage={(state) => state.page + state.groupSize}
      >
        <span aria-hidden="true">…</span>
      </PaginationControl>
    );
  },
);

PaginationNextGroup.displayName = 'Pagination.NextGroup';

export type PaginationNextProps = PaginationButtonProps;

export const PaginationNext = React.forwardRef<HTMLElement, PaginationNextProps>((props, ref) => {
  const { labels } = usePaginationContext('Pagination.Next');

  return (
    <PaginationControl
      {...props}
      defaultAriaLabel={labels.next}
      ref={ref}
      targetPage={(state) => state.page + 1}
    >
      <span aria-hidden="true">›</span>
    </PaginationControl>
  );
});

PaginationNext.displayName = 'Pagination.Next';

export type PaginationLastProps = PaginationButtonProps;

export const PaginationLast = React.forwardRef<HTMLElement, PaginationLastProps>((props, ref) => {
  const { labels } = usePaginationContext('Pagination.Last');

  return (
    <PaginationControl
      {...props}
      defaultAriaLabel={labels.last}
      ref={ref}
      targetPage={(state) => state.totalPages}
    >
      <span aria-hidden="true">»</span>
    </PaginationControl>
  );
});

PaginationLast.displayName = 'Pagination.Last';

export interface PaginationEllipsisProps extends Omit<
  React.ComponentPropsWithoutRef<'span'>,
  'className'
> {
  className?: string;
  render?: useRender.ComponentProps<'span', PaginationState>['render'];
}

export const PaginationEllipsis = React.forwardRef<HTMLSpanElement, PaginationEllipsisProps>(
  ({ children = '…', className, render, ...props }, ref) => {
    const state = usePaginationContext('Pagination.Ellipsis');
    return useRender<PaginationState, HTMLSpanElement>({
      defaultTagName: 'span',
      ref,
      render,
      state,
      props: {
        ...props,
        children,
        className: cn(
          'inline-flex items-center justify-center text-city-muted-foreground',
          state.density === 'compact' ? 'size-7 text-xs' : 'size-8 text-sm',
          className,
        ),
        'aria-hidden': true,
        'data-city-pagination-ellipsis': '',
        'data-city-density': state.density,
      },
    });
  },
);

PaginationEllipsis.displayName = 'Pagination.Ellipsis';

export const Pagination = {
  Root: PaginationRoot,
  List: PaginationList,
  Item: PaginationItem,
  First: PaginationFirst,
  Previous: PaginationPrevious,
  PreviousGroup: PaginationPreviousGroup,
  Page: PaginationPage,
  NextGroup: PaginationNextGroup,
  Next: PaginationNext,
  Last: PaginationLast,
  Ellipsis: PaginationEllipsis,
} as const;
