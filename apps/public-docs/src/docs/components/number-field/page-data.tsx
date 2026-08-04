import numberFieldSource from './examples/number-field.tsx?raw';
import NumberFieldExample from './examples/number-field';
import type { ComponentPageData } from '../../types';
export const pageData = {
  api: [
    {
      name: 'value / onValueChange',
      type: 'number | null / callback',
      description: '숫자 값을 제어합니다.',
    },
    { name: 'min / max / step', type: 'number', description: '허용 범위와 증감 단위입니다.' },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      description: '제어 크기입니다.',
    },
    { name: 'disabled', type: 'boolean', description: '값 변경을 막습니다.' },
  ],
  examples: [
    {
      Component: NumberFieldExample,
      coverage: [
        { axis: 'size', values: ['sm', 'md', 'lg'] },
        { axis: 'mode', values: ['controlled', 'uncontrolled'] },
        { axis: 'disabled', values: ['true'] },
      ],
      description: '범위가 있는 제어 값, 비제어 크기, 비활성 상태입니다.',
      id: 'number-field-basic',
      filename: 'number-field.tsx',
      source: numberFieldSource,
      title: '수량 입력',
    },
  ],
  optionAxes: [
    { name: 'size', defaultValue: 'md', values: ['sm', 'md', 'lg'] },
    { name: 'mode', values: ['controlled', 'uncontrolled'] },
    { name: 'disabled', defaultValue: 'false', values: ['false', 'true'] },
  ],
} satisfies ComponentPageData;
