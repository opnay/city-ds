import selectSource from './examples/select.tsx?raw';
import SelectExample from './examples/select';
import type { ComponentPageData } from '../../types';
export const pageData = {
  api: [
    { name: 'items', type: 'Record<Value, string> | Item[]', description: '선택 가능한 값입니다.' },
    {
      name: 'value / onValueChange',
      type: 'Value / callback',
      description: '선택 값을 제어합니다.',
    },
    {
      name: 'multiple',
      type: 'boolean',
      defaultValue: 'false',
      description: '여러 값을 선택합니다.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      description: '트리거 높이입니다.',
    },
  ],
  examples: [
    {
      Component: SelectExample,
      coverage: [
        { axis: 'size', values: ['sm', 'md', 'lg'] },
        { axis: 'multiple', values: ['false', 'true'] },
        { axis: 'mode', values: ['controlled', 'uncontrolled'] },
      ],
      description: '제어·비제어 단일·복수 선택과 모든 크기의 팝업 목록입니다.',
      id: 'select-basic',
      source: selectSource,
      title: '선택 목록',
    },
  ],
  optionAxes: [
    { name: 'size', defaultValue: 'md', values: ['sm', 'md', 'lg'] },
    { name: 'multiple', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'mode', values: ['controlled', 'uncontrolled'] },
  ],
} satisfies ComponentPageData;
