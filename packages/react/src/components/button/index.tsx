'use client';

import * as React from 'react';
import {
  Button as BaseButton,
  type ButtonProps as BaseButtonProps,
  type ButtonState,
} from '@base-ui/react/button';

import { cn } from '../../lib/cn';
import { atomicRectShapeClasses } from '../../lib/atomic-shape';
import { atomicControlTextClasses } from '../../lib/atomic-typography';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { ControlSize } from '../../types';

export const BUTTON_VARIANTS = ['primary', 'secondary', 'outline', 'ghost', 'destructive'] as const;

export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];

export interface ButtonProps extends Omit<BaseButtonProps, 'className'> {
  className?: StateClassName<ButtonState>;
  iconOnly?: boolean;
  size?: ControlSize;
  variant?: ButtonVariant;
}

const buttonSizeClasses: Record<ControlSize, string> = {
  xsm: 'h-(--city-control-xsm) gap-1 px-1.5',
  sm: 'h-(--city-control-sm) gap-1.5 px-2',
  md: 'h-(--city-control-md) gap-1.5 px-2.5',
  lg: 'h-(--city-control-lg) gap-2 px-3',
  xlg: 'h-(--city-control-xlg) gap-2 px-4',
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

const iconOnlySizeClasses: Record<ControlSize, string> = {
  xsm: 'w-(--city-control-xsm) gap-0 px-0',
  sm: 'w-(--city-control-sm) gap-0 px-0',
  md: 'w-(--city-control-md) gap-0 px-0',
  lg: 'w-(--city-control-lg) gap-0 px-0',
  xlg: 'w-(--city-control-xlg) gap-0 px-0',
};

export const Button = React.forwardRef<HTMLElement, ButtonProps>(function Button(
  { className, iconOnly = false, size = 'md', variant = 'primary', ...props },
  ref,
) {
  return (
    <BaseButton
      {...props}
      ref={ref}
      data-city-icon-only={iconOnly ? '' : undefined}
      data-city-size={size}
      className={(state) =>
        cn(
          atomicRectShapeClasses.control,
          'city-button focus-visible:ring-city-ring focus-visible:ring-offset-city-background relative inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          buttonSizeClasses[size],
          atomicControlTextClasses[size],
          iconOnly && iconOnlySizeClasses[size],
          buttonVariantClasses[variant],
          resolveClassName(className, state),
        )
      }
    />
  );
});

Button.displayName = 'Button';
