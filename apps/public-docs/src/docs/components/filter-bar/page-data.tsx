import matrixSource from './examples/matrix.tsx?raw';
import FilterBarMatrixExample from './examples/matrix';
import { FilterBarPreview } from '../../preview-playgrounds/surfaces';
import filtersSource from './examples/filters.tsx?raw';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'filter-bar-playground',
  widePreviewIds: ['filter-bar-playground', 'filter-bar-matrix'],
  api: [
    {
      name: 'children',
      type: 'ReactNode',
      description: '직접 자식마다 하나의 조건을 배치합니다. 레이블과 제어는 함께 묶으십시오.',
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
      description: '테이블 결과 바로 위에서 이름과 상태를 함께 적용하고 초기화합니다.',
      id: 'filter-bar-playground',
      filename: 'filters.tsx',
      source: filtersSource,
      title: 'Preview',
    },
    {
      Component: FilterBarMatrixExample,
      coverage: [
        {
          axis: 'density',
          values: ['comfortable', 'compact'],
          combinations: ['density=comfortable', 'density=compact'],
        },
      ],
      description: '밀도에 따라 조건과 액션 사이 간격을 비교합니다.',
      id: 'filter-bar-matrix',
      filename: 'matrix.tsx',
      source: matrixSource,
      title: '밀도',
    },
  ],
  optionAxes: [
    {
      control: 'segmented',
      name: 'density',
      defaultValue: 'comfortable',
      values: ['comfortable', 'compact'],
    },
  ],
} satisfies ComponentPageData;
