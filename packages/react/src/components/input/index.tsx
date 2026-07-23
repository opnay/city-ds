'use client';

import * as React from 'react';
import { Field as BaseField } from '@base-ui/react/field';
import {
  Input as BaseInput,
  type InputProps as BaseInputProps,
  type InputState,
} from '@base-ui/react/input';
import { useRender } from '@base-ui/react/use-render';

import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { ControlSize } from '../../types';

export interface InputProps extends Omit<BaseInputProps, 'className' | 'size'> {
  className?: StateClassName<InputState>;
  size?: ControlSize;
}

const inputSizeClasses: Record<ControlSize, string> = {
  sm: 'h-8 px-2.5 text-xs',
  md: 'h-9 px-3 text-sm',
  lg: 'h-10 px-3.5 text-sm',
};

const inputClasses =
  'flex w-full min-w-0 rounded-city-sm border border-city-input bg-city-background text-city-foreground outline-none transition-colors placeholder:text-city-muted-foreground focus-visible:border-city-ring focus-visible:ring-2 focus-visible:ring-city-ring/30 disabled:cursor-not-allowed disabled:opacity-50 data-[invalid]:border-city-destructive data-[invalid]:focus-visible:ring-city-destructive/30';

export const Input = React.forwardRef<HTMLElement, InputProps>(function Input(
  { className, size = 'md', ...props },
  ref,
) {
  return (
    <BaseInput
      {...props}
      ref={ref}
      className={(state) =>
        cn(inputClasses, inputSizeClasses[size], resolveClassName(className, state))
      }
    />
  );
});

Input.displayName = 'Input';

type TextareaNativeProps = React.ComponentPropsWithoutRef<'textarea'>;

export interface TextareaProps
  extends
    Omit<BaseField.Control.Props, 'className' | 'render' | 'size' | keyof TextareaNativeProps>,
    Omit<TextareaNativeProps, 'className' | 'size'> {
  className?: StateClassName<BaseField.Control.State>;
  render?: BaseField.Control.Props['render'];
  size?: ControlSize;
}

const textareaSizeClasses: Record<ControlSize, string> = {
  sm: 'min-h-20 px-2.5 py-2 text-xs',
  md: 'min-h-24 px-3 py-2 text-sm',
  lg: 'min-h-28 px-3.5 py-2.5 text-sm',
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, render, size = 'md', ...props },
  ref,
) {
  return (
    <BaseField.Control
      {...(props as BaseField.Control.Props)}
      ref={ref}
      render={render ?? <textarea />}
      className={(state) =>
        cn(inputClasses, 'resize-y', textareaSizeClasses[size], resolveClassName(className, state))
      }
    />
  );
});

Textarea.displayName = 'Textarea';

export type InputGroupState = Record<never, never>;

export interface InputGroupProps extends Omit<
  useRender.ComponentProps<'div', InputGroupState>,
  'className'
> {
  className?: StateClassName<InputGroupState>;
  size?: ControlSize;
}

const inputGroupSizeClasses: Record<ControlSize, string> = {
  sm: 'min-h-8 text-xs',
  md: 'min-h-9 text-sm',
  lg: 'min-h-10 text-sm',
};

export const InputGroupRoot = React.forwardRef<HTMLDivElement, InputGroupProps>(
  function InputGroupRoot({ className, render, size = 'md', ...props }, ref) {
    const state: InputGroupState = {};

    return useRender({
      defaultTagName: 'div',
      ref,
      render,
      state,
      props: {
        ...props,
        className: cn(
          'flex w-full items-center overflow-hidden rounded-city-sm border border-city-input bg-city-background text-city-foreground transition-colors focus-within:border-city-ring focus-within:ring-2 focus-within:ring-city-ring/30 [&>input]:rounded-none [&>input]:border-0 [&>input]:bg-transparent [&>input]:shadow-none [&>input]:focus-visible:ring-0 [&>textarea]:rounded-none [&>textarea]:border-0 [&>textarea]:bg-transparent [&>textarea]:shadow-none [&>textarea]:focus-visible:ring-0',
          inputGroupSizeClasses[size],
          resolveClassName(className, state),
        ),
      },
    });
  },
);

InputGroupRoot.displayName = 'InputGroup.Root';

export type InputGroupAddonPosition = 'leading' | 'trailing';

export interface InputGroupAddonProps extends Omit<
  useRender.ComponentProps<'span', InputGroupState>,
  'className'
> {
  className?: StateClassName<InputGroupState>;
  position?: InputGroupAddonPosition;
}

export const InputGroupAddon = React.forwardRef<HTMLSpanElement, InputGroupAddonProps>(
  function InputGroupAddon({ className, position = 'leading', render, ...props }, ref) {
    const state: InputGroupState = {};

    return useRender({
      defaultTagName: 'span',
      ref,
      render,
      state,
      props: {
        ...props,
        'data-city-position': position,
        className: cn(
          'flex shrink-0 items-center px-2 text-city-muted-foreground',
          position === 'trailing' && 'order-last',
          resolveClassName(className, state),
        ),
      },
    });
  },
);

InputGroupAddon.displayName = 'InputGroup.Addon';

export const InputGroup = {
  Root: InputGroupRoot,
  Addon: InputGroupAddon,
};
