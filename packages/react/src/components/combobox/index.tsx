'use client';

import * as React from 'react';
import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import type {
  ComboboxArrowProps as BaseComboboxArrowProps,
  ComboboxBackdropProps as BaseComboboxBackdropProps,
  ComboboxChipProps as BaseComboboxChipProps,
  ComboboxChipRemoveProps as BaseComboboxChipRemoveProps,
  ComboboxChipsProps as BaseComboboxChipsProps,
  ComboboxClearProps as BaseComboboxClearProps,
  ComboboxCollectionProps as BaseComboboxCollectionProps,
  ComboboxEmptyProps as BaseComboboxEmptyProps,
  ComboboxGroupLabelProps as BaseComboboxGroupLabelProps,
  ComboboxGroupProps as BaseComboboxGroupProps,
  ComboboxIconProps as BaseComboboxIconProps,
  ComboboxInputGroupProps as BaseComboboxInputGroupProps,
  ComboboxInputProps as BaseComboboxInputProps,
  ComboboxItemIndicatorProps as BaseComboboxItemIndicatorProps,
  ComboboxItemProps as BaseComboboxItemProps,
  ComboboxLabelProps as BaseComboboxLabelProps,
  ComboboxListProps as BaseComboboxListProps,
  ComboboxPopupProps as BaseComboboxPopupProps,
  ComboboxPortalProps as BaseComboboxPortalProps,
  ComboboxPositionerProps as BaseComboboxPositionerProps,
  ComboboxRootProps as BaseComboboxRootProps,
  ComboboxStatusProps as BaseComboboxStatusProps,
  ComboboxTriggerProps as BaseComboboxTriggerProps,
  ComboboxValueProps as BaseComboboxValueProps,
} from '@base-ui/react/combobox';
import { Check, ChevronDown, X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { ControlSize } from '../../types';

function classes<State>(className: StateClassName<State> | undefined, defaults: string) {
  return (state: State) => cn(defaults, resolveClassName(className, state));
}

export type ComboboxRootProps<
  Value,
  Multiple extends boolean | undefined = false,
> = BaseComboboxRootProps<Value, Multiple> & {
  size?: ControlSize;
};
export type ComboboxLabelProps = BaseComboboxLabelProps;
export type ComboboxInputGroupProps = Omit<BaseComboboxInputGroupProps, 'size'> & {
  size?: ControlSize;
};
export type ComboboxInputProps = Omit<BaseComboboxInputProps, 'size'> & {
  size?: ControlSize;
};
export type ComboboxTriggerProps = BaseComboboxTriggerProps;
export type ComboboxValueProps = BaseComboboxValueProps;
export type ComboboxIconProps = BaseComboboxIconProps;
export type ComboboxClearProps = BaseComboboxClearProps;
export type ComboboxPortalProps = BaseComboboxPortalProps;
export type ComboboxBackdropProps = BaseComboboxBackdropProps;
export type ComboboxPositionerProps = BaseComboboxPositionerProps;
export type ComboboxPopupProps = BaseComboboxPopupProps;
export type ComboboxListProps = BaseComboboxListProps;
export type ComboboxItemProps = BaseComboboxItemProps;
export type ComboboxItemIndicatorProps = BaseComboboxItemIndicatorProps;
export type ComboboxGroupProps = BaseComboboxGroupProps;
export type ComboboxGroupLabelProps = BaseComboboxGroupLabelProps;
export type ComboboxArrowProps = BaseComboboxArrowProps;
export type ComboboxEmptyProps = BaseComboboxEmptyProps;
export type ComboboxStatusProps = BaseComboboxStatusProps;
export type ComboboxChipsProps = BaseComboboxChipsProps;
export type ComboboxChipProps = BaseComboboxChipProps;
export type ComboboxChipRemoveProps = BaseComboboxChipRemoveProps;
export type ComboboxCollectionProps = BaseComboboxCollectionProps;

const ComboboxSizeContext = React.createContext<ControlSize>('md');

const comboboxGroupSizeClasses: Record<ControlSize, string> = {
  sm: 'min-h-(--city-control-sm) px-2.5 text-xs',
  md: 'min-h-(--city-control-md) px-3 text-sm',
  lg: 'min-h-(--city-control-lg) px-3.5 text-sm',
};

const comboboxInputSizeClasses: Record<ControlSize, string> = {
  sm: 'h-(--city-control-sm)',
  md: 'h-(--city-control-md)',
  lg: 'h-(--city-control-lg)',
};

export function ComboboxRoot<Value, Multiple extends boolean | undefined = false>({
  size = 'md',
  ...props
}: ComboboxRootProps<Value, Multiple>): React.JSX.Element {
  return (
    <ComboboxSizeContext.Provider value={size}>
      <BaseCombobox.Root {...props} />
    </ComboboxSizeContext.Provider>
  );
}

ComboboxRoot.displayName = 'Combobox.Root';

export const ComboboxPortal = BaseCombobox.Portal;
export const ComboboxCollection = BaseCombobox.Collection;
export const ComboboxValue = BaseCombobox.Value;

export const ComboboxLabel = React.forwardRef<HTMLDivElement, ComboboxLabelProps>(
  ({ className, ...props }, ref) => (
    <BaseCombobox.Label
      {...props}
      ref={ref}
      className={classes(className, 'text-city-foreground mb-1.5 block text-sm font-medium')}
    />
  ),
);

export const ComboboxInputGroup = React.forwardRef<HTMLDivElement, ComboboxInputGroupProps>(
  ({ className, size: sizeProp, ...props }, ref) => {
    const rootSize = React.useContext(ComboboxSizeContext);
    const size = sizeProp ?? rootSize;

    return (
      <BaseCombobox.InputGroup
        {...props}
        ref={ref}
        data-city-size={size}
        className={classes(
          className,
          cn(
            'rounded-city-sm border-city-input bg-city-surface-raised text-city-foreground focus-within:ring-city-ring data-[invalid]:border-city-destructive data-[invalid]:focus-within:ring-city-destructive/30 flex w-full items-center gap-2 border transition-colors focus-within:ring-2 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            comboboxGroupSizeClasses[size],
          ),
        )}
      />
    );
  },
);

export const ComboboxInput = React.forwardRef<HTMLInputElement, ComboboxInputProps>(
  ({ className, size: sizeProp, ...props }, ref) => {
    const rootSize = React.useContext(ComboboxSizeContext);
    const size = sizeProp ?? rootSize;

    return (
      <BaseCombobox.Input
        {...props}
        ref={ref}
        data-city-size={size}
        className={classes(
          className,
          cn(
            'placeholder:text-city-muted-foreground min-w-0 flex-1 bg-transparent outline-none disabled:cursor-not-allowed',
            comboboxInputSizeClasses[size],
          ),
        )}
      />
    );
  },
);

export const ComboboxTrigger = React.forwardRef<HTMLButtonElement, ComboboxTriggerProps>(
  ({ className, children, ...props }, ref) => (
    <BaseCombobox.Trigger
      {...props}
      ref={ref}
      className={classes(
        className,
        'text-city-muted-foreground hover:text-city-foreground rounded-city-xs flex shrink-0 items-center justify-center transition-[color,transform] outline-none disabled:pointer-events-none data-[open]:rotate-180',
      )}
    >
      {children ?? <ChevronDown aria-hidden="true" size={16} strokeWidth={1.8} />}
    </BaseCombobox.Trigger>
  ),
);

export const ComboboxIcon = React.forwardRef<HTMLSpanElement, ComboboxIconProps>(
  ({ className, children, ...props }, ref) => (
    <BaseCombobox.Icon
      {...props}
      ref={ref}
      className={classes(className, 'text-city-muted-foreground flex shrink-0')}
    >
      {children ?? <ChevronDown aria-hidden="true" size={16} strokeWidth={1.8} />}
    </BaseCombobox.Icon>
  ),
);

export const ComboboxClear = React.forwardRef<HTMLButtonElement, ComboboxClearProps>(
  ({ className, children, 'aria-label': ariaLabel = 'Clear selection', ...props }, ref) => (
    <BaseCombobox.Clear
      {...props}
      ref={ref}
      aria-label={ariaLabel}
      className={classes(
        className,
        'text-city-muted-foreground hover:text-city-foreground rounded-city-xs hidden shrink-0 items-center justify-center transition-colors outline-none disabled:pointer-events-none data-[visible]:flex',
      )}
    >
      {children ?? <X aria-hidden="true" size={16} strokeWidth={1.8} />}
    </BaseCombobox.Clear>
  ),
);

export const ComboboxBackdrop = React.forwardRef<HTMLDivElement, ComboboxBackdropProps>(
  ({ className, ...props }, ref) => (
    <BaseCombobox.Backdrop
      {...props}
      ref={ref}
      className={classes(className, 'fixed inset-0 z-40')}
    />
  ),
);
export const ComboboxPositioner = React.forwardRef<HTMLDivElement, ComboboxPositionerProps>(
  ({ className, ...props }, ref) => (
    <BaseCombobox.Positioner {...props} ref={ref} className={classes(className, 'z-50')} />
  ),
);
export const ComboboxPopup = React.forwardRef<HTMLDivElement, ComboboxPopupProps>(
  ({ className, ...props }, ref) => (
    <BaseCombobox.Popup
      {...props}
      ref={ref}
      className={classes(
        className,
        'rounded-city-md border-city-border bg-city-surface-raised text-city-foreground shadow-city-popup min-w-(--anchor-width) overflow-visible border p-1 text-sm outline-none data-[side=bottom]:-mt-px data-[side=bottom]:rounded-t-none data-[side=left]:-mr-px data-[side=left]:rounded-r-none data-[side=right]:-ml-px data-[side=right]:rounded-l-none data-[side=top]:-mb-px data-[side=top]:rounded-b-none',
      )}
    />
  ),
);
export const ComboboxList = React.forwardRef<HTMLDivElement, ComboboxListProps>(
  ({ className, ...props }, ref) => (
    <BaseCombobox.List
      {...props}
      ref={ref}
      className={classes(className, 'max-h-72 overflow-y-auto py-1')}
    />
  ),
);
export const ComboboxItem = React.forwardRef<HTMLDivElement, ComboboxItemProps>(
  ({ className, ...props }, ref) => (
    <BaseCombobox.Item
      {...props}
      ref={ref}
      className={classes(
        className,
        'rounded-city-xs data-[highlighted]:bg-city-muted relative flex min-h-8 w-full cursor-default items-center py-1.5 pr-2 pl-8 text-left text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-45 data-[selected]:font-medium',
      )}
    />
  ),
);
export const ComboboxItemIndicator = React.forwardRef<HTMLSpanElement, ComboboxItemIndicatorProps>(
  ({ className, children, ...props }, ref) => (
    <BaseCombobox.ItemIndicator
      {...props}
      ref={ref}
      className={classes(className, 'text-city-foreground absolute left-2 flex items-center')}
    >
      {children ?? <Check aria-hidden="true" size={14} strokeWidth={2} />}
    </BaseCombobox.ItemIndicator>
  ),
);
export const ComboboxGroup = React.forwardRef<HTMLDivElement, ComboboxGroupProps>(
  ({ className, ...props }, ref) => (
    <BaseCombobox.Group {...props} ref={ref} className={classes(className, 'py-1')} />
  ),
);
export const ComboboxGroupLabel = React.forwardRef<HTMLDivElement, ComboboxGroupLabelProps>(
  ({ className, ...props }, ref) => (
    <BaseCombobox.GroupLabel
      {...props}
      ref={ref}
      className={classes(className, 'text-city-muted-foreground px-2 py-1.5 text-xs font-medium')}
    />
  ),
);
export const ComboboxEmpty = React.forwardRef<HTMLDivElement, ComboboxEmptyProps>(
  ({ className, children, ...props }, ref) => (
    <BaseCombobox.Empty
      {...props}
      ref={ref}
      className={classes(className, 'text-city-muted-foreground text-center text-sm')}
    >
      <span className="block px-3 py-6">{children}</span>
    </BaseCombobox.Empty>
  ),
);
export const ComboboxStatus = React.forwardRef<HTMLDivElement, ComboboxStatusProps>(
  ({ className, ...props }, ref) => (
    <BaseCombobox.Status {...props} ref={ref} className={classes(className, 'sr-only')} />
  ),
);
export const ComboboxChips = React.forwardRef<HTMLDivElement, ComboboxChipsProps>(
  ({ className, ...props }, ref) => (
    <BaseCombobox.Chips
      {...props}
      ref={ref}
      className={classes(className, 'flex w-full flex-wrap items-center gap-1 empty:hidden')}
    />
  ),
);
export const ComboboxChip = React.forwardRef<HTMLDivElement, ComboboxChipProps>(
  ({ className, ...props }, ref) => (
    <BaseCombobox.Chip
      {...props}
      ref={ref}
      className={classes(
        className,
        'rounded-city-xs border-city-border bg-city-muted text-city-foreground inline-flex items-center gap-1 border px-2 py-0.5 text-xs',
      )}
    />
  ),
);
export const ComboboxChipRemove = React.forwardRef<HTMLButtonElement, ComboboxChipRemoveProps>(
  ({ className, children, 'aria-label': ariaLabel = 'Remove selection', ...props }, ref) => (
    <BaseCombobox.ChipRemove
      {...props}
      ref={ref}
      aria-label={ariaLabel}
      className={classes(
        className,
        'text-city-muted-foreground hover:text-city-foreground rounded-city-xs',
      )}
    >
      {children ?? <X aria-hidden="true" size={12} strokeWidth={2} />}
    </BaseCombobox.ChipRemove>
  ),
);
export const ComboboxArrow = React.forwardRef<HTMLDivElement, ComboboxArrowProps>(
  ({ className, ...props }, ref) => (
    <BaseCombobox.Arrow
      {...props}
      ref={ref}
      className={classes(
        className,
        'border-city-border bg-city-surface-raised size-2 rotate-45 data-[side=bottom]:-top-1 data-[side=bottom]:border-t data-[side=bottom]:border-l data-[side=left]:-right-1 data-[side=left]:border-t data-[side=left]:border-r data-[side=right]:-left-1 data-[side=right]:border-b data-[side=right]:border-l data-[side=top]:-bottom-1 data-[side=top]:border-r data-[side=top]:border-b',
      )}
    />
  ),
);

export const Combobox = {
  Root: ComboboxRoot,
  Label: ComboboxLabel,
  InputGroup: ComboboxInputGroup,
  Input: ComboboxInput,
  Trigger: ComboboxTrigger,
  Value: ComboboxValue,
  Icon: ComboboxIcon,
  Clear: ComboboxClear,
  Portal: ComboboxPortal,
  Backdrop: ComboboxBackdrop,
  Positioner: ComboboxPositioner,
  Popup: ComboboxPopup,
  List: ComboboxList,
  Item: ComboboxItem,
  ItemIndicator: ComboboxItemIndicator,
  Group: ComboboxGroup,
  GroupLabel: ComboboxGroupLabel,
  Empty: ComboboxEmpty,
  Status: ComboboxStatus,
  Chips: ComboboxChips,
  Chip: ComboboxChip,
  ChipRemove: ComboboxChipRemove,
  Arrow: ComboboxArrow,
  Collection: ComboboxCollection,
};
