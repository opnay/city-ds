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
      name: 'Toaster',
      type: 'component',
      description: '토스트의 위치, 수명, 표시 개수와 공통 스타일을 관리합니다.',
    },
    {
      name: 'toast',
      type: 'function',
      description: 'neutral 토스트를 표시합니다. 앱 어디서든 호출할 수 있습니다.',
    },
    {
      name: 'toast.{info|success|warning|error}',
      type: 'function',
      description: '의미에 맞는 tone과 기본 아이콘을 적용해 토스트를 표시합니다.',
    },
    {
      name: 'toast.promise',
      type: 'function',
      description: '비동기 작업의 loading·success·error 상태를 같은 토스트에서 갱신합니다.',
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
      description: '버튼을 눌러 background 92%·tone 8% 배경과 원색 border·텍스트를 비교합니다.',
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
