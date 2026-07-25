'use client';

import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';

import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';

export const SKELETON_VARIANTS = ['text', 'circular', 'rectangular'] as const;
export const SKELETON_SIZES = ['sm', 'md', 'lg'] as const;

export type SkeletonVariant = (typeof SKELETON_VARIANTS)[number];
export type SkeletonSize = (typeof SKELETON_SIZES)[number];

export interface SkeletonState extends Record<string, unknown> {
  size: SkeletonSize;
  variant: SkeletonVariant;
}

export interface SkeletonProps extends Omit<
  useRender.ComponentProps<'span', SkeletonState>,
  'aria-hidden' | 'className'
> {
  className?: StateClassName<SkeletonState>;
  size?: SkeletonSize;
  variant?: SkeletonVariant;
}

const skeletonSizeClasses: Record<SkeletonVariant, Record<SkeletonSize, string>> = {
  text: {
    sm: 'w-24 text-sm',
    md: 'w-32 text-base',
    lg: 'w-48 text-lg',
  },
  circular: {
    sm: 'size-8',
    md: 'size-10',
    lg: 'size-12',
  },
  rectangular: {
    sm: 'h-16 w-full',
    md: 'h-24 w-full',
    lg: 'h-32 w-full',
  },
};

const skeletonVariantClasses: Record<SkeletonVariant, string> = {
  text: 'rounded-city-xs',
  circular: 'rounded-full',
  rectangular: 'rounded-city-md',
};

export const Skeleton = React.forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  {
    'aria-label': _ariaLabel,
    'aria-labelledby': _ariaLabelledBy,
    className,
    render,
    role: _role,
    size = 'md',
    variant = 'text',
    ...props
  },
  ref,
) {
  void _ariaLabel;
  void _ariaLabelledBy;
  void _role;

  const state: SkeletonState = { size, variant };

  return useRender({
    defaultTagName: 'span',
    ref,
    render,
    state,
    props: {
      ...props,
      'aria-hidden': true,
      'data-size': size,
      'data-variant': variant,
      className: cn(
        'city-skeleton bg-city-muted block max-w-full shrink-0 overflow-hidden',
        skeletonVariantClasses[variant],
        skeletonSizeClasses[variant][size],
        resolveClassName(className, state),
      ),
    },
  });
});

Skeleton.displayName = 'Skeleton';
