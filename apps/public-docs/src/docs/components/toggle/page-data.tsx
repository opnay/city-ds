import matrixSource from './examples/matrix.tsx?raw';
import ToggleMatrixExample from './examples/matrix';
import type { ComponentPageData } from '../../types';
export const pageData = {
  api: [
    {
      name: 'variant',
      type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'",
      defaultValue: "'outline'",
      description: '토글 표면입니다.',
    },
    {
      name: 'pressed / onPressedChange',
      type: 'boolean / callback',
      description: '켜짐 상태를 제어합니다.',
    },
    { name: 'defaultPressed', type: 'boolean', description: '비제어 초기 상태입니다.' },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      description: '제어 높이입니다.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      description: '상태 변경을 막고 비활성 이유를 주변 문맥에서 설명합니다.',
    },
  ],
  examples: [
    {
      Component: ToggleMatrixExample,
      coverage: [
        {
          axis: 'variant',
          values: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
          combinations: [
            'variant=primary|pressed=true',
            'variant=primary|pressed=false',
            'variant=secondary|pressed=true',
            'variant=secondary|pressed=false',
            'variant=outline|pressed=true',
            'variant=outline|pressed=false',
            'variant=ghost|pressed=true',
            'variant=ghost|pressed=false',
            'variant=destructive|pressed=true',
            'variant=destructive|pressed=false',
          ],
        },
        { axis: 'pressed', values: ['false', 'true'] },
        { axis: 'size', values: ['sm', 'md', 'lg'] },
        { axis: 'mode', values: ['uncontrolled', 'controlled'] },
        { axis: 'disabled', values: ['true'] },
      ],
      description: '모든 표면·선택 상태와 크기를 비교합니다.',
      id: 'toggle-matrix',
      filename: 'matrix.tsx',
      source: matrixSource,
      title: '토글 상태',
    },
  ],
  optionAxes: [
    {
      name: 'variant',
      defaultValue: 'outline',
      values: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
    },
    { name: 'pressed', values: ['false', 'true'] },
    { name: 'size', defaultValue: 'md', values: ['sm', 'md', 'lg'] },
    { name: 'mode', defaultValue: 'uncontrolled', values: ['uncontrolled', 'controlled'] },
    { name: 'disabled', defaultValue: 'false', values: ['false', 'true'] },
  ],
} satisfies ComponentPageData;
