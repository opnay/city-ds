'use client';

import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';

import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { Density, SurfaceAppearance } from '../../types';
import { useDensity } from '../density-provider';
import { Divider } from '../divider';

const ItemGroupContext = React.createContext(false);
const ItemDensityContext = React.createContext<Density | null>(null);

export interface ItemState extends Record<string, unknown> {
  appearance: SurfaceAppearance;
  density: Density;
}

export interface ItemRootProps extends Omit<
  useRender.ComponentProps<'div', ItemState>,
  'className'
> {
  appearance?: SurfaceAppearance;
  className?: StateClassName<ItemState>;
  density?: Density;
}

const appearanceClasses: Record<SurfaceAppearance, string> = {
  plain: 'border-transparent bg-transparent',
  band: 'border-transparent bg-city-muted',
  outline: 'border-city-border bg-transparent',
};

export const ItemRoot = React.forwardRef<HTMLDivElement, ItemRootProps>(function ItemRoot(
  { appearance = 'plain', className, density: densityProp, render, ...props },
  ref,
) {
  const grouped = React.useContext(ItemGroupContext);
  const density = useDensity(densityProp);
  const state: ItemState = { appearance, density };
  const element = useRender({
    defaultTagName: 'div',
    ref,
    render,
    state,
    props: {
      ...props,
      'data-city-item': '',
      'data-appearance': appearance,
      'data-city-density': density,
      className: cn(
        'group/city-item flex w-full min-w-0 flex-wrap items-center rounded-city-md border text-sm text-city-foreground',
        'transition-colors motion-reduce:transition-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-city-ring focus-visible:ring-offset-2 focus-visible:ring-offset-city-background',
        appearance === 'band'
          ? '[&:is(a,button)]:hover:bg-city-accent-hover [&:is(a,button):hover_[data-city-item-description]]:text-city-accent-foreground'
          : '[&:is(a,button)]:hover:bg-city-muted',
        appearanceClasses[appearance],
        density === 'compact' ? 'gap-2 p-3' : 'gap-3 p-4',
        resolveClassName(className, state),
      ),
    },
  });

  const content = (
    <ItemGroupContext.Provider value={false}>
      <ItemDensityContext.Provider value={density}>{element}</ItemDensityContext.Provider>
    </ItemGroupContext.Provider>
  );

  return grouped ? (
    <li className="min-w-0" data-city-item-list-entry="">
      {content}
    </li>
  ) : (
    content
  );
});

export interface ItemGroupProps extends Omit<useRender.ComponentProps<'ul'>, 'className'> {
  className?: string;
}

export const ItemGroup = React.forwardRef<HTMLUListElement, ItemGroupProps>(function ItemGroup(
  { className, render, ...props },
  ref,
) {
  const density = useDensity();
  const element = useRender({
    defaultTagName: 'ul',
    ref,
    render,
    props: {
      ...props,
      role: 'list',
      'data-city-item-group': '',
      className: cn(
        'm-0 flex w-full min-w-0 list-none flex-col p-0',
        density === 'compact' ? 'gap-2' : 'gap-3',
        className,
      ),
    },
  });

  return <ItemGroupContext.Provider value={true}>{element}</ItemGroupContext.Provider>;
});

export type ItemSeparatorProps = Omit<
  React.ComponentPropsWithoutRef<typeof Divider>,
  'children' | 'orientation' | 'plain'
>;

export const ItemSeparator = React.forwardRef<HTMLDivElement, ItemSeparatorProps>(
  function ItemSeparator(props, ref) {
    const grouped = React.useContext(ItemGroupContext);
    const element = (
      <Divider
        {...props}
        ref={ref}
        orientation="horizontal"
        aria-hidden="true"
        data-city-item-separator=""
      />
    );

    return grouped ? (
      <li aria-hidden="true" className="list-none">
        {element}
      </li>
    ) : (
      element
    );
  },
);

export interface ItemMediaProps extends Omit<useRender.ComponentProps<'div'>, 'className'> {
  className?: string;
  variant?: 'default' | 'icon' | 'image';
}

export const ItemMedia = React.forwardRef<HTMLDivElement, ItemMediaProps>(function ItemMedia(
  { className, variant = 'default', render, ...props },
  ref,
) {
  const inheritedDensity = useDensity();
  const density = React.useContext(ItemDensityContext) ?? inheritedDensity;

  return useRender({
    defaultTagName: 'div',
    ref,
    render,
    props: {
      ...props,
      'data-city-item-media': '',
      'data-variant': variant,
      className: cn(
        'flex shrink-0 items-center justify-center self-start [&_svg]:pointer-events-none',
        variant === 'icon' && 'py-0.5 [&_svg]:size-5',
        variant === 'image' &&
          'overflow-hidden rounded-city-sm [&_img]:size-full [&_img]:object-cover',
        variant === 'image' && (density === 'compact' ? 'size-8' : 'size-10'),
        className,
      ),
    },
  });
});

