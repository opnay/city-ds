import matrixSource from './examples/matrix.tsx?raw';
import FilterBarMatrixExample from './examples/matrix';
import { FilterBarPreview } from '../../preview-playgrounds/surfaces';
import { createPlaygroundSource } from '../../preview-playgrounds/source';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'filter-bar-playground',
  widePreviewIds: ['filter-bar-playground', 'filter-bar-matrix'],
  api: [
    {
      name: 'appearance',
      type: "'plain' | 'band' | 'outline'",
      defaultValue: "'band'",
      description: '필터 영역의 표면 처리입니다.',
    },
    {
      name: 'density',
      type: "'comfortable' | 'compact'",
      description: '필터와 액션 사이의 간격입니다.',
    },
    {
      name: 'actions',
      type: 'ReactNode',
      description: '적용·초기화처럼 필터와 분리할 액션입니다.',
    },
  ],
  examples: [
    {
      Component: FilterBarPreview,
      configurable: true,
      coverage: [{ axis: 'preview', values: ['configurable'] }],
      description: '사이드바에서 필터 영역의 표면과 밀도를 조절합니다.',
      id: 'filter-bar-playground',
      filename: 'playground.tsx',
      source: createPlaygroundSource('@opnay/city-ds-react/filter-bar', 'FilterBar'),
      title: 'Preview',
    },
    {
      Component: FilterBarMatrixExample,
      coverage: [
        {
          axis: 'appearance',
          values: ['plain', 'band', 'outline'],
          combinations: [
            'appearance=plain|density=comfortable',
            'appearance=plain|density=compact',
            'appearance=band|density=comfortable',
            'appearance=band|density=compact',
            'appearance=outline|density=comfortable',
            'appearance=outline|density=compact',
          ],
        },
        { axis: 'density', values: ['comfortable', 'compact'] },
      ],
      description: '모든 표면과 밀도 조합을 비교합니다.',
      id: 'filter-bar-matrix',
      filename: 'matrix.tsx',
      source: matrixSource,
      title: '표면과 밀도',
    },
  ],
  optionAxes: [
    {
      control: 'segmented',
      name: 'appearance',
      defaultValue: 'band',
      values: ['plain', 'band', 'outline'],
    },
    {
      control: 'segmented',
      name: 'density',
      defaultValue: 'comfortable',
      values: ['comfortable', 'compact'],
    },
  ],
} satisfies ComponentPageData;
