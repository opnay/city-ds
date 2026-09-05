import shortcutsSource from './examples/shortcuts.tsx?raw';
import KbdShortcutsExample from './examples/shortcuts';
import sizesSource from './examples/sizes.tsx?raw';
import KbdSizesExample from './examples/sizes';
import { KbdPreview } from '../../preview-playgrounds/content';
import { createPlaygroundSource } from '../../preview-playgrounds/source';
import type { ComponentPageData } from '../../types';

const sizes = ['sm', 'md', 'lg'] as const;

export const pageData = {
  featuredExampleId: 'kbd-playground',
  api: [
    {
      name: 'children',
      type: 'ReactNode',
      description: '표시할 키 또는 단축키입니다.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      description: '주변 텍스트와 단축키의 밀도에 맞춥니다.',
    },
    {
      name: 'render',
      type: 'ReactElement | render function',
      description: '기본 kbd 요소를 다른 요소와 합성합니다.',
    },
  ],
  examples: [
    {
      Component: KbdPreview,
      configurable: true,
      coverage: [{ axis: 'preview', values: ['configurable'] }],
      description: '사이드바에서 단축키 표기의 크기를 조절합니다.',
      id: 'kbd-playground',
      filename: 'playground.tsx',
      source: createPlaygroundSource('@opnay/city-ds-react/kbd', 'Kbd'),
      title: 'Preview',
    },
    {
      Component: KbdShortcutsExample,
      coverage: [{ axis: 'children', values: ['key', 'shortcut'] }],
      description: '단일 키와 여러 키로 된 단축키를 표시합니다.',
      id: 'kbd-shortcuts',
      filename: 'shortcuts.tsx',
      source: shortcutsSource,
      title: '키와 단축키',
    },
    {
      Component: KbdSizesExample,
      coverage: [{ axis: 'size', values: sizes }],
      description: '주변 콘텐츠의 밀도에 맞는 크기를 선택합니다.',
      id: 'kbd-sizes',
      filename: 'sizes.tsx',
      source: sizesSource,
      title: '크기',
    },
  ],
  optionAxes: [{ control: 'segmented', name: 'size', defaultValue: 'md', values: sizes }],
  previewOptionAxes: [{ control: 'segmented', name: 'size', defaultValue: 'md', values: sizes }],
} satisfies ComponentPageData;
