'use client';

import * as React from 'react';
import {
  Toggle as BaseToggle,
  type ToggleProps as BaseToggleProps,
  type ToggleState,
} from '@base-ui/react/toggle';

import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { ControlSize } from '../../types';
import { BUTTON_VARIANTS, type ButtonVariant } from '../button';

export const TOGGLE_VARIANTS = BUTTON_VARIANTS;

export type ToggleVariant = ButtonVariant;

export interface ToggleProps<Value extends string = string> extends Omit<
  BaseToggleProps<Value>,
  'className'
> {
  className?: StateClassName<ToggleState>;
  size?: ControlSize;
  variant?: ToggleVariant;
}

const toggleSizeClasses: Record<ControlSize, string> = {
  sm: 'h-(--city-control-sm) gap-1.5 px-2.5 text-xs',
  md: 'h-(--city-control-md) gap-2 px-3 text-sm',
  lg: 'h-(--city-control-lg) gap-2 px-4 text-sm',
};

const toggleVariantClasses: Record<ToggleVariant, string> = {
  primary:
    'bg-city-primary text-city-primary-foreground hover:bg-city-primary/90 active:bg-city-primary/80 data-[pressed]:bg-city-primary/80',
  secondary:
    'bg-city-accent text-city-accent-foreground hover:bg-city-accent-hover active:bg-city-accent-active data-[pressed]:bg-city-foreground data-[pressed]:text-city-background',
  outline:
    'border border-city-border bg-city-background text-city-foreground hover:bg-city-accent active:bg-city-accent-active data-[pressed]:bg-city-foreground data-[pressed]:text-city-background',
  ghost:
    'text-city-foreground hover:bg-city-accent active:bg-city-accent-active data-[pressed]:bg-city-accent data-[pressed]:text-city-accent-foreground',
  destructive:
    'bg-city-destructive text-city-destructive-foreground hover:bg-city-destructive/90 active:bg-city-destructive/80 data-[pressed]:bg-city-destructive/80',
};

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  { className, size = 'md', variant = 'outline', ...props },
  ref,
) {
  return (
    <BaseToggle
      {...props}
      ref={ref}
      className={(state) =>
        cn(
          'rounded-city-sm focus-visible:ring-city-ring focus-visible:ring-offset-city-background inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          toggleSizeClasses[size],
          toggleVariantClasses[variant],
          resolveClassName(className, state),
        )
      }
    />
  );
});

Toggle.displayName = 'Toggle';
