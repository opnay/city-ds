import matrixSource from './examples/matrix.tsx?raw';
import FilterBarMatrixExample from './examples/matrix';
import type { ComponentPageData } from '../../types';

export const pageData = {
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
    { name: 'appearance', defaultValue: 'band', values: ['plain', 'band', 'outline'] },
    { name: 'density', defaultValue: 'comfortable', values: ['comfortable', 'compact'] },
  ],
} satisfies ComponentPageData;
