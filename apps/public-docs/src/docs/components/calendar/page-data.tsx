import outsideDaysSource from './examples/outside-days.tsx?raw';
import CalendarOutsideDaysExample from './examples/outside-days';
import sizesSource from './examples/sizes.tsx?raw';
import CalendarSizesExample from './examples/sizes';
import statesSource from './examples/states.tsx?raw';
import StatesExample from './examples/states';
import type { ComponentPageData } from '../../types';

export const pageData = {
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
      Component: CalendarSizesExample,
      coverage: [{ axis: 'size', values: ['sm', 'md', 'lg'] }],
      description: '날짜 셀과 달력 머리글의 제어 크기를 함께 맞춥니다.',
      id: 'calendar-sizes',
      filename: 'sizes.tsx',
      source: sizesSource,
      title: '크기',
    },
    {
      Component: StatesExample,
      coverage: [
        { axis: 'controlled', values: ['true'] },
        { axis: 'readOnly', values: ['true'] },
        { axis: 'invalid', values: ['true'] },
        { axis: 'disabled', values: ['true'] },
      ],
      description: '제어된 선택과 읽기 전용·유효하지 않은 상태를 확인합니다.',
      id: 'calendar-states',
      filename: 'states.tsx',
      source: statesSource,
      title: '로컬 날짜 선택',
    },
    {
      Component: CalendarOutsideDaysExample,
      coverage: [{ axis: 'showOutsideDays', values: ['false', 'true'] }],
      description: '월 경계에서 인접 월 날짜를 함께 표시할지 선택합니다.',
      id: 'calendar-outside-days',
      filename: 'outside-days.tsx',
      source: outsideDaysSource,
      title: '인접 월 날짜',
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
