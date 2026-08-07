import playgroundSource from './examples/playground.tsx?raw';
import CalendarPlaygroundExample from './examples/playground';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'calendar-playground',
  api: [
    {
      name: 'value / defaultValue',
      type: 'Date | null',
      description: '시간대가 없는 로컬 날짜를 제어하거나 초기화합니다.',
    },
    {
      name: 'onValueChange',
      type: '(value: Date | null) => void',
      description: '선택 변경을 받습니다.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      description: '날짜 셀과 캡션 크기를 정합니다.',
    },
    {
      name: 'minValue / maxValue / isDateUnavailable',
      type: 'Date / predicate',
      description: '선택 가능한 날짜를 제한합니다.',
    },
    {
      name: 'showOutsideDays',
      type: 'boolean',
      defaultValue: 'true',
      description: '인접 월의 날짜를 현재 달력 그리드에 표시합니다.',
    },
  ],
  examples: [
    {
      Component: CalendarPlaygroundExample,
      coverage: [
        { axis: 'size', values: ['sm', 'md', 'lg'] },
        { axis: 'disabled', values: ['false', 'true'] },
        { axis: 'readOnly', values: ['false', 'true'] },
        { axis: 'invalid', values: ['false', 'true'] },
        { axis: 'showOutsideDays', values: ['false', 'true'] },
      ],
      description: '크기와 상태, 인접 월 날짜 표시를 한 달력에서 바꿔 확인합니다.',
      id: 'calendar-playground',
      filename: 'playground.tsx',
      source: playgroundSource,
      title: '달력 옵션',
    },
  ],
  optionAxes: [
    { name: 'size', defaultValue: 'md', values: ['sm', 'md', 'lg'] },
    { name: 'disabled', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'readOnly', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'invalid', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'showOutsideDays', defaultValue: 'true', values: ['false', 'true'] },
  ],
} satisfies ComponentPageData;
