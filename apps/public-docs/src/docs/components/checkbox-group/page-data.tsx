import checkboxGroupSource from './examples/checkbox-group.tsx?raw';
import CheckboxGroupExample from './examples/checkbox-group';
import type { ComponentPageData } from '../../types';
export const pageData = {
  api: [
    {
      name: 'value / onValueChange',
      type: 'Value[] / callback',
      description: '복수 선택을 제어합니다.',
    },
    { name: 'defaultValue', type: 'Value[]', description: '비제어 초기 선택입니다.' },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      description: '체크박스 크기입니다.',
    },
    { name: 'disabled', type: 'boolean', description: '그룹이나 항목 선택을 막습니다.' },
  ],
  examples: [
    {
      Component: CheckboxGroupExample,
      coverage: [
        { axis: 'size', values: ['sm', 'md', 'lg'] },
        { axis: 'mode', values: ['controlled', 'uncontrolled'] },
        { axis: 'disabled', values: ['true'] },
      ],
      description: '제어·비제어 복수 선택, 크기와 비활성 항목을 함께 보여줍니다.',
      id: 'checkbox-group-basic',
      source: checkboxGroupSource,
      title: '복수 선택',
    },
  ],
  optionAxes: [
    { name: 'size', defaultValue: 'md', values: ['sm', 'md', 'lg'] },
    { name: 'mode', values: ['controlled', 'uncontrolled'] },
    { name: 'disabled', defaultValue: 'false', values: ['false', 'true'] },
  ],
} satisfies ComponentPageData;
