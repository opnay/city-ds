import densitySource from './examples/density.tsx?raw';
import DensityExample from './examples/density';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'density-provider',
  api: [
    {
      name: 'density',
      type: "'comfortable' | 'compact'",
      defaultValue: "'comfortable'",
      description: '하위 복합 컴포넌트의 기본 밀도를 설정합니다.',
    },
    {
      name: 'render',
      type: 'ReactElement | render function',
      description: '밀도 범위의 실제 컨테이너를 합성합니다.',
    },
    {
      name: 'useDensity',
      type: '(density?) => Density',
      description: '하위 컴포넌트에서 상속 밀도를 읽습니다.',
    },
  ],
  examples: [
    {
      Component: DensityExample,
      coverage: [{ axis: 'density', values: ['comfortable', 'compact'] }],
      description: '한 영역 안의 제어가 같은 밀도를 상속합니다.',
      id: 'density-provider',
      filename: 'density.tsx',
      source: densitySource,
      title: '영역 밀도',
    },
  ],
  optionAxes: [
    { name: 'density', defaultValue: 'comfortable', values: ['comfortable', 'compact'] },
  ],
} satisfies ComponentPageData;
