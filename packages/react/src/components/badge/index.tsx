'use client';

import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';

import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { FeedbackTone } from '../../types';

export const BADGE_VARIANTS = ['solid', 'subtle', 'outline', 'destructive'] as const;
export const BADGE_SIZES = ['sm', 'md', 'lg'] as const;

export type BadgeVariant = (typeof BADGE_VARIANTS)[number];
export type BadgeSize = (typeof BADGE_SIZES)[number];
export type BadgeMode = 'label' | 'count' | 'dot';
export type BadgeAppearance = Extract<BadgeVariant, 'solid' | 'subtle' | 'outline'>;

export type BadgeState = Record<never, never>;

export interface BadgeProps extends Omit<
  useRender.ComponentProps<'span', BadgeState>,
  'children' | 'className'
> {
  appearance?: BadgeAppearance;
  children?: React.ReactNode;
  className?: StateClassName<BadgeState>;
  count?: number;
  dot?: boolean;
  size?: BadgeSize;
  tone?: FeedbackTone;
  variant?: BadgeVariant;
}

const badgeVariantClasses: Record<BadgeVariant, string> = {
  solid: 'bg-city-primary text-city-primary-foreground',
  subtle: 'bg-city-muted text-city-foreground',
  outline: 'border border-city-border bg-transparent text-city-foreground',
  destructive: 'bg-city-destructive/10 text-city-destructive',
};

const legacyBadgePresentation: Record<
  BadgeVariant,
  { appearance: BadgeAppearance; tone: FeedbackTone }
> = {
  solid: { appearance: 'solid', tone: 'neutral' },
  subtle: { appearance: 'subtle', tone: 'neutral' },
  outline: { appearance: 'outline', tone: 'neutral' },
  destructive: { appearance: 'subtle', tone: 'destructive' },
};

const badgePresentationClasses: Record<FeedbackTone, Record<BadgeAppearance, string>> = {
  neutral: {
    solid: 'bg-city-primary text-city-primary-foreground',
    subtle: 'bg-city-muted text-city-foreground',
    outline: 'border border-city-border bg-transparent text-city-foreground',
  },
  info: {
    solid: 'bg-city-info/20 text-city-foreground',
    subtle: 'bg-city-info/10 text-city-foreground',
    outline: 'border border-city-info/40 bg-transparent text-city-foreground',
  },
  success: {
    solid: 'bg-city-success/20 text-city-foreground',
    subtle: 'bg-city-success/10 text-city-foreground',
    outline: 'border border-city-success/40 bg-transparent text-city-foreground',
  },
  warning: {
    solid: 'bg-city-warning/20 text-city-foreground',
    subtle: 'bg-city-warning/10 text-city-foreground',
    outline: 'border border-city-warning/40 bg-transparent text-city-foreground',
  },
  destructive: {
    solid: 'bg-city-destructive text-city-destructive-foreground',
    subtle: 'bg-city-destructive/10 text-city-destructive',
    outline: 'border border-city-destructive/40 bg-transparent text-city-destructive',
  },
};

const badgeDotToneClasses: Record<FeedbackTone, string> = {
  neutral: 'bg-city-primary',
  info: 'bg-city-info',
  success: 'bg-city-success',
  warning: 'bg-city-warning',
  destructive: 'bg-city-destructive',
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
    appearance: appearanceProp,
    children,
    className,
    count,
    dot = false,
    render,
    size = 'md',
    tone: toneProp,
    variant = 'solid',
    ...props
  },
  ref,
) {
  const state: BadgeState = {};
  const mode: BadgeMode = dot ? 'dot' : count !== undefined ? 'count' : 'label';
  const legacyPresentation = legacyBadgePresentation[variant];
  const appearance = appearanceProp ?? legacyPresentation.appearance;
  const tone = toneProp ?? legacyPresentation.tone;
  const usesLegacyVariant = appearanceProp === undefined && toneProp === undefined;
  const hasAccessibleName = props['aria-label'] != null || props['aria-labelledby'] != null;
  const role =
    mode === 'dot' && hasAccessibleName && render === undefined
      ? (props.role ?? 'img')
      : props.role;

  return useRender({
    defaultTagName: 'span',
    ref,
    render,
    state,
    props: {
      ...props,
      'aria-hidden': mode === 'dot' && !hasAccessibleName ? true : props['aria-hidden'],
      role,
      children: mode === 'dot' ? undefined : mode === 'count' ? count : children,
      'data-appearance': appearance,
      'data-city-badge': mode,
      'data-city-size': size,
      'data-tone': tone,
      'data-variant': variant,
      className: cn(
        'inline-flex shrink-0 items-center font-medium leading-none',
        mode === 'label' && 'rounded-city-xs',
        mode !== 'dot' && badgeSizeClasses[size],
        mode === 'count' &&
          cn(
            'justify-center rounded-city-full font-semibold tabular-nums',
            badgeCountSizeClasses[size],
          ),
        mode === 'dot' && cn('rounded-city-full p-0', badgeDotSizeClasses[size]),
        mode === 'dot'
          ? usesLegacyVariant
            ? badgeVariantClasses[variant]
            : badgeDotToneClasses[tone]
          : usesLegacyVariant
            ? badgeVariantClasses[variant]
            : badgePresentationClasses[tone][appearance],
        resolveClassName(className, state),
      ),
    },
  });
});

Badge.displayName = 'Badge';
