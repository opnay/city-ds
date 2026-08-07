import sizesSource from './examples/sizes.tsx?raw';
import DatePickerSizesExample from './examples/sizes';
import statesSource from './examples/states.tsx?raw';
import DatePickerStatesExample from './examples/states';
import usageSource from './examples/usage.tsx?raw';
import UsageExample from './examples/usage';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'date-picker-usage',
  api: [
    {
      name: 'value / defaultValue',
      type: 'Date | null',
      description: '날짜 입력과 달력의 공통 값을 제어합니다.',
    },
    {
      name: 'open / onOpenChange / defaultOpen',
      type: 'boolean / callback',
      description: '달력 팝오버의 열림을 제어하거나 초기화합니다.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      description: '입력과 달력 제어 크기를 맞춥니다.',
    },
    {
      name: 'Calendar',
      type: 'Calendar props',
      description: '선택 후 값을 반영하고 팝오버를 닫습니다.',
    },
  ],
  examples: [
    {
      Component: DatePickerSizesExample,
      coverage: [{ axis: 'size', values: ['sm', 'md', 'lg'] }],
      description: '입력 세그먼트와 달력 트리거의 제어 높이를 함께 맞춥니다.',
      id: 'date-picker-sizes',
      filename: 'sizes.tsx',
      source: sizesSource,
      title: '크기',
    },
    {
      Component: UsageExample,
      coverage: [
        { axis: 'open', values: ['false', 'true'] },
        { axis: 'controlled', values: ['value', 'open'] },
      ],
      description: '텍스트 입력과 달력 선택이 하나의 로컬 날짜 상태를 공유합니다.',
      id: 'date-picker-usage',
      filename: 'usage.tsx',
      source: usageSource,
      title: '입력과 달력 조합',
    },
    {
      Component: DatePickerStatesExample,
      coverage: [
        { axis: 'invalid', values: ['true'] },
        { axis: 'disabled', values: ['true'] },
        { axis: 'readOnly', values: ['true'] },
      ],
      description: '오류, 비활성, 읽기 전용 날짜 입력을 구분합니다.',
      id: 'date-picker-states',
      filename: 'states.tsx',
      source: statesSource,
      title: '입력 상태',
    },
  ],
  optionAxes: [
    { name: 'size', defaultValue: 'md', values: ['sm', 'md', 'lg'] },
    { name: 'open', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'disabled', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'readOnly', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'invalid', defaultValue: 'false', values: ['false', 'true'] },
  ],
} satisfies ComponentPageData;
