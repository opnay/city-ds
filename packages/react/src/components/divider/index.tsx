'use client';

import * as React from 'react';
import {
  Separator as BaseSeparator,
  type SeparatorProps as BaseSeparatorProps,
  type SeparatorState as BaseSeparatorState,
} from '@base-ui/react/separator';

import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';

interface DividerBaseProps extends Omit<
  BaseSeparatorProps,
  'aria-orientation' | 'children' | 'className' | 'orientation' | 'role'
> {
  className?: StateClassName<BaseSeparatorState>;
}

export type DividerProps =
  | (DividerBaseProps & {
      children?: never;
      orientation?: BaseSeparatorState['orientation'];
      plain?: never;
    })
  | (DividerBaseProps & {
      children: React.ReactNode;
      orientation?: 'horizontal';
      plain?: boolean;
    });

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(function Divider(
  {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    className,
    children,
    orientation,
    plain,
    render,
    ...props
  },
  ref,
) {
  const labeled = React.Children.count(children) > 0;
  const resolvedOrientation = labeled ? 'horizontal' : (orientation ?? 'horizontal');
  const labelId = React.useId();
  const resolvedAriaLabelledBy =
    ariaLabelledBy ?? (ariaLabel === undefined && labeled ? labelId : undefined);

  return (
    <BaseSeparator
      {...props}
      ref={ref}
      render={render}
      aria-label={ariaLabel}
      aria-labelledby={resolvedAriaLabelledBy}
      aria-orientation={resolvedOrientation}
      data-city-divider=""
      data-city-divider-labeled={labeled ? '' : undefined}
      data-city-divider-plain={labeled && plain ? '' : undefined}
      orientation={resolvedOrientation}
      role="separator"
      className={(state) =>
        cn(
          labeled
            ? 'flex w-full min-w-0 items-center gap-3'
            : resolvedOrientation === 'vertical'
              ? 'bg-city-border h-full min-h-0 w-px shrink-0 self-stretch'
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
            id={resolvedAriaLabelledBy === labelId ? labelId : undefined}
            className={cn(
              'min-w-0 truncate text-xs leading-none text-city-muted-foreground',
              plain ? 'font-normal' : 'font-medium',
            )}
            data-city-divider-label=""
          >
            {children}
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
