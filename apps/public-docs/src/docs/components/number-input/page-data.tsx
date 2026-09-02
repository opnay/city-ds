import numberInputSource from './examples/number-input.tsx?raw';
import NumberInputExample from './examples/number-input';
import sizesSource from './examples/sizes.tsx?raw';
import NumberInputSizesExample from './examples/sizes';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'number-input-basic',
  api: [
    {
      name: 'value / onValueChange',
      type: 'number | null / callback',
      description: '숫자 값을 제어합니다.',
    },
    { name: 'min / max / step', type: 'number', description: '허용 범위와 증감 단위입니다.' },
    {
      name: 'size',
      type: "'xsm' | 'sm' | 'md' | 'lg' | 'xlg'",
      defaultValue: "'md'",
      description: '제어 크기입니다.',
    },
    { name: 'disabled', type: 'boolean', description: '값 변경을 막습니다.' },
  ],
  examples: [
    {
      Component: NumberInputSizesExample,
      coverage: [{ axis: 'size', values: ['xsm', 'sm', 'md', 'lg', 'xlg'] }],
      description: '입력과 증감 버튼을 같은 제어 크기로 맞춥니다.',
      id: 'number-input-sizes',
      filename: 'sizes.tsx',
      source: sizesSource,
      title: '크기',
    },
    {
      Component: NumberInputExample,
      coverage: [
        { axis: 'mode', values: ['controlled', 'uncontrolled'] },
        { axis: 'disabled', values: ['true'] },
      ],
      description: '범위가 있는 제어 값, 비제어 값과 비활성 상태입니다.',
      id: 'number-input-basic',
      filename: 'number-input.tsx',
      source: numberInputSource,
      title: '수량 입력',
    },
  ],
  optionAxes: [
    { name: 'size', defaultValue: 'md', values: ['xsm', 'sm', 'md', 'lg', 'xlg'] },
    { name: 'mode', values: ['controlled', 'uncontrolled'] },
    { name: 'disabled', defaultValue: 'false', values: ['false', 'true'] },
  ],
} satisfies ComponentPageData;
