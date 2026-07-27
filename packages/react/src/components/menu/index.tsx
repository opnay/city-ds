'use client';

import * as React from 'react';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import type {
  MenuArrowProps as BaseMenuArrowProps,
  MenuBackdropProps as BaseMenuBackdropProps,
  MenuCheckboxItemIndicatorProps as BaseMenuCheckboxItemIndicatorProps,
  MenuCheckboxItemProps as BaseMenuCheckboxItemProps,
  MenuGroupLabelProps as BaseMenuGroupLabelProps,
  MenuGroupProps as BaseMenuGroupProps,
  MenuItemProps as BaseMenuItemProps,
  MenuLinkItemProps as BaseMenuLinkItemProps,
  MenuPopupProps as BaseMenuPopupProps,
  MenuPortalProps as BaseMenuPortalProps,
  MenuPositionerProps as BaseMenuPositionerProps,
  MenuRadioGroupProps as BaseMenuRadioGroupProps,
  MenuRadioItemIndicatorProps as BaseMenuRadioItemIndicatorProps,
  MenuRadioItemProps as BaseMenuRadioItemProps,
  MenuRootProps as BaseMenuRootProps,
  MenuSubmenuRootProps as BaseMenuSubmenuRootProps,
  MenuSubmenuTriggerProps as BaseMenuSubmenuTriggerProps,
  MenuTriggerProps as BaseMenuTriggerProps,
  MenuViewportProps as BaseMenuViewportProps,
} from '@base-ui/react/menu';
import { Check, ChevronRight, ChevronUp, Circle } from 'lucide-react';
import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { Density } from '../../types';

function classes<State>(className: StateClassName<State> | undefined, defaults: string) {
  return (state: State) => cn(defaults, resolveClassName(className, state));
}

const itemStyles =
  'rounded-city-xs hover:bg-city-accent hover:text-city-accent-foreground data-[highlighted]:bg-city-accent data-[highlighted]:text-city-accent-foreground relative flex w-full cursor-default items-center text-left transition-colors outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-45';
const itemDensityStyles: Record<Density, string> = {
  comfortable: 'min-h-8 gap-2 py-1.5 pr-2 pl-2 text-sm',
  compact: 'min-h-7 gap-1.5 py-1 pr-1.5 pl-1.5 text-xs',
};
const selectionItemDensityStyles: Record<Density, string> = {
  comfortable: 'pl-8',
  compact: 'pl-7',
};
const itemVariantStyles = {
  default: '',
  destructive:
    'text-city-destructive hover:text-city-destructive data-[highlighted]:text-city-destructive',
} as const;
const MenuScrollContext = React.createContext(false);
const MenuDensityContext = React.createContext<Density>('comfortable');

export type MenuRootProps<Payload = unknown> = BaseMenuRootProps<Payload> & {
  density?: Density;
};
export type MenuTriggerProps<Payload = unknown> = BaseMenuTriggerProps<Payload>;
export type MenuPortalProps = BaseMenuPortalProps;
export type MenuBackdropProps = BaseMenuBackdropProps;
export type MenuPositionerProps = BaseMenuPositionerProps;
export type MenuPopupProps = BaseMenuPopupProps;
export type MenuViewportProps = BaseMenuViewportProps;
export type MenuItemVariant = keyof typeof itemVariantStyles;
export type MenuItemProps = BaseMenuItemProps & { variant?: MenuItemVariant };
export type MenuLinkItemProps = BaseMenuLinkItemProps & { variant?: MenuItemVariant };
export type MenuCheckboxItemProps = BaseMenuCheckboxItemProps;
export type MenuCheckboxItemIndicatorProps = BaseMenuCheckboxItemIndicatorProps;
export type MenuRadioGroupProps = BaseMenuRadioGroupProps;
export type MenuRadioItemProps = BaseMenuRadioItemProps;
export type MenuRadioItemIndicatorProps = BaseMenuRadioItemIndicatorProps;
export type MenuGroupProps = BaseMenuGroupProps;
export type MenuGroupLabelProps = BaseMenuGroupLabelProps;
export type MenuSeparatorProps = React.ComponentPropsWithoutRef<typeof BaseMenu.Separator>;
export type MenuSubmenuRootProps = BaseMenuSubmenuRootProps;
export type MenuSubmenuTriggerProps = BaseMenuSubmenuTriggerProps;
export type MenuArrowProps = BaseMenuArrowProps;
export interface MenuScrollUpIndicatorState {
  visible: boolean;
}
export type MenuScrollUpIndicatorProps = Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'className'
> & {
  className?: StateClassName<MenuScrollUpIndicatorState>;
};

export function MenuRoot<Payload = unknown>({
  density = 'comfortable',
  ...props
}: MenuRootProps<Payload>): React.JSX.Element {
  return (
    <MenuDensityContext.Provider value={density}>
      <BaseMenu.Root {...props} />
    </MenuDensityContext.Provider>
  );
}

MenuRoot.displayName = 'Menu.Root';

export const MenuPortal = BaseMenu.Portal;
export const MenuSubmenuRoot = BaseMenu.SubmenuRoot;

