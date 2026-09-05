import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Avatar as RootAvatar } from '../../src';
import {
  AVATAR_SIZES,
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
  type AvatarFallbackProps,
  type AvatarImageProps,
  type AvatarRootProps,
} from '../../src/components/avatar';

function assertAvatarPropsContract() {
  const root: AvatarRootProps = { size: 'sm' };
  const image: AvatarImageProps = { alt: '프로필 사진', src: 'data:image/svg+xml,%3Csvg%2F%3E' };
  const fallback: AvatarFallbackProps = { delay: 100 };

  // @ts-expect-error Avatar sizes are limited to sm, md, and lg.
  const invalidSize: AvatarRootProps = { size: 'xlg' };

  void root;
  void image;
  void fallback;
  void invalidSize;
}

void assertAvatarPropsContract;

function replaceImageLoading(status: 'loaded' | 'error') {
  const ImageConstructor = window.Image;

  class TestImage {
    complete = false;
    naturalWidth = 0;
    crossOrigin: string | null = null;
    onerror: ((event: Event) => void) | null = null;
    onload: ((event: Event) => void) | null = null;
    referrerPolicy = '';
    sizes = '';
    srcset = '';

    set src(_: string) {
      queueMicrotask(() => {
        if (status === 'loaded') this.onload?.(new Event('load'));
        else this.onerror?.(new Event('error'));
      });
    }
  }

  window.Image = TestImage as unknown as typeof Image;

  return () => {
    window.Image = ImageConstructor;
  };
}

describe('Avatar', () => {
  it('exports the same composite API from the package root', () => {
    expect(RootAvatar).toBe(Avatar);
    expect(Avatar.Root).toBe(AvatarRoot);
    expect(Avatar.Image).toBe(AvatarImage);
    expect(Avatar.Fallback).toBe(AvatarFallback);
    expect(AVATAR_SIZES).toEqual(['sm', 'md', 'lg']);
  });

  it('uses the Root size and circular surface while preserving Base UI render composition', () => {
    const ref = React.createRef<HTMLSpanElement>();

    render(
      <Avatar.Root ref={ref} render={<span data-composed="true" />} size="lg">
        <Avatar.Fallback>IS</Avatar.Fallback>
      </Avatar.Root>,
    );

    const avatar = screen.getByText('IS').parentElement;

    expect(ref.current).toBe(avatar);
    expect(avatar).toHaveAttribute('data-composed', 'true');
    expect(avatar).toHaveAttribute('data-city-avatar', '');
    expect(avatar).toHaveAttribute('data-city-size', 'lg');
    expect(avatar).toHaveClass('size-12', 'overflow-hidden', 'rounded-full');
    expect(screen.getByText('IS')).toHaveAttribute('data-city-avatar-fallback', '');
  });

  it('shows the Image and propagates loaded state after Base UI loads the source', async () => {
    const restoreImage = replaceImageLoading('loaded');
    const onLoadingStatusChange = vi.fn();

    try {
      render(
        <Avatar.Root
          className={(state) => (state.imageLoadingStatus === 'loaded' ? 'image-loaded' : '')}
        >
          <Avatar.Image
            alt="인섭의 프로필 사진"
            onLoadingStatusChange={onLoadingStatusChange}
            src="data:image/svg+xml,%3Csvg%2F%3E"
          />
          <Avatar.Fallback>IS</Avatar.Fallback>
        </Avatar.Root>,
      );

      const image = await screen.findByRole('img', { name: '인섭의 프로필 사진' });

      expect(onLoadingStatusChange).toHaveBeenLastCalledWith('loaded');
      expect(image).toHaveAttribute('data-city-avatar-image', '');
      expect(image).toHaveClass('size-full', 'object-cover');
      expect(image.parentElement).toHaveClass('image-loaded');
      expect(screen.queryByText('IS')).not.toBeInTheDocument();
    } finally {
      restoreImage();
    }
  });

  it('shows Fallback after Base UI reports an image loading error', async () => {
    const restoreImage = replaceImageLoading('error');
    const onLoadingStatusChange = vi.fn();

    try {
      render(
        <Avatar.Root>
          <Avatar.Image
            alt="불러오지 못한 프로필 사진"
            onLoadingStatusChange={onLoadingStatusChange}
            src="data:image/svg+xml,invalid"
          />
          <Avatar.Fallback>IS</Avatar.Fallback>
        </Avatar.Root>,
      );

      await waitFor(() => expect(onLoadingStatusChange).toHaveBeenLastCalledWith('error'));

      expect(screen.getByText('IS')).toBeVisible();
      expect(screen.getByText('IS')).toHaveAttribute('data-city-avatar-fallback', '');
      expect(
        screen.queryByRole('img', { name: '불러오지 못한 프로필 사진' }),
      ).not.toBeInTheDocument();
    } finally {
      restoreImage();
    }
  });
});
