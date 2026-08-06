import controlledSource from './examples/controlled.tsx?raw';
import PopoverControlledExample from './examples/controlled';
import modalSource from './examples/modal.tsx?raw';
import PopoverModalExample from './examples/modal';
import placementsSource from './examples/placements.tsx?raw';
import PopoverPlacementsExample from './examples/placements';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'popover-controlled',
  api: [
    {
      name: 'open / onOpenChange',
      type: 'boolean / callback',
      description: '열림 상태를 제어합니다.',
    },
    { name: 'defaultOpen', type: 'boolean', description: '비제어 초기 열림 상태입니다.' },
    { name: 'side / align', type: 'placement', description: '트리거 기준 위치입니다.' },
    { name: 'modal', type: 'boolean', description: '모달 포커스 동작을 선택합니다.' },
  ],
  examples: [
    {
      Component: PopoverPlacementsExample,
      coverage: [
        {
          axis: 'side',
          values: ['top', 'right', 'bottom', 'left'],
          combinations: [
            'side=top|align=start',
            'side=top|align=center',
            'side=top|align=end',
            'side=right|align=start',
            'side=right|align=center',
            'side=right|align=end',
            'side=bottom|align=start',
            'side=bottom|align=center',
            'side=bottom|align=end',
            'side=left|align=start',
            'side=left|align=center',
            'side=left|align=end',
          ],
        },
        { axis: 'align', values: ['start', 'center', 'end'] },
      ],
      description: '트리거와 가용 공간에 맞는 방향·정렬 조합을 비교합니다.',
      id: 'popover-placements',
      filename: 'placements.tsx',
      source: placementsSource,
      title: '위치',
    },
    {
      Component: PopoverControlledExample,
      coverage: [
        { axis: 'mode', values: ['controlled', 'uncontrolled'] },
        { axis: 'open', values: ['closed', 'open'] },
      ],
      description: '기본 열림 동작과 외부 상태로 제어하는 패널을 구분합니다.',
      id: 'popover-controlled',
      filename: 'controlled.tsx',
      source: controlledSource,
      title: '상태 제어',
    },
    {
      Component: PopoverModalExample,
      coverage: [{ axis: 'modal', values: ['false', 'true'] }],
      description: '배경과 계속 상호작용할 수 있는지에 따라 포커스 동작을 선택합니다.',
      id: 'popover-modal',
      filename: 'modal.tsx',
      source: modalSource,
      title: '모달 동작',
    },
  ],
  optionAxes: [
    { name: 'mode', values: ['controlled', 'uncontrolled'] },
    { name: 'open', values: ['closed', 'open'] },
    { name: 'side', values: ['top', 'right', 'bottom', 'left'] },
    { name: 'align', defaultValue: 'center', values: ['start', 'center', 'end'] },
    { name: 'modal', defaultValue: 'false', values: ['false', 'true'] },
  ],
} satisfies ComponentPageData;
