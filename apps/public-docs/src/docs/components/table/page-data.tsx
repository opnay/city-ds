import interactionsSource from './examples/interactions.tsx?raw';
import TableInteractionsExample from './examples/interactions';
import overflowSource from './examples/overflow.tsx?raw';
import TableOverflowExample from './examples/overflow';
import presentationSource from './examples/presentation.tsx?raw';
import TablePresentationExample from './examples/presentation';
import statesSource from './examples/states.tsx?raw';
import TableStatesExample from './examples/states';
import { TablePreview } from '../../preview-playgrounds/surfaces';
import { createPlaygroundSource } from '../../preview-playgrounds/source';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'table-playground',
  widePreviewIds: [
    'table-playground',
    'table-presentation',
    'table-states',
    'table-overflow',
    'table-interactions',
  ],
  api: [
    {
      defaultValue: "'md'",
      description: '셀 여백입니다.',
      name: 'size',
      type: "'xsm' | 'sm' | 'md' | 'lg' | 'xlg'",
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
      Component: TablePreview,
      configurable: true,
      coverage: [{ axis: 'preview', values: ['configurable'] }],
      description: '사이드바에서 셀 밀도, 표면, 스크롤과 정렬·선택 상태를 조절합니다.',
      id: 'table-playground',
      filename: 'playground.tsx',
      source: createPlaygroundSource('@opnay/city-ds-react/table', 'Table'),
      title: 'Preview',
    },
    {
      Component: TablePresentationExample,
      coverage: [
        {
          axis: 'size',
          combinations: [
            'size=xsm|variant=line',
            'size=sm|variant=line',
            'size=md|variant=line',
            'size=lg|variant=line',
            'size=xlg|variant=line',
            'size=xsm|variant=surface',
            'size=sm|variant=surface',
            'size=md|variant=surface',
            'size=lg|variant=surface',
            'size=xlg|variant=surface',
          ],
          values: ['xsm', 'sm', 'md', 'lg', 'xlg'],
        },
        { axis: 'variant', values: ['line', 'surface'] },
      ],
      description: '모든 크기와 표면 조합에서 셀 밀도와 경계를 비교합니다.',
      id: 'table-presentation',
      filename: 'presentation.tsx',
      source: presentationSource,
      title: '크기와 표면',
    },
    {
      Component: TableStatesExample,
      coverage: [{ axis: 'state', values: ['empty', 'loading'] }],
      description: '데이터가 없거나 아직 준비되지 않은 상태를 표 구조 안에서 전달합니다.',
      id: 'table-states',
      filename: 'states.tsx',
      source: statesSource,
      title: '빈 상태와 로딩',
    },
    {
      Component: TableOverflowExample,
      coverage: [
        { axis: 'overflow', values: ['horizontal-scroll'] },
        { axis: 'scrollAppearance', values: ['plain', 'band', 'outline'] },
      ],
      description: '좁은 영역에서 표를 자르지 않고 키보드로 스크롤할 수 있게 합니다.',
      id: 'table-overflow',
      filename: 'overflow.tsx',
      source: overflowSource,
      title: '가로 넘침',
    },
    {
      Component: TableInteractionsExample,
      coverage: [
        { axis: 'sort', values: ['none', 'asc', 'desc'] },
        { axis: 'selection', values: ['none', 'indeterminate', 'all'] },
      ],
      description: '정렬과 행 선택을 제어하며 일부 선택 상태를 명시적으로 전달합니다.',
      id: 'table-interactions',
      filename: 'interactions.tsx',
      source: interactionsSource,
      title: '정렬과 선택',
    },
  ],
  optionAxes: [
    { defaultValue: 'md', name: 'size', values: ['xsm', 'sm', 'md', 'lg', 'xlg'] },
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
  previewOptionAxes: [
    { defaultValue: 'md', name: 'size', values: ['xsm', 'sm', 'md', 'lg', 'xlg'] },
    { defaultValue: 'line', name: 'variant', values: ['line', 'surface'] },
    { defaultValue: 'outline', name: 'scrollAppearance', values: ['plain', 'band', 'outline'] },
    { defaultValue: 'none', name: 'sort', values: ['none', 'asc', 'desc'] },
    { defaultValue: 'none', name: 'selection', values: ['none', 'indeterminate', 'all'] },
  ],
} satisfies ComponentPageData;
