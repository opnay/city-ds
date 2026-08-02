import toastSource from './examples/toast.tsx?raw';
import ToastExample from './examples/toast';
import type { ComponentPageData } from '../../types';
export const pageData = {
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
      Component: ToastExample,
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
      description: '모든 tone·appearance 조합과 저장 완료 토스트 상호작용을 확인합니다.',
      id: 'toast-basic',
      source: toastSource,
      title: '알림 표시',
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
