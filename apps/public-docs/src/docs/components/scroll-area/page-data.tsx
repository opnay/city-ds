import bothAxesSource from './examples/both-axes.tsx?raw';
import ScrollAreaBothAxesExample from './examples/both-axes';
import verticalSource from './examples/vertical.tsx?raw';
import ScrollAreaVerticalExample from './examples/vertical';
import { ScrollAreaPreview } from '../../preview-playgrounds/layout';
import { createPlaygroundSource } from '../../preview-playgrounds/source';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'scroll-area-playground',
  widePreviewIds: ['scroll-area-playground', 'scroll-area-vertical', 'scroll-area-both-axes'],
  api: [
    {
      name: 'ScrollArea.Root',
      type: 'overflowEdgeThreshold?: number | { xStart?: number; xEnd?: number; yStart?: number; yEnd?: number }',
      description: '스크롤 경계 상태를 적용하기 전의 축별 픽셀 임계값입니다.',
    },
    {
      name: 'ScrollArea.Viewport',
      type: 'div props',
      description:
        '실제로 스크롤되는 컨테이너입니다. 구분 가능한 영역에는 aria-label 또는 aria-labelledby를 전달하십시오.',
    },
    {
      defaultValue: "'vertical'",
      name: 'ScrollArea.Scrollbar',
      type: "orientation?: 'vertical' | 'horizontal'; keepMounted?: boolean",
      description: '축별 스크롤바입니다. keepMounted는 넘침이 없을 때도 트랙 요소를 유지합니다.',
    },
    {
      name: 'ScrollArea.Thumb / Corner',
      type: 'component',
      description: '현재 위치를 드래그하는 thumb와 두 축이 만나는 corner를 구성합니다.',
    },
    {
      name: 'render',
      type: 'ReactElement | render function',
      description: '각 Base UI 파트를 다른 요소와 합성합니다.',
    },
  ],
  examples: [
    {
      Component: ScrollAreaPreview,
      configurable: true,
      coverage: [{ axis: 'preview', values: ['configurable'] }],
      description: '옵션 사이드바에서 세로 스크롤과 두 축 스크롤을 전환합니다.',
      id: 'scroll-area-playground',
      filename: 'playground.tsx',
      source: createPlaygroundSource('@opnay/city-ds-react/scroll-area', 'ScrollArea'),
      title: 'Preview',
    },
    {
      Component: ScrollAreaVerticalExample,
      coverage: [{ axis: 'axes', values: ['vertical'] }],
      description: '높이가 제한된 이벤트 목록에서 세로 스크롤바와 thumb를 구성합니다.',
      id: 'scroll-area-vertical',
      filename: 'vertical.tsx',
      source: verticalSource,
      title: '세로 스크롤',
    },
    {
      Component: ScrollAreaBothAxesExample,
      coverage: [{ axis: 'axes', values: ['both'] }],
      description: '너비와 높이가 모두 넘치는 콘텐츠에 두 방향 스크롤바와 corner를 배치합니다.',
      id: 'scroll-area-both-axes',
      filename: 'both-axes.tsx',
      source: bothAxesSource,
      title: '두 축 스크롤',
    },
  ],
  optionAxes: [
    {
      control: 'segmented',
      defaultValue: 'vertical',
      name: 'axes',
      values: ['vertical', 'both'],
    },
  ],
  previewOptionAxes: [
    {
      control: 'segmented',
      defaultValue: 'vertical',
      name: 'axes',
      values: ['vertical', 'both'],
    },
  ],
} satisfies ComponentPageData;
