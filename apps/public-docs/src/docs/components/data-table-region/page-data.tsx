import hintSource from './examples/hint.tsx?raw';
import DataTableRegionHintExample from './examples/hint';
import overflowSource from './examples/overflow.tsx?raw';
import OverflowExample from './examples/overflow';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'data-table-region-overflow',
  widePreviewIds: ['data-table-region-overflow', 'data-table-region-hint'],
  api: [
    {
      name: 'label',
      type: 'string',
      description: '스크롤 가능한 table region의 접근성 이름입니다.',
    },
    { name: 'hint', type: 'ReactNode', description: '좁은 화면의 가로 스크롤 안내입니다.' },
    {
      name: 'showHint',
      type: 'boolean',
      defaultValue: 'true',
      description: '제공한 hint를 표시할지 정합니다.',
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
      Component: OverflowExample,
      coverage: [
        { axis: 'appearance', values: ['plain', 'band', 'outline'] },
        { axis: 'overflow', values: ['scroll hint'] },
      ],
      description: '좁은 컨테이너에서 스크롤 가능한 표와 안내를 연결합니다.',
      id: 'data-table-region-overflow',
      filename: 'overflow.tsx',
      source: overflowSource,
      title: '가로 스크롤 영역',
    },
    {
      Component: DataTableRegionHintExample,
      coverage: [{ axis: 'showHint', values: ['true', 'false'] }],
      description: '주변 문맥에 같은 안내가 있을 때 중복 힌트를 숨길 수 있습니다.',
      id: 'data-table-region-hint',
      filename: 'hint.tsx',
      source: hintSource,
      title: '스크롤 안내',
    },
  ],
  optionAxes: [
    { name: 'appearance', defaultValue: 'plain', values: ['plain', 'band', 'outline'] },
    { name: 'showHint', defaultValue: 'true', values: ['true', 'false'] },
  ],
} satisfies ComponentPageData;
