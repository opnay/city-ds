import interactionsSource from './examples/interactions.tsx?raw';
import TableInteractionsExample from './examples/interactions';
import matrixSource from './examples/matrix.tsx?raw';
import TableMatrixExample from './examples/matrix';
import type { ComponentPageData } from '../../types';

export const pageData = {
  api: [
    {
      defaultValue: "'md'",
      description: '셀 여백입니다.',
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
    },
    {
      defaultValue: "'line'",
      description: '테이블 표면입니다.',
      name: 'variant',
      type: "'line' | 'surface'",
    },
    {
      description: '제어된 정렬 방향을 바꾸고 현재 상태를 전달합니다.',
      name: 'Table.SortButton',
      type: "direction: false | 'asc' | 'desc'",
    },
    {
      description: '전체·일부·선택 없음과 개별 행 선택을 표현합니다.',
      name: 'Table.SelectionHead / SelectionCell',
      type: 'component',
    },
    {
      description: '빈 결과와 로딩 행입니다.',
      name: 'Table.StateRow',
      type: "status: 'empty' | 'loading'",
    },
    {
      description: '가로 넘침을 키보드로 스크롤하며 표면 경계를 정합니다.',
      name: 'Table.ScrollArea',
      type: "appearance: 'plain' | 'band' | 'outline'",
    },
  ],
  examples: [
    {
      Component: TableMatrixExample,
      coverage: [
        {
          axis: 'size',
          combinations: [
            'size=sm|variant=line',
            'size=md|variant=line',
            'size=lg|variant=line',
            'size=sm|variant=surface',
            'size=md|variant=surface',
            'size=lg|variant=surface',
          ],
          values: ['sm', 'md', 'lg'],
        },
        { axis: 'variant', values: ['line', 'surface'] },
        { axis: 'state', values: ['empty', 'loading'] },
        { axis: 'overflow', values: ['horizontal-scroll'] },
        { axis: 'scrollAppearance', values: ['plain', 'band', 'outline'] },
      ],
      description: '모든 크기·표면 조합과 빈·로딩 상태입니다.',
      id: 'table-matrix',
      source: matrixSource,
      title: '테이블 형태와 상태',
    },
    {
      Component: TableInteractionsExample,
      coverage: [
        { axis: 'sort', values: ['none', 'asc', 'desc'] },
        { axis: 'selection', values: ['none', 'indeterminate', 'all'] },
      ],
      description: '정렬과 행 선택을 제어하며 일부 선택 상태를 명시적으로 전달합니다.',
      id: 'table-interactions',
      source: interactionsSource,
      title: '정렬과 선택',
    },
  ],
  optionAxes: [
    { defaultValue: 'md', name: 'size', values: ['sm', 'md', 'lg'] },
    { defaultValue: 'line', name: 'variant', values: ['line', 'surface'] },
    { name: 'state', values: ['empty', 'loading'] },
    { name: 'overflow', values: ['horizontal-scroll'] },
    {
      name: 'scrollAppearance',
      defaultValue: 'outline',
      values: ['plain', 'band', 'outline'],
    },
    { defaultValue: 'none', name: 'sort', values: ['none', 'asc', 'desc'] },
    {
      defaultValue: 'none',
      name: 'selection',
      values: ['none', 'indeterminate', 'all'],
    },
  ],
} satisfies ComponentPageData;
