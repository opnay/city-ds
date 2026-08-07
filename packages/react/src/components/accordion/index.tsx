'use client';

import * as React from 'react';
import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import type {
  AccordionHeaderProps as BaseAccordionHeaderProps,
  AccordionHeaderState,
  AccordionItemProps as BaseAccordionItemProps,
  AccordionItemState,
  AccordionPanelProps as BaseAccordionPanelProps,
  AccordionPanelState,
  AccordionRootProps as BaseAccordionRootProps,
  AccordionRootState,
  AccordionTriggerProps as BaseAccordionTriggerProps,
  AccordionTriggerState,
} from '@base-ui/react/accordion';
import { ChevronDown } from 'lucide-react';

import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';

function classes<State>(className: StateClassName<State> | undefined, defaults: string) {
  return (state: State) => cn(defaults, resolveClassName(className, state));
}

export interface AccordionRootProps<Value = unknown> extends Omit<
  BaseAccordionRootProps<Value>,
  'className'
> {
  className?: StateClassName<AccordionRootState<Value>>;
}
export interface AccordionItemProps extends Omit<BaseAccordionItemProps, 'className'> {
  className?: StateClassName<AccordionItemState>;
}
export interface AccordionHeaderProps extends Omit<BaseAccordionHeaderProps, 'className'> {
  className?: StateClassName<AccordionHeaderState>;
}
export interface AccordionTriggerProps extends Omit<BaseAccordionTriggerProps, 'className'> {
  className?: StateClassName<AccordionTriggerState>;
}
export interface AccordionPanelProps extends Omit<BaseAccordionPanelProps, 'className'> {
  className?: StateClassName<AccordionPanelState>;
}

export const AccordionRoot = React.forwardRef<HTMLDivElement, AccordionRootProps>(
  ({ className, ...props }, ref) => (
    <BaseAccordion.Root
      {...props}
      ref={ref}
      className={classes(
        className,
        'border-city-border bg-city-surface text-city-foreground divide-city-border rounded-city-md w-full divide-y overflow-hidden border',
      )}
    />
  ),
);

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, ...props }, ref) => (
    <BaseAccordion.Item
      {...props}
      ref={ref}
      className={classes(className, 'group/city-accordion-item')}
    />
  ),
);

export const AccordionHeader = React.forwardRef<HTMLHeadingElement, AccordionHeaderProps>(
  ({ className, ...props }, ref) => (
    <BaseAccordion.Header
      {...props}
      ref={ref}
      className={classes(className, 'm-0 text-sm font-medium')}
    />
  ),
);

export const AccordionTrigger = React.forwardRef<HTMLElement, AccordionTriggerProps>(
  ({ className, children, ...props }, ref) => (
    <BaseAccordion.Trigger
      {...props}
      ref={ref}
      className={classes(
        className,
        'group/city-accordion-trigger focus-visible:ring-city-ring flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium transition-opacity outline-none active:opacity-70 focus-visible:ring-2 data-[disabled]:pointer-events-none data-[disabled]:opacity-45',
      )}
    >
      <span className="min-w-0 flex-1 decoration-city-muted-foreground underline-offset-4 group-hover/city-accordion-trigger:underline">
        {children}
      </span>
      <ChevronDown
        aria-hidden="true"
        className="shrink-0 text-city-muted-foreground transition-[color,transform] duration-200 group-hover/city-accordion-trigger:text-city-foreground motion-reduce:transition-none [[data-panel-open]_&]:rotate-180"
        size={16}
        strokeWidth={1.8}
      />
    </BaseAccordion.Trigger>
  ),
);

export const AccordionPanel = React.forwardRef<HTMLDivElement, AccordionPanelProps>(
  ({ className, ...props }, ref) => (
    <BaseAccordion.Panel
      {...props}
      ref={ref}
      className={classes(
        className,
        'text-city-muted-foreground overflow-hidden px-4 pb-4 text-sm leading-6 transition-[height] duration-200 motion-reduce:transition-none',
      )}
    />
  ),
);

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Header: AccordionHeader,
  Trigger: AccordionTrigger,
  Panel: AccordionPanel,
};
