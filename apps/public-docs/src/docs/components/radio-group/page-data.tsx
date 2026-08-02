import choicesSource from './examples/choices.tsx?raw';
import RadioGroupChoicesExample from './examples/choices';
import type { ComponentPageData } from '../../types';
export const pageData = {
  api: [
    {
      name: 'value / onValueChange',
      type: 'Value / callback',
      description: '단일 선택을 제어합니다.',
    },
    { name: 'defaultValue', type: 'Value', description: '비제어 초기 선택입니다.' },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      description: '라디오 크기입니다.',
    },
    { name: 'disabled', type: 'boolean', description: '선택할 수 없는 항목입니다.' },
  ],
  examples: [
    {
      Component: RadioGroupChoicesExample,
      coverage: [
        { axis: 'size', values: ['sm', 'md', 'lg'] },
        { axis: 'mode', values: ['controlled', 'uncontrolled'] },
        { axis: 'disabled', values: ['true'] },
      ],
      description: '제어·비제어 크기와 비활성 단일 선택입니다.',
      id: 'radio-group-choices',
      source: choicesSource,
      title: '단일 선택',
    },
  ],
  optionAxes: [
    { name: 'size', defaultValue: 'md', values: ['sm', 'md', 'lg'] },
    { name: 'mode', values: ['controlled', 'uncontrolled'] },
    { name: 'disabled', defaultValue: 'false', values: ['false', 'true'] },
  ],
} satisfies ComponentPageData;
