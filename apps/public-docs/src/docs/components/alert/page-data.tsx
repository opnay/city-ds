import iconsSource from './examples/icons.tsx?raw';
import AlertIconsExample from './examples/icons';
import presentationSource from './examples/presentation.tsx?raw';
import AlertPresentationExample from './examples/presentation';
import variantsSource from './examples/variants.tsx?raw';
import AlertVariantsExample from './examples/variants';
import { AlertPreview } from '../../preview-playgrounds/content';
import { createPlaygroundSource } from '../../preview-playgrounds/source';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'alert-playground',
  widePreviewIds: ['alert-presentation', 'alert-variants'],
  api: [
    {
      name: 'tone',
      type: "'neutral' | 'info' | 'success' | 'warning' | 'destructive'",
      defaultValue: "'info'",
      description: '메시지의 의미와 기본 역할을 정합니다.',
    },
    {
      name: 'appearance',
      type: "'subtle' | 'outline'",
      defaultValue: "'subtle'",
      description: '배경 또는 윤곽 표현을 정합니다.',
    },
    {
      name: 'showIcon',
      type: 'boolean',
      defaultValue: 'true',
      description: '의미 아이콘을 표시합니다.',
    },
    {
      name: 'variant',
      type: "'info' | 'success' | 'warning' | 'error'",
      description: '이전 표현과 호환되는 tone 별칭입니다.',
    },
  ],
  examples: [
    {
      Component: AlertPreview,
      configurable: true,
      coverage: [{ axis: 'preview', values: ['configurable'] }],
      description: '사이드바에서 의미, 표면과 아이콘을 조절합니다.',
      id: 'alert-playground',
      filename: 'playground.tsx',
      source: createPlaygroundSource('@opnay/city-ds-react/alert', 'Alert'),
      title: 'Preview',
    },
    {
      Component: AlertPresentationExample,
      coverage: [
        {
          axis: 'tone',
          values: ['neutral', 'info', 'success', 'warning', 'destructive'],
          combinations: [
            'tone=neutral|appearance=subtle',
            'tone=neutral|appearance=outline',
            'tone=info|appearance=subtle',
            'tone=info|appearance=outline',
            'tone=success|appearance=subtle',
            'tone=success|appearance=outline',
            'tone=warning|appearance=subtle',
            'tone=warning|appearance=outline',
            'tone=destructive|appearance=subtle',
            'tone=destructive|appearance=outline',
          ],
        },
        {
          axis: 'appearance',
          values: ['subtle', 'outline'],
          combinations: [
            'tone=neutral|appearance=subtle',
            'tone=neutral|appearance=outline',
            'tone=info|appearance=subtle',
            'tone=info|appearance=outline',
            'tone=success|appearance=subtle',
            'tone=success|appearance=outline',
            'tone=warning|appearance=subtle',
            'tone=warning|appearance=outline',
            'tone=destructive|appearance=subtle',
            'tone=destructive|appearance=outline',
          ],
        },
      ],
      description: '모든 의미와 표현 조합을 비교합니다.',
      id: 'alert-presentation',
      filename: 'presentation.tsx',
      source: presentationSource,
      title: 'tone × appearance',
    },
    {
      Component: AlertIconsExample,
      coverage: [{ axis: 'showIcon', values: ['true', 'false'] }],
      description: '의미 아이콘이 필요한 문맥과 텍스트만 필요한 문맥을 비교합니다.',
      id: 'alert-icons',
      filename: 'icons.tsx',
      source: iconsSource,
      title: '아이콘',
    },
    {
      Component: AlertVariantsExample,
      coverage: [{ axis: 'variant', values: ['info', 'success', 'warning', 'error'] }],
      description: '기존 variant API를 사용하는 호환 표현입니다.',
      id: 'alert-variants',
      filename: 'variants.tsx',
      source: variantsSource,
      title: '호환 variant',
    },
  ],
  optionAxes: [
    {
      name: 'tone',
      defaultValue: 'info',
      values: ['neutral', 'info', 'success', 'warning', 'destructive'],
    },
    { name: 'appearance', defaultValue: 'subtle', values: ['subtle', 'outline'] },
    { name: 'showIcon', defaultValue: 'true', values: ['true', 'false'] },
    { name: 'variant', values: ['info', 'success', 'warning', 'error'] },
  ],
} satisfies ComponentPageData;
