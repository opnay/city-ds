import * as React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ScrollArea as RootScrollArea } from '../../src';
import { ScrollArea } from '../../src/components/scroll-area';

class TestResizeObserver {
  constructor(private readonly callback: ResizeObserverCallback) {
    resizeObservers.add(this);
  }

  disconnect() {
    resizeObservers.delete(this);
  }

  observe() {}

  flush() {
    this.callback([], this as unknown as ResizeObserver);
  }
}

let originalResizeObserver: typeof ResizeObserver | undefined;
let originalGetAnimations: PropertyDescriptor | undefined;
let resizeObservers = new Set<TestResizeObserver>();

function setDimensions(element: HTMLElement, dimensions: Record<string, number>) {
  Object.defineProperties(
    element,
    Object.fromEntries(
      Object.entries(dimensions).map(([name, value]) => [name, { configurable: true, value }]),
    ),
  );
}

function renderScrollArea() {
  const rootRef = React.createRef<HTMLDivElement>();

  render(
    <ScrollArea.Root
      ref={rootRef}
      className={(state) =>
        [
          state.hasOverflowX && 'state-overflow-x',
          state.hasOverflowY && 'state-overflow-y',
          state.scrolling && 'state-scrolling',
        ]
          .filter(Boolean)
          .join(' ')
      }
      data-testid="scroll-area"
      render={<section data-composed="true" />}
    >
      <ScrollArea.Viewport aria-label="스크롤 가능한 실행 기록">
        <ScrollArea.Content>긴 실행 기록</ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar keepMounted orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      <ScrollArea.Scrollbar keepMounted orientation="horizontal">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner />
    </ScrollArea.Root>,
  );

  const root = screen.getByTestId('scroll-area');
  const viewport = screen.getByLabelText('스크롤 가능한 실행 기록');
  const verticalScrollbar = root.querySelector<HTMLElement>('[data-orientation="vertical"]');
  const horizontalScrollbar = root.querySelector<HTMLElement>('[data-orientation="horizontal"]');
  const verticalThumb = verticalScrollbar?.querySelector<HTMLElement>(
    '[data-city-scroll-area-thumb]',
  );
  const horizontalThumb = horizontalScrollbar?.querySelector<HTMLElement>(
    '[data-city-scroll-area-thumb]',
  );

  if (!verticalScrollbar || !horizontalScrollbar || !verticalThumb || !horizontalThumb) {
    throw new Error('ScrollArea 하위 요소를 찾을 수 없습니다.');
  }

  setDimensions(viewport, {
    clientHeight: 100,
    clientWidth: 120,
    scrollHeight: 400,
    scrollWidth: 480,
  });
  setDimensions(verticalScrollbar, { offsetHeight: 100, offsetWidth: 10 });
  setDimensions(horizontalScrollbar, { offsetHeight: 10, offsetWidth: 120 });
  setDimensions(verticalThumb, { offsetHeight: 25, offsetWidth: 10 });
  setDimensions(horizontalThumb, { offsetHeight: 10, offsetWidth: 30 });

  Object.assign(verticalThumb, {
    hasPointerCapture: () => true,
    releasePointerCapture: () => {},
    setPointerCapture: () => {},
  });

  act(() => {
    for (const observer of resizeObservers) observer.flush();
  });

  return {
    horizontalScrollbar,
    horizontalThumb,
    root,
    rootRef,
    verticalScrollbar,
    verticalThumb,
    viewport,
  };
}

beforeEach(() => {
  originalResizeObserver = globalThis.ResizeObserver;
  originalGetAnimations = Object.getOwnPropertyDescriptor(Element.prototype, 'getAnimations');
  resizeObservers = new Set();
  globalThis.ResizeObserver = TestResizeObserver as unknown as typeof ResizeObserver;
  Element.prototype.getAnimations = () => [];
});

afterEach(() => {
  globalThis.ResizeObserver = originalResizeObserver as typeof ResizeObserver;
  if (originalGetAnimations) {
    Object.defineProperty(Element.prototype, 'getAnimations', originalGetAnimations);
  } else {
    Reflect.deleteProperty(Element.prototype, 'getAnimations');
  }
});

describe('ScrollArea', () => {
  it('exports the same compound component from the package root', () => {
    expect(RootScrollArea).toBe(ScrollArea);
  });

  it('keeps overflowing viewports keyboard-focusable and exposes both scrollbar orientations', async () => {
    const {
      horizontalScrollbar,
      horizontalThumb,
      root,
      rootRef,
      verticalScrollbar,
      verticalThumb,
      viewport,
    } = renderScrollArea();

    await waitFor(() => expect(viewport).toHaveAttribute('tabindex', '0'));

    expect(rootRef.current).toBe(root);
    expect(root).toHaveAttribute('data-composed', 'true');
    expect(root).toHaveAttribute('data-city-scroll-area-root', '');
    expect(root).toHaveClass('relative', 'overflow-hidden', 'state-overflow-x', 'state-overflow-y');
    expect(viewport).toHaveAttribute('data-city-scroll-area-viewport', '');
    expect(viewport).toHaveClass('focus-visible:ring-inset');
    expect(verticalScrollbar).toHaveAttribute('data-city-scroll-area-scrollbar', '');
    expect(verticalScrollbar).toHaveAttribute('data-orientation', 'vertical');
    expect(verticalScrollbar).toHaveClass('data-[orientation=vertical]:flex-col');
    expect(horizontalScrollbar).toHaveAttribute('data-orientation', 'horizontal');
    expect(horizontalScrollbar).toHaveClass('data-[orientation=horizontal]:flex-row');
    expect(verticalThumb).toHaveAttribute('data-orientation', 'vertical');
    expect(horizontalThumb).toHaveAttribute('data-orientation', 'horizontal');
    await waitFor(() =>
      expect(root.querySelector('[data-city-scroll-area-corner]')).toHaveClass('bg-city-accent'),
    );

    viewport.focus();
    expect(viewport).toHaveFocus();

    fireEvent.keyDown(viewport, { key: 'ArrowDown' });
    viewport.scrollTop = 80;
    fireEvent.scroll(viewport);

    await waitFor(() => {
      expect(verticalScrollbar).toHaveAttribute('data-scrolling', '');
      expect(root).toHaveClass('state-scrolling');
    });
  });

  it('uses Base UI hover and thumb-drag state for the visible scrollbar treatment', async () => {
    const { root, verticalScrollbar, verticalThumb, viewport } = renderScrollArea();

    fireEvent.pointerEnter(root, { pointerType: 'mouse' });

    await waitFor(() => expect(verticalScrollbar).toHaveAttribute('data-hovering', ''));
    expect(verticalScrollbar).toHaveClass('data-[hovering]:opacity-100');

    fireEvent.pointerDown(verticalScrollbar, { button: 0, clientY: 12, pointerId: 1 });
    fireEvent.pointerMove(verticalThumb, { button: 0, clientY: 62, pointerId: 1 });

    await waitFor(() => {
      expect(viewport.scrollTop).toBeGreaterThan(0);
      expect(verticalScrollbar).toHaveAttribute('data-scrolling', '');
      expect(verticalThumb).toHaveClass(
        'cursor-grab',
        'active:cursor-grabbing',
        'data-[orientation=vertical]:w-full',
      );
    });
  });
});
