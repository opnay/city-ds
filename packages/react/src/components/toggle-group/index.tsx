'use client';

import * as React from 'react';
import {
  ToggleGroup as BaseToggleGroup,
  type ToggleGroupProps as BaseToggleGroupProps,
  type ToggleGroupState,
} from '@base-ui/react/toggle-group';
import type { ToggleState } from '@base-ui/react/toggle';

import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { ControlSize } from '../../types';
import { Toggle, type ToggleProps, type ToggleVariant } from '../toggle';

type ToggleGroupStyleContextValue = {
  size: ControlSize;
  variant: ToggleVariant;
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
  variant?: ToggleVariant;
}

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
  ToggleProps<Value>,
  'className'
> {
  className?: StateClassName<ToggleState>;
}

const ToggleGroupItemBase = React.forwardRef(function ToggleGroupItem<
  Value extends string = string,
>(
  { size: sizeProp, variant: variantProp, ...props }: ToggleGroupItemProps<Value>,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const { size, variant } = React.useContext(ToggleGroupStyleContext);

  return <Toggle {...props} ref={ref} size={sizeProp ?? size} variant={variantProp ?? variant} />;
});

ToggleGroupItemBase.displayName = 'ToggleGroup.Item';

export const ToggleGroupItem = ToggleGroupItemBase as <Value extends string = string>(
  props: ToggleGroupItemProps<Value> & React.RefAttributes<HTMLButtonElement>,
) => React.JSX.Element;

export const ToggleGroup = Object.assign(ToggleGroupRoot, {
  Item: ToggleGroupItem,
});
