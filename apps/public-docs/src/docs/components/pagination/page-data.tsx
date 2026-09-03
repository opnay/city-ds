import pagerSource from './examples/pager.tsx?raw';
import PaginationExample from './examples/pager';
import { PaginationPreview } from '../../preview-playgrounds/content';
import { createPlaygroundSource } from '../../preview-playgrounds/source';
import type { ComponentPageData } from '../../types';
export const pageData = {
  featuredExampleId: 'pagination-playground',
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
      Component: PaginationPreview,
      configurable: true,
      coverage: [{ axis: 'preview', values: ['configurable'] }],
      description: '사이드바에서 페이지 제어의 밀도를 조절합니다.',
      id: 'pagination-playground',
      filename: 'playground.tsx',
      source: createPlaygroundSource('@opnay/city-ds-react/pagination', 'Pagination'),
      title: 'Preview',
    },
    {
      Component: PaginationExample,
      coverage: [{ axis: 'density', values: ['comfortable', 'compact'] }],
      description: '편안한·압축 밀도에서 긴 페이지 범위의 이전·다음과 생략을 제공합니다.',
      id: 'pagination-controlled',
      filename: 'pager.tsx',
      source: pagerSource,
      title: '제어된 페이지 이동',
    },
  ],
  optionAxes: [
    { name: 'density', defaultValue: 'comfortable', values: ['comfortable', 'compact'] },
  ],
} satisfies ComponentPageData;
