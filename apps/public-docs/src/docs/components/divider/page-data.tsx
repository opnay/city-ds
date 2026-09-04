import orientationSource from './examples/orientation.tsx?raw';
import DividerOrientationExample from './examples/orientation';
import usageSource from './examples/usage.tsx?raw';
import DividerUsageExample from './examples/usage';
import { DividerPreview } from '../../preview-playgrounds/content';
import { createPlaygroundSource } from '../../preview-playgrounds/source';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'divider-playground',
  widePreviewIds: ['divider-playground', 'divider-orientation', 'divider-usage'],
  api: [
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      defaultValue: "'horizontal'",
      description: '구분선 방향입니다. 세로형은 부모 영역의 높이를 따릅니다.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: '가로 구분선 가운데에 표시하는 짧은 라벨입니다.',
    },
    {
      name: 'plain',
      type: 'boolean',
      defaultValue: 'false',
      description: '가로 라벨의 강조를 낮춥니다.',
    },
    {
      name: 'render',
      type: 'ReactElement | render function',
      description: '기본 div를 다른 요소와 합성합니다.',
    },
  ],
  examples: [
    {
      Component: DividerPreview,
      configurable: true,
      coverage: [{ axis: 'preview', values: ['configurable'] }],
      description: '사이드바에서 방향과 가로 라벨의 강조를 조절합니다.',
      id: 'divider-playground',
      filename: 'playground.tsx',
      source: createPlaygroundSource('@opnay/city-ds-react/divider', 'Divider'),
      title: 'Preview',
    },
    {
      Component: DividerOrientationExample,
      coverage: [{ axis: 'orientation', values: ['horizontal', 'vertical'] }],
      description: '가로 구분선과 높이가 있는 영역 안의 세로 구분선을 비교합니다.',
      id: 'divider-orientation',
      filename: 'orientation.tsx',
      source: orientationSource,
      title: '방향',
    },
    {
      Component: DividerUsageExample,
      coverage: [{ axis: 'plain', values: ['false', 'true'] }],
      description: 'children 라벨과 낮은 강조의 plain 라벨을 비교합니다.',
      id: 'divider-usage',
      filename: 'usage.tsx',
      source: usageSource,
      title: '라벨',
    },
  ],
  optionAxes: [
    {
      control: 'segmented',
      name: 'orientation',
      defaultValue: 'horizontal',
      values: ['horizontal', 'vertical'],
    },
    { name: 'plain', defaultValue: 'false', values: ['false', 'true'] },
  ],
} satisfies ComponentPageData;
