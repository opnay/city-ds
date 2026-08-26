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
  xsm: 'h-3 w-5 p-0.5',
  sm: 'h-3.5 w-6 p-0.5',
  md: 'h-4 w-7 p-0.5',
  lg: 'h-5 w-9 p-0.5',
  xlg: 'h-6 w-11 p-0.5',
};

export interface SwitchThumbProps extends Omit<BaseSwitch.Thumb.Props, 'className'> {
  className?: StateClassName<BaseSwitch.Thumb.State>;
  size?: ControlSize;
}

const switchThumbSizeClasses: Record<ControlSize, string> = {
  xsm: 'size-2 data-[checked]:translate-x-2',
  sm: 'size-2.5 data-[checked]:translate-x-2.5',
  md: 'size-3 data-[checked]:translate-x-3',
  lg: 'size-4 data-[checked]:translate-x-4',
  xlg: 'size-5 data-[checked]:translate-x-5',
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
          'bg-city-input data-[checked]:bg-city-background pointer-events-none block shadow-sm transition-colors transition-transform',
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
          'bg-city-background focus-visible:ring-city-ring focus-visible:ring-offset-city-background data-[checked]:bg-city-primary relative inline-flex shrink-0 items-center transition-colors outline-none before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-city-input before:transition-colors before:content-[""] focus-visible:ring-2 focus-visible:ring-offset-2 data-[checked]:before:border-city-primary data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
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
