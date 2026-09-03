import densitySource from './examples/density.tsx?raw';
import TabsDensityExample from './examples/density';
import tabsSource from './examples/tabs.tsx?raw';
import TabsExample from './examples/tabs';
import { TabsPreview } from '../../preview-playgrounds/content';
import { createPlaygroundSource } from '../../preview-playgrounds/source';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'tabs-playground',
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
      Component: TabsPreview,
      configurable: true,
      coverage: [{ axis: 'preview', values: ['configurable'] }],
      description: '사이드바에서 밀도, 값 소유 방식과 비활성 탭을 조절합니다.',
      id: 'tabs-playground',
      filename: 'playground.tsx',
      source: createPlaygroundSource('@opnay/city-ds-react/tabs', 'Tabs'),
      title: 'Preview',
    },
    {
      Component: TabsDensityExample,
      coverage: [{ axis: 'density', values: ['comfortable', 'compact'] }],
      description: '콘텐츠 밀도에 맞춰 탭 목록의 여백을 조정합니다.',
      id: 'tabs-density',
      filename: 'density.tsx',
      source: densitySource,
      title: '밀도',
    },
    {
      Component: TabsExample,
      coverage: [
        { axis: 'mode', values: ['controlled', 'uncontrolled'] },
        { axis: 'disabled', values: ['true'] },
      ],
      description: '제어·비제어 활성 탭과 열 수 없는 탭을 구분합니다.',
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
