'use client';

import * as React from 'react';
import { Field as BaseField } from '@base-ui/react/field';

import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';

export type FieldRootProps = Omit<BaseField.Root.Props, 'className'> & {
  className?: StateClassName<BaseField.Root.State>;
};

export const FieldRoot = React.forwardRef<HTMLDivElement, FieldRootProps>(function FieldRoot(
  { className, ...props },
  ref,
) {
  return (
    <BaseField.Root
      {...props}
      ref={ref}
      className={(state) => cn('grid gap-1.5', resolveClassName(className, state))}
    />
  );
});

FieldRoot.displayName = 'Field.Root';

export type FieldLabelProps = Omit<BaseField.Label.Props, 'className'> & {
  className?: StateClassName<BaseField.Label.State>;
};

export const FieldLabel = React.forwardRef<HTMLElement, FieldLabelProps>(function FieldLabel(
  { className, ...props },
  ref,
) {
  return (
    <BaseField.Label
      {...props}
      ref={ref}
      className={(state) =>
        cn(
          'text-city-foreground text-sm leading-none font-medium data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
          resolveClassName(className, state),
        )
      }
    />
  );
});

FieldLabel.displayName = 'Field.Label';

export type FieldDescriptionProps = Omit<BaseField.Description.Props, 'className'> & {
  className?: StateClassName<BaseField.Description.State>;
};

export const FieldDescription = React.forwardRef<HTMLParagraphElement, FieldDescriptionProps>(
  function FieldDescription({ className, ...props }, ref) {
    return (
      <BaseField.Description
        {...props}
        ref={ref}
        className={(state) =>
          cn('text-city-muted-foreground text-xs leading-5', resolveClassName(className, state))
        }
      />
    );
  },
);

FieldDescription.displayName = 'Field.Description';

export type FieldErrorProps = Omit<BaseField.Error.Props, 'className'> & {
  className?: StateClassName<BaseField.Error.State>;
};

export const FieldError = React.forwardRef<HTMLDivElement, FieldErrorProps>(function FieldError(
  { className, ...props },
  ref,
) {
  return (
    <BaseField.Error
      {...props}
      ref={ref}
      className={(state) =>
        cn('text-city-destructive text-xs leading-5', resolveClassName(className, state))
      }
    />
  );
});

FieldError.displayName = 'Field.Error';

export type FieldControlProps = Omit<BaseField.Control.Props, 'className'> & {
  className?: StateClassName<BaseField.Control.State>;
};

export const FieldControl = React.forwardRef<HTMLElement, FieldControlProps>(function FieldControl(
  { className, ...props },
  ref,
) {
  return (
    <BaseField.Control
      {...props}
      ref={ref}
      className={(state) =>
        cn(
          'rounded-city-sm border-city-input bg-city-background text-city-foreground placeholder:text-city-muted-foreground focus-visible:border-city-ring focus-visible:ring-city-ring data-[invalid]:border-city-destructive data-[invalid]:focus-visible:ring-city-destructive flex w-full border px-3 py-2 text-sm transition-colors outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
          resolveClassName(className, state),
        )
      }
    />
  );
});

FieldControl.displayName = 'Field.Control';

export const Field = {
  Root: FieldRoot,
  Label: FieldLabel,
  Description: FieldDescription,
  Error: FieldError,
  Control: FieldControl,
};
