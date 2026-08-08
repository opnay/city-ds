import selectionSource from './examples/selection.tsx?raw';
import CheckboxGroupSelectionExample from './examples/selection';
import sizesSource from './examples/sizes.tsx?raw';
import CheckboxGroupSizesExample from './examples/sizes';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'checkbox-group-selection',
  api: [
    {
      name: 'value / onValueChange',
      type: 'Value[] / callback',
      description: '복수 선택을 제어합니다.',
    },
    { name: 'defaultValue', type: 'Value[]', description: '비제어 초기 선택입니다.' },
    {
      name: 'size',
      type: "'xsm' | 'sm' | 'md' | 'lg' | 'xlg'",
      defaultValue: "'md'",
      description: '체크박스 크기입니다.',
    },
    { name: 'disabled', type: 'boolean', description: '그룹이나 항목 선택을 막습니다.' },
  ],
  examples: [
    {
      Component: CheckboxGroupSizesExample,
      coverage: [{ axis: 'size', values: ['xsm', 'sm', 'md', 'lg', 'xlg'] }],
      description: '그룹 안의 모든 체크박스에 동일한 크기를 적용합니다.',
      id: 'checkbox-group-sizes',
      filename: 'sizes.tsx',
      source: sizesSource,
      title: '크기',
    },
    {
      Component: CheckboxGroupSelectionExample,
      coverage: [
        { axis: 'mode', values: ['controlled', 'uncontrolled'] },
        { axis: 'disabled', values: ['true'] },
      ],
      description: '제어·비제어 복수 선택과 선택할 수 없는 항목을 구분합니다.',
      id: 'checkbox-group-selection',
      filename: 'selection.tsx',
      source: selectionSource,
      title: '복수 선택',
    },
  ],
  optionAxes: [
    { name: 'size', defaultValue: 'md', values: ['xsm', 'sm', 'md', 'lg', 'xlg'] },
    { name: 'mode', values: ['controlled', 'uncontrolled'] },
    { name: 'disabled', defaultValue: 'false', values: ['false', 'true'] },
  ],
} satisfies ComponentPageData;
