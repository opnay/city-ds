import tooltipSource from './examples/tooltip.tsx?raw';
import TooltipExample from './examples/tooltip';
import type { ComponentPageData } from '../../types';
export const pageData = {
  api: [
    { name: 'delay', type: 'number', description: '표시 전 대기 시간입니다.' },
    {
      name: 'open / onOpenChange',
      type: 'boolean / callback',
      description: '열림 상태를 제어합니다.',
    },
    {
      name: 'side',
      type: "'top' | 'right' | 'bottom' | 'left'",
      description: '트리거에 대한 위치입니다.',
    },
  ],
  examples: [
    {
      Component: TooltipExample,
      coverage: [
        { axis: 'side', values: ['top', 'right', 'bottom', 'left'] },
        { axis: 'mode', values: ['uncontrolled', 'controlled'] },
      ],
      description: '네 방향의 포인터·키보드 보조 설명을 표시합니다.',
      id: 'tooltip-basic',
      filename: 'tooltip.tsx',
      source: tooltipSource,
      title: '보조 설명',
    },
  ],
  optionAxes: [
    { name: 'side', values: ['top', 'right', 'bottom', 'left'] },
    { name: 'mode', defaultValue: 'uncontrolled', values: ['uncontrolled', 'controlled'] },
  ],
} satisfies ComponentPageData;
