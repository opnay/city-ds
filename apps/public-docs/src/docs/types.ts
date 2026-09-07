import type { ComponentType } from 'react';

export type ComponentCategory =
  | 'Actions'
  | 'Data display'
  | 'Dates'
  | 'Feedback'
  | 'Inputs'
  | 'Selection'
  | 'Form structure'
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
  importNames?: readonly string[];
  importPath: `@opnay/city-ds-react/${string}`;
  keywords: readonly string[];
  load: () => Promise<DocModule>;
  related: readonly string[];
  selectionGuidance: string;
  slug: string;
  title: string;
}

export type StaticDocSection = 'components' | 'guides' | 'start';

export type StaticDocPath =
  | '/'
  | '/accessibility'
  | '/color'
  | '/components'
  | '/foundations'
  | '/getting-started'
  | '/patterns';

export interface StaticDocEntry {
  description: string;
  englishTitle: string;
  keywords: readonly string[];
  label: string;
  path: StaticDocPath;
  section: StaticDocSection;
  title: string;
}

export type DocumentSearchResult =
  | { entry: ComponentDocEntry; kind: 'component' }
  | { entry: StaticDocEntry; kind: 'static' };

export interface ApiItem {
  defaultValue?: string;
  description: string;
  name: string;
  type: string;
}

export interface OptionAxis {
  control?: 'select' | 'segmented' | 'switch';
  defaultValue?: string;
  name: string;
  values: readonly string[];
}

export type PreviewOptionValues = Readonly<Record<string, string>>;

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
  configurable?: boolean;
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
  featuredExampleId: string;
  optionAxes: readonly OptionAxis[];
  previewOptionAxes?: readonly OptionAxis[];
  widePreviewIds?: readonly string[];
}
