import matrixSource from './examples/matrix.tsx?raw';
import SkeletonMatrixExample from './examples/matrix';
import { SkeletonPreview } from '../../preview-playgrounds/content';
import { createPlaygroundSource } from '../../preview-playgrounds/source';
import type { ComponentPageData } from '../../types';
export const pageData = {
  featuredExampleId: 'skeleton-playground',
  widePreviewIds: ['skeleton-matrix'],
  api: [
    {
      name: 'variant',
      type: "'text' | 'circular' | 'rectangular'",
      defaultValue: "'text'",
      description: '콘텐츠 형태에 맞춘 골격입니다.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      description: '골격의 크기입니다.',
    },
  ],
  examples: [
    {
      Component: SkeletonPreview,
      configurable: true,
      coverage: [{ axis: 'preview', values: ['configurable'] }],
      description: '사이드바에서 골격의 형태와 크기를 조절합니다.',
      id: 'skeleton-playground',
      filename: 'playground.tsx',
      source: createPlaygroundSource('@opnay/city-ds-react/skeleton', 'Skeleton'),
      title: 'Preview',
    },
    {
      Component: SkeletonMatrixExample,
      coverage: [
        {
          axis: 'variant',
          values: ['text', 'circular', 'rectangular'],
          combinations: [
            'variant=text|size=sm',
            'variant=text|size=md',
            'variant=text|size=lg',
            'variant=circular|size=sm',
            'variant=circular|size=md',
            'variant=circular|size=lg',
            'variant=rectangular|size=sm',
            'variant=rectangular|size=md',
            'variant=rectangular|size=lg',
          ],
        },
        { axis: 'size', values: ['sm', 'md', 'lg'] },
      ],
      description: '모든 형태와 크기를 함께 비교합니다.',
      id: 'skeleton-matrix',
      filename: 'matrix.tsx',
      source: matrixSource,
      title: '골격 조합',
    },
  ],
  optionAxes: [
    { name: 'variant', defaultValue: 'text', values: ['text', 'circular', 'rectangular'] },
    { name: 'size', defaultValue: 'md', values: ['sm', 'md', 'lg'] },
  ],
} satisfies ComponentPageData;
