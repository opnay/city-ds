import pagerSource from './examples/pager.tsx?raw';
import PaginationExample from './examples/pager';
import type { ComponentPageData } from '../../types';
export const pageData = {
  api: [
    { name: 'totalPages', type: 'number', description: '전체 페이지 수입니다.' },
    {
      name: 'page / onPageChange',
      type: 'number / callback',
      description: '현재 페이지를 제어합니다.',
    },
    {
      name: 'density',
      type: "'comfortable' | 'compact'",
      defaultValue: "'comfortable'",
      description: '페이지 제어 간격입니다.',
    },
    { name: 'siblingCount', type: 'number', description: '현재 페이지 주변 노출 수입니다.' },
  ],
  examples: [
    {
      Component: PaginationExample,
      coverage: [{ axis: 'density', values: ['comfortable', 'compact'] }],
      description: '편안한·압축 밀도에서 긴 페이지 범위의 이전·다음과 생략을 제공합니다.',
      id: 'pagination-controlled',
      source: pagerSource,
      title: '제어된 페이지 이동',
    },
  ],
  optionAxes: [
    { name: 'density', defaultValue: 'comfortable', values: ['comfortable', 'compact'] },
  ],
} satisfies ComponentPageData;
