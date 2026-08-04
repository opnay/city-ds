import usageSource from './examples/usage.tsx?raw';
import UsageExample from './examples/usage';
import type { ComponentPageData } from '../../types';

export const pageData = {
  api: [
    {
      name: 'Breadcrumbs.Root',
      type: 'nav props',
      description: 'nav landmark와 기본 접근성 이름을 제공합니다.',
    },
    {
      name: 'Breadcrumbs.Page',
      type: 'span props',
      description: '현재 항목에 aria-current="page"를 설정합니다.',
    },
    {
      name: 'Breadcrumbs.Ellipsis',
      type: 'span props',
      description: '생략된 경로를 명시적으로 표현합니다.',
    },
    {
      name: 'render',
      type: 'ReactElement | render function',
      description: 'Link 등 실제 탐색 요소를 합성합니다.',
    },
  ],
  examples: [
    {
      Component: UsageExample,
      coverage: [
        { axis: 'current', values: ['page'] },
        { axis: 'overflow', values: ['ellipsis'] },
      ],
      description: '현재 항목과 긴 경로의 생략을 직접 구성합니다.',
      id: 'breadcrumbs-usage',
      filename: 'usage.tsx',
      source: usageSource,
      title: '계층 경로',
    },
  ],
  optionAxes: [
    { name: 'current', values: ['page'] },
    { name: 'overflow', values: ['ellipsis'] },
  ],
} satisfies ComponentPageData;
