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
import { atomicControlTextClasses } from '../../lib/atomic-typography';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { ControlSize, SurfaceAppearance } from '../../types';
import type { ButtonVariant } from '../button';

function classes<State>(className: StateClassName<State> | undefined, defaults: string) {
  return (state: State) => cn(defaults, resolveClassName(className, state));
}

export type ToolbarRootProps = Omit<BaseToolbarRootProps, 'className'> & {
  appearance?: SurfaceAppearance;
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
  xsm: 'gap-0.5 p-0.5',
  sm: 'gap-1 p-0.5',
  md: 'gap-1 p-1',
  lg: 'gap-1.5 p-1.5',
  xlg: 'gap-2 p-2',
};

const toolbarAppearanceClasses: Record<SurfaceAppearance, string> = {
  plain: 'bg-transparent',
  band: 'border-city-border bg-city-surface border-b',
  outline: 'rounded-city-md border-city-border bg-city-surface border',
};

const itemSizeClasses: Record<ControlSize, string> = {
  xsm: 'h-(--city-control-xsm) gap-1 px-1.5',
  sm: 'h-(--city-control-sm) gap-1.5 px-2',
  md: 'h-(--city-control-md) gap-1.5 px-2.5',
  lg: 'h-(--city-control-lg) gap-2 px-3',
  xlg: 'h-(--city-control-xlg) gap-2 px-4',
};

const itemVariantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-city-primary text-city-primary-foreground hover:bg-city-primary-hover active:bg-city-primary-active data-[pressed]:bg-city-primary-active',
  secondary:
    'bg-city-accent text-city-accent-foreground hover:bg-city-accent-hover active:bg-city-accent-active data-[pressed]:bg-city-inverse data-[pressed]:text-city-inverse-foreground',
  outline:
    'border border-city-border bg-city-background text-city-foreground hover:bg-city-accent active:bg-city-accent-active data-[pressed]:bg-city-inverse data-[pressed]:text-city-inverse-foreground',
  ghost:
    'text-city-foreground hover:bg-city-accent active:bg-city-accent-active data-[pressed]:bg-city-accent data-[pressed]:text-city-accent-foreground',
  destructive:
    'bg-city-destructive text-city-destructive-foreground hover:bg-city-destructive-hover active:bg-city-destructive-active data-[pressed]:bg-city-destructive-active',
};

export const ToolbarRoot = React.forwardRef<HTMLDivElement, ToolbarRootProps>(
  (
    { appearance = 'outline', className, orientation = 'horizontal', size = 'md', ...props },
    ref,
  ) => {
    const contextValue = React.useMemo(() => ({ orientation, size }), [orientation, size]);

    return (
      <ToolbarContext.Provider value={contextValue}>
        <BaseToolbar.Root
          {...props}
          ref={ref}
          orientation={orientation}
          data-appearance={appearance}
          data-city-toolbar-root=""
          data-size={size}
          className={(state) =>
            cn(
              'text-city-foreground inline-flex max-w-full items-center data-[disabled]:opacity-60 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch',
              toolbarAppearanceClasses[appearance],
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
            atomicControlTextClasses[size],
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
            atomicControlTextClasses[size],
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
            atomicControlTextClasses[size],
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