export const MenuTrigger = React.forwardRef<HTMLButtonElement, MenuTriggerProps>(
  ({ className, render, ...props }, ref) => {
    const density = React.useContext(MenuDensityContext);

    return (
      <BaseMenu.Trigger
        {...props}
        ref={ref}
        render={render}
        data-city-density={density}
        className={classes(
          className,
          render == null
            ? cn(
                'rounded-city-sm border-city-input bg-city-surface-raised text-city-foreground hover:bg-city-accent hover:text-city-accent-foreground active:bg-city-accent-active focus-visible:ring-city-ring inline-flex items-center justify-center border font-medium transition-colors outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
                density === 'compact'
                  ? 'h-(--city-control-sm) gap-1.5 px-2.5 text-xs'
                  : 'h-(--city-control-md) gap-2 px-3 text-sm',
              )
            : '',
        )}
      />
    );
  },
);

export const MenuBackdrop = React.forwardRef<HTMLDivElement, MenuBackdropProps>(
  ({ className, ...props }, ref) => (
    <BaseMenu.Backdrop {...props} ref={ref} className={classes(className, 'fixed inset-0 z-40')} />
  ),
);

export const MenuPositioner = React.forwardRef<HTMLDivElement, MenuPositionerProps>(
  ({ className, ...props }, ref) => (
    <BaseMenu.Positioner {...props} ref={ref} className={classes(className, 'z-50')} />
  ),
);

export const MenuPopup = React.forwardRef<HTMLDivElement, MenuPopupProps>(
  ({ children, className, onScroll, tabIndex = 0, ...props }, ref) => {
    const [canScrollUp, setCanScrollUp] = React.useState(false);
    const density = React.useContext(MenuDensityContext);

    return (
      <MenuScrollContext.Provider value={canScrollUp}>
        <BaseMenu.Popup
          {...props}
          ref={ref}
          tabIndex={tabIndex}
          data-city-density={density}
          onScroll={(event) => {
            setCanScrollUp(event.currentTarget.scrollTop > 0);
            onScroll?.(event);
          }}
          className={classes(
            className,
            cn(
              'rounded-city-md border-city-border bg-city-surface-raised text-city-foreground shadow-city-popup max-h-(--available-height) min-w-44 overflow-y-auto overscroll-contain border outline-none',
              density === 'compact' ? 'p-0.5 text-xs' : 'p-1 text-sm',
            ),
          )}
        >
          {children}
        </BaseMenu.Popup>
      </MenuScrollContext.Provider>
    );
  },
);

export const MenuViewport = React.forwardRef<HTMLDivElement, MenuViewportProps>(
  ({ className, ...props }, ref) => (
    <BaseMenu.Viewport {...props} ref={ref} className={classes(className, '')} />
  ),
);

export const MenuItem = React.forwardRef<HTMLElement, MenuItemProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const density = React.useContext(MenuDensityContext);

    return (
      <BaseMenu.Item
        {...props}
        ref={ref}
        data-city-density={density}
        className={classes(
          className,
          cn(itemStyles, itemDensityStyles[density], itemVariantStyles[variant]),
        )}
      />
    );
  },
);

export const MenuLinkItem = React.forwardRef<Element, MenuLinkItemProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const density = React.useContext(MenuDensityContext);

    return (
      <BaseMenu.LinkItem
        {...props}
        ref={ref}
        data-city-density={density}
        className={classes(
          className,
          cn(itemStyles, itemDensityStyles[density], itemVariantStyles[variant]),
        )}
      />
    );
  },
);

export const MenuCheckboxItem = React.forwardRef<HTMLElement, MenuCheckboxItemProps>(
  ({ className, ...props }, ref) => {
    const density = React.useContext(MenuDensityContext);

    return (
      <BaseMenu.CheckboxItem
        {...props}
        ref={ref}
        data-city-density={density}
        className={classes(
          className,
          cn(itemStyles, itemDensityStyles[density], selectionItemDensityStyles[density]),
        )}
      />
    );
  },
);

export const MenuCheckboxItemIndicator = React.forwardRef<
  HTMLSpanElement,
  MenuCheckboxItemIndicatorProps
>(({ className, children, ...props }, ref) => (
  <BaseMenu.CheckboxItemIndicator
    {...props}
    ref={ref}
    className={classes(className, 'text-city-foreground absolute left-2 flex items-center')}
  >
    {children ?? <Check aria-hidden="true" size={14} strokeWidth={2} />}
  </BaseMenu.CheckboxItemIndicator>
));

export const MenuRadioGroup = BaseMenu.RadioGroup;

export const MenuRadioItem = React.forwardRef<HTMLElement, MenuRadioItemProps>(
  ({ className, ...props }, ref) => {
    const density = React.useContext(MenuDensityContext);

    return (
      <BaseMenu.RadioItem
        {...props}
        ref={ref}
        data-city-density={density}
        className={classes(
          className,
          cn(itemStyles, itemDensityStyles[density], selectionItemDensityStyles[density]),
        )}
      />
    );
  },
);

