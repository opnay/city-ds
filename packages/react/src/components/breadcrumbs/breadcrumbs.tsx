'use client';

import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';

import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';

export type BreadcrumbsState = Record<string, unknown>;

const state: BreadcrumbsState = {};

export interface BreadcrumbsRootProps extends Omit<
  useRender.ComponentProps<'nav', BreadcrumbsState>,
  'className'
> {
  className?: StateClassName<BreadcrumbsState>;
}

export const BreadcrumbsRoot = React.forwardRef<HTMLElement, BreadcrumbsRootProps>(
  function BreadcrumbsRoot({ className, render, ...props }, ref) {
    return useRender({
      defaultTagName: 'nav',
      ref,
      render,
      state,
      props: {
        ...props,
        'aria-label': props['aria-label'] ?? 'Breadcrumb',
        'data-city-breadcrumbs-root': '',
        className: cn('text-city-foreground min-w-0 text-sm', resolveClassName(className, state)),
      },
    });
  },
);

BreadcrumbsRoot.displayName = 'Breadcrumbs.Root';

export interface BreadcrumbsListProps extends Omit<
  useRender.ComponentProps<'ol', BreadcrumbsState>,
  'className'
> {
  className?: StateClassName<BreadcrumbsState>;
}

export const BreadcrumbsList = React.forwardRef<HTMLOListElement, BreadcrumbsListProps>(
  function BreadcrumbsList({ className, render, ...props }, ref) {
    return useRender({
      defaultTagName: 'ol',
      ref,
      render,
      state,
      props: {
        ...props,
        'data-city-breadcrumbs-list': '',
        className: cn(
          'flex min-w-0 flex-wrap items-center gap-1.5',
          resolveClassName(className, state),
        ),
      },
    });
  },
);

BreadcrumbsList.displayName = 'Breadcrumbs.List';

export interface BreadcrumbsItemProps extends Omit<
  useRender.ComponentProps<'li', BreadcrumbsState>,
  'className'
> {
  className?: StateClassName<BreadcrumbsState>;
}

export const BreadcrumbsItem = React.forwardRef<HTMLLIElement, BreadcrumbsItemProps>(
  function BreadcrumbsItem({ className, render, ...props }, ref) {
    return useRender({
      defaultTagName: 'li',
      ref,
      render,
      state,
      props: {
        ...props,
        'data-city-breadcrumbs-item': '',
        className: cn(
          'inline-flex min-w-0 items-center gap-1.5',
          resolveClassName(className, state),
        ),
      },
    });
  },
);

BreadcrumbsItem.displayName = 'Breadcrumbs.Item';

export interface BreadcrumbsLinkProps extends Omit<
  useRender.ComponentProps<'a', BreadcrumbsState>,
  'className'
> {
  className?: StateClassName<BreadcrumbsState>;
}

export const BreadcrumbsLink = React.forwardRef<HTMLAnchorElement, BreadcrumbsLinkProps>(
  function BreadcrumbsLink({ className, render, ...props }, ref) {
    return useRender({
      defaultTagName: 'a',
      ref,
      render,
      state,
      props: {
        ...props,
        'data-city-breadcrumbs-link': '',
        className: cn(
          'focus-visible:ring-city-ring focus-visible:ring-offset-city-background rounded-city-xs opacity-[0.64] outline-none transition-opacity hover:opacity-[0.84] focus-visible:opacity-[0.84] focus-visible:ring-2 focus-visible:ring-offset-2 active:opacity-[0.84]',
          resolveClassName(className, state),
        ),
      },
    });
  },
);

BreadcrumbsLink.displayName = 'Breadcrumbs.Link';

export interface BreadcrumbsPageProps extends Omit<
  useRender.ComponentProps<'span', BreadcrumbsState>,
  'className'
> {
  className?: StateClassName<BreadcrumbsState>;
}

export const BreadcrumbsPage = React.forwardRef<HTMLSpanElement, BreadcrumbsPageProps>(
  function BreadcrumbsPage({ className, render, ...props }, ref) {
    return useRender({
      defaultTagName: 'span',
      ref,
      render,
      state,
      props: {
        ...props,
        'aria-current': props['aria-current'] ?? 'page',
        'data-city-breadcrumbs-page': '',
        className: cn(
          'text-city-foreground font-medium opacity-100',
          resolveClassName(className, state),
        ),
      },
    });
  },
);

BreadcrumbsPage.displayName = 'Breadcrumbs.Page';

export interface BreadcrumbsSeparatorProps extends Omit<
  useRender.ComponentProps<'span', BreadcrumbsState>,
  'className' | 'children'
> {
  children?: React.ReactNode;
  className?: StateClassName<BreadcrumbsState>;
}

export const BreadcrumbsSeparator = React.forwardRef<HTMLSpanElement, BreadcrumbsSeparatorProps>(
  function BreadcrumbsSeparator({ children = '/', className, render, ...props }, ref) {
    return useRender({
      defaultTagName: 'span',
      ref,
      render,
      state,
      props: {
        ...props,
        'aria-hidden': props['aria-hidden'] ?? true,
        'data-city-breadcrumbs-separator': '',
        children,
        className: cn('select-none opacity-[0.64]', resolveClassName(className, state)),
      },
    });
  },
);

BreadcrumbsSeparator.displayName = 'Breadcrumbs.Separator';

export interface BreadcrumbsEllipsisProps extends Omit<
  useRender.ComponentProps<'span', BreadcrumbsState>,
  'className' | 'children'
> {
  children?: React.ReactNode;
  className?: StateClassName<BreadcrumbsState>;
}

export const BreadcrumbsEllipsis = React.forwardRef<HTMLSpanElement, BreadcrumbsEllipsisProps>(
  function BreadcrumbsEllipsis(
    { children = '…', className, render, 'aria-label': ariaLabel = 'More pages', ...props },
    ref,
  ) {
    return useRender({
      defaultTagName: 'span',
      ref,
      render,
      state,
      props: {
        ...props,
        'data-city-breadcrumbs-ellipsis': '',
        children: (
          <>
            <span aria-hidden="true">{children}</span>
            <span className="sr-only">{ariaLabel}</span>
          </>
        ),
        className: cn(
          'inline-flex min-w-4 justify-center opacity-[0.64]',
          resolveClassName(className, state),
        ),
      },
    });
  },
);

BreadcrumbsEllipsis.displayName = 'Breadcrumbs.Ellipsis';

export const Breadcrumbs = {
  Root: BreadcrumbsRoot,
  List: BreadcrumbsList,
  Item: BreadcrumbsItem,
  Link: BreadcrumbsLink,
  Page: BreadcrumbsPage,
  Separator: BreadcrumbsSeparator,
  Ellipsis: BreadcrumbsEllipsis,
};
