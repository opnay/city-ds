'use client';

import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';

import { atomicRectShapeClasses } from '../../lib/atomic-shape';
import { compactStatusTextClasses } from '../../lib/atomic-typography';
import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';

export const KBD_SIZES = ['sm', 'md', 'lg'] as const;

export type KbdSize = (typeof KBD_SIZES)[number];

export interface KbdState extends Record<string, unknown> {
  size: KbdSize;
}

export interface KbdProps extends Omit<useRender.ComponentProps<'kbd', KbdState>, 'className'> {
  className?: StateClassName<KbdState>;
  size?: KbdSize;
}

const kbdSizeClasses: Record<KbdSize, string> = {
  sm: 'h-5 min-w-5 px-1',
  md: 'h-6 min-w-6 px-1.5',
  lg: 'h-7 min-w-7 px-2',
};

export const Kbd = React.forwardRef<HTMLElement, KbdProps>(function Kbd(
  { className, render, size = 'md', ...props },
  ref,
) {
  const state: KbdState = { size };

  return useRender({
    defaultTagName: 'kbd',
    ref,
    render,
    state,
    props: {
      ...props,
      'data-city-kbd': '',
      'data-city-size': size,
      className: cn(
        atomicRectShapeClasses.compact,
        'inline-flex shrink-0 items-center justify-center border border-city-border bg-city-muted pt-px font-mono font-medium leading-none whitespace-nowrap text-city-foreground',
        kbdSizeClasses[size],
        compactStatusTextClasses[size],
        resolveClassName(className, state),
      ),
    },
  });
});

Kbd.displayName = 'Kbd';
