import presentationSource from './examples/presentation.tsx?raw';
import ToastPresentationExample from './examples/presentation';
import usageSource from './examples/usage.tsx?raw';
import ToastUsageExample from './examples/usage';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'toast-usage',
  widePreviewIds: ['toast-presentation'],
  api: [
    {
      name: 'tone',
      type: "'neutral' | 'info' | 'success' | 'warning' | 'destructive'",
      description: 'Root의 시각적·의미적 상태를 정합니다. 생략하면 toast.type에서 유도합니다.',
    },
    { name: 'Toast.Provider', type: 'component', description: '토스트 수명과 제한을 관리합니다.' },
    {
      name: 'Toast.useToastManager',
      type: 'hook',
      description: '토스트를 추가하고 목록을 읽습니다.',
    },
  ],
  examples: [
    {
      Component: ToastPresentationExample,
      coverage: [
        {
          axis: 'tone',
          values: ['neutral', 'info', 'success', 'warning', 'destructive'],
          combinations: [
            'tone=neutral',
            'tone=info',
            'tone=success',
            'tone=warning',
            'tone=destructive',
          ],
        },
      ],
      description: 'background 92%·tone 8% 배경과 원색 border·텍스트를 비교합니다.',
      id: 'toast-presentation',
      filename: 'presentation.tsx',
      source: presentationSource,
      title: '의미 색상',
    },
    {
      Component: ToastUsageExample,
      coverage: [{ axis: 'interaction', values: ['save', 'refresh', 'status-error'] }],
      description: '작업별 tone과 기본 아이콘, 액션이 있는 오류 토스트를 비교합니다.',
      id: 'toast-usage',
      filename: 'usage.tsx',
      source: usageSource,
      title: '토스트 표시',
    },
  ],
  optionAxes: [
    {
      name: 'tone',
      defaultValue: 'neutral',
      values: ['neutral', 'info', 'success', 'warning', 'destructive'],
    },
  ],
} satisfies ComponentPageData;
