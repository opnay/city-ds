import controlledSource from './examples/controlled.tsx?raw';
import MenuControlledExample from './examples/controlled';
import densitySource from './examples/density.tsx?raw';
import MenuDensityExample from './examples/density';
import variantsSource from './examples/variants.tsx?raw';
import MenuVariantsExample from './examples/variants';
import type { ComponentPageData } from '../../types';

export const pageData = {
  api: [
    { name: 'density', type: "'comfortable' | 'compact'", description: '항목의 밀도입니다.' },
    {
      name: 'variant',
      type: "'default' | 'destructive'",
      defaultValue: "'default'",
      description: '파괴적 명령을 구분합니다.',
    },
    {
      name: 'open / onOpenChange',
      type: 'boolean / callback',
      description: '열림 상태를 제어합니다.',
    },
  ],
  examples: [
    {
      Component: MenuDensityExample,
      coverage: [{ axis: 'density', values: ['comfortable', 'compact'] }],
      description: '명령 수와 주변 제어 밀도에 맞춰 항목 간격을 선택합니다.',
      id: 'menu-density',
      filename: 'density.tsx',
      source: densitySource,
      title: '밀도',
    },
    {
      Component: MenuVariantsExample,
      coverage: [{ axis: 'variant', values: ['default', 'destructive'] }],
      description: '되돌리기 어려운 명령을 파괴적 항목으로 구분합니다.',
      id: 'menu-variants',
      filename: 'variants.tsx',
      source: variantsSource,
      title: '항목 역할',
    },
    {
      Component: MenuControlledExample,
      coverage: [{ axis: 'mode', values: ['uncontrolled', 'controlled'] }],
      description: '기본 열림 동작과 외부에서 제어하는 열림 상태를 비교합니다.',
      id: 'menu-controlled',
      filename: 'controlled.tsx',
      source: controlledSource,
      title: '상태 제어',
    },
  ],
  optionAxes: [
    { name: 'density', defaultValue: 'comfortable', values: ['comfortable', 'compact'] },
    { name: 'variant', defaultValue: 'default', values: ['default', 'destructive'] },
    { name: 'mode', defaultValue: 'uncontrolled', values: ['uncontrolled', 'controlled'] },
  ],
} satisfies ComponentPageData;
