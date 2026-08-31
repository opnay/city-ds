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
import {
  outlineFrameBaseClasses,
  outlineFrameHeightClasses,
  outlineFrameSegmentWidthClasses,
  outlineFrameTextClasses,
  outlineFrameValuePaddingClasses,
} from '../../lib/outline-frame';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { ControlSize } from '../../types';

function classes<State>(className: StateClassName<State> | undefined, defaults: string) {
  return (state: State) => cn(defaults, resolveClassName(className, state));
}

export type SelectRootProps<
  Value,
  Multiple extends boolean | undefined = false,
> = BaseSelectRootProps<Value, Multiple> & {
  size?: ControlSize;
};
export type SelectLabelProps = BaseSelectLabelProps;
export type SelectTriggerProps = Omit<BaseSelectTriggerProps, 'size'> & {
  size?: ControlSize;
};
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

const SelectSizeContext = React.createContext<ControlSize>('md');
const SelectTriggerSizeContext = React.createContext<ControlSize | null>(null);

export function SelectRoot<Value, Multiple extends boolean | undefined = false>({
  size = 'md',
  ...props
}: SelectRootProps<Value, Multiple>): React.JSX.Element {
  return (
    <SelectSizeContext.Provider value={size}>
      <BaseSelect.Root {...props} />
    </SelectSizeContext.Provider>
  );
}

SelectRoot.displayName = 'Select.Root';

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
  ({ className, size: sizeProp, ...props }, ref) => {
    const rootSize = React.useContext(SelectSizeContext);
    const size = sizeProp ?? rootSize;

    return (
      <SelectTriggerSizeContext.Provider value={size}>
        <BaseSelect.Trigger
          {...props}
          ref={ref}
          data-city-size={size}
          className={classes(
            className,
            cn(
              outlineFrameBaseClasses,
              outlineFrameHeightClasses[size],
              outlineFrameTextClasses[size],
              'group data-[placeholder]:text-city-muted-foreground p-0 text-left outline-none disabled:pointer-events-none',
            ),
          )}
        />
      </SelectTriggerSizeContext.Provider>
    );
  },
);

SelectTrigger.displayName = 'Select.Trigger';

export const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ className, ...props }, ref) => {
    const rootSize = React.useContext(SelectSizeContext);
    const triggerSize = React.useContext(SelectTriggerSizeContext);
    const size = triggerSize ?? rootSize;

    return (
      <BaseSelect.Value
        {...props}
        ref={ref}
        data-city-size={size}
        className={classes(
          className,
          cn('min-w-0 flex-1 truncate text-left', outlineFrameValuePaddingClasses[size]),
        )}
      />
    );
  },
);

export const SelectIcon = React.forwardRef<HTMLSpanElement, SelectIconProps>(
  ({ className, children, ...props }, ref) => {
    const rootSize = React.useContext(SelectSizeContext);
    const triggerSize = React.useContext(SelectTriggerSizeContext);
    const size = triggerSize ?? rootSize;

    return (
      <BaseSelect.Icon
        {...props}
        ref={ref}
        data-city-select-icon=""
        data-city-size={size}
        className={classes(
          className,
          cn(
            'border-city-border text-city-muted-foreground group-hover:bg-city-accent group-hover:text-city-accent-foreground group-active:bg-city-accent-active flex h-full shrink-0 items-center justify-center self-stretch border-l transition-colors [&>svg]:transition-transform data-[popup-open]:[&>svg]:rotate-180',
            outlineFrameSegmentWidthClasses[size],
          ),
        )}
      >
        {children ?? <ChevronDown aria-hidden="true" size={16} strokeWidth={1.8} />}
      </BaseSelect.Icon>
    );
  },
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
  ({ alignItemWithTrigger = false, className, ...props }, ref) => (
    <BaseSelect.Positioner
      {...props}
      ref={ref}
      alignItemWithTrigger={alignItemWithTrigger}
      className={classes(className, 'z-50')}
    />
  ),
);

export const SelectPopup = React.forwardRef<HTMLDivElement, SelectPopupProps>(
  ({ className, ...props }, ref) => (
    <BaseSelect.Popup
      {...props}
      ref={ref}
      className={classes(
        className,
        'rounded-city-md border-city-border bg-city-background text-city-foreground shadow-city-popup min-w-(--anchor-width) overflow-visible border p-1 text-sm outline-none data-[side=bottom]:-mt-px data-[side=bottom]:rounded-t-none data-[side=left]:-mr-px data-[side=left]:rounded-r-none data-[side=right]:-ml-px data-[side=right]:rounded-l-none data-[side=top]:-mb-px data-[side=top]:rounded-b-none',
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
        'rounded-city-xs data-[highlighted]:bg-city-accent-hover relative flex min-h-8 w-full cursor-default items-center py-1.5 pr-2 pl-8 text-left text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-45 data-[selected]:font-medium',
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
        'border-city-border bg-city-background size-2 rotate-45 data-[side=bottom]:-top-1 data-[side=bottom]:border-t data-[side=bottom]:border-l data-[side=left]:-right-1 data-[side=left]:border-t data-[side=left]:border-r data-[side=right]:-left-1 data-[side=right]:border-b data-[side=right]:border-l data-[side=top]:-bottom-1 data-[side=top]:border-r data-[side=top]:border-b',
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
