import iconsSource from './examples/icons.tsx?raw';
import CalloutIconsExample from './examples/icons';
import presentationSource from './examples/presentation.tsx?raw';
import CalloutPresentationExample from './examples/presentation';
import variantsSource from './examples/variants.tsx?raw';
import CalloutVariantsExample from './examples/variants';
import type { ComponentPageData } from '../../types';

export const pageData = {
  api: [
    {
      name: 'tone',
      type: "'neutral' | 'info' | 'success' | 'warning' | 'destructive'",
      defaultValue: "'info'",
      description: '안내의 의미를 지정합니다.',
    },
    {
      name: 'appearance',
      type: "'subtle' | 'outline'",
      defaultValue: "'subtle'",
      description: '표현을 지정합니다.',
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
      description: 'Alert와 호환되는 tone 별칭입니다.',
    },
  ],
  examples: [
    {
      Component: CalloutPresentationExample,
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
      description: 'Alert와 같은 의미·표현 계약을 모든 조합으로 보여 줍니다.',
      id: 'callout-presentation',
      filename: 'presentation.tsx',
      source: presentationSource,
      title: 'tone × appearance',
    },
    {
      Component: CalloutIconsExample,
      coverage: [{ axis: 'showIcon', values: ['true', 'false'] }],
      description: '문서 문맥에 맞춰 의미 아이콘 표시 여부를 선택합니다.',
      id: 'callout-icons',
      filename: 'icons.tsx',
      source: iconsSource,
      title: '아이콘',
    },
    {
      Component: CalloutVariantsExample,
      coverage: [{ axis: 'variant', values: ['info', 'success', 'warning', 'error'] }],
      description: 'Alert와 공유하는 기존 variant API의 호환 표현입니다.',
      id: 'callout-variants',
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
