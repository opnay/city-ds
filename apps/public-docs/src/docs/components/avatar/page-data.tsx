import fallbackSource from './examples/fallback.tsx?raw';
import AvatarFallbackExample from './examples/fallback';
import sizesSource from './examples/sizes.tsx?raw';
import AvatarSizesExample from './examples/sizes';
import usageSource from './examples/usage.tsx?raw';
import AvatarUsageExample from './examples/usage';
import { AvatarPreview } from '../../preview-playgrounds/content';
import { createPlaygroundSource } from '../../preview-playgrounds/source';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'avatar-playground',
  api: [
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      description: 'Avatar.Root의 가로·세로 크기를 함께 정합니다.',
    },
    {
      name: 'shape',
      type: "'circle' | 'square'",
      defaultValue: "'circle'",
      description: '원형 또는 모서리가 작은 사각형으로 표시합니다.',
    },
    {
      name: 'Avatar.Image',
      type: 'src, alt, onLoadingStatusChange',
      description: '이미지와 대체 텍스트를 제공하며 Base UI의 로딩 상태를 알립니다.',
    },
    {
      name: 'Avatar.Fallback',
      type: 'children, delay',
      description: '이미지가 없거나 로드에 실패했을 때 이니셜 또는 대체 콘텐츠를 표시합니다.',
    },
    {
      name: 'render',
      type: 'ReactElement | render function',
      description: '각 합성 요소의 기본 태그를 다른 요소와 합성합니다.',
    },
  ],
  examples: [
    {
      Component: AvatarPreview,
      configurable: true,
      coverage: [{ axis: 'preview', values: ['configurable'] }],
      description: '사이드바에서 크기, 형태, 표시할 콘텐츠를 조절합니다.',
      id: 'avatar-playground',
      filename: 'playground.tsx',
      source: createPlaygroundSource('@opnay/city-ds-react/avatar', 'Avatar'),
      title: 'Preview',
    },
    {
      Component: AvatarUsageExample,
      coverage: [
        { axis: 'content', values: ['image'] },
        { axis: 'image', values: ['loaded'] },
        { axis: 'shape', values: ['circle'] },
      ],
      description: '로컬 data URI 이미지를 Avatar.Image에 전달하고 alt를 제공합니다.',
      id: 'avatar-usage',
      filename: 'usage.tsx',
      source: usageSource,
      title: '이미지',
    },
    {
      Component: AvatarFallbackExample,
      coverage: [
        { axis: 'content', values: ['fallback'] },
        { axis: 'fallback', values: ['error'] },
        { axis: 'shape', values: ['square'] },
      ],
      description: '이미지를 불러오지 못하면 사각형 Avatar.Fallback이 이니셜을 표시합니다.',
      id: 'avatar-fallback',
      filename: 'fallback.tsx',
      source: fallbackSource,
      title: '로딩 실패',
    },
    {
      Component: AvatarSizesExample,
      coverage: [{ axis: 'size', values: ['sm', 'md', 'lg'] }],
      description: '주변 콘텐츠의 밀도에 맞춰 Avatar.Root 크기를 선택합니다.',
      id: 'avatar-sizes',
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
      values: ['sm', 'md', 'lg'],
    },
    {
      control: 'segmented',
      name: 'shape',
      defaultValue: 'circle',
      values: ['circle', 'square'],
    },
    {
      control: 'segmented',
      name: 'content',
      defaultValue: 'image',
      values: ['image', 'fallback'],
    },
  ],
} satisfies ComponentPageData;
