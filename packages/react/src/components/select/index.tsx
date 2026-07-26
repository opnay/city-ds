'use client';

import * as React from 'react';
import { Select as BaseSelect } from '@base-ui/react/select';
import type {
  SelectArrowProps as BaseSelectArrowProps,
  SelectBackdropProps as BaseSelectBackdropProps,
  SelectGroupLabelProps as BaseSelectGroupLabelProps,
  SelectGroupProps as BaseSelectGroupProps,
  SelectIconProps as BaseSelectIconProps,
  SelectItemIndicatorProps as BaseSelectItemIndicatorProps,
  SelectItemProps as BaseSelectItemProps,
  SelectItemTextProps as BaseSelectItemTextProps,
  SelectLabelProps as BaseSelectLabelProps,
  SelectListProps as BaseSelectListProps,
  SelectPopupProps as BaseSelectPopupProps,
  SelectPortalProps as BaseSelectPortalProps,
  SelectPositionerProps as BaseSelectPositionerProps,
  SelectRootProps as BaseSelectRootProps,
  SelectScrollDownArrowProps as BaseSelectScrollDownArrowProps,
  SelectScrollUpArrowProps as BaseSelectScrollUpArrowProps,
  SelectTriggerProps as BaseSelectTriggerProps,
  SelectValueProps as BaseSelectValueProps,
} from '@base-ui/react/select';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';

function classes<State>(className: StateClassName<State> | undefined, defaults: string) {
  return (state: State) => cn(defaults, resolveClassName(className, state));
}

export type SelectRootProps<
  Value,
  Multiple extends boolean | undefined = false,
> = BaseSelectRootProps<Value, Multiple>;
export type SelectLabelProps = BaseSelectLabelProps;
export type SelectTriggerProps = BaseSelectTriggerProps;
export type SelectValueProps = BaseSelectValueProps;
export type SelectIconProps = BaseSelectIconProps;
export type SelectPortalProps = BaseSelectPortalProps;
export type SelectBackdropProps = BaseSelectBackdropProps;
export type SelectPositionerProps = BaseSelectPositionerProps;
export type SelectPopupProps = BaseSelectPopupProps;
export type SelectListProps = BaseSelectListProps;
export type SelectItemProps = BaseSelectItemProps;
export type SelectItemIndicatorProps = BaseSelectItemIndicatorProps;
export type SelectItemTextProps = BaseSelectItemTextProps;
export type SelectGroupProps = BaseSelectGroupProps;
export type SelectGroupLabelProps = BaseSelectGroupLabelProps;
export type SelectArrowProps = BaseSelectArrowProps;
export type SelectScrollUpArrowProps = BaseSelectScrollUpArrowProps;
export type SelectScrollDownArrowProps = BaseSelectScrollDownArrowProps;
export type SelectSeparatorProps = React.ComponentPropsWithoutRef<typeof BaseSelect.Separator>;

export const SelectRoot = BaseSelect.Root;
export const SelectPortal = BaseSelect.Portal;

export const SelectLabel = React.forwardRef<HTMLDivElement, SelectLabelProps>(
  ({ className, ...props }, ref) => (
    <BaseSelect.Label
      {...props}
      ref={ref}
      className={classes(className, 'text-city-foreground mb-1.5 block text-sm font-medium')}
    />
  ),
);

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, ...props }, ref) => (
    <BaseSelect.Trigger
      {...props}
      ref={ref}
      className={classes(
        className,
        'rounded-city-sm border-city-input bg-city-surface-raised text-city-foreground hover:bg-city-accent active:bg-city-accent-active focus-visible:ring-city-ring data-[placeholder]:text-city-muted-foreground flex h-(--city-control-md) w-full items-center justify-between gap-2 border px-3 text-sm transition-colors outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
      )}
    />
  ),
);

export const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ className, ...props }, ref) => (
    <BaseSelect.Value
      {...props}
      ref={ref}
      className={classes(className, 'min-w-0 flex-1 truncate text-left')}
    />
  ),
);

export const SelectIcon = React.forwardRef<HTMLSpanElement, SelectIconProps>(
  ({ className, children, ...props }, ref) => (
    <BaseSelect.Icon
      {...props}
      ref={ref}
      className={classes(
        className,
        'text-city-muted-foreground flex shrink-0 transition-transform data-[open]:rotate-180',
      )}
    >
      {children ?? <ChevronDown aria-hidden="true" size={16} strokeWidth={1.8} />}
    </BaseSelect.Icon>
  ),
);

export const SelectBackdrop = React.forwardRef<HTMLDivElement, SelectBackdropProps>(
  ({ className, ...props }, ref) => (
    <BaseSelect.Backdrop
      {...props}
      ref={ref}
      className={classes(className, 'fixed inset-0 z-40')}
    />
  ),
);

export const SelectPositioner = React.forwardRef<HTMLDivElement, SelectPositionerProps>(
  ({ className, ...props }, ref) => (
    <BaseSelect.Positioner {...props} ref={ref} className={classes(className, 'z-50')} />
  ),
);

