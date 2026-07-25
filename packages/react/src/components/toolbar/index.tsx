'use client';

import * as React from 'react';
import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import type {
  ToolbarButtonProps as BaseToolbarButtonProps,
  ToolbarGroupProps as BaseToolbarGroupProps,
  ToolbarLinkProps as BaseToolbarLinkProps,
  ToolbarRootProps as BaseToolbarRootProps,
  ToolbarSeparatorProps as BaseToolbarSeparatorProps,
} from '@base-ui/react/toolbar';
import {
  Toggle as BaseToggle,
  type ToggleProps as BaseToggleProps,
  type ToggleState as BaseToggleState,
} from '@base-ui/react/toggle';
import {
  ToggleGroup as BaseToggleGroup,
  type ToggleGroupProps as BaseToggleGroupProps,
  type ToggleGroupState as BaseToggleGroupState,
} from '@base-ui/react/toggle-group';

import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { ControlSize } from '../../types';
import type { ButtonVariant } from '../button';

function classes<State>(className: StateClassName<State> | undefined, defaults: string) {
  return (state: State) => cn(defaults, resolveClassName(className, state));
}

export type ToolbarRootProps = Omit<BaseToolbarRootProps, 'className'> & {
  className?: StateClassName<BaseToolbar.Root.State>;
  size?: ControlSize;
};
export type ToolbarButtonProps = Omit<BaseToolbarButtonProps, 'className'> & {
  className?: StateClassName<BaseToolbar.Button.State>;
  size?: ControlSize;
  variant?: ButtonVariant;
};
export type ToolbarLinkProps = Omit<BaseToolbarLinkProps, 'className'> & {
  className?: StateClassName<BaseToolbar.Link.State>;
  size?: ControlSize;
  variant?: Extract<ButtonVariant, 'secondary' | 'outline' | 'ghost'>;
};
export type ToolbarSeparatorProps = Omit<BaseToolbarSeparatorProps, 'className'> & {
  className?: StateClassName<BaseToolbar.Separator.State>;
};
export type ToolbarGroupProps = Omit<BaseToolbarGroupProps, 'className'> & {
  className?: StateClassName<BaseToolbar.Group.State>;
};
export type ToolbarToggleGroupProps<Value extends string = string> = Omit<
  BaseToggleGroupProps<Value>,
  'className'
> & {
  className?: StateClassName<BaseToggleGroupState>;
};
export type ToolbarToggleProps<Value extends string = string> = Omit<
  BaseToggleProps<Value>,
  'className'
> & {
  className?: StateClassName<BaseToggleState>;
  size?: ControlSize;
  variant?: ButtonVariant;
};

type ToolbarContextValue = {
  orientation: NonNullable<BaseToolbarRootProps['orientation']>;
  size: ControlSize;
};

const ToolbarContext = React.createContext<ToolbarContextValue>({
  orientation: 'horizontal',
  size: 'md',
});

const toolbarSizeClasses: Record<ControlSize, string> = {
  sm: 'gap-1 p-1',
  md: 'gap-1.5 p-1.5',
  lg: 'gap-2 p-2',
};

const itemSizeClasses: Record<ControlSize, string> = {
  sm: 'h-8 gap-1.5 px-2.5 text-xs',
  md: 'h-9 gap-2 px-3 text-sm',
  lg: 'h-10 gap-2 px-4 text-sm',
};

const itemVariantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-city-primary text-city-primary-foreground hover:bg-city-primary/90 active:bg-city-primary/80 data-[pressed]:bg-city-primary/80',
  secondary:
    'bg-city-muted text-city-foreground hover:bg-city-muted/70 active:bg-city-muted/50 data-[pressed]:bg-city-foreground data-[pressed]:text-city-background',
  outline:
    'border border-city-border bg-city-background text-city-foreground hover:bg-city-muted active:bg-city-muted/70 data-[pressed]:bg-city-foreground data-[pressed]:text-city-background',
  ghost:
    'text-city-foreground hover:bg-city-muted active:bg-city-muted/70 data-[pressed]:bg-city-muted data-[pressed]:text-city-foreground',
  destructive:
    'bg-city-destructive text-city-destructive-foreground hover:bg-city-destructive/90 active:bg-city-destructive/80 data-[pressed]:bg-city-destructive/80',
};

