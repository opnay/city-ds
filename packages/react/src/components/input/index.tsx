'use client';

import * as React from 'react';
import { Field as BaseField } from '@base-ui/react/field';
import {
  Input as BaseInput,
  type InputProps as BaseInputProps,
  type InputState,
} from '@base-ui/react/input';
import { useRender } from '@base-ui/react/use-render';

import { atomicRectShapeClasses } from '../../lib/atomic-shape';
import { cn } from '../../lib/cn';
import {
  outlineFrameBaseClasses,
  outlineFrameHeightClasses,
  outlineFrameLeadingTextPaddingClasses,
  outlineFrameTextClasses,
  outlineFrameTextareaMinHeightClasses,
  outlineFrameTrailingIconPaddingClasses,
  outlineFrameValuePaddingClasses,
} from '../../lib/outline-frame';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { ControlSize } from '../../types';

const InputGroupSizeContext = React.createContext<ControlSize | null>(null);

export interface InputProps extends Omit<BaseInputProps, 'className' | 'size'> {
  className?: StateClassName<InputState>;
  size?: ControlSize;
}

const inputClasses = cn(
  atomicRectShapeClasses.control,
  'flex w-full min-w-0 border border-city-input bg-city-background text-city-foreground outline-none transition-colors placeholder:text-city-muted-foreground focus-visible:border-city-ring focus-visible:ring-2 focus-visible:ring-city-ring disabled:cursor-not-allowed disabled:opacity-50 data-[invalid]:border-city-destructive data-[invalid]:focus-visible:ring-city-destructive',
);

export const Input = React.forwardRef<HTMLElement, InputProps>(function Input(
  { className, size: sizeProp, ...props },
  ref,
) {
  const groupSize = React.useContext(InputGroupSizeContext);
  const size = sizeProp ?? groupSize ?? 'md';

  return (
    <BaseInput
      {...props}
      ref={ref}
      className={(state) =>
        cn(
          inputClasses,
          outlineFrameHeightClasses[size],
          outlineFrameTextClasses[size],
          outlineFrameValuePaddingClasses[size],
          resolveClassName(className, state),
        )
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
  xsm: 'min-h-16 px-1.5 py-1.5 text-xs',
  sm: 'min-h-18 px-2 py-1.5 text-xs',
  md: 'min-h-20 px-2.5 py-2 text-xs',
  lg: 'min-h-24 px-3 py-2 text-sm',
  xlg: 'min-h-28 px-3.5 py-2.5 text-sm',
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, render, size: sizeProp, ...props },
  ref,
) {
  const groupSize = React.useContext(InputGroupSizeContext);
  const size = sizeProp ?? groupSize ?? 'md';

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

export const InputGroupRoot = React.forwardRef<HTMLDivElement, InputGroupProps>(
  function InputGroupRoot({ className, render, size = 'md', ...props }, ref) {
    const state: InputGroupState = {};

    const element = useRender({
      defaultTagName: 'div',
      ref,
      render,
      state,
      props: {
        ...props,
        className: cn(
          outlineFrameBaseClasses,
          outlineFrameHeightClasses[size],
          outlineFrameTextClasses[size],
          outlineFrameTextareaMinHeightClasses[size],
          'gap-1 has-[textarea]:h-auto [&>input]:h-full [&>input]:self-stretch [&>input]:rounded-none [&>input]:border-0 [&>input]:bg-transparent [&>input]:shadow-none [&>input]:focus-visible:ring-0 [&>textarea]:rounded-none [&>textarea]:border-0 [&>textarea]:bg-transparent [&>textarea]:shadow-none [&>textarea]:focus-visible:ring-0 [&:has(>[data-city-position=leading])>input]:pl-0 [&:has(>[data-city-position=leading])>textarea]:pl-0 [&:has(>[data-city-position=trailing])>input]:pr-0 [&:has(>[data-city-position=trailing])>textarea]:pr-0',
          resolveClassName(className, state),
        ),
      },
    });

    return <InputGroupSizeContext.Provider value={size}>{element}</InputGroupSizeContext.Provider>;
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
    const size = React.useContext(InputGroupSizeContext) ?? 'md';
    const state: InputGroupState = {};

    return useRender({
      defaultTagName: 'span',
      ref,
      render,
      state,
      props: {
        ...props,
        'data-city-position': position,
        'data-city-size': size,
        className: cn(
          'text-city-muted-foreground flex shrink-0 items-center',
          position === 'leading'
            ? outlineFrameLeadingTextPaddingClasses[size]
            : cn('order-last', outlineFrameTrailingIconPaddingClasses[size]),
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
