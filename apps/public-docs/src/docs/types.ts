import type { ComponentType } from 'react';

export type ComponentCategory =
  | 'Actions'
  | 'Data display'
  | 'Disclosure'
  | 'Feedback'
  | 'Forms'
  | 'Foundations'
  | 'Layout'
  | 'Navigation'
  | 'Overlays';

export interface DocModule {
  default: ComponentType;
}

export interface ComponentDocEntry {
  category: ComponentCategory;
  description: string;
  importPath: `@opnay/city-ds-react/${string}`;
  keywords: readonly string[];
  load: () => Promise<DocModule>;
  related: readonly string[];
  slug: string;
  title: string;
}

export interface ApiItem {
  defaultValue?: string;
  description: string;
  name: string;
  type: string;
}

export interface OptionAxis {
  defaultValue?: string;
  name: string;
  values: readonly string[];
}

export interface ExampleCoverage {
  axis: string;
  combinations?: readonly string[];
  values: readonly string[];
}

export interface DocExample {
  Component: ComponentType;
  coverage: readonly ExampleCoverage[];
  description: string;
  id: string;
  source: string;
  title: string;
}

export interface ComponentPageData {
  api: readonly ApiItem[];
  examples: readonly DocExample[];
  optionAxes: readonly OptionAxis[];
}
