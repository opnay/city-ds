import usageSource from './examples/usage.tsx?raw';
import DividerUsageExample from './examples/usage';
import { DividerPreview } from '../../preview-playgrounds/content';
import { createPlaygroundSource } from '../../preview-playgrounds/source';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'divider-playground',
  api: [
    {
      name: 'label',
      type: 'string',
      defaultValue: 'undefined',
      description: '구분선 가운데 표시하며 접근 가능한 이름으로도 사용하는 텍스트입니다.',
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
      description: '사이드바에서 가운데 레이블 표시 여부를 조절합니다.',
      id: 'divider-playground',
      filename: 'playground.tsx',
      source: createPlaygroundSource('@opnay/city-ds-react/divider', 'Divider'),
      title: 'Preview',
    },
    {
      Component: DividerUsageExample,
      coverage: [{ axis: 'label', values: ['none', 'section'] }],
      description: '레이블 없는 기본 구분선과 가운데 레이블이 있는 구분선을 비교합니다.',
      id: 'divider-usage',
      filename: 'usage.tsx',
      source: usageSource,
      title: '레이블 사용',
    },
  ],
  optionAxes: [
    {
      control: 'segmented',
      name: 'label',
      defaultValue: 'section',
      values: ['none', 'section'],
    },
  ],
} satisfies ComponentPageData;
