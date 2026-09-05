'use client';

import * as React from 'react';
import { Avatar as BaseAvatar } from '@base-ui/react/avatar';

import { atomicRectShapeClasses } from '../../lib/atomic-shape';
import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';

export const AVATAR_SIZES = ['sm', 'md', 'lg'] as const;
export const AVATAR_SHAPES = ['circle', 'square'] as const;

export type AvatarSize = (typeof AVATAR_SIZES)[number];
export type AvatarShape = (typeof AVATAR_SHAPES)[number];

export interface AvatarRootProps extends Omit<BaseAvatar.Root.Props, 'className'> {
  className?: StateClassName<BaseAvatar.Root.State>;
  size?: AvatarSize;
  shape?: AvatarShape;
}

export interface AvatarImageProps extends Omit<BaseAvatar.Image.Props, 'className'> {
  className?: StateClassName<BaseAvatar.Image.State>;
}

export interface AvatarFallbackProps extends Omit<BaseAvatar.Fallback.Props, 'className'> {
  className?: StateClassName<BaseAvatar.Fallback.State>;
}

const avatarSizeClasses: Record<AvatarSize, string> = {
  sm: 'size-8',
  md: 'size-10',
  lg: 'size-12',
};

const avatarShapeClasses: Record<AvatarShape, string> = {
  circle: 'rounded-full',
  square: atomicRectShapeClasses.control,
};

export const AvatarRoot = React.forwardRef<HTMLSpanElement, AvatarRootProps>(function AvatarRoot(
  { className, shape = 'circle', size = 'md', ...props },
  ref,
) {
  return (
    <BaseAvatar.Root
      {...props}
      ref={ref}
      data-city-avatar=""
      data-city-size={size}
      data-city-shape={shape}
      className={(state) =>
        cn(
          'group inline-flex shrink-0 overflow-hidden bg-city-muted text-city-muted-foreground',
          avatarSizeClasses[size],
          avatarShapeClasses[shape],
          resolveClassName(className, state),
        )
      }
    />
  );
});

AvatarRoot.displayName = 'Avatar.Root';

export const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  function AvatarImage({ className, ...props }, ref) {
    return (
      <BaseAvatar.Image
        {...props}
        ref={ref}
        data-city-avatar-image=""
        className={(state) =>
          cn('block size-full object-cover', resolveClassName(className, state))
        }
      />
    );
  },
);

AvatarImage.displayName = 'Avatar.Image';

export const AvatarFallback = React.forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  function AvatarFallback({ className, ...props }, ref) {
    return (
      <BaseAvatar.Fallback
        {...props}
        ref={ref}
        data-city-avatar-fallback=""
        className={(state) =>
          cn(
            'flex size-full items-center justify-center bg-city-muted text-xs leading-none font-medium',
            resolveClassName(className, state),
          )
        }
      />
    );
  },
);

AvatarFallback.displayName = 'Avatar.Fallback';

export const Avatar = {
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
};
