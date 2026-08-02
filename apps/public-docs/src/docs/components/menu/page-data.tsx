import menuSource from './examples/menu.tsx?raw';
import MenuExample from './examples/menu';
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
      Component: MenuExample,
      coverage: [
        { axis: 'density', values: ['comfortable', 'compact'] },
        { axis: 'variant', values: ['default', 'destructive'] },
        { axis: 'mode', values: ['uncontrolled', 'controlled'] },
      ],
      description: '편안한·압축 밀도의 명령, 체크 항목, 파괴적 명령을 구성합니다.',
      id: 'menu-basic',
      source: menuSource,
      title: '컨텍스트 명령',
    },
  ],
  optionAxes: [
    { name: 'density', defaultValue: 'comfortable', values: ['comfortable', 'compact'] },
    { name: 'variant', defaultValue: 'default', values: ['default', 'destructive'] },
    { name: 'mode', defaultValue: 'uncontrolled', values: ['uncontrolled', 'controlled'] },
  ],
} satisfies ComponentPageData;
