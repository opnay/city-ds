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

export interface RadioGroupControlProps<Value = unknown> extends Omit<
  BaseRadio.Root.Props<Value>,
  'className'
> {
  className?: StateClassName<BaseRadio.Root.State>;
  size?: ControlSize;
}

export interface RadioGroupItemProps<Value = unknown> extends RadioGroupControlProps<Value> {
  labelClassName?: string;
}

const radioSizeClasses: Record<ControlSize, string> = {
  xsm: 'size-2.5',
  sm: 'size-3',
  md: 'size-3.5',
  lg: 'size-4',
  xlg: 'size-5',
};

const radioIndicatorSizeClasses: Record<ControlSize, string> = {
  xsm: 'size-1',
  sm: 'size-1.5',
  md: 'size-1.5',
  lg: 'size-2',
  xlg: 'size-2.5',
};

const RadioGroupControlBase = React.forwardRef(function RadioGroupControl(
  { children, className, size: sizeProp, ...props }: RadioGroupControlProps,
  ref: React.ForwardedRef<HTMLElement>,
) {
  const rootSize = React.useContext(RadioGroupSizeContext);
  const size = sizeProp ?? rootSize;

  return (
    <BaseRadio.Root
      {...props}
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
      {children}
    </BaseRadio.Root>
  );
});

RadioGroupControlBase.displayName = 'RadioGroup.Control';

export const RadioGroupControl = RadioGroupControlBase as <Value>(
  props: RadioGroupControlProps<Value> & React.RefAttributes<HTMLElement>,
) => React.JSX.Element;

const RadioGroupItemBase = React.forwardRef(function RadioGroupItem(
  { children, labelClassName, ...props }: RadioGroupItemProps,
  ref: React.ForwardedRef<HTMLElement>,
) {
  const labelId = React.useId();

  return (
    <label
      className={cn(
        'text-city-foreground flex w-fit cursor-pointer items-center gap-2 text-sm has-data-[disabled]:cursor-not-allowed has-data-[disabled]:opacity-50',
        labelClassName,
      )}
    >
      <RadioGroupControl
        {...props}
        aria-labelledby={props['aria-labelledby'] ?? labelId}
        ref={ref}
      />
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
  Control: RadioGroupControl,
});
