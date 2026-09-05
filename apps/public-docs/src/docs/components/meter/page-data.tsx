import playgroundSource from './examples/playground.tsx?raw';
import MeterPlayground from './examples/playground';
import sizesSource from './examples/sizes.tsx?raw';
import MeterSizesExample from './examples/sizes';
import usageSource from './examples/usage.tsx?raw';
import MeterUsageExample from './examples/usage';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'meter-playground',
  api: [
    {
      name: 'Root / Label / Value / Track / Indicator',
      type: 'compound parts',
      description: '측정값의 이름, 표시값, 전체 범위와 채워진 구간을 조합합니다.',
    },
    {
      name: 'value',
      type: 'number',
      description: '표시할 현재 측정값입니다. Meter는 항상 결정된 숫자 값을 받습니다.',
    },
    {
      name: 'min / max',
      type: 'number',
      defaultValue: '0 / 100',
      description: '측정 범위의 최솟값과 최댓값입니다.',
    },
    {
      name: 'format / locale',
      type: 'Intl.NumberFormatOptions / Intl.LocalesArgument',
      description: 'Value와 스크린 리더가 읽는 값을 지역화하여 표시합니다.',
    },
    {
      name: 'getAriaValueText',
      type: '(formattedValue: string, value: number) => string',
      description: '스크린 리더에 더 구체적인 현재 값 설명을 제공합니다.',
    },
    {
      name: 'size',
      type: "'xsm' | 'sm' | 'md' | 'lg' | 'xlg'",
      defaultValue: "'md'",
      description: '트랙의 시각적 두께를 정합니다.',
    },
    {
      name: 'render',
      type: 'ReactElement | render function',
      description: '각 합성 요소의 기본 태그를 다른 요소와 합성합니다.',
    },
  ],
  examples: [
    {
      Component: MeterPlayground,
      configurable: true,
      coverage: [{ axis: 'preview', values: ['configurable'] }],
      description: '사이드바에서 트랙 크기를 조절합니다.',
      id: 'meter-playground',
      filename: 'playground.tsx',
      source: playgroundSource,
      title: 'Preview',
    },
    {
      Component: MeterUsageExample,
      coverage: [
        { axis: 'format', values: ['unit'] },
        { axis: 'locale', values: ['en-US'] },
        { axis: 'label', values: ['visible'] },
      ],
      description: '현재 저장 용량을 단위 형식으로 표시하고 Label로 이름을 연결합니다.',
      id: 'meter-usage',
      filename: 'usage.tsx',
      source: usageSource,
      title: '용량 표시',
    },
    {
      Component: MeterSizesExample,
      coverage: [{ axis: 'size', values: ['xsm', 'sm', 'md', 'lg', 'xlg'] }],
      description: '주변 콘텐츠 밀도에 맞춰 트랙 두께를 선택합니다.',
      id: 'meter-sizes',
      filename: 'sizes.tsx',
      source: sizesSource,
      title: '크기',
    },
  ],
  optionAxes: [
    {
      control: 'segmented',
      name: 'size',
      defaultValue: 'md',
      values: ['xsm', 'sm', 'md', 'lg', 'xlg'],
    },
  ],
} satisfies ComponentPageData;
