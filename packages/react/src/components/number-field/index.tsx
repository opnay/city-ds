'use client';

import * as React from 'react';
import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
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

export type NumberFieldRootProps = Omit<BaseNumberField.Root.Props, 'className'> & {
  className?: StateClassName<BaseNumberField.Root.State>;
  size?: ControlSize;
};

const NumberFieldSizeContext = React.createContext<ControlSize>('md');

export const NumberFieldRoot = React.forwardRef<HTMLDivElement, NumberFieldRootProps>(
  function NumberFieldRoot({ className, size = 'md', ...props }, ref) {
    return (
      <NumberFieldSizeContext.Provider value={size}>
        <BaseNumberField.Root
          {...props}
          ref={ref}
          data-city-size={size}
          className={(state) => cn('grid gap-1.5', resolveClassName(className, state))}
        />
      </NumberFieldSizeContext.Provider>
    );
  },
);

NumberFieldRoot.displayName = 'NumberField.Root';

export interface NumberFieldGroupProps extends Omit<BaseNumberField.Group.Props, 'className'> {
  className?: StateClassName<BaseNumberField.Group.State>;
  size?: ControlSize;
}

export const NumberFieldGroup = React.forwardRef<HTMLDivElement, NumberFieldGroupProps>(
  function NumberFieldGroup({ className, size: sizeProp, ...props }, ref) {
    const rootSize = React.useContext(NumberFieldSizeContext);
    const size = sizeProp ?? rootSize;

    return (
      <BaseNumberField.Group
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

NumberFieldGroup.displayName = 'NumberField.Group';

export interface NumberFieldInputProps extends Omit<
  BaseNumberField.Input.Props,
  'className' | 'size'
> {
  className?: StateClassName<BaseNumberField.Input.State>;
  size?: ControlSize;
}

const inputSizeClasses: Record<ControlSize, string> = {
  sm: 'px-2.5 text-xs',
  md: 'px-3 text-sm',
  lg: 'px-3.5 text-sm',
};

export const NumberFieldInput = React.forwardRef<HTMLInputElement, NumberFieldInputProps>(
  function NumberFieldInput({ className, size: sizeProp, ...props }, ref) {
    const rootSize = React.useContext(NumberFieldSizeContext);
    const size = sizeProp ?? rootSize;

    return (
      <BaseNumberField.Input
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

NumberFieldInput.displayName = 'NumberField.Input';

type StepperProps = Omit<BaseNumberField.Increment.Props, 'className'> & {
  className?: StateClassName<BaseNumberField.Increment.State>;
  size?: ControlSize;
};

const stepperClasses =
  'border-city-border text-city-muted-foreground hover:bg-city-accent hover:text-city-accent-foreground active:bg-city-accent-active focus-visible:ring-city-ring/30 inline-flex h-full shrink-0 self-stretch items-center justify-center transition-colors focus-visible:z-10 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50';

export const NumberFieldIncrement = React.forwardRef<HTMLButtonElement, StepperProps>(
  function NumberFieldIncrement({ children, className, size: sizeProp, ...props }, ref) {
    const rootSize = React.useContext(NumberFieldSizeContext);
    const size = sizeProp ?? rootSize;

    return (
      <BaseNumberField.Increment
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
      </BaseNumberField.Increment>
    );
  },
);

NumberFieldIncrement.displayName = 'NumberField.Increment';

export const NumberFieldDecrement = React.forwardRef<HTMLButtonElement, StepperProps>(
  function NumberFieldDecrement({ children, className, size: sizeProp, ...props }, ref) {
    const rootSize = React.useContext(NumberFieldSizeContext);
    const size = sizeProp ?? rootSize;

    return (
      <BaseNumberField.Decrement
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
      </BaseNumberField.Decrement>
    );
  },
);

NumberFieldDecrement.displayName = 'NumberField.Decrement';

export const NumberField = {
  Root: NumberFieldRoot,
  Group: NumberFieldGroup,
  Input: NumberFieldInput,
  Increment: NumberFieldIncrement,
  Decrement: NumberFieldDecrement,
};
