import matrixSource from './examples/matrix.tsx?raw';
import MatrixExample from './examples/matrix';
import type { ComponentPageData } from '../../types';

export const pageData = {
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
      type: "'sm' | 'md' | 'lg'",
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
      Component: MatrixExample,
      coverage: [
        {
          axis: 'size',
          values: ['sm', 'md', 'lg'],
          combinations: [
            'size=sm|multiple=false',
            'size=sm|multiple=true',
            'size=md|multiple=false',
            'size=md|multiple=true',
            'size=lg|multiple=false',
            'size=lg|multiple=true',
          ],
        },
        {
          axis: 'multiple',
          values: ['false', 'true'],
          combinations: [
            'size=sm|multiple=false',
            'size=sm|multiple=true',
            'size=md|multiple=false',
            'size=md|multiple=true',
            'size=lg|multiple=false',
            'size=lg|multiple=true',
          ],
        },
        { axis: 'disabled', values: ['true'] },
        { axis: 'mode', values: ['uncontrolled', 'controlled'] },
      ],
      description: '모든 크기에서 단일·복수 선택 구조를 비교합니다.',
      id: 'combobox-matrix',
      source: matrixSource,
      title: 'size × multiple',
    },
  ],
  optionAxes: [
    { name: 'size', defaultValue: 'md', values: ['sm', 'md', 'lg'] },
    { name: 'multiple', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'disabled', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'mode', defaultValue: 'uncontrolled', values: ['uncontrolled', 'controlled'] },
  ],
} satisfies ComponentPageData;
