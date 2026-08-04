import popoverSource from './examples/popover.tsx?raw';
import PopoverExample from './examples/popover';
import type { ComponentPageData } from '../../types';
export const pageData = {
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
      Component: PopoverExample,
      coverage: [
        { axis: 'mode', values: ['controlled', 'uncontrolled'] },
        { axis: 'open', values: ['closed', 'open'] },
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
        { axis: 'modal', values: ['false', 'true'] },
      ],
      description: '트리거 가까이의 비제어·제어 상호작용 패널입니다.',
      id: 'popover-basic',
      filename: 'popover.tsx',
      source: popoverSource,
      title: '상호작용 패널',
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
