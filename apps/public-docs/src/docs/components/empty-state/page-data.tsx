import emptySource from './examples/empty.tsx?raw';
import EmptyExample from './examples/empty';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'empty-state',
  widePreviewIds: ['empty-state'],
  api: [
    {
      name: 'density',
      type: "'default' | 'compact'",
      defaultValue: "'default'",
      description: '빈 영역의 여백과 서체 밀도를 정합니다.',
    },
    { name: 'Icon', type: 'EmptyState.Icon', description: '상태를 보조하는 장식 아이콘입니다.' },
    { name: 'Actions', type: 'EmptyState.Actions', description: '다음 행동을 한두 개 제공합니다.' },
  ],
  examples: [
    {
      Component: EmptyExample,
      coverage: [
        { axis: 'density', values: ['default', 'compact'] },
        { axis: 'empty', values: ['no data', 'no results'] },
      ],
      description: '초기 데이터 없음과 검색 결과 없음을 구분해 안내합니다.',
      id: 'empty-state',
      filename: 'empty.tsx',
      source: emptySource,
      title: '빈 결과 복구',
    },
  ],
  optionAxes: [{ name: 'density', defaultValue: 'default', values: ['default', 'compact'] }],
} satisfies ComponentPageData;
