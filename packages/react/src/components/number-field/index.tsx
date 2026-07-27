'use client';

import * as React from 'react';
import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import { Minus, Plus } from 'lucide-react';

import { cn } from '../../lib/cn';
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

const groupSizeClasses: Record<ControlSize, string> = {
  sm: 'min-h-(--city-control-sm) text-xs',
  md: 'min-h-(--city-control-md) text-sm',
  lg: 'min-h-(--city-control-lg) text-sm',
};

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
            'rounded-city-sm border-city-input bg-city-background text-city-foreground focus-within:border-city-ring focus-within:ring-city-ring/30 data-[invalid]:border-city-destructive data-[invalid]:focus-within:ring-city-destructive/30 flex w-full items-center overflow-hidden border transition-colors focus-within:ring-2 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
            groupSizeClasses[size],
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
  sm: 'h-(--city-control-sm) px-2.5 text-xs',
  md: 'h-(--city-control-md) px-3 text-sm',
  lg: 'h-(--city-control-lg) px-3.5 text-sm',
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
            'text-city-foreground placeholder:text-city-muted-foreground min-w-0 flex-1 bg-transparent outline-none disabled:cursor-not-allowed',
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

const stepperSizeClasses: Record<ControlSize, string> = {
  sm: 'h-(--city-control-sm) w-(--city-control-sm)',
  md: 'h-(--city-control-md) w-(--city-control-md)',
  lg: 'h-(--city-control-lg) w-(--city-control-lg)',
};

const stepperClasses =
  'inline-flex shrink-0 items-center justify-center border-city-border text-city-muted-foreground transition-colors hover:bg-city-accent hover:text-city-accent-foreground active:bg-city-accent-active focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-city-ring/30 disabled:cursor-not-allowed disabled:opacity-50';

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
            stepperSizeClasses[size],
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
            stepperSizeClasses[size],
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
