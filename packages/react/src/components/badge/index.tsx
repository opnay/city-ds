'use client';

import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';

import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';

export const BADGE_VARIANTS = ['solid', 'subtle', 'outline', 'destructive'] as const;
export const BADGE_SIZES = ['sm', 'md', 'lg'] as const;

export type BadgeVariant = (typeof BADGE_VARIANTS)[number];
export type BadgeSize = (typeof BADGE_SIZES)[number];
export type BadgeMode = 'label' | 'count' | 'dot';

export type BadgeState = Record<never, never>;

export interface BadgeProps extends Omit<
  useRender.ComponentProps<'span', BadgeState>,
  'children' | 'className'
> {
  children?: React.ReactNode;
  className?: StateClassName<BadgeState>;
  count?: number;
  dot?: boolean;
  size?: BadgeSize;
  variant?: BadgeVariant;
}

const badgeVariantClasses: Record<BadgeVariant, string> = {
  solid: 'bg-city-primary text-city-primary-foreground',
  subtle: 'bg-city-muted text-city-foreground',
  outline: 'border border-city-border bg-transparent text-city-foreground',
  destructive: 'bg-city-destructive/10 text-city-destructive',
};

const badgeSizeClasses: Record<BadgeSize, string> = {
  sm: 'h-4 px-1 text-[0.625rem]',
  md: 'h-5 px-1.5 text-xs',
  lg: 'h-6 px-2 text-sm',
};

const badgeCountSizeClasses: Record<BadgeSize, string> = {
  sm: 'min-w-4',
  md: 'min-w-5',
  lg: 'min-w-6',
};

const badgeDotSizeClasses: Record<BadgeSize, string> = {
  sm: 'size-1.5',
  md: 'size-2',
  lg: 'size-2.5',
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    children,
    className,
    count,
    dot = false,
    render,
    size = 'md',
    variant = 'solid',
    ...props
  },
  ref,
) {
  const state: BadgeState = {};
  const mode: BadgeMode = dot ? 'dot' : count !== undefined ? 'count' : 'label';
  const hasAccessibleName = props['aria-label'] != null || props['aria-labelledby'] != null;

  return useRender({
    defaultTagName: 'span',
    ref,
    render,
    state,
    props: {
      ...props,
      'aria-hidden':
        mode === 'dot' && !hasAccessibleName ? true : props['aria-hidden'],
      children: mode === 'dot' ? undefined : mode === 'count' ? count : children,
      'data-city-badge': mode,
      'data-city-size': size,
      'data-variant': variant,
      className: cn(
        'inline-flex shrink-0 items-center rounded-city-xs font-medium leading-none',
        mode !== 'dot' && badgeSizeClasses[size],
        mode === 'count' &&
          cn(
            'justify-center rounded-city-full font-semibold tabular-nums',
            badgeCountSizeClasses[size],
          ),
        mode === 'dot' && cn('rounded-city-full p-0', badgeDotSizeClasses[size]),
        badgeVariantClasses[variant],
        resolveClassName(className, state),
      ),
    },
  });
});

Badge.displayName = 'Badge';
