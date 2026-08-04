import usageSource from './examples/usage.tsx?raw';
import UsageExample from './examples/usage';
import type { ComponentPageData } from '../../types';

export const pageData = {
  api: [
    {
      name: 'multiple',
      type: 'boolean',
      defaultValue: 'false',
      description: '여러 항목을 동시에 열 수 있게 합니다.',
    },
    {
      name: 'value / defaultValue',
      type: 'string[]',
      description: '열린 항목을 제어하거나 초기화합니다.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Root 전체 또는 Item 단위로 열림을 막습니다.',
    },
  ],
  examples: [
    {
      Component: UsageExample,
      coverage: [
        { axis: 'multiple', values: ['false', 'true'] },
        { axis: 'disabled', values: ['true'] },
        { axis: 'mode', values: ['uncontrolled', 'controlled'] },
      ],
      description: '기본 단일 열림과 비활성 항목을 함께 확인합니다.',
      id: 'accordion-usage',
      filename: 'usage.tsx',
      source: usageSource,
      title: '기본 구조',
    },
  ],
  optionAxes: [
    { name: 'multiple', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'disabled', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'mode', defaultValue: 'uncontrolled', values: ['uncontrolled', 'controlled'] },
  ],
} satisfies ComponentPageData;
