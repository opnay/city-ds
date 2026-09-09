'use client';

import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';
import { cn } from '../../lib/cn';
import type { Density, FeedbackTone } from '../../types';
import { feedbackToneStyles } from '../../lib/feedback-tone-styles';
import { useDensity } from '../density-provider';

const TimelineContext = React.createContext<Density>('comfortable');

export interface TimelineRootProps extends Omit<useRender.ComponentProps<'ol'>, 'className'> {
  className?: string;
  density?: Density;
}

export const TimelineRoot = React.forwardRef<HTMLOListElement, TimelineRootProps>(
  function TimelineRoot({ density: densityProp, className, render, ...props }, ref) {
    const density = useDensity(densityProp);
    const element = useRender({
      defaultTagName: 'ol',
      ref,
      render,
      props: {
        role: 'list',
        ...props,
        className: cn('m-0 min-w-0 list-none p-0 text-sm text-city-foreground', className),
        'data-city-timeline': '',
        'data-city-density': density,
      },
    });
    return <TimelineContext.Provider value={density}>{element}</TimelineContext.Provider>;
  },
);

export interface TimelineItemProps extends Omit<useRender.ComponentProps<'li'>, 'className'> {
  className?: string;
}

export const TimelineItem = React.forwardRef<HTMLLIElement, TimelineItemProps>(
  function TimelineItem({ className, render, ...props }, ref) {
    const density = React.useContext(TimelineContext);
    return useRender({
      defaultTagName: 'li',
      ref,
      render,
      props: {
        ...props,
        className: cn(
          'relative grid min-w-0 grid-cols-[1.5rem_minmax(0,1fr)] gap-x-3 last:pb-0 [&:last-child>[data-city-timeline-connector]]:hidden',
          density === 'compact' ? 'pb-4' : 'pb-6',
          className,
        ),
        'data-city-timeline-item': '',
      },
    });
  },
);

export interface TimelineIndicatorProps extends Omit<useRender.ComponentProps<'div'>, 'className'> {
  className?: string;
  tone?: FeedbackTone;
}

export const TimelineIndicator = React.forwardRef<HTMLDivElement, TimelineIndicatorProps>(
  function TimelineIndicator(
    {
      children = <span className="size-1.5 rounded-full bg-current" />,
      tone = 'neutral',
      className,
      render,
      ...props
    },
    ref,
  ) {
    const toneStyles = feedbackToneStyles[tone];
    return useRender({
      defaultTagName: 'div',
      ref,
      render,
      props: {
        'aria-hidden': true,
        ...props,
        children,
        className: cn(
          'relative z-10 col-start-1 row-start-1 flex size-6 items-center justify-center rounded-full border [&_svg]:size-3.5',
          toneStyles.border,
          tone === 'neutral'
            ? 'bg-city-background text-city-muted-foreground'
            : cn(toneStyles.fill, toneStyles.fillForeground),
          className,
        ),
        'data-city-timeline-indicator': '',
        'data-tone': tone,
      },
    });
  },
);

export interface TimelineConnectorProps extends Omit<useRender.ComponentProps<'div'>, 'className'> {
  className?: string;
}

export const TimelineConnector = React.forwardRef<HTMLDivElement, TimelineConnectorProps>(
  function TimelineConnector({ className, render, ...props }, ref) {
    return useRender({
      defaultTagName: 'div',
      ref,
      render,
      props: {
        'aria-hidden': true,
        ...props,
        className: cn(
          'pointer-events-none absolute start-3 top-6 bottom-0 w-px -translate-x-1/2 bg-city-border rtl:translate-x-1/2',
          className,
        ),
        'data-city-timeline-connector': '',
      },
    });
  },
);

export interface TimelineContentProps extends Omit<useRender.ComponentProps<'div'>, 'className'> {
  className?: string;
}

export const TimelineContent = React.forwardRef<HTMLDivElement, TimelineContentProps>(
  function TimelineContent({ className, render, ...props }, ref) {
    return useRender({
      defaultTagName: 'div',
      ref,
      render,
      props: {
        ...props,
        className: cn(
          'col-start-2 row-start-1 grid min-w-0 gap-1 [overflow-wrap:anywhere]',
          className,
        ),
        'data-city-timeline-content': '',
      },
    });
  },
);

export interface TimelineTitleProps extends Omit<useRender.ComponentProps<'p'>, 'className'> {
  className?: string;
}

export const TimelineTitle = React.forwardRef<HTMLParagraphElement, TimelineTitleProps>(
  function TimelineTitle({ className, render, ...props }, ref) {
    return useRender({
      defaultTagName: 'p',
      ref,
      render,
      props: {
        ...props,
        className: cn(
          'm-0 min-w-0 text-sm leading-6 font-medium [overflow-wrap:anywhere]',
          className,
        ),
        'data-city-timeline-title': '',
      },
    });
  },
);

export interface TimelineDescriptionProps extends Omit<useRender.ComponentProps<'p'>, 'className'> {
  className?: string;
}

export const TimelineDescription = React.forwardRef<HTMLParagraphElement, TimelineDescriptionProps>(
  function TimelineDescription({ className, render, ...props }, ref) {
    return useRender({
      defaultTagName: 'p',
      ref,
      render,
      props: {
        ...props,
        className: cn(
          'm-0 min-w-0 text-sm text-city-muted-foreground [overflow-wrap:anywhere]',
          className,
        ),
        'data-city-timeline-description': '',
      },
    });
  },
);

export interface TimelineTimeProps extends Omit<useRender.ComponentProps<'time'>, 'className'> {
  className?: string;
}

export const TimelineTime = React.forwardRef<HTMLTimeElement, TimelineTimeProps>(
  function TimelineTime({ className, render, ...props }, ref) {
    return useRender({
      defaultTagName: 'time',
      ref,
      render,
      props: {
        ...props,
        className: cn(
          'min-w-0 text-xs leading-6 text-city-muted-foreground [overflow-wrap:anywhere]',
          className,
        ),
        'data-city-timeline-time': '',
      },
    });
  },
);

TimelineRoot.displayName = 'Timeline.Root';
TimelineItem.displayName = 'Timeline.Item';
TimelineIndicator.displayName = 'Timeline.Indicator';
TimelineConnector.displayName = 'Timeline.Connector';
TimelineContent.displayName = 'Timeline.Content';
TimelineTitle.displayName = 'Timeline.Title';
TimelineDescription.displayName = 'Timeline.Description';
TimelineTime.displayName = 'Timeline.Time';

export const Timeline = {
  Root: TimelineRoot,
  Item: TimelineItem,
  Indicator: TimelineIndicator,
  Connector: TimelineConnector,
  Content: TimelineContent,
  Title: TimelineTitle,
  Description: TimelineDescription,
  Time: TimelineTime,
};
