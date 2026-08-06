import controlledSource from './examples/controlled.tsx?raw';
import TooltipControlledExample from './examples/controlled';
import placementsSource from './examples/placements.tsx?raw';
import TooltipPlacementsExample from './examples/placements';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'tooltip-placements',
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
      Component: TooltipPlacementsExample,
      coverage: [{ axis: 'side', values: ['top', 'right', 'bottom', 'left'] }],
      description: '네 방향의 포인터·키보드 보조 설명을 표시합니다.',
      id: 'tooltip-placements',
      filename: 'placements.tsx',
      source: placementsSource,
      title: '위치',
    },
    {
      Component: TooltipControlledExample,
      coverage: [{ axis: 'mode', values: ['uncontrolled', 'controlled'] }],
      description: '기본 열림 동작과 외부에서 제어하는 열림 상태를 구분합니다.',
      id: 'tooltip-controlled',
      filename: 'controlled.tsx',
      source: controlledSource,
      title: '상태 제어',
    },
  ],
  optionAxes: [
    { name: 'side', values: ['top', 'right', 'bottom', 'left'] },
    { name: 'mode', defaultValue: 'uncontrolled', values: ['uncontrolled', 'controlled'] },
  ],
} satisfies ComponentPageData;
