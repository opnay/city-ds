'use client';

import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { Checkbox } from '../checkbox';
import { cn } from '../../lib/cn';
import type { ControlSize, SurfaceAppearance } from '../../types';

export const TABLE_VARIANTS = ['line', 'surface'] as const;

export type TableSortDirection = 'asc' | 'desc';

export interface TableScrollAreaProps extends Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'className'
> {
  appearance?: SurfaceAppearance;
  className?: string;
}

const scrollAreaAppearanceClasses: Record<SurfaceAppearance, string> = {
  plain: '',
  band: 'border-city-border border-y',
  outline: 'rounded-city-md border-city-border border',
};

export const TableScrollArea = React.forwardRef<HTMLDivElement, TableScrollAreaProps>(
  ({ appearance = 'outline', className, tabIndex = 0, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      className={cn(
        'focus-visible:ring-city-ring focus-visible:ring-offset-city-background w-full overflow-x-auto outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        scrollAreaAppearanceClasses[appearance],
        className,
      )}
      data-appearance={appearance}
      data-city-table-scroll-area=""
      tabIndex={tabIndex}
    />
  ),
);

TableScrollArea.displayName = 'Table.ScrollArea';

export interface TableSortButtonProps extends Omit<
  React.ComponentPropsWithoutRef<'button'>,
  'className' | 'onChange'
> {
  className?: string;
  direction?: TableSortDirection | false;
  onDirectionChange?: (direction: TableSortDirection) => void;
}

function getNextSortDirection(direction: TableSortButtonProps['direction']): TableSortDirection {
  return direction === 'asc' ? 'desc' : 'asc';
}

export const TableSortButton = React.forwardRef<HTMLButtonElement, TableSortButtonProps>(
  (
    {
      children,
      className,
      direction = false,
      onClick,
      onDirectionChange,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const Icon = direction === 'asc' ? ArrowUp : direction === 'desc' ? ArrowDown : ChevronsUpDown;
    const sortLabel =
      direction === 'asc'
        ? 'sorted ascending'
        : direction === 'desc'
          ? 'sorted descending'
          : 'not sorted';
    const textLabel = typeof children === 'string' ? children : 'Column';

    return (
      <button
        {...props}
        ref={ref}
        type={type}
        aria-label={props['aria-label'] ?? `${textLabel} (${sortLabel})`}
        aria-pressed={direction !== false}
        className={cn(
          'rounded-city-xs hover:bg-city-accent active:bg-city-accent-active focus-visible:ring-city-ring focus-visible:ring-offset-city-background -mx-1 inline-flex items-center gap-1 px-1 py-0.5 text-inherit transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          className,
        )}
        data-city-table-sort-button=""
        data-sort-direction={direction || 'none'}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) {
            onDirectionChange?.(getNextSortDirection(direction));
          }
        }}
      >
        <span>{children}</span>
        <Icon aria-hidden="true" className="size-3.5" />
      </button>
    );
  },
);

TableSortButton.displayName = 'Table.SortButton';

export interface TableSelectionHeadProps extends Omit<TableHeadProps, 'children'> {
  checked?: boolean | 'indeterminate';
  label?: string;
  onCheckedChange?: (checked: boolean) => void;
}

export const TableSelectionHead = React.forwardRef<HTMLTableCellElement, TableSelectionHeadProps>(
  ({ checked = false, label = 'Select all rows', onCheckedChange, className, ...props }, ref) => (
    <TableHead {...props} ref={ref} className={cn('w-10', className)}>
      <Checkbox
        aria-label={label}
        checked={checked === true}
        indeterminate={checked === 'indeterminate'}
        onCheckedChange={(value) => onCheckedChange?.(value === true)}
      />
    </TableHead>
  ),
);

TableSelectionHead.displayName = 'Table.SelectionHead';

export interface TableSelectionCellProps extends Omit<TableCellProps, 'children'> {
  checked?: boolean;
  label: string;
  onCheckedChange?: (checked: boolean) => void;
}

