import selectionSource from './examples/selection.tsx?raw';
import SelectSelectionExample from './examples/selection';
import sizesSource from './examples/sizes.tsx?raw';
import SelectSizesExample from './examples/sizes';
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
      Component: SelectSizesExample,
      coverage: [{ axis: 'size', values: ['sm', 'md', 'lg'] }],
      description: '트리거와 팝업 항목의 제어 크기를 맞춥니다.',
      id: 'select-sizes',
      filename: 'sizes.tsx',
      source: sizesSource,
      title: '크기',
    },
    {
      Component: SelectSelectionExample,
      coverage: [
        { axis: 'multiple', values: ['false', 'true'] },
        { axis: 'mode', values: ['controlled', 'uncontrolled'] },
      ],
      description: '제어·비제어 값과 단일·복수 선택을 구분합니다.',
      id: 'select-selection',
      filename: 'selection.tsx',
      source: selectionSource,
      title: '선택 방식',
    },
  ],
  optionAxes: [
    { name: 'size', defaultValue: 'md', values: ['sm', 'md', 'lg'] },
    { name: 'multiple', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'mode', values: ['controlled', 'uncontrolled'] },
  ],
} satisfies ComponentPageData;
