'use client';

import * as React from 'react';
import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import { Minus, Plus } from 'lucide-react';

import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { ControlSize } from '../../types';

export type NumberFieldRootProps = Omit<BaseNumberField.Root.Props, 'className'> & {
  className?: StateClassName<BaseNumberField.Root.State>;
};

export const NumberFieldRoot = React.forwardRef<HTMLDivElement, NumberFieldRootProps>(
  function NumberFieldRoot({ className, ...props }, ref) {
    return (
      <BaseNumberField.Root
        {...props}
        ref={ref}
        className={(state) => cn('grid gap-1.5', resolveClassName(className, state))}
      />
    );
  },
);

NumberFieldRoot.displayName = 'NumberField.Root';

export interface NumberFieldGroupProps extends Omit<BaseNumberField.Group.Props, 'className'> {
  className?: StateClassName<BaseNumberField.Group.State>;
  size?: ControlSize;
}

const groupSizeClasses: Record<ControlSize, string> = {
  sm: 'min-h-8 text-xs',
  md: 'min-h-9 text-sm',
  lg: 'min-h-10 text-sm',
};

export const NumberFieldGroup = React.forwardRef<HTMLDivElement, NumberFieldGroupProps>(
  function NumberFieldGroup({ className, size = 'md', ...props }, ref) {
    return (
      <BaseNumberField.Group
        {...props}
        ref={ref}
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
  sm: 'h-8 px-2.5 text-xs',
  md: 'h-9 px-3 text-sm',
  lg: 'h-10 px-3.5 text-sm',
};

export const NumberFieldInput = React.forwardRef<HTMLInputElement, NumberFieldInputProps>(
  function NumberFieldInput({ className, size = 'md', ...props }, ref) {
    return (
      <BaseNumberField.Input
        {...props}
        ref={ref}
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
  sm: 'h-8 w-8',
  md: 'h-9 w-9',
  lg: 'h-10 w-10',
};

const stepperClasses =
  'inline-flex shrink-0 items-center justify-center border-city-border text-city-muted-foreground transition-colors hover:bg-city-accent hover:text-city-accent-foreground active:bg-city-accent-active focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-city-ring/30 disabled:cursor-not-allowed disabled:opacity-50';

export const NumberFieldIncrement = React.forwardRef<HTMLButtonElement, StepperProps>(
  function NumberFieldIncrement({ children, className, size = 'md', ...props }, ref) {
    return (
      <BaseNumberField.Increment
        {...props}
        ref={ref}
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
  function NumberFieldDecrement({ children, className, size = 'md', ...props }, ref) {
    return (
      <BaseNumberField.Decrement
        {...props}
        ref={ref}
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
