'use client';

import * as React from 'react';
import {
  Separator as BaseSeparator,
  type SeparatorProps as BaseSeparatorProps,
  type SeparatorState as BaseSeparatorState,
} from '@base-ui/react/separator';

import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';

export interface DividerProps extends Omit<
  BaseSeparatorProps,
  'aria-orientation' | 'children' | 'className' | 'orientation' | 'role'
> {
  className?: StateClassName<BaseSeparatorState>;
  label?: string;
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(function Divider(
  {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    className,
    label,
    render,
    ...props
  },
  ref,
) {
  const labeled = label !== undefined;
  const resolvedAriaLabel = ariaLabel ?? (ariaLabelledBy === undefined ? label : undefined);

  return (
    <BaseSeparator
      {...props}
      ref={ref}
      render={render}
      aria-label={resolvedAriaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-orientation="horizontal"
      data-city-divider=""
      data-city-divider-labeled={labeled ? '' : undefined}
      orientation="horizontal"
      role="separator"
      className={(state) =>
        cn(
          labeled
            ? 'flex w-full min-w-0 items-center gap-3'
            : 'bg-city-border h-px w-full min-w-0 shrink-0',
          resolveClassName(className, state),
        )
      }
    >
      {labeled ? (
        <>
          <span
            aria-hidden="true"
            className="h-px min-w-0 flex-1 bg-city-border"
            data-city-divider-line=""
          />
          <span
            aria-hidden="true"
            className="min-w-0 truncate text-xs leading-none font-medium text-city-muted-foreground"
            data-city-divider-label=""
          >
            {label}
          </span>
          <span
            aria-hidden="true"
            className="h-px min-w-0 flex-1 bg-city-border"
            data-city-divider-line=""
          />
        </>
      ) : undefined}
    </BaseSeparator>
  );
});

Divider.displayName = 'Divider';
