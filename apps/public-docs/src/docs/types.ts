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

export interface DocCodeFile {
  filename: string;
  language: string;
  source: string;
}

interface DocExampleBase {
  Component: ComponentType;
  coverage: readonly ExampleCoverage[];
  description: string;
  id: string;
  title: string;
}

interface SingleFileDocExample extends DocExampleBase {
  filename: string;
  files?: never;
  source: string;
}

interface MultiFileDocExample extends DocExampleBase {
  filename?: never;
  files: readonly [DocCodeFile, DocCodeFile, ...DocCodeFile[]];
  source?: never;
}

export type DocExample = MultiFileDocExample | SingleFileDocExample;

export interface ComponentPageData {
  api: readonly ApiItem[];
  examples: readonly DocExample[];
  optionAxes: readonly OptionAxis[];
}
