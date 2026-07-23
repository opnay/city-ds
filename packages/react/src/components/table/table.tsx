'use client';

import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';
import { cn } from '../../lib/cn';
import type { ControlSize } from '../../types';

export const TABLE_VARIANTS = ['line', 'surface'] as const;

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
  sm: 'px-2 py-1.5',
  md: 'px-3 py-2',
  lg: 'px-4 py-3',
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
          'align-middle transition-colors hover:bg-city-muted/70',
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
} as const;