export const TableSelectionCell = React.forwardRef<HTMLTableCellElement, TableSelectionCellProps>(
  ({ checked = false, label, onCheckedChange, className, ...props }, ref) => (
    <TableCell {...props} ref={ref} className={cn('w-10', className)}>
      <Checkbox
        aria-label={label}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange?.(value === true)}
      />
    </TableCell>
  ),
);

TableSelectionCell.displayName = 'Table.SelectionCell';

export interface TableStateRowProps extends Omit<TableRowProps, 'children'> {
  children: React.ReactNode;
  colSpan: number;
  status?: 'empty' | 'loading';
}

export const TableStateRow = React.forwardRef<HTMLTableRowElement, TableStateRowProps>(
  ({ children, className, colSpan, status = 'empty', ...props }, ref) => (
    <TableRow {...props} ref={ref} className={cn('hover:bg-transparent', className)}>
      <TableCell
        colSpan={colSpan}
        className="h-28 text-center text-sm text-city-muted-foreground"
        role={status === 'loading' ? 'status' : undefined}
        aria-live={status === 'loading' ? 'polite' : undefined}
        data-city-table-state={status}
      >
        {children}
      </TableCell>
    </TableRow>
  ),
);

TableStateRow.displayName = 'Table.StateRow';

export type TableVariant = (typeof TABLE_VARIANTS)[number];

interface TableContextValue extends Record<string, unknown> {
  size: ControlSize;
  variant: TableVariant;
}

const TABLE_CONTEXT_DEFAULTS: TableContextValue = {
  size: 'md',
  variant: 'line',
};

const TableContext = React.createContext<TableContextValue>(TABLE_CONTEXT_DEFAULTS);

function useTableContext(): TableContextValue {
  return React.useContext(TableContext);
}

const CELL_PADDING: Record<ControlSize, string> = {
  xsm: 'px-1 py-0.5',
  sm: 'px-1.5 py-1',
  md: 'px-2 py-1.5',
  lg: 'px-3 py-2',
  xlg: 'px-4 py-3',
};

export interface TableRootProps extends Omit<React.ComponentPropsWithoutRef<'table'>, 'className'> {
  className?: string;
  render?: useRender.ComponentProps<'table', TableContextValue>['render'];
  size?: ControlSize;
  variant?: TableVariant;
}

export const TableRoot = React.forwardRef<HTMLTableElement, TableRootProps>(
  ({ children, className, render, size = 'md', variant = 'line', ...props }, ref) => {
    const state = React.useMemo<TableContextValue>(() => ({ size, variant }), [size, variant]);
    const table = useRender<TableContextValue, HTMLTableElement>({
      defaultTagName: 'table',
      ref,
      render,
      state,
      props: {
        ...props,
        children,
        className: cn('w-full border-collapse text-left text-sm', className),
        'data-city-table-root': '',
        'data-size': size,
        'data-variant': variant,
      },
    });

    return <TableContext.Provider value={state}>{table}</TableContext.Provider>;
  },
);

TableRoot.displayName = 'Table.Root';

export interface TableHeaderProps extends Omit<
  React.ComponentPropsWithoutRef<'thead'>,
  'className'
> {
  className?: string;
  render?: useRender.ComponentProps<'thead', TableContextValue>['render'];
}

export const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ children, className, render, ...props }, ref) => {
    const state = useTableContext();
    return useRender<TableContextValue, HTMLTableSectionElement>({
      defaultTagName: 'thead',
      ref,
      render,
      state,
      props: {
        ...props,
        children,
        className: cn(
          'text-city-muted-foreground',
          state.variant === 'line' && 'border-b border-city-border',
          className,
        ),
        'data-city-table-header': '',
      },
    });
  },
);

TableHeader.displayName = 'Table.Header';

export interface TableBodyProps extends Omit<React.ComponentPropsWithoutRef<'tbody'>, 'className'> {
  className?: string;
  render?: useRender.ComponentProps<'tbody', TableContextValue>['render'];
}

export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ children, className, render, ...props }, ref) => {
    const state = useTableContext();
    return useRender<TableContextValue, HTMLTableSectionElement>({
      defaultTagName: 'tbody',
      ref,
      render,
      state,
      props: {
        ...props,
        children,
        className: cn(state.variant === 'line' && 'divide-y divide-city-border', className),
        'data-city-table-body': '',
      },
    });
  },
);

