'use client';

import * as React from 'react';
import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset';

import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';

export type FieldsetRootProps = Omit<BaseFieldset.Root.Props, 'className'> & {
  className?: StateClassName<BaseFieldset.Root.State>;
};

export const FieldsetRoot = React.forwardRef<HTMLFieldSetElement, FieldsetRootProps>(
  function FieldsetRoot({ className, ...props }, ref) {
    return (
      <BaseFieldset.Root
        {...props}
        ref={ref}
        className={(state) =>
          cn(
            'border-city-border rounded-city-md grid gap-4 border p-4 disabled:cursor-not-allowed disabled:opacity-60',
            resolveClassName(className, state),
          )
        }
      />
    );
  },
);

FieldsetRoot.displayName = 'Fieldset.Root';

export type FieldsetLegendProps = Omit<BaseFieldset.Legend.Props, 'className'> & {
  className?: StateClassName<BaseFieldset.Legend.State>;
};

export const FieldsetLegend = React.forwardRef<HTMLDivElement, FieldsetLegendProps>(
  function FieldsetLegend({ className, ...props }, ref) {
    return (
      <BaseFieldset.Legend
        {...props}
        ref={ref}
        className={(state) =>
          cn(
            'text-city-foreground text-sm leading-none font-semibold data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
            resolveClassName(className, state),
          )
        }
      />
    );
  },
);

FieldsetLegend.displayName = 'Fieldset.Legend';

export type FieldsetContentProps = React.HTMLAttributes<HTMLDivElement>;

export const FieldsetContent = React.forwardRef<HTMLDivElement, FieldsetContentProps>(
  function FieldsetContent({ className, ...props }, ref) {
    return <div {...props} ref={ref} className={cn('grid gap-3', className)} />;
  },
);

FieldsetContent.displayName = 'Fieldset.Content';

export type FieldsetDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export const FieldsetDescription = React.forwardRef<HTMLParagraphElement, FieldsetDescriptionProps>(
  function FieldsetDescription({ className, ...props }, ref) {
    return (
      <p
        {...props}
        ref={ref}
        className={cn('text-city-muted-foreground -mt-2 text-xs leading-5', className)}
      />
    );
  },
);

FieldsetDescription.displayName = 'Fieldset.Description';

export type FieldsetErrorProps = React.HTMLAttributes<HTMLParagraphElement>;

export const FieldsetError = React.forwardRef<HTMLParagraphElement, FieldsetErrorProps>(
  function FieldsetError({ className, ...props }, ref) {
    return (
      <p
        {...props}
        ref={ref}
        className={cn('text-city-destructive -mt-2 text-xs leading-5', className)}
      />
    );
  },
);

FieldsetError.displayName = 'Fieldset.Error';

export const Fieldset = {
  Root: FieldsetRoot,
  Legend: FieldsetLegend,
  Content: FieldsetContent,
  Description: FieldsetDescription,
  Error: FieldsetError,
};
