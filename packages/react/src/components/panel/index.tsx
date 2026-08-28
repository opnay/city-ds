'use client';

import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';

import { cn } from '../../lib/cn';

export interface PanelRootProps extends Omit<useRender.ComponentProps<'div'>, 'className'> {
  className?: string;
}

export const PanelRoot = React.forwardRef<HTMLDivElement, PanelRootProps>(function PanelRoot(
  { className, render, ...props },
  ref,
) {
  return useRender({
    defaultTagName: 'div',
    ref,
    render,
    props: {
      ...props,
      className: cn('grid min-w-0', className),
      'data-city-panel': '',
    },
  });
});

PanelRoot.displayName = 'Panel.Root';

export interface PanelHeaderProps extends Omit<useRender.ComponentProps<'header'>, 'className'> {
  actions?: React.ReactNode;
  className?: string;
}

export const PanelHeader = React.forwardRef<HTMLElement, PanelHeaderProps>(function PanelHeader(
  { actions, children, className, render, ...props },
  ref,
) {
  return useRender({
    defaultTagName: 'header',
    ref,
    render,
    props: {
      ...props,
      children: (
        <>
          <div className="flex min-w-0 flex-1 items-center" data-city-panel-header-content="">
            {children}
          </div>
          {actions != null ? (
            <div
              className="ml-auto flex shrink-0 flex-wrap items-center gap-2"
              data-city-panel-header-actions=""
            >
              {actions}
            </div>
          ) : null}
        </>
      ),
      className: cn('flex min-w-0 flex-wrap items-center gap-2', className),
      'data-city-panel-header': '',
    },
  });
});

PanelHeader.displayName = 'Panel.Header';

export interface PanelBodyProps extends Omit<useRender.ComponentProps<'div'>, 'className'> {
  className?: string;
}

export const PanelBody = React.forwardRef<HTMLDivElement, PanelBodyProps>(function PanelBody(
  { className, render, ...props },
  ref,
) {
  return useRender({
    defaultTagName: 'div',
    ref,
    render,
    props: {
      ...props,
      className: cn('min-w-0', className),
      'data-city-panel-body': '',
    },
  });
});

PanelBody.displayName = 'Panel.Body';

export const Panel = {
  Root: PanelRoot,
  Header: PanelHeader,
  Body: PanelBody,
};
