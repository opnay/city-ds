'use client';

import * as React from 'react';
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { Check, Minus } from 'lucide-react';

import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { ControlSize } from '../../types';

export interface CheckboxProps extends Omit<BaseCheckbox.Root.Props, 'className'> {
  className?: StateClassName<BaseCheckbox.Root.State>;
  size?: ControlSize;
}

const checkboxSizeClasses: Record<ControlSize, string> = {
  sm: 'size-3.5',
  md: 'size-4',
  lg: 'size-5',
};

export type CheckboxIndicatorProps = Omit<BaseCheckbox.Indicator.Props, 'className'> & {
  className?: StateClassName<BaseCheckbox.Indicator.State>;
};

export const CheckboxIndicator = React.forwardRef<HTMLSpanElement, CheckboxIndicatorProps>(
  function CheckboxIndicator({ className, children, ...props }, ref) {
    return (
      <BaseCheckbox.Indicator
        {...props}
        ref={ref}
        className={(state) =>
          cn(
            'flex size-full items-center justify-center text-current',
            resolveClassName(className, state),
          )
        }
      >
        {children ?? (
          <>
            <Check
              aria-hidden="true"
              className="size-3 group-data-[indeterminate]:hidden"
              strokeWidth={3}
            />
            <Minus
              aria-hidden="true"
              className="hidden size-3 group-data-[indeterminate]:block"
              strokeWidth={3}
            />
          </>
        )}
      </BaseCheckbox.Indicator>
    );
  },
);

CheckboxIndicator.displayName = 'Checkbox.Indicator';

const CheckboxRoot = React.forwardRef<HTMLElement, CheckboxProps>(function Checkbox(
  { children, className, size = 'md', ...props },
  ref,
) {
  return (
    <BaseCheckbox.Root
      {...props}
      ref={ref}
      className={(state) =>
        cn(
          'group rounded-city-xs border-city-input bg-city-background text-city-primary-foreground focus-visible:ring-city-ring focus-visible:ring-offset-city-background data-[checked]:border-city-primary data-[checked]:bg-city-primary data-[indeterminate]:border-city-primary data-[indeterminate]:bg-city-primary grid shrink-0 place-items-center border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
          checkboxSizeClasses[size],
          resolveClassName(className, state),
        )
      }
    >
      <CheckboxIndicator />
      {children}
    </BaseCheckbox.Root>
  );
});

CheckboxRoot.displayName = 'Checkbox';

export const Checkbox = Object.assign(CheckboxRoot, {
  Indicator: CheckboxIndicator,
});
