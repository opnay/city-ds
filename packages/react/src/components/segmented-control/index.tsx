'use client';

import * as React from 'react';
import { Radio as BaseRadio } from '@base-ui/react/radio';
import {
  RadioGroup as BaseRadioGroup,
  type RadioGroupProps as BaseRadioGroupProps,
  type RadioGroupState,
} from '@base-ui/react/radio-group';

import { atomicRectShapeClasses } from '../../lib/atomic-shape';
import { atomicControlTextClasses } from '../../lib/atomic-typography';
import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { ControlSize } from '../../types';

type SegmentedControlValueProps<Value extends string> =
  | {
      defaultValue?: never;
      value: Value;
    }
  | {
      defaultValue: Value;
      value?: never;
    };

export type SegmentedControlProps<Value extends string = string> = Omit<
  BaseRadioGroupProps<Value>,
  'className' | 'defaultValue' | 'required' | 'value'
> &
  SegmentedControlValueProps<Value> & {
    className?: StateClassName<RadioGroupState>;
    size?: ControlSize;
  };

export interface SegmentedControlItemProps<Value extends string = string> extends Omit<
  BaseRadio.Root.Props<Value>,
  'className'
> {
  className?: StateClassName<BaseRadio.Root.State>;
  size?: ControlSize;
}

const SegmentedControlSizeContext = React.createContext<ControlSize>('md');

const itemSizeClasses: Record<ControlSize, string> = {
  xsm: 'h-(--city-control-xsm) gap-1 px-1.5',
  sm: 'h-(--city-control-sm) gap-1.5 px-2',
  md: 'h-(--city-control-md) gap-1.5 px-2.5',
  lg: 'h-(--city-control-lg) gap-2 px-3',
  xlg: 'h-(--city-control-xlg) gap-2 px-4',
};

const SegmentedControlRootBase = React.forwardRef(function SegmentedControlRoot<
  Value extends string = string,
>(
  { className, size = 'md', ...props }: SegmentedControlProps<Value>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  return (
    <SegmentedControlSizeContext.Provider value={size}>
      <BaseRadioGroup
        {...props}
        ref={ref}
        required
        data-city-size={size}
        className={(state) =>
          cn(
            'rounded-city-md bg-city-muted inline-flex gap-1 p-1 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60',
            resolveClassName(className, state),
          )
        }
      />
    </SegmentedControlSizeContext.Provider>
  );
});

SegmentedControlRootBase.displayName = 'SegmentedControl.Root';

export const SegmentedControlRoot = SegmentedControlRootBase as <Value extends string = string>(
  props: SegmentedControlProps<Value> & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element;

const SegmentedControlItemBase = React.forwardRef(function SegmentedControlItem<
  Value extends string = string,
>(
  { className, size: sizeProp, ...props }: SegmentedControlItemProps<Value>,
  ref: React.ForwardedRef<HTMLElement>,
) {
  const rootSize = React.useContext(SegmentedControlSizeContext);
  const size = sizeProp ?? rootSize;

  return (
    <BaseRadio.Root
      {...props}
      ref={ref}
      data-city-size={size}
      className={(state) =>
        cn(
          atomicRectShapeClasses.control,
          'text-city-muted-foreground hover:bg-city-accent hover:text-city-accent-foreground focus-visible:ring-city-ring focus-visible:ring-offset-city-background data-[checked]:bg-city-inverse data-[checked]:text-city-inverse-foreground inline-flex shrink-0 cursor-pointer items-center justify-center font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
          itemSizeClasses[size],
          atomicControlTextClasses[size],
          resolveClassName(className, state),
        )
      }
    />
  );
});

SegmentedControlItemBase.displayName = 'SegmentedControl.Item';

export const SegmentedControlItem = SegmentedControlItemBase as <Value extends string = string>(
  props: SegmentedControlItemProps<Value> & React.RefAttributes<HTMLElement>,
) => React.JSX.Element;

export const SegmentedControl = Object.assign(SegmentedControlRoot, {
  Item: SegmentedControlItem,
});
