import matrixSource from './examples/matrix.tsx?raw';
import MatrixExample from './examples/matrix';
import type { ComponentPageData } from '../../types';

export const pageData = {
  api: [
    {
      name: 'tone',
      type: "'neutral' | 'info' | 'success' | 'warning' | 'destructive'",
      defaultValue: "'info'",
      description: '메시지의 의미와 기본 역할을 정합니다.',
    },
    {
      name: 'appearance',
      type: "'subtle' | 'outline'",
      defaultValue: "'subtle'",
      description: '배경 또는 윤곽 표현을 정합니다.',
    },
    {
      name: 'showIcon',
      type: 'boolean',
      defaultValue: 'true',
      description: '의미 아이콘을 표시합니다.',
    },
    {
      name: 'variant',
      type: "'info' | 'success' | 'warning' | 'error'",
      description: '이전 표현과 호환되는 tone 별칭입니다.',
    },
  ],
  examples: [
    {
      Component: MatrixExample,
      coverage: [
        {
          axis: 'tone',
          values: ['neutral', 'info', 'success', 'warning', 'destructive'],
          combinations: [
            'tone=neutral|appearance=subtle',
            'tone=neutral|appearance=outline',
            'tone=info|appearance=subtle',
            'tone=info|appearance=outline',
            'tone=success|appearance=subtle',
            'tone=success|appearance=outline',
            'tone=warning|appearance=subtle',
            'tone=warning|appearance=outline',
            'tone=destructive|appearance=subtle',
            'tone=destructive|appearance=outline',
          ],
        },
        {
          axis: 'appearance',
          values: ['subtle', 'outline'],
          combinations: [
            'tone=neutral|appearance=subtle',
            'tone=neutral|appearance=outline',
            'tone=info|appearance=subtle',
            'tone=info|appearance=outline',
            'tone=success|appearance=subtle',
            'tone=success|appearance=outline',
            'tone=warning|appearance=subtle',
            'tone=warning|appearance=outline',
            'tone=destructive|appearance=subtle',
            'tone=destructive|appearance=outline',
          ],
        },
        { axis: 'showIcon', values: ['true', 'false'] },
        { axis: 'variant', values: ['info', 'success', 'warning', 'error'] },
      ],
      description: '모든 의미와 표현 조합을 비교합니다.',
      id: 'alert-matrix',
      filename: 'matrix.tsx',
      source: matrixSource,
      title: 'tone × appearance',
    },
  ],
  optionAxes: [
    {
      name: 'tone',
      defaultValue: 'info',
      values: ['neutral', 'info', 'success', 'warning', 'destructive'],
    },
    { name: 'appearance', defaultValue: 'subtle', values: ['subtle', 'outline'] },
    { name: 'showIcon', defaultValue: 'true', values: ['true', 'false'] },
    { name: 'variant', values: ['info', 'success', 'warning', 'error'] },
  ],
} satisfies ComponentPageData;
