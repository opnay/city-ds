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
    {
      name: 'appearance',
      type: "'outline' | 'subtle'",
      defaultValue: "'outline'",
      description: '토스트 표면입니다.',
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
            'tone=neutral|appearance=outline',
            'tone=neutral|appearance=subtle',
            'tone=info|appearance=outline',
            'tone=info|appearance=subtle',
            'tone=success|appearance=outline',
            'tone=success|appearance=subtle',
            'tone=warning|appearance=outline',
            'tone=warning|appearance=subtle',
            'tone=destructive|appearance=outline',
            'tone=destructive|appearance=subtle',
          ],
        },
        { axis: 'appearance', values: ['outline', 'subtle'] },
      ],
      description: '각 의미와 표면 조합을 상호작용 없이 비교합니다.',
      id: 'toast-presentation',
      filename: 'presentation.tsx',
      source: presentationSource,
      title: '의미와 표면',
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
    { name: 'appearance', defaultValue: 'outline', values: ['outline', 'subtle'] },
  ],
} satisfies ComponentPageData;
