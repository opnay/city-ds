'use client';

import * as React from 'react';
import {
  Button as BaseButton,
  type ButtonProps as BaseButtonProps,
  type ButtonState,
} from '@base-ui/react/button';

import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { ControlSize } from '../../types';

export const BUTTON_VARIANTS = ['primary', 'secondary', 'outline', 'ghost', 'destructive'] as const;

export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];

export interface ButtonProps extends Omit<BaseButtonProps, 'className'> {
  className?: StateClassName<ButtonState>;
  size?: ControlSize;
  variant?: ButtonVariant;
}

const buttonSizeClasses: Record<ControlSize, string> = {
  sm: 'h-8 gap-1.5 px-2.5 text-xs',
  md: 'h-9 gap-2 px-3 text-sm',
  lg: 'h-10 gap-2 px-4 text-sm',
};

const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-city-primary text-city-primary-foreground hover:bg-city-primary/90 active:bg-city-primary/80',
  secondary:
    'bg-city-accent text-city-accent-foreground hover:bg-city-accent-hover active:bg-city-accent-active',
  outline:
    'border border-city-border bg-city-background text-city-foreground hover:bg-city-accent active:bg-city-accent-active',
  ghost: 'text-city-foreground hover:bg-city-accent active:bg-city-accent-active',
  destructive:
    'bg-city-destructive text-city-destructive-foreground hover:bg-city-destructive/90 active:bg-city-destructive/80',
};

export const Button = React.forwardRef<HTMLElement, ButtonProps>(function Button(
  { className, size = 'md', variant = 'primary', ...props },
  ref,
) {
  return (
    <BaseButton
      {...props}
      ref={ref}
      className={(state) =>
        cn(
          'rounded-city-sm focus-visible:ring-city-ring focus-visible:ring-offset-city-background inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          buttonSizeClasses[size],
          buttonVariantClasses[variant],
          resolveClassName(className, state),
        )
      }
    />
  );
});

Button.displayName = 'Button';
