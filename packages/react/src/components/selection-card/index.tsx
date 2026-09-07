'use client';

import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';

import { cn } from '../../lib/cn';

export interface SelectionCardProps extends Omit<useRender.ComponentProps<'label'>, 'className'> {
  className?: string;
}

export const SelectionCardRoot = React.forwardRef<HTMLLabelElement, SelectionCardProps>(
  function SelectionCard({ className, render, ...props }, ref) {
    return useRender({
      defaultTagName: 'label',
      ref,
      render,
      props: {
        ...props,
        className: cn(
          'border-city-border bg-city-background text-city-foreground rounded-city-md flex w-full min-w-0 cursor-pointer items-start gap-3 border p-4 text-sm transition-colors',
          '[&:not(:has([data-disabled])):hover]:bg-city-muted has-[[aria-checked=true]]:border-city-primary has-[[aria-checked=true]]:bg-city-muted has-[[aria-checked=mixed]]:border-city-primary has-[[aria-checked=mixed]]:bg-city-muted',
          'has-[:focus-visible]:ring-city-ring has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-city-background has-data-[disabled]:cursor-not-allowed has-data-[disabled]:opacity-50',
          '[&_[role=radio]]:focus-visible:ring-0 [&_[role=checkbox]]:focus-visible:ring-0 [&_[role=switch]]:focus-visible:ring-0 [&_[role=checkbox][data-disabled]]:opacity-100 [&_[role=switch][data-disabled]]:opacity-100',
          className,
        ),
        'data-city-selection-card': '',
      },
    });
  },
);

SelectionCardRoot.displayName = 'SelectionCard';

export type SelectionCardContentProps = React.ComponentPropsWithoutRef<'span'>;

export const SelectionCardContent = React.forwardRef<HTMLSpanElement, SelectionCardContentProps>(
  function SelectionCardContent({ className, ...props }, ref) {
    return <span {...props} ref={ref} className={cn('grid min-w-0 flex-1 gap-1', className)} />;
  },
);

SelectionCardContent.displayName = 'SelectionCard.Content';

export type SelectionCardTitleProps = React.ComponentPropsWithoutRef<'span'>;

export const SelectionCardTitle = React.forwardRef<HTMLSpanElement, SelectionCardTitleProps>(
  function SelectionCardTitle({ className, ...props }, ref) {
    return <span {...props} ref={ref} className={cn('text-sm leading-5 font-medium', className)} />;
  },
);

SelectionCardTitle.displayName = 'SelectionCard.Title';

export type SelectionCardDescriptionProps = React.ComponentPropsWithoutRef<'span'>;

export const SelectionCardDescription = React.forwardRef<
  HTMLSpanElement,
  SelectionCardDescriptionProps
>(function SelectionCardDescription({ className, ...props }, ref) {
  return (
    <span
      {...props}
      ref={ref}
      className={cn('text-city-muted-foreground text-xs leading-5', className)}
    />
  );
});

SelectionCardDescription.displayName = 'SelectionCard.Description';

export const SelectionCard = Object.assign(SelectionCardRoot, {
  Content: SelectionCardContent,
  Title: SelectionCardTitle,
  Description: SelectionCardDescription,
});
