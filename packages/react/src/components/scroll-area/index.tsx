'use client';

import * as React from 'react';
import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import type {
  ScrollAreaContentProps as BaseScrollAreaContentProps,
  ScrollAreaContentState,
  ScrollAreaCornerProps as BaseScrollAreaCornerProps,
  ScrollAreaCornerState,
  ScrollAreaRootProps as BaseScrollAreaRootProps,
  ScrollAreaRootState,
  ScrollAreaScrollbarProps as BaseScrollAreaScrollbarProps,
  ScrollAreaScrollbarState,
  ScrollAreaThumbProps as BaseScrollAreaThumbProps,
  ScrollAreaThumbState,
  ScrollAreaViewportProps as BaseScrollAreaViewportProps,
  ScrollAreaViewportState,
} from '@base-ui/react/scroll-area';

import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';

function classes<State>(className: StateClassName<State> | undefined, defaults: string) {
  return (state: State) => cn(defaults, resolveClassName(className, state));
}

export type ScrollAreaRootProps = Omit<BaseScrollAreaRootProps, 'className'> & {
  className?: StateClassName<ScrollAreaRootState>;
};

export type ScrollAreaViewportProps = Omit<BaseScrollAreaViewportProps, 'className'> & {
  className?: StateClassName<ScrollAreaViewportState>;
};

export type ScrollAreaContentProps = Omit<BaseScrollAreaContentProps, 'className'> & {
  className?: StateClassName<ScrollAreaContentState>;
};

export type ScrollAreaScrollbarProps = Omit<BaseScrollAreaScrollbarProps, 'className'> & {
  className?: StateClassName<ScrollAreaScrollbarState>;
};

export type ScrollAreaThumbProps = Omit<BaseScrollAreaThumbProps, 'className'> & {
  className?: StateClassName<ScrollAreaThumbState>;
};

export type ScrollAreaCornerProps = Omit<BaseScrollAreaCornerProps, 'className'> & {
  className?: StateClassName<ScrollAreaCornerState>;
};

export const ScrollAreaRoot = React.forwardRef<HTMLDivElement, ScrollAreaRootProps>(
  ({ className, ...props }, ref) => (
    <BaseScrollArea.Root
      {...props}
      ref={ref}
      data-city-scroll-area-root=""
      className={classes(className, 'relative overflow-hidden')}
    />
  ),
);

ScrollAreaRoot.displayName = 'ScrollArea.Root';

export const ScrollAreaViewport = React.forwardRef<HTMLDivElement, ScrollAreaViewportProps>(
  ({ className, ...props }, ref) => (
    <BaseScrollArea.Viewport
      {...props}
      ref={ref}
      data-city-scroll-area-viewport=""
      className={classes(
        className,
        'focus-visible:ring-city-ring focus-visible:ring-offset-city-background size-full min-h-0 min-w-0 overscroll-contain outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-offset-2',
      )}
    />
  ),
);

ScrollAreaViewport.displayName = 'ScrollArea.Viewport';

export const ScrollAreaContent = React.forwardRef<HTMLDivElement, ScrollAreaContentProps>(
  ({ className, ...props }, ref) => (
    <BaseScrollArea.Content
      {...props}
      ref={ref}
      data-city-scroll-area-content=""
      className={classes(className, 'min-w-full')}
    />
  ),
);

ScrollAreaContent.displayName = 'ScrollArea.Content';

export const ScrollAreaScrollbar = React.forwardRef<HTMLDivElement, ScrollAreaScrollbarProps>(
  ({ className, ...props }, ref) => (
    <BaseScrollArea.Scrollbar
      {...props}
      ref={ref}
      data-city-scroll-area-scrollbar=""
      className={classes(
        className,
        'flex touch-none select-none bg-transparent p-0.5 opacity-0 transition-[background-color,opacity] duration-(--city-duration-fast) data-[hovering]:bg-city-accent data-[hovering]:opacity-100 data-[scrolling]:bg-city-accent data-[scrolling]:opacity-100 data-[orientation=vertical]:w-2.5 data-[orientation=vertical]:flex-col data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-row',
      )}
    />
  ),
);

ScrollAreaScrollbar.displayName = 'ScrollArea.Scrollbar';

export const ScrollAreaThumb = React.forwardRef<HTMLDivElement, ScrollAreaThumbProps>(
  ({ className, ...props }, ref) => (
    <BaseScrollArea.Thumb
      {...props}
      ref={ref}
      data-city-scroll-area-thumb=""
      className={classes(
        className,
        'cursor-grab rounded-full bg-city-muted-foreground active:cursor-grabbing data-[orientation=vertical]:w-full data-[orientation=horizontal]:h-full data-[scrolling]:bg-city-foreground',
      )}
    />
  ),
);

ScrollAreaThumb.displayName = 'ScrollArea.Thumb';

export const ScrollAreaCorner = React.forwardRef<HTMLDivElement, ScrollAreaCornerProps>(
  ({ className, ...props }, ref) => (
    <BaseScrollArea.Corner
      {...props}
      ref={ref}
      data-city-scroll-area-corner=""
      className={classes(className, 'bg-city-accent')}
    />
  ),
);

ScrollAreaCorner.displayName = 'ScrollArea.Corner';

export const ScrollArea = {
  Root: ScrollAreaRoot,
  Viewport: ScrollAreaViewport,
  Content: ScrollAreaContent,
  Scrollbar: ScrollAreaScrollbar,
  Thumb: ScrollAreaThumb,
  Corner: ScrollAreaCorner,
} as const;
