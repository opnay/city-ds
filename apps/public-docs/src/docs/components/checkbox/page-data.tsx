import sizesSource from './examples/sizes.tsx?raw';
import CheckboxSizesExample from './examples/sizes';
import statesSource from './examples/states.tsx?raw';
import StatesExample from './examples/states';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'checkbox-states',
  api: [
    {
      name: 'checked / defaultChecked',
      type: 'boolean',
      description: '선택 상태를 제어하거나 초기화합니다.',
    },
    {
      name: 'onCheckedChange',
      type: '(checked: boolean) => void',
      description: '사용자의 변경을 받습니다.',
    },
    {
      name: 'indeterminate',
      type: 'boolean',
      defaultValue: 'false',
      description: '부분 선택 상태를 표시합니다.',
    },
    {
      name: 'size',
      type: "'xsm' | 'sm' | 'md' | 'lg' | 'xlg'",
      defaultValue: "'md'",
      description: '제어 크기를 지정합니다.',
    },
  ],
  examples: [
    {
      Component: StatesExample,
      coverage: [
        { axis: 'checked', values: ['false', 'true'] },
        { axis: 'indeterminate', values: ['true'] },
        { axis: 'disabled', values: ['true'] },
      ],
      description: '제어됨, 부분 선택, 비활성 상태를 비교합니다.',
      id: 'checkbox-states',
      filename: 'states.tsx',
      source: statesSource,
      title: '선택 상태',
    },
    {
      Component: CheckboxSizesExample,
      coverage: [{ axis: 'size', values: ['xsm', 'sm', 'md', 'lg', 'xlg'] }],
      description: '주변 입력 제어와 체크박스 크기를 맞춥니다.',
      id: 'checkbox-sizes',
      filename: 'sizes.tsx',
      source: sizesSource,
      title: '크기',
    },
  ],
  optionAxes: [
    { name: 'checked', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'indeterminate', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'disabled', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'size', defaultValue: 'md', values: ['xsm', 'sm', 'md', 'lg', 'xlg'] },
  ],
} satisfies ComponentPageData;