export const MenuRadioItemIndicator = React.forwardRef<
  HTMLSpanElement,
  MenuRadioItemIndicatorProps
>(({ className, children, ...props }, ref) => (
  <BaseMenu.RadioItemIndicator
    {...props}
    ref={ref}
    className={classes(className, 'text-city-foreground absolute left-2 flex items-center')}
  >
    {children ?? <Circle aria-hidden="true" size={8} fill="currentColor" strokeWidth={0} />}
  </BaseMenu.RadioItemIndicator>
));

export const MenuGroup = React.forwardRef<HTMLDivElement, MenuGroupProps>(
  ({ className, ...props }, ref) => {
    const density = React.useContext(MenuDensityContext);

    return (
      <BaseMenu.Group
        {...props}
        ref={ref}
        data-city-density={density}
        className={classes(className, density === 'compact' ? 'py-0.5' : 'py-1')}
      />
    );
  },
);

export const MenuGroupLabel = React.forwardRef<HTMLDivElement, MenuGroupLabelProps>(
  ({ className, ...props }, ref) => {
    const density = React.useContext(MenuDensityContext);

    return (
      <BaseMenu.GroupLabel
        {...props}
        ref={ref}
        data-city-density={density}
        className={classes(
          className,
          cn(
            'text-city-muted-foreground font-medium',
            density === 'compact' ? 'px-1.5 py-1 text-[0.625rem]' : 'px-2 py-1.5 text-xs',
          ),
        )}
      />
    );
  },
);

export const MenuSeparator = React.forwardRef<HTMLDivElement, MenuSeparatorProps>(
  ({ className, ...props }, ref) => {
    const density = React.useContext(MenuDensityContext);

    return (
      <BaseMenu.Separator
        {...props}
        ref={ref}
        data-city-density={density}
        className={classes(
          className,
          cn('bg-city-border h-px', density === 'compact' ? 'my-0.5' : 'my-1'),
        )}
      />
    );
  },
);

export const MenuSubmenuTrigger = React.forwardRef<HTMLElement, MenuSubmenuTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const density = React.useContext(MenuDensityContext);

    return (
      <BaseMenu.SubmenuTrigger
        {...props}
        ref={ref}
        data-city-density={density}
        className={classes(
          className,
          cn(itemStyles, itemDensityStyles[density], density === 'compact' ? 'pr-0.5' : 'pr-1'),
        )}
      >
        <span className="min-w-0 flex-1 truncate">{children}</span>
        <ChevronRight
          aria-hidden="true"
          className="text-city-muted-foreground ml-auto"
          size={density === 'compact' ? 14 : 16}
        />
      </BaseMenu.SubmenuTrigger>
    );
  },
);

export const MenuArrow = React.forwardRef<HTMLDivElement, MenuArrowProps>(
  ({ className, ...props }, ref) => (
    <BaseMenu.Arrow
      {...props}
      ref={ref}
      className={classes(
        className,
        'border-city-border bg-city-surface-raised size-2 rotate-45 border-t border-l',
      )}
    />
  ),
);

export const MenuScrollUpIndicator = React.forwardRef<HTMLDivElement, MenuScrollUpIndicatorProps>(
  ({ className, children, ...props }, ref) => {
    const visible = React.useContext(MenuScrollContext);
    const density = React.useContext(MenuDensityContext);
    const state = { visible };

    return (
      <div
        {...props}
        ref={ref}
        aria-hidden="true"
        data-visible={visible ? '' : undefined}
        className={cn(
          'pointer-events-none sticky top-0 z-10 h-0 w-full opacity-0 transition-opacity data-[visible]:opacity-100 motion-reduce:transition-none',
          resolveClassName(className, state),
        )}
      >
        <span
          className={cn(
            'border-city-border bg-city-surface-raised text-city-muted-foreground absolute -inset-x-1 -top-1 flex items-center justify-center border-b shadow-sm',
            density === 'compact' ? 'h-7' : 'h-8',
          )}
        >
          {children ?? <ChevronUp aria-hidden="true" size={16} />}
        </span>
      </div>
    );
  },
);

export const Menu = {
  Root: MenuRoot,
  Trigger: MenuTrigger,
  Portal: MenuPortal,
  Backdrop: MenuBackdrop,
  Positioner: MenuPositioner,
  Popup: MenuPopup,
  Viewport: MenuViewport,
  Item: MenuItem,
  LinkItem: MenuLinkItem,
  CheckboxItem: MenuCheckboxItem,
  CheckboxItemIndicator: MenuCheckboxItemIndicator,
  RadioGroup: MenuRadioGroup,
  RadioItem: MenuRadioItem,
  RadioItemIndicator: MenuRadioItemIndicator,
  Group: MenuGroup,
  GroupLabel: MenuGroupLabel,
  Separator: MenuSeparator,
  SubmenuRoot: MenuSubmenuRoot,
  SubmenuTrigger: MenuSubmenuTrigger,
  Arrow: MenuArrow,
  ScrollUpIndicator: MenuScrollUpIndicator,
};
