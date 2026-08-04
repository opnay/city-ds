import matrixSource from './examples/matrix.tsx?raw';
import ToggleGroupMatrixExample from './examples/matrix';
import type { ComponentPageData } from '../../types';
export const pageData = {
  api: [
    {
      name: 'variant',
      type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'",
      defaultValue: "'ghost'",
      description: '그룹 항목 표면입니다.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      description: '그룹의 모든 항목 크기를 맞춥니다.',
    },
    {
      name: 'multiple',
      type: 'boolean',
      defaultValue: 'false',
      description: '여러 항목을 선택합니다.',
    },
    {
      name: 'value / onValueChange',
      type: 'Value[] / callback',
      description: '선택 값을 제어합니다.',
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      defaultValue: "'horizontal'",
      description: '배치 방향입니다.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      description: '그룹 또는 개별 Item의 선택을 막습니다.',
    },
  ],
  examples: [
    {
      Component: ToggleGroupMatrixExample,
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
        { axis: 'multiple', values: ['false', 'true'] },
        { axis: 'orientation', values: ['horizontal', 'vertical'] },
        { axis: 'size', values: ['sm', 'md', 'lg'] },
        { axis: 'mode', values: ['uncontrolled', 'controlled'] },
        { axis: 'disabled', values: ['true'] },
      ],
      description: '각 표면의 선택·해제 항목, 단일·복수 선택과 방향을 비교합니다.',
      id: 'toggle-group-matrix',
      filename: 'matrix.tsx',
      source: matrixSource,
      title: '그룹 선택',
    },
  ],
  optionAxes: [
    {
      name: 'variant',
      defaultValue: 'ghost',
      values: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
    },
    { name: 'pressed', values: ['false', 'true'] },
    { name: 'multiple', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'orientation', defaultValue: 'horizontal', values: ['horizontal', 'vertical'] },
    { name: 'size', defaultValue: 'md', values: ['sm', 'md', 'lg'] },
    { name: 'mode', defaultValue: 'uncontrolled', values: ['uncontrolled', 'controlled'] },
    { name: 'disabled', defaultValue: 'false', values: ['false', 'true'] },
  ],
} satisfies ComponentPageData;
