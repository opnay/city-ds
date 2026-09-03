import controlledSource from './examples/controlled.tsx?raw';
import PopoverControlledExample from './examples/controlled';
import modalSource from './examples/modal.tsx?raw';
import PopoverModalExample from './examples/modal';
import placementsSource from './examples/placements.tsx?raw';
import PopoverPlacementsExample from './examples/placements';
import { PopoverPreview } from '../../preview-playgrounds/surfaces';
import { createPlaygroundSource } from '../../preview-playgrounds/source';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'popover-playground',
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
      Component: PopoverPreview,
      configurable: true,
      coverage: [{ axis: 'preview', values: ['configurable'] }],
      description: '사이드바에서 열림 상태 소유, 위치와 모달 동작을 조절합니다.',
      id: 'popover-playground',
      filename: 'playground.tsx',
      source: createPlaygroundSource('@opnay/city-ds-react/popover', 'Popover'),
      title: 'Preview',
    },
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
      description: '방향별 그룹 안에서 트리거 기준 정렬 조합을 비교합니다.',
      id: 'popover-placements',
      filename: 'placements.tsx',
      source: placementsSource,
      title: '방향과 정렬',
    },
    {
      Component: PopoverControlledExample,
      coverage: [
        { axis: 'mode', values: ['controlled', 'uncontrolled'] },
        { axis: 'open', values: ['closed', 'open'] },
      ],
      description: '컴포넌트와 외부 상태가 open 값을 소유하는 방식을 구분합니다.',
      id: 'popover-controlled',
      filename: 'controlled.tsx',
      source: controlledSource,
      title: '열림 상태 소유권',
    },
    {
      Component: PopoverModalExample,
      coverage: [{ axis: 'modal', values: ['false', 'true'] }],
      description: '배경 작업의 지속 여부에 따라 포커스와 상호작용 범위를 선택합니다.',
      id: 'popover-modal',
      filename: 'modal.tsx',
      source: modalSource,
      title: '상호작용 범위',
    },
  ],
  optionAxes: [
    { name: 'mode', values: ['controlled', 'uncontrolled'] },
    { name: 'open', values: ['closed', 'open'] },
    { name: 'side', values: ['top', 'right', 'bottom', 'left'] },
    { name: 'align', defaultValue: 'center', values: ['start', 'center', 'end'] },
    { name: 'modal', defaultValue: 'false', values: ['false', 'true'] },
  ],
  previewOptionAxes: [
    { name: 'mode', defaultValue: 'uncontrolled', values: ['uncontrolled', 'controlled'] },
    { name: 'side', defaultValue: 'bottom', values: ['top', 'right', 'bottom', 'left'] },
    { name: 'align', defaultValue: 'center', values: ['start', 'center', 'end'] },
    { control: 'switch', name: 'modal', defaultValue: 'false', values: ['false', 'true'] },
  ],
  widePreviewIds: ['popover-placements'],
} satisfies ComponentPageData;
