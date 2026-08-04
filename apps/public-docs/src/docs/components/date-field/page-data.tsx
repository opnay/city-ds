import controlledSource from './examples/controlled.tsx?raw';
import ControlledExample from './examples/controlled';
import type { ComponentPageData } from '../../types';

export const pageData = {
  api: [
    {
      name: 'value / defaultValue',
      type: 'Date | null',
      description: '로컬 날짜를 제어하거나 초기화합니다.',
    },
    {
      name: 'onValueChange',
      type: '(value: Date | null) => void',
      description: '유효한 날짜 변경을 받습니다.',
    },
    {
      name: 'minValue / maxValue',
      type: 'Date',
      description: '입력 가능한 날짜 범위를 제한합니다.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      description: '입력 제어 크기를 정합니다.',
    },
  ],
  examples: [
    {
      Component: ControlledExample,
      coverage: [
        { axis: 'size', values: ['sm', 'md', 'lg'] },
        { axis: 'controlled', values: ['true'] },
        { axis: 'invalid', values: ['true'] },
        { axis: 'disabled', values: ['true'] },
        { axis: 'readOnly', values: ['true'] },
      ],
      description: '제어된 로컬 날짜와 검증 오류를 확인합니다.',
      id: 'date-field-controlled',
      filename: 'controlled.tsx',
      source: controlledSource,
      title: '날짜 텍스트 입력',
    },
  ],
  optionAxes: [
    { name: 'size', defaultValue: 'md', values: ['sm', 'md', 'lg'] },
    { name: 'disabled', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'readOnly', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'invalid', defaultValue: 'false', values: ['false', 'true'] },
  ],
} satisfies ComponentPageData;
