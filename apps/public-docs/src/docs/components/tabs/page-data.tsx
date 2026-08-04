import tabsSource from './examples/tabs.tsx?raw';
import TabsExample from './examples/tabs';
import type { ComponentPageData } from '../../types';
export const pageData = {
  api: [
    {
      name: 'value / onValueChange',
      type: 'string / callback',
      description: '활성 탭을 제어합니다.',
    },
    { name: 'defaultValue', type: 'string', description: '비제어 초기 탭입니다.' },
    {
      name: 'density',
      type: "'comfortable' | 'compact'",
      defaultValue: "'comfortable'",
      description: '탭 여백입니다.',
    },
    { name: 'disabled', type: 'boolean', description: '열 수 없는 탭입니다.' },
  ],
  examples: [
    {
      Component: TabsExample,
      coverage: [
        { axis: 'density', values: ['comfortable', 'compact'] },
        { axis: 'mode', values: ['controlled', 'uncontrolled'] },
        { axis: 'disabled', values: ['true'] },
      ],
      description: '제어·비제어 탭, 두 밀도와 비활성 탭을 보여줍니다.',
      id: 'tabs-basic',
      filename: 'tabs.tsx',
      source: tabsSource,
      title: '탭과 패널',
    },
  ],
  optionAxes: [
    { name: 'density', defaultValue: 'comfortable', values: ['comfortable', 'compact'] },
    { name: 'mode', values: ['controlled', 'uncontrolled'] },
    { name: 'disabled', defaultValue: 'false', values: ['false', 'true'] },
  ],
} satisfies ComponentPageData;