TableBody.displayName = 'Table.Body';

export interface TableFooterProps extends Omit<
  React.ComponentPropsWithoutRef<'tfoot'>,
  'className'
> {
  className?: string;
  render?: useRender.ComponentProps<'tfoot', TableContextValue>['render'];
}

export const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ children, className, render, ...props }, ref) => {
    const state = useTableContext();
    return useRender<TableContextValue, HTMLTableSectionElement>({
      defaultTagName: 'tfoot',
      ref,
      render,
      state,
      props: {
        ...props,
        children,
        className: cn(
          'font-medium',
          state.variant === 'line' && 'border-t border-city-border',
          className,
        ),
        'data-city-table-footer': '',
      },
    });
  },
);

TableFooter.displayName = 'Table.Footer';

export interface TableRowProps extends Omit<React.ComponentPropsWithoutRef<'tr'>, 'className'> {
  className?: string;
  render?: useRender.ComponentProps<'tr', TableContextValue>['render'];
}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ children, className, render, ...props }, ref) => {
    const state = useTableContext();
    return useRender<TableContextValue, HTMLTableRowElement>({
      defaultTagName: 'tr',
      ref,
      render,
      state,
      props: {
        ...props,
        children,
        className: cn(
          'align-middle transition-colors hover:bg-city-muted',
          state.variant === 'surface' && 'border-b border-city-border last:border-b-0',
          className,
        ),
        'data-city-table-row': '',
      },
    });
  },
);

TableRow.displayName = 'Table.Row';

export interface TableHeadProps extends Omit<React.ComponentPropsWithoutRef<'th'>, 'className'> {
  className?: string;
  render?: useRender.ComponentProps<'th', TableContextValue>['render'];
}

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ children, className, render, scope = 'col', ...props }, ref) => {
    const state = useTableContext();
    return useRender<TableContextValue, HTMLTableCellElement>({
      defaultTagName: 'th',
      ref,
      render,
      state,
      props: {
        ...props,
        children,
        scope,
        className: cn(
          CELL_PADDING[state.size],
          'h-9 font-medium text-city-muted-foreground',
          className,
        ),
        'data-city-table-head': '',
      },
    });
  },
);

TableHead.displayName = 'Table.Head';

export interface TableCellProps extends Omit<React.ComponentPropsWithoutRef<'td'>, 'className'> {
  className?: string;
  render?: useRender.ComponentProps<'td', TableContextValue>['render'];
}

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ children, className, render, ...props }, ref) => {
    const state = useTableContext();
    return useRender<TableContextValue, HTMLTableCellElement>({
      defaultTagName: 'td',
      ref,
      render,
      state,
      props: {
        ...props,
        children,
        className: cn(
          CELL_PADDING[state.size],
          state.variant === 'surface' && 'bg-city-surface',
          className,
        ),
        'data-city-table-cell': '',
      },
    });
  },
);

TableCell.displayName = 'Table.Cell';

export interface TableCaptionProps extends Omit<
  React.ComponentPropsWithoutRef<'caption'>,
  'className'
> {
  className?: string;
  render?: useRender.ComponentProps<'caption', TableContextValue>['render'];
}

export const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ children, className, render, ...props }, ref) => {
    const state = useTableContext();
    return useRender<TableContextValue, HTMLTableCaptionElement>({
      defaultTagName: 'caption',
      ref,
      render,
      state,
      props: {
        ...props,
        children,
        className: cn(
          'caption-bottom pt-2 text-left text-sm text-city-muted-foreground',
          className,
        ),
        'data-city-table-caption': '',
      },
    });
  },
);

TableCaption.displayName = 'Table.Caption';

export const Table = {
  Root: TableRoot,
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
  Caption: TableCaption,
  ScrollArea: TableScrollArea,
  SortButton: TableSortButton,
  SelectionHead: TableSelectionHead,
  SelectionCell: TableSelectionCell,
  StateRow: TableStateRow,
} as const;
