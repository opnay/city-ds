import overflowSource from './examples/overflow.tsx?raw';
import OverflowExample from './examples/overflow';
import type { ComponentPageData } from '../../types';

export const pageData = {
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
        { axis: 'showHint', values: ['true', 'false'] },
        { axis: 'overflow', values: ['scroll hint'] },
      ],
      description: '좁은 컨테이너에서 스크롤 가능한 표와 안내를 연결합니다.',
      id: 'data-table-region-overflow',
      source: overflowSource,
      title: '가로 스크롤 영역',
    },
  ],
  optionAxes: [
    { name: 'appearance', defaultValue: 'plain', values: ['plain', 'band', 'outline'] },
    { name: 'showHint', defaultValue: 'true', values: ['true', 'false'] },
  ],
} satisfies ComponentPageData;
