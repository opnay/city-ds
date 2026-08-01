import * as React from 'react';
import { Unstyled } from '@storybook/addon-docs/blocks';

export interface ComponentSpecimenProps {
  children: React.ReactNode;
}

export function ComponentSpecimen({ children }: ComponentSpecimenProps) {
  return <Unstyled data-city-docs-specimen="">{children}</Unstyled>;
}
