'use client';

import * as React from 'react';
import { OTPField as BaseOTPField } from '@base-ui/react/otp-field';

import { atomicRectShapeClasses } from '../../lib/atomic-shape';
import { cn } from '../../lib/cn';
import {
  outlineFrameHeightClasses,
  outlineFrameSegmentWidthClasses,
  outlineFrameTextClasses,
} from '../../lib/outline-frame';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { ControlSize } from '../../types';

const OtpInputSizeContext = React.createContext<ControlSize>('md');

export interface OtpInputRootProps extends Omit<BaseOTPField.Root.Props, 'className' | 'length'> {
  className?: StateClassName<BaseOTPField.Root.State>;
  length?: number;
  size?: ControlSize;
}

export const OtpInputRoot = React.forwardRef<HTMLDivElement, OtpInputRootProps>(
  function OtpInputRoot({ children, className, length = 6, size = 'md', ...props }, ref) {
    return (
      <OtpInputSizeContext.Provider value={size}>
        <BaseOTPField.Root
          {...props}
          ref={ref}
          length={length}
          data-city-otp-input=""
          data-city-size={size}
          className={(state) =>
            cn('flex max-w-full items-center gap-2', resolveClassName(className, state))
          }
        >
          {children ??
            (Number.isInteger(length) && length > 0
              ? Array.from({ length }, (_, index) => <OtpInputInput key={index} />)
              : null)}
        </BaseOTPField.Root>
      </OtpInputSizeContext.Provider>
    );
  },
);

OtpInputRoot.displayName = 'OtpInput.Root';

export interface OtpInputInputProps extends Omit<BaseOTPField.Input.Props, 'className' | 'size'> {
  className?: StateClassName<BaseOTPField.Input.State>;
  size?: ControlSize;
}

export const OtpInputInput = React.forwardRef<HTMLInputElement, OtpInputInputProps>(
  function OtpInputInput({ className, size: sizeProp, ...props }, ref) {
    const groupSize = React.useContext(OtpInputSizeContext);
    const size = sizeProp ?? groupSize;

    return (
      <BaseOTPField.Input
        {...props}
        ref={ref}
        data-city-otp-input-slot=""
        data-city-size={size}
        className={(state) =>
          cn(
            atomicRectShapeClasses.control,
            outlineFrameHeightClasses[size],
            outlineFrameSegmentWidthClasses[size],
            outlineFrameTextClasses[size],
            'border-city-input bg-city-background text-city-foreground focus-visible:border-city-ring focus-visible:ring-city-ring data-[invalid]:border-city-destructive data-[invalid]:focus-visible:ring-city-destructive min-w-0 border p-0 text-center tabular-nums outline-none transition-colors focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
            resolveClassName(className, state),
          )
        }
      />
    );
  },
);

OtpInputInput.displayName = 'OtpInput.Input';

export const OtpInput = { Root: OtpInputRoot, Input: OtpInputInput };
