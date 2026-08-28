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
      description: '연한 배경과 원색 텍스트로 표현한 각 의미를 상호작용 없이 비교합니다.',
      id: 'toast-presentation',
      filename: 'presentation.tsx',
      source: presentationSource,
      title: '의미 색상',
    },
    {
      Component: ToastUsageExample,
      coverage: [{ axis: 'interaction', values: ['manager.add'] }],
      description: '로컬 작업 결과를 manager에 추가하고 사용자가 닫을 수 있게 합니다.',
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
