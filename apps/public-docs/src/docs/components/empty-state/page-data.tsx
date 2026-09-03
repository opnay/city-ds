import emptySource from './examples/empty.tsx?raw';
import EmptyExample from './examples/empty';
import { EmptyStatePreview } from '../../preview-playgrounds/content';
import { createPlaygroundSource } from '../../preview-playgrounds/source';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'empty-state-playground',
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
      Component: EmptyStatePreview,
      configurable: true,
      coverage: [{ axis: 'preview', values: ['configurable'] }],
      description: '사이드바에서 빈 상태의 정보 밀도를 조절합니다.',
      id: 'empty-state-playground',
      filename: 'playground.tsx',
      source: createPlaygroundSource('@opnay/city-ds-react/empty-state', 'EmptyState'),
      title: 'Preview',
    },
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
  optionAxes: [
    {
      control: 'segmented',
      name: 'density',
      defaultValue: 'default',
      values: ['default', 'compact'],
    },
  ],
} satisfies ComponentPageData;