export const SelectPopup = React.forwardRef<HTMLDivElement, SelectPopupProps>(
  ({ className, ...props }, ref) => (
    <BaseSelect.Popup
      {...props}
      ref={ref}
      className={classes(
        className,
        'rounded-city-md border-city-border bg-city-surface-raised text-city-foreground shadow-city-popup min-w-40 overflow-hidden border p-1 text-sm outline-none',
      )}
    />
  ),
);

export const SelectList = React.forwardRef<HTMLDivElement, SelectListProps>(
  ({ className, ...props }, ref) => (
    <BaseSelect.List
      {...props}
      ref={ref}
      className={classes(className, 'max-h-72 overflow-y-auto py-1')}
    />
  ),
);

export const SelectItem = React.forwardRef<HTMLElement, SelectItemProps>(
  ({ className, ...props }, ref) => (
    <BaseSelect.Item
      {...props}
      ref={ref}
      className={classes(
        className,
        'rounded-city-xs data-[highlighted]:bg-city-muted relative flex min-h-8 w-full cursor-default items-center py-1.5 pr-2 pl-8 text-left text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-45 data-[selected]:font-medium',
      )}
    />
  ),
);

export const SelectItemIndicator = React.forwardRef<HTMLSpanElement, SelectItemIndicatorProps>(
  ({ className, children, ...props }, ref) => (
    <BaseSelect.ItemIndicator
      {...props}
      ref={ref}
      className={classes(className, 'text-city-foreground absolute left-2 flex items-center')}
    >
      {children ?? <Check aria-hidden="true" size={14} strokeWidth={2} />}
    </BaseSelect.ItemIndicator>
  ),
);

export const SelectItemText = React.forwardRef<HTMLDivElement, SelectItemTextProps>(
  ({ className, ...props }, ref) => (
    <BaseSelect.ItemText
      {...props}
      ref={ref}
      className={classes(className, 'min-w-0 flex-1 truncate')}
    />
  ),
);

export const SelectGroup = React.forwardRef<HTMLDivElement, SelectGroupProps>(
  ({ className, ...props }, ref) => (
    <BaseSelect.Group {...props} ref={ref} className={classes(className, 'py-1')} />
  ),
);

export const SelectGroupLabel = React.forwardRef<HTMLDivElement, SelectGroupLabelProps>(
  ({ className, ...props }, ref) => (
    <BaseSelect.GroupLabel
      {...props}
      ref={ref}
      className={classes(className, 'text-city-muted-foreground px-2 py-1.5 text-xs font-medium')}
    />
  ),
);

export const SelectSeparator = React.forwardRef<HTMLDivElement, SelectSeparatorProps>(
  ({ className, ...props }, ref) => (
    <BaseSelect.Separator
      {...props}
      ref={ref}
      className={classes(className, 'bg-city-border my-1 h-px')}
    />
  ),
);

export const SelectArrow = React.forwardRef<HTMLDivElement, SelectArrowProps>(
  ({ className, ...props }, ref) => (
    <BaseSelect.Arrow
      {...props}
      ref={ref}
      className={classes(
        className,
        'border-city-border bg-city-surface-raised size-2 rotate-45 border-t border-l',
      )}
    />
  ),
);

export const SelectScrollUpArrow = React.forwardRef<HTMLDivElement, SelectScrollUpArrowProps>(
  ({ className, children, ...props }, ref) => (
    <BaseSelect.ScrollUpArrow
      {...props}
      ref={ref}
      className={classes(
        className,
        'text-city-muted-foreground flex h-7 items-center justify-center',
      )}
    >
      {children ?? <ChevronUp aria-hidden="true" size={16} />}
    </BaseSelect.ScrollUpArrow>
  ),
);

export const SelectScrollDownArrow = React.forwardRef<HTMLDivElement, SelectScrollDownArrowProps>(
  ({ className, children, ...props }, ref) => (
    <BaseSelect.ScrollDownArrow
      {...props}
      ref={ref}
      className={classes(
        className,
        'text-city-muted-foreground flex h-7 items-center justify-center',
      )}
    >
      {children ?? <ChevronDown aria-hidden="true" size={16} />}
    </BaseSelect.ScrollDownArrow>
  ),
);

export const Select = {
  Root: SelectRoot,
  Label: SelectLabel,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Icon: SelectIcon,
  Portal: SelectPortal,
  Backdrop: SelectBackdrop,
  Positioner: SelectPositioner,
  Popup: SelectPopup,
  List: SelectList,
  Item: SelectItem,
  ItemIndicator: SelectItemIndicator,
  ItemText: SelectItemText,
  Group: SelectGroup,
  GroupLabel: SelectGroupLabel,
  Separator: SelectSeparator,
  Arrow: SelectArrow,
  ScrollUpArrow: SelectScrollUpArrow,
  ScrollDownArrow: SelectScrollDownArrow,
};
