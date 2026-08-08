import selectionSource from './examples/selection.tsx?raw';
import ComboboxSelectionExample from './examples/selection';
import statesSource from './examples/states.tsx?raw';
import ComboboxStatesExample from './examples/states';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'combobox-selection',
  api: [
    { name: 'items', type: 'readonly Value[]', description: '검색하고 선택할 컬렉션입니다.' },
    {
      name: 'multiple',
      type: 'boolean',
      defaultValue: 'false',
      description: '여러 값을 선택하고 Chip으로 표시합니다.',
    },
    {
      name: 'size',
      type: "'xsm' | 'sm' | 'md' | 'lg' | 'xlg'",
      defaultValue: "'md'",
      description: '입력 그룹과 제어 크기를 정합니다.',
    },
    {
      name: 'value / onValueChange / defaultValue',
      type: 'Value | Value[] / callback',
      description: '선택 값을 제어하거나 초기화합니다.',
    },
  ],
  examples: [
    {
      Component: ComboboxSelectionExample,
      coverage: [
        {
          axis: 'size',
          values: ['xsm', 'sm', 'md', 'lg', 'xlg'],
          combinations: [
            'size=xsm|multiple=false',
            'size=xsm|multiple=true',
            'size=sm|multiple=false',
            'size=sm|multiple=true',
            'size=md|multiple=false',
            'size=md|multiple=true',
            'size=lg|multiple=false',
            'size=lg|multiple=true',
            'size=xlg|multiple=false',
            'size=xlg|multiple=true',
          ],
        },
        {
          axis: 'multiple',
          values: ['false', 'true'],
          combinations: [
            'size=xsm|multiple=false',
            'size=xsm|multiple=true',
            'size=sm|multiple=false',
            'size=sm|multiple=true',
            'size=md|multiple=false',
            'size=md|multiple=true',
            'size=lg|multiple=false',
            'size=lg|multiple=true',
            'size=xlg|multiple=false',
            'size=xlg|multiple=true',
          ],
        },
      ],
      description: '모든 크기에서 단일·복수 선택 구조를 비교합니다.',
      id: 'combobox-selection',
      filename: 'selection.tsx',
      source: selectionSource,
      title: 'size × multiple',
    },
    {
      Component: ComboboxStatesExample,
      coverage: [
        { axis: 'disabled', values: ['true'] },
        { axis: 'mode', values: ['uncontrolled', 'controlled'] },
      ],
      description: '외부에서 값을 제어하는 입력과 선택할 수 없는 입력을 구분합니다.',
      id: 'combobox-states',
      filename: 'states.tsx',
      source: statesSource,
      title: '상태 제어',
    },
  ],
  optionAxes: [
    { name: 'size', defaultValue: 'md', values: ['xsm', 'sm', 'md', 'lg', 'xlg'] },
    { name: 'multiple', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'disabled', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'mode', defaultValue: 'uncontrolled', values: ['uncontrolled', 'controlled'] },
  ],
} satisfies ComponentPageData;