export const ToolbarRoot = React.forwardRef<HTMLDivElement, ToolbarRootProps>(
  ({ className, orientation = 'horizontal', size = 'md', ...props }, ref) => {
    const contextValue = React.useMemo(() => ({ orientation, size }), [orientation, size]);

    return (
      <ToolbarContext.Provider value={contextValue}>
        <BaseToolbar.Root
          {...props}
          ref={ref}
          orientation={orientation}
          className={(state) =>
            cn(
              'rounded-city-md border-city-border bg-city-surface text-city-foreground inline-flex max-w-full items-center border data-[disabled]:opacity-60 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch',
              toolbarSizeClasses[size],
              resolveClassName(className, state),
            )
          }
        />
      </ToolbarContext.Provider>
    );
  },
);

ToolbarRoot.displayName = 'Toolbar.Root';

export const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, size: sizeProp, variant = 'ghost', ...props }, ref) => {
    const { size: rootSize } = React.useContext(ToolbarContext);
    const size = sizeProp ?? rootSize;

    return (
      <BaseToolbar.Button
        {...props}
        ref={ref}
        className={(state) =>
          cn(
            'rounded-city-sm focus-visible:ring-city-ring focus-visible:ring-offset-city-surface inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[orientation=vertical]:w-full',
            itemSizeClasses[size],
            itemVariantClasses[variant],
            resolveClassName(className, state),
          )
        }
      />
    );
  },
);

ToolbarButton.displayName = 'Toolbar.Button';

export const ToolbarLink = React.forwardRef<HTMLAnchorElement, ToolbarLinkProps>(
  ({ className, size: sizeProp, variant = 'ghost', ...props }, ref) => {
    const { size: rootSize } = React.useContext(ToolbarContext);
    const size = sizeProp ?? rootSize;

    return (
      <BaseToolbar.Link
        {...props}
        ref={ref}
        className={(state) =>
          cn(
            'rounded-city-sm focus-visible:ring-city-ring focus-visible:ring-offset-city-surface inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[orientation=vertical]:w-full',
            itemSizeClasses[size],
            itemVariantClasses[variant],
            resolveClassName(className, state),
          )
        }
      />
    );
  },
);

ToolbarLink.displayName = 'Toolbar.Link';

export const ToolbarSeparator = React.forwardRef<HTMLDivElement, ToolbarSeparatorProps>(
  ({ className, ...props }, ref) => (
    <BaseToolbar.Separator
      {...props}
      ref={ref}
      className={classes(
        className,
        'bg-city-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-6 data-[orientation=vertical]:h-6 data-[orientation=vertical]:w-px',
      )}
    />
  ),
);

ToolbarSeparator.displayName = 'Toolbar.Separator';

export const ToolbarGroup = React.forwardRef<HTMLDivElement, ToolbarGroupProps>(
  ({ className, ...props }, ref) => (
    <BaseToolbar.Group
      {...props}
      ref={ref}
      className={classes(
        className,
        'inline-flex items-center gap-1 data-[disabled]:opacity-60 data-[orientation=vertical]:w-full data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch',
      )}
    />
  ),
);

ToolbarGroup.displayName = 'Toolbar.Group';

export const ToolbarToggleGroup = React.forwardRef<HTMLDivElement, ToolbarToggleGroupProps>(
  ({ className, orientation: orientationProp, ...props }, ref) => {
    const { orientation: rootOrientation } = React.useContext(ToolbarContext);
    const orientation = orientationProp ?? rootOrientation;

    return (
      <BaseToggleGroup
        {...props}
        ref={ref}
        orientation={orientation}
        className={(state) =>
          cn(
            'inline-flex items-center gap-1 data-[disabled]:opacity-60 data-[orientation=vertical]:w-full data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch',
            resolveClassName(className, state),
          )
        }
      />
    );
  },
);

ToolbarToggleGroup.displayName = 'Toolbar.ToggleGroup';

export const ToolbarToggle = React.forwardRef<HTMLButtonElement, ToolbarToggleProps>(
  ({ className, size: sizeProp, variant = 'ghost', ...props }, ref) => {
    const { orientation, size: rootSize } = React.useContext(ToolbarContext);
    const size = sizeProp ?? rootSize;

    return (
      <BaseToggle
        {...props}
        ref={ref}
        className={(state) =>
          cn(
            'rounded-city-sm focus-visible:ring-city-ring focus-visible:ring-offset-city-surface inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            orientation === 'vertical' && 'w-full',
            itemSizeClasses[size],
            itemVariantClasses[variant],
            resolveClassName(className, state),
          )
        }
      />
    );
  },
);

ToolbarToggle.displayName = 'Toolbar.Toggle';

export const Toolbar = {
  Root: ToolbarRoot,
  Button: ToolbarButton,
  Link: ToolbarLink,
  Separator: ToolbarSeparator,
  Group: ToolbarGroup,
  ToggleGroup: ToolbarToggleGroup,
  Toggle: ToolbarToggle,
};
