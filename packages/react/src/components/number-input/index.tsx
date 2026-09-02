'use client';

import * as React from 'react';
import { NumberField as BaseNumberInput } from '@base-ui/react/number-field';
import { Minus, Plus } from 'lucide-react';

import { cn } from '../../lib/cn';
import {
  outlineFrameBaseClasses,
  outlineFrameHeightClasses,
  outlineFrameSegmentWidthClasses,
  outlineFrameTextClasses,
} from '../../lib/outline-frame';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { ControlSize } from '../../types';

export type NumberInputRootProps = Omit<BaseNumberInput.Root.Props, 'className'> & {
  className?: StateClassName<BaseNumberInput.Root.State>;
  size?: ControlSize;
};

const NumberInputSizeContext = React.createContext<ControlSize>('md');

export const NumberInputRoot = React.forwardRef<HTMLDivElement, NumberInputRootProps>(
  function NumberInputRoot({ className, size = 'md', ...props }, ref) {
    return (
      <NumberInputSizeContext.Provider value={size}>
        <BaseNumberInput.Root
          {...props}
          ref={ref}
          data-city-size={size}
          className={(state) => cn('grid gap-1.5', resolveClassName(className, state))}
        />
      </NumberInputSizeContext.Provider>
    );
  },
);

NumberInputRoot.displayName = 'NumberInput.Root';

export interface NumberInputGroupProps extends Omit<BaseNumberInput.Group.Props, 'className'> {
  className?: StateClassName<BaseNumberInput.Group.State>;
  size?: ControlSize;
}

export const NumberInputGroup = React.forwardRef<HTMLDivElement, NumberInputGroupProps>(
  function NumberInputGroup({ className, size: sizeProp, ...props }, ref) {
    const rootSize = React.useContext(NumberInputSizeContext);
    const size = sizeProp ?? rootSize;

    return (
      <BaseNumberInput.Group
        {...props}
        ref={ref}
        data-city-size={size}
        className={(state) =>
          cn(
            outlineFrameBaseClasses,
            outlineFrameHeightClasses[size],
            outlineFrameTextClasses[size],
            resolveClassName(className, state),
          )
        }
      />
    );
  },
);

NumberInputGroup.displayName = 'NumberInput.Group';

export interface NumberInputInputProps extends Omit<
  BaseNumberInput.Input.Props,
  'className' | 'size'
> {
  className?: StateClassName<BaseNumberInput.Input.State>;
  size?: ControlSize;
}

const inputSizeClasses: Record<ControlSize, string> = {
  xsm: 'px-1.5 text-xs',
  sm: 'px-2 text-xs',
  md: 'px-2.5 text-xs',
  lg: 'px-3 text-sm',
  xlg: 'px-3.5 text-sm',
};

export const NumberInputInput = React.forwardRef<HTMLInputElement, NumberInputInputProps>(
  function NumberInputInput({ className, size: sizeProp, ...props }, ref) {
    const rootSize = React.useContext(NumberInputSizeContext);
    const size = sizeProp ?? rootSize;

    return (
      <BaseNumberInput.Input
        {...props}
        ref={ref}
        data-city-size={size}
        className={(state) =>
          cn(
            'text-city-foreground placeholder:text-city-muted-foreground h-full min-w-0 flex-1 self-stretch bg-transparent outline-none disabled:cursor-not-allowed',
            inputSizeClasses[size],
            resolveClassName(className, state),
          )
        }
      />
    );
  },
);

NumberInputInput.displayName = 'NumberInput.Input';

type StepperProps = Omit<BaseNumberInput.Increment.Props, 'className'> & {
  className?: StateClassName<BaseNumberInput.Increment.State>;
  size?: ControlSize;
};

const stepperClasses =
  'border-city-border text-city-muted-foreground hover:bg-city-accent hover:text-city-accent-foreground active:bg-city-accent-active focus-visible:ring-city-ring inline-flex h-full shrink-0 self-stretch items-center justify-center transition-colors focus-visible:z-10 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50';

export const NumberInputIncrement = React.forwardRef<HTMLButtonElement, StepperProps>(
  function NumberInputIncrement({ children, className, size: sizeProp, ...props }, ref) {
    const rootSize = React.useContext(NumberInputSizeContext);
    const size = sizeProp ?? rootSize;

    return (
      <BaseNumberInput.Increment
        {...props}
        ref={ref}
        data-city-size={size}
        className={(state) =>
          cn(
            stepperClasses,
            outlineFrameSegmentWidthClasses[size],
            'border-l',
            resolveClassName(className, state),
          )
        }
      >
        {children ?? <Plus aria-hidden="true" className="size-3.5" />}
      </BaseNumberInput.Increment>
    );
  },
);

NumberInputIncrement.displayName = 'NumberInput.Increment';

export const NumberInputDecrement = React.forwardRef<HTMLButtonElement, StepperProps>(
  function NumberInputDecrement({ children, className, size: sizeProp, ...props }, ref) {
    const rootSize = React.useContext(NumberInputSizeContext);
    const size = sizeProp ?? rootSize;

    return (
      <BaseNumberInput.Decrement
        {...props}
        ref={ref}
        data-city-size={size}
        className={(state) =>
          cn(
            stepperClasses,
            outlineFrameSegmentWidthClasses[size],
            'border-l',
            resolveClassName(className, state),
          )
        }
      >
        {children ?? <Minus aria-hidden="true" className="size-3.5" />}
      </BaseNumberInput.Decrement>
    );
  },
);

NumberInputDecrement.displayName = 'NumberInput.Decrement';

export const NumberInput = {
  Root: NumberInputRoot,
  Group: NumberInputGroup,
  Input: NumberInputInput,
  Increment: NumberInputIncrement,
  Decrement: NumberInputDecrement,
};
