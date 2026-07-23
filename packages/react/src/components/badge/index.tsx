'use client';

import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';

import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';

export const BADGE_VARIANTS = ['solid', 'subtle', 'outline', 'destructive'] as const;

export type BadgeVariant = (typeof BADGE_VARIANTS)[number];

export type BadgeState = Record<never, never>;

export interface BadgeProps extends Omit<
  useRender.ComponentProps<'span', BadgeState>,
  'className'
> {
  className?: StateClassName<BadgeState>;
  variant?: BadgeVariant;
}

const badgeVariantClasses: Record<BadgeVariant, string> = {
  solid: 'bg-city-primary text-city-primary-foreground',
  subtle: 'bg-city-muted text-city-foreground',
  outline: 'border border-city-border bg-transparent text-city-foreground',
  destructive: 'bg-city-destructive/10 text-city-destructive',
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, render, variant = 'solid', ...props },
  ref,
) {
  const state: BadgeState = {};

  return useRender({
    defaultTagName: 'span',
    ref,
    render,
    state,
    props: {
      ...props,
      className: cn(
        'inline-flex h-5 shrink-0 items-center rounded-city-xs px-1.5 text-xs font-medium leading-none',
        badgeVariantClasses[variant],
        resolveClassName(className, state),
      ),
    },
  });
});

Badge.displayName = 'Badge';
