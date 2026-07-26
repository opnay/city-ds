'use client';

import * as React from 'react';
import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group';

import { Checkbox, type CheckboxProps } from '../checkbox';
import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { ControlSize } from '../../types';

const CheckboxGroupSizeContext = React.createContext<ControlSize>('md');

export interface CheckboxGroupProps extends Omit<BaseCheckboxGroup.Props, 'className'> {
  className?: StateClassName<BaseCheckboxGroup.State>;
  size?: ControlSize;
}

export const CheckboxGroupRoot = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  function CheckboxGroupRoot({ className, size = 'md', ...props }, ref) {
    return (
      <CheckboxGroupSizeContext.Provider value={size}>
        <BaseCheckboxGroup
          {...props}
          ref={ref}
          data-city-size={size}
          className={(state) =>
            cn('grid gap-2 data-[disabled]:cursor-not-allowed', resolveClassName(className, state))
          }
        />
      </CheckboxGroupSizeContext.Provider>
    );
  },
);

CheckboxGroupRoot.displayName = 'CheckboxGroup.Root';

export interface CheckboxGroupItemProps extends CheckboxProps {
  labelClassName?: string;
}

export const CheckboxGroupItem = React.forwardRef<HTMLElement, CheckboxGroupItemProps>(
  function CheckboxGroupItem(
    {
      children,
      className,
      labelClassName,
      size,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      ...props
    },
    ref,
  ) {
    const inheritedSize = React.useContext(CheckboxGroupSizeContext);
    const generatedLabelId = React.useId();
    const hasExplicitAccessibleName = ariaLabel !== undefined || ariaLabelledBy !== undefined;

    return (
      <label
        className={cn(
          'text-city-foreground flex w-fit cursor-pointer items-center gap-2 text-sm has-data-[disabled]:cursor-not-allowed has-data-[disabled]:opacity-50',
          labelClassName,
        )}
      >
        <Checkbox
          {...props}
          ref={ref}
          aria-label={ariaLabel}
          aria-labelledby={hasExplicitAccessibleName ? ariaLabelledBy : generatedLabelId}
          className={(state) =>
            cn('data-[disabled]:opacity-100', resolveClassName(className, state))
          }
          size={size ?? inheritedSize}
        />
        <span id={hasExplicitAccessibleName ? undefined : generatedLabelId}>{children}</span>
      </label>
    );
  },
);

CheckboxGroupItem.displayName = 'CheckboxGroup.Item';

export const CheckboxGroup = Object.assign(CheckboxGroupRoot, {
  Item: CheckboxGroupItem,
});