export interface ItemContentProps extends Omit<useRender.ComponentProps<'div'>, 'className'> {
  className?: string;
}

export const ItemContent = React.forwardRef<HTMLDivElement, ItemContentProps>(function ItemContent(
  { className, render, ...props },
  ref,
) {
  return useRender({
    defaultTagName: 'div',
    ref,
    render,
    props: {
      ...props,
      'data-city-item-content': '',
      className: cn('flex min-w-0 flex-1 flex-col gap-1 [overflow-wrap:anywhere]', className),
    },
  });
});

export interface ItemTitleProps extends Omit<useRender.ComponentProps<'div'>, 'className'> {
  className?: string;
}

export const ItemTitle = React.forwardRef<HTMLDivElement, ItemTitleProps>(function ItemTitle(
  { className, render, ...props },
  ref,
) {
  return useRender({
    defaultTagName: 'div',
    ref,
    render,
    props: {
      ...props,
      'data-city-item-title': '',
      className: cn(
        'flex min-w-0 flex-wrap items-center gap-2 text-sm leading-5 font-medium [overflow-wrap:anywhere]',
        className,
      ),
    },
  });
});

export interface ItemDescriptionProps extends Omit<useRender.ComponentProps<'p'>, 'className'> {
  className?: string;
}

export const ItemDescription = React.forwardRef<HTMLParagraphElement, ItemDescriptionProps>(
  function ItemDescription({ className, render, ...props }, ref) {
    return useRender({
      defaultTagName: 'p',
      ref,
      render,
      props: {
        ...props,
        'data-city-item-description': '',
        className: cn(
          'm-0 min-w-0 text-sm leading-5 text-city-muted-foreground [overflow-wrap:anywhere] [&_a]:underline [&_a]:underline-offset-4',
          className,
        ),
      },
    });
  },
);

export interface ItemActionsProps extends Omit<useRender.ComponentProps<'div'>, 'className'> {
  className?: string;
}

export const ItemActions = React.forwardRef<HTMLDivElement, ItemActionsProps>(function ItemActions(
  { className, render, ...props },
  ref,
) {
  return useRender({
    defaultTagName: 'div',
    ref,
    render,
    props: {
      ...props,
      'data-city-item-actions': '',
      className: cn('ml-auto flex max-w-full min-w-0 flex-wrap items-center gap-2', className),
    },
  });
});

export interface ItemHeaderProps extends Omit<useRender.ComponentProps<'div'>, 'className'> {
  className?: string;
}

export const ItemHeader = React.forwardRef<HTMLDivElement, ItemHeaderProps>(function ItemHeader(
  { className, render, ...props },
  ref,
) {
  return useRender({
    defaultTagName: 'div',
    ref,
    render,
    props: {
      ...props,
      'data-city-item-header': '',
      className: cn(
        'flex min-w-0 basis-full flex-wrap items-center justify-between gap-2',
        className,
      ),
    },
  });
});

export interface ItemFooterProps extends Omit<useRender.ComponentProps<'div'>, 'className'> {
  className?: string;
}

export const ItemFooter = React.forwardRef<HTMLDivElement, ItemFooterProps>(function ItemFooter(
  { className, render, ...props },
  ref,
) {
  return useRender({
    defaultTagName: 'div',
    ref,
    render,
    props: {
      ...props,
      'data-city-item-footer': '',
      className: cn(
        'flex min-w-0 basis-full flex-wrap items-center justify-between gap-2',
        className,
      ),
    },
  });
});

ItemRoot.displayName = 'Item.Root';
ItemGroup.displayName = 'Item.Group';
ItemSeparator.displayName = 'Item.Separator';
ItemMedia.displayName = 'Item.Media';
ItemContent.displayName = 'Item.Content';
ItemTitle.displayName = 'Item.Title';
ItemDescription.displayName = 'Item.Description';
ItemActions.displayName = 'Item.Actions';
ItemHeader.displayName = 'Item.Header';
ItemFooter.displayName = 'Item.Footer';

export const Item = {
  Root: ItemRoot,
  Group: ItemGroup,
  Separator: ItemSeparator,
  Media: ItemMedia,
  Content: ItemContent,
  Title: ItemTitle,
  Description: ItemDescription,
  Actions: ItemActions,
  Header: ItemHeader,
  Footer: ItemFooter,
};
