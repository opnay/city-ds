'use client';

import * as React from 'react';
import { Switch as BaseSwitch } from '@base-ui/react/switch';

import { atomicRoundShapeClass } from '../../lib/atomic-shape';
import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { ControlSize } from '../../types';

export interface SwitchProps extends Omit<BaseSwitch.Root.Props, 'className'> {
  className?: StateClassName<BaseSwitch.Root.State>;
  size?: ControlSize;
}

const switchSizeClasses: Record<ControlSize, string> = {
  sm: 'h-4 w-7 p-0.5',
  md: 'h-5 w-9 p-0.5',
  lg: 'h-6 w-11 p-0.5',
};

export interface SwitchThumbProps extends Omit<BaseSwitch.Thumb.Props, 'className'> {
  className?: StateClassName<BaseSwitch.Thumb.State>;
  size?: ControlSize;
}

const switchThumbSizeClasses: Record<ControlSize, string> = {
  sm: 'size-3 data-[checked]:translate-x-3',
  md: 'size-4 data-[checked]:translate-x-4',
  lg: 'size-5 data-[checked]:translate-x-5',
};

export const SwitchThumb = React.forwardRef<HTMLSpanElement, SwitchThumbProps>(function SwitchThumb(
  { className, size = 'md', ...props },
  ref,
) {
  return (
    <BaseSwitch.Thumb
      {...props}
      ref={ref}
      className={(state) =>
        cn(
          atomicRoundShapeClass,
          'bg-city-background pointer-events-none block shadow-sm transition-transform',
          switchThumbSizeClasses[size],
          resolveClassName(className, state),
        )
      }
    />
  );
});

SwitchThumb.displayName = 'Switch.Thumb';

const SwitchRoot = React.forwardRef<HTMLElement, SwitchProps>(function Switch(
  { children, className, size = 'md', ...props },
  ref,
) {
  return (
    <BaseSwitch.Root
      {...props}
      ref={ref}
      className={(state) =>
        cn(
          atomicRoundShapeClass,
          'bg-city-muted focus-visible:ring-city-ring focus-visible:ring-offset-city-background data-[checked]:bg-city-primary inline-flex shrink-0 items-center transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
          switchSizeClasses[size],
          resolveClassName(className, state),
        )
      }
    >
      <SwitchThumb size={size} />
      {children}
    </BaseSwitch.Root>
  );
});

SwitchRoot.displayName = 'Switch';

export const Switch = Object.assign(SwitchRoot, {
  Thumb: SwitchThumb,
});
