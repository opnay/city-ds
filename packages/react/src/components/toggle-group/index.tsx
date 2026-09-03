'use client';

import * as React from 'react';
import {
  Toggle as BaseToggle,
  type ToggleProps as BaseToggleProps,
  type ToggleState,
} from '@base-ui/react/toggle';
import {
  ToggleGroup as BaseToggleGroup,
  type ToggleGroupProps as BaseToggleGroupProps,
  type ToggleGroupState,
} from '@base-ui/react/toggle-group';

import { atomicRectShapeClasses } from '../../lib/atomic-shape';
import { atomicControlTextClasses } from '../../lib/atomic-typography';
import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { ControlSize } from '../../types';
import { BUTTON_VARIANTS, type ButtonVariant } from '../button';

export const TOGGLE_GROUP_VARIANTS = BUTTON_VARIANTS;
export type ToggleGroupVariant = ButtonVariant;

type ToggleGroupStyleContextValue = {
  size: ControlSize;
  variant: ToggleGroupVariant;
};

const ToggleGroupStyleContext = React.createContext<ToggleGroupStyleContextValue>({
  size: 'md',
  variant: 'ghost',
});

export interface ToggleGroupProps<Value extends string = string> extends Omit<
  BaseToggleGroupProps<Value>,
  'className'
> {
  className?: StateClassName<ToggleGroupState>;
  size?: ControlSize;
  variant?: ToggleGroupVariant;
}

const itemSizeClasses: Record<ControlSize, string> = {
  xsm: 'h-(--city-control-xsm) gap-1 px-1.5',
  sm: 'h-(--city-control-sm) gap-1.5 px-2',
  md: 'h-(--city-control-md) gap-1.5 px-2.5',
  lg: 'h-(--city-control-lg) gap-2 px-3',
  xlg: 'h-(--city-control-xlg) gap-2 px-4',
};

const itemVariantClasses: Record<ToggleGroupVariant, string> = {
  primary:
    'bg-city-primary text-city-primary-foreground hover:bg-city-primary-hover active:bg-city-primary-active data-[pressed]:bg-city-primary-active',
  secondary:
    'bg-city-accent text-city-accent-foreground hover:bg-city-accent-hover active:bg-city-accent-active data-[pressed]:bg-city-inverse data-[pressed]:text-city-inverse-foreground',
  outline:
    'border border-city-border bg-city-background text-city-foreground hover:bg-city-accent active:bg-city-accent-active data-[pressed]:bg-city-inverse data-[pressed]:text-city-inverse-foreground',
  ghost:
    'text-city-foreground hover:bg-city-accent active:bg-city-accent-active data-[pressed]:underline data-[pressed]:underline-offset-4',
  destructive:
    'bg-city-destructive text-city-destructive-foreground hover:bg-city-destructive-hover active:bg-city-destructive-active data-[pressed]:bg-city-destructive-active',
};

const ToggleGroupRootBase = React.forwardRef(function ToggleGroupRoot<
  Value extends string = string,
>(
  {
    className,
    size = 'md',
    variant = 'ghost',
    orientation = 'horizontal',
    ...props
  }: ToggleGroupProps<Value>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const styleContext = React.useMemo(() => ({ size, variant }), [size, variant]);

  return (
    <ToggleGroupStyleContext.Provider value={styleContext}>
      <BaseToggleGroup
        {...props}
        ref={ref}
        data-city-size={size}
        data-city-variant={variant}
        orientation={orientation}
        className={(state) =>
          cn(
            'rounded-city-md bg-city-muted inline-flex gap-1 p-1 data-[disabled]:cursor-not-allowed',
            orientation === 'vertical' && 'flex-col',
            resolveClassName(className, state),
          )
        }
      />
    </ToggleGroupStyleContext.Provider>
  );
});

ToggleGroupRootBase.displayName = 'ToggleGroup.Root';

export const ToggleGroupRoot = ToggleGroupRootBase as <Value extends string = string>(
  props: ToggleGroupProps<Value> & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element;

export interface ToggleGroupItemProps<Value extends string = string> extends Omit<
  BaseToggleProps<Value>,
  'className'
> {
  className?: StateClassName<ToggleState>;
  size?: ControlSize;
  variant?: ToggleGroupVariant;
}

const ToggleGroupItemBase = React.forwardRef(function ToggleGroupItem<
  Value extends string = string,
>(
  { className, size: sizeProp, variant: variantProp, ...props }: ToggleGroupItemProps<Value>,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const { size, variant } = React.useContext(ToggleGroupStyleContext);
  const itemSize = sizeProp ?? size;
  const itemVariant = variantProp ?? variant;

  return (
    <BaseToggle
      {...props}
      ref={ref}
      className={(state) =>
        cn(
          atomicRectShapeClasses.control,
          'focus-visible:ring-city-ring focus-visible:ring-offset-city-background inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          itemSizeClasses[itemSize],
          atomicControlTextClasses[itemSize],
          itemVariantClasses[itemVariant],
          resolveClassName(className, state),
        )
      }
    />
  );
});

ToggleGroupItemBase.displayName = 'ToggleGroup.Item';

export const ToggleGroupItem = ToggleGroupItemBase as <Value extends string = string>(
  props: ToggleGroupItemProps<Value> & React.RefAttributes<HTMLButtonElement>,
) => React.JSX.Element;

export const ToggleGroup = Object.assign(ToggleGroupRoot, {
  Item: ToggleGroupItem,
});
