'use client';

import * as React from 'react';
import { Radio as BaseRadio } from '@base-ui/react/radio';
import {
  RadioGroup as BaseRadioGroup,
  type RadioGroupProps as BaseRadioGroupProps,
  type RadioGroupState,
} from '@base-ui/react/radio-group';

import { atomicRoundShapeClass } from '../../lib/atomic-shape';
import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { ControlSize } from '../../types';

export interface RadioGroupProps<Value = unknown> extends Omit<
  BaseRadioGroupProps<Value>,
  'className'
> {
  className?: StateClassName<RadioGroupState>;
  size?: ControlSize;
}

const RadioGroupSizeContext = React.createContext<ControlSize>('md');

export function RadioGroupRoot<Value>({
  className,
  size = 'md',
  ...props
}: RadioGroupProps<Value>): React.JSX.Element {
  return (
    <RadioGroupSizeContext.Provider value={size}>
      <BaseRadioGroup
        {...props}
        data-city-size={size}
        className={(state) => cn('grid gap-2', resolveClassName(className, state))}
      />
    </RadioGroupSizeContext.Provider>
  );
}

RadioGroupRoot.displayName = 'RadioGroup.Root';

export interface RadioGroupItemProps<Value = unknown> extends Omit<
  BaseRadio.Root.Props<Value>,
  'className'
> {
  className?: StateClassName<BaseRadio.Root.State>;
  labelClassName?: string;
  size?: ControlSize;
}

const radioSizeClasses: Record<ControlSize, string> = {
  sm: 'size-3.5',
  md: 'size-4',
  lg: 'size-5',
};

const radioIndicatorSizeClasses: Record<ControlSize, string> = {
  sm: 'size-1.5',
  md: 'size-2',
  lg: 'size-2.5',
};

const RadioGroupItemBase = React.forwardRef(function RadioGroupItem(
  { children, className, labelClassName, size: sizeProp, ...props }: RadioGroupItemProps,
  ref: React.ForwardedRef<HTMLElement>,
) {
  const labelId = React.useId();
  const rootSize = React.useContext(RadioGroupSizeContext);
  const size = sizeProp ?? rootSize;

  return (
    <label
      className={cn(
        'text-city-foreground flex w-fit cursor-pointer items-center gap-2 text-sm has-data-[disabled]:cursor-not-allowed has-data-[disabled]:opacity-50',
        labelClassName,
      )}
    >
      <BaseRadio.Root
        {...props}
        aria-labelledby={props['aria-labelledby'] ?? labelId}
        data-city-size={size}
        ref={ref}
        className={(state) =>
          cn(
            atomicRoundShapeClass,
            'border-city-input bg-city-background focus-visible:ring-city-ring focus-visible:ring-offset-city-background data-[checked]:border-city-primary grid shrink-0 place-items-center border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 data-[disabled]:cursor-not-allowed',
            radioSizeClasses[size],
            resolveClassName(className, state),
          )
        }
      >
        <BaseRadio.Indicator
          className={cn('bg-city-primary', atomicRoundShapeClass, radioIndicatorSizeClasses[size])}
        />
      </BaseRadio.Root>
      <span id={labelId}>{children}</span>
    </label>
  );
});

RadioGroupItemBase.displayName = 'RadioGroup.Item';

export const RadioGroupItem = RadioGroupItemBase as <Value>(
  props: RadioGroupItemProps<Value> & React.RefAttributes<HTMLElement>,
) => React.JSX.Element;

export const RadioGroup = Object.assign(RadioGroupRoot, {
  Item: RadioGroupItem,
});
