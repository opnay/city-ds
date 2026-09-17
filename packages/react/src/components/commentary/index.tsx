'use client';

import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';
import { cn } from '../../lib/cn';
import type { Density } from '../../types';
import { useDensity } from '../density-provider';

export type CommentaryAppearance = 'plain' | 'bubble';
export type CommentaryAlign = 'start' | 'end';
const CommentaryContext = React.createContext<{
  appearance: CommentaryAppearance;
  density: Density;
}>({ appearance: 'plain', density: 'comfortable' });

export interface CommentaryRootProps extends Omit<useRender.ComponentProps<'div'>, 'className'> {
  className?: string;
  appearance?: CommentaryAppearance;
  align?: CommentaryAlign;
  density?: Density;
}

export const CommentaryRoot = React.forwardRef<HTMLDivElement, CommentaryRootProps>(
  function CommentaryRoot(
    { appearance = 'plain', align = 'start', density: densityProp, className, render, ...props },
    ref,
  ) {
    const density = useDensity(densityProp);
    const context = React.useMemo(() => ({ appearance, density }), [appearance, density]);
    const element = useRender({
      defaultTagName: 'div',
      ref,
      render,
      props: {
        ...props,
        'data-city-commentary': '',
        'data-city-appearance': appearance,
        'data-city-align': align,
        'data-city-density': density,
        className: cn(
          'flex min-w-0 flex-col text-sm text-city-foreground',
          align === 'end' ? 'items-end' : 'items-start',
          density === 'compact' ? 'gap-2' : 'gap-3',
          className,
        ),
      },
    });
    return <CommentaryContext.Provider value={context}>{element}</CommentaryContext.Provider>;
  },
);

export interface CommentaryHeaderProps extends Omit<useRender.ComponentProps<'div'>, 'className'> {
  className?: string;
}
export const CommentaryHeader = React.forwardRef<HTMLDivElement, CommentaryHeaderProps>(
  function CommentaryHeader({ className, render, ...props }, ref) {
    return useRender({
      defaultTagName: 'div',
      ref,
      render,
      props: {
        ...props,
        'data-city-commentary-header': '',
        className: cn(
          'flex min-w-0 max-w-full flex-wrap items-center gap-x-2 gap-y-1 [overflow-wrap:anywhere]',
          className,
        ),
      },
    });
  },
);

export interface CommentaryAuthorProps extends Omit<useRender.ComponentProps<'span'>, 'className'> {
  className?: string;
}
export const CommentaryAuthor = React.forwardRef<HTMLSpanElement, CommentaryAuthorProps>(
  function CommentaryAuthor({ className, render, ...props }, ref) {
    return useRender({
      defaultTagName: 'span',
      ref,
      render,
      props: {
        ...props,
        'data-city-commentary-author': '',
        className: cn('min-w-0 font-medium [overflow-wrap:anywhere]', className),
      },
    });
  },
);

export interface CommentaryMetaProps extends Omit<useRender.ComponentProps<'span'>, 'className'> {
  className?: string;
}
export const CommentaryMeta = React.forwardRef<HTMLSpanElement, CommentaryMetaProps>(
  function CommentaryMeta({ className, render, ...props }, ref) {
    return useRender({
      defaultTagName: 'span',
      ref,
      render,
      props: {
        ...props,
        'data-city-commentary-meta': '',
        className: cn(
          'min-w-0 text-xs text-city-muted-foreground [overflow-wrap:anywhere]',
          className,
        ),
      },
    });
  },
);

export interface CommentaryContentProps extends Omit<useRender.ComponentProps<'div'>, 'className'> {
  className?: string;
}
export const CommentaryContent = React.forwardRef<HTMLDivElement, CommentaryContentProps>(
  function CommentaryContent({ className, render, ...props }, ref) {
    const { appearance, density } = React.useContext(CommentaryContext);
    return useRender({
      defaultTagName: 'div',
      ref,
      render,
      props: {
        ...props,
        'data-city-commentary-content': '',
        className: cn(
          'min-w-0 max-w-full leading-6 [overflow-wrap:anywhere] [&_pre]:max-w-full [&_pre]:overflow-x-auto',
          appearance === 'bubble' && 'rounded-city-lg bg-city-muted',
          appearance === 'bubble' && (density === 'compact' ? 'px-3 py-2' : 'px-4 py-3'),
          className,
        ),
      },
    });
  },
);

export interface CommentaryActionsProps extends Omit<useRender.ComponentProps<'div'>, 'className'> {
  className?: string;
}
export const CommentaryActions = React.forwardRef<HTMLDivElement, CommentaryActionsProps>(
  function CommentaryActions({ className, render, ...props }, ref) {
    return useRender({
      defaultTagName: 'div',
      ref,
      render,
      props: {
        ...props,
        'data-city-commentary-actions': '',
        className: cn('flex min-w-0 max-w-full flex-wrap items-center gap-2', className),
      },
    });
  },
);

export const Commentary = {
  Root: CommentaryRoot,
  Header: CommentaryHeader,
  Author: CommentaryAuthor,
  Meta: CommentaryMeta,
  Content: CommentaryContent,
  Actions: CommentaryActions,
};
