'use client';

import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';

import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { Density } from '../../types';

export interface DensityProviderState extends Record<string, unknown> {
  density: Density;
}

export interface DensityProviderProps extends Omit<
  useRender.ComponentProps<'div', DensityProviderState>,
  'className'
> {
  className?: StateClassName<DensityProviderState>;
  density?: Density;
}

const DensityContext = React.createContext<Density>('comfortable');

export function DensityProvider({
  children,
  className,
  density = 'comfortable',
  render,
  ...props
}: DensityProviderProps): React.JSX.Element {
  const state: DensityProviderState = { density };
  const scope = useRender<DensityProviderState, HTMLDivElement>({
    defaultTagName: 'div',
    render,
    state,
    props: {
      ...props,
      children,
      className: resolveClassName(className, state),
      'data-city-density': density,
      'data-city-density-provider': '',
    },
  });

  return <DensityContext.Provider value={density}>{scope}</DensityContext.Provider>;
}

export function useDensity(density?: Density): Density {
  const inheritedDensity = React.useContext(DensityContext);
  return density ?? inheritedDensity;
}
