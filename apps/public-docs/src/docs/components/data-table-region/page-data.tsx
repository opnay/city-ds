import overflowSource from './examples/overflow.tsx?raw';
import OverflowExample from './examples/overflow';
import { DataTableRegionPreview } from '../../preview-playgrounds/surfaces';
import { createPlaygroundSource } from '../../preview-playgrounds/source';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'data-table-region-playground',
  widePreviewIds: ['data-table-region-playground', 'data-table-region-overflow'],
  api: [
    {
      name: 'label',
      type: 'string',
      description: '스크롤 가능한 table region의 접근성 이름입니다.',
    },
    {
      name: 'appearance',
      type: "'plain' | 'band' | 'outline'",
      defaultValue: "'plain'",
      description: '스크롤 영역의 표면을 지정합니다.',
    },
  ],
  examples: [
    {
      Component: DataTableRegionPreview,
      configurable: true,
      coverage: [{ axis: 'preview', values: ['configurable'] }],
      description: '사이드바에서 스크롤 영역 표면을 조절합니다.',
      id: 'data-table-region-playground',
      filename: 'playground.tsx',
      source: createPlaygroundSource('@opnay/city-ds-react/data-table-region', 'DataTableRegion'),
      title: 'Preview',
    },
    {
      Component: OverflowExample,
      coverage: [
        { axis: 'appearance', values: ['plain', 'band', 'outline'] },
        { axis: 'overflow', values: ['horizontal scroll'] },
      ],
      description: '좁은 컨테이너에서 스크롤 가능한 표를 구성합니다.',
      id: 'data-table-region-overflow',
      filename: 'overflow.tsx',
      source: overflowSource,
      title: '가로 스크롤 영역',
    },
  ],
  optionAxes: [
    {
      control: 'segmented',
      name: 'appearance',
      defaultValue: 'plain',
      values: ['plain', 'band', 'outline'],
    },
  ],
} satisfies ComponentPageData;
