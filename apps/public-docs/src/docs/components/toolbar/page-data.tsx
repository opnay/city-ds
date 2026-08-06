import appearancesSource from './examples/appearances.tsx?raw';
import ToolbarAppearancesExample from './examples/appearances';
import buttonVariantsSource from './examples/button-variants.tsx?raw';
import ToolbarButtonVariantsExample from './examples/button-variants';
import linkVariantsSource from './examples/link-variants.tsx?raw';
import ToolbarLinkVariantsExample from './examples/link-variants';
import orientationSource from './examples/orientation.tsx?raw';
import ToolbarOrientationExample from './examples/orientation';
import sizesSource from './examples/sizes.tsx?raw';
import ToolbarSizesExample from './examples/sizes';
import toggleVariantsSource from './examples/toggle-variants.tsx?raw';
import ToolbarToggleVariantsExample from './examples/toggle-variants';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'toolbar-appearances',
  api: [
    {
      name: 'appearance',
      type: "'plain' | 'band' | 'outline'",
      defaultValue: "'outline'",
      description: '도구 모음 표면입니다.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      description: '항목 크기입니다.',
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      defaultValue: "'horizontal'",
      description: '도구 모음 방향입니다.',
    },
    { name: 'Toolbar.Group', type: 'component', description: '관련 도구를 묶습니다.' },
    {
      name: 'Toolbar.Button / Toolbar.Toggle variant',
      type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'",
      description: '명령과 토글의 시각적 위계를 정합니다.',
    },
    {
      name: 'Toolbar.Link variant',
      type: "'secondary' | 'outline' | 'ghost'",
      description: 'render로 합성한 내부 링크의 표면을 정합니다.',
    },
  ],
  examples: [
    {
      Component: ToolbarAppearancesExample,
      coverage: [{ axis: 'appearance', values: ['plain', 'band', 'outline'] }],
      description: '주변 표면과 도구 모음의 경계 강도를 맞춥니다.',
      id: 'toolbar-appearances',
      filename: 'appearances.tsx',
      source: appearancesSource,
      title: '표면',
    },
    {
      Component: ToolbarSizesExample,
      coverage: [{ axis: 'size', values: ['sm', 'md', 'lg'] }],
      description: '도구 모음 안의 모든 항목에 동일한 크기를 적용합니다.',
      id: 'toolbar-sizes',
      filename: 'sizes.tsx',
      source: sizesSource,
      title: '크기',
    },
    {
      Component: ToolbarOrientationExample,
      coverage: [{ axis: 'orientation', values: ['horizontal', 'vertical'] }],
      description: '배치 방향과 키보드 탐색 방향을 함께 맞춥니다.',
      id: 'toolbar-orientation',
      filename: 'orientation.tsx',
      source: orientationSource,
      title: '방향',
    },
    {
      Component: ToolbarButtonVariantsExample,
      coverage: [
        {
          axis: 'buttonVariant',
          values: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
        },
      ],
      description: '명령의 우선순위와 위험도를 버튼 표면으로 구분합니다.',
      id: 'toolbar-button-variants',
      filename: 'button-variants.tsx',
      source: buttonVariantsSource,
      title: '버튼 표면',
    },
    {
      Component: ToolbarLinkVariantsExample,
      coverage: [{ axis: 'linkVariant', values: ['secondary', 'outline', 'ghost'] }],
      description: '실제 링크 의미를 유지하면서 도구 모음 표면에 맞춥니다.',
      id: 'toolbar-link-variants',
      filename: 'link-variants.tsx',
      source: linkVariantsSource,
      title: '링크 표면',
    },
    {
      Component: ToolbarToggleVariantsExample,
      coverage: [
        {
          axis: 'toggleVariant',
          values: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
        },
      ],
      description: '유지되는 선택 상태에 맞는 토글 표면을 비교합니다.',
      id: 'toolbar-toggle-variants',
      filename: 'toggle-variants.tsx',
      source: toggleVariantsSource,
      title: '토글 표면',
    },
  ],
  optionAxes: [
    { name: 'appearance', defaultValue: 'outline', values: ['plain', 'band', 'outline'] },
    { name: 'size', defaultValue: 'md', values: ['sm', 'md', 'lg'] },
    { name: 'orientation', defaultValue: 'horizontal', values: ['horizontal', 'vertical'] },
    {
      name: 'buttonVariant',
      defaultValue: 'ghost',
      values: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
    },
    {
      name: 'linkVariant',
      defaultValue: 'ghost',
      values: ['secondary', 'outline', 'ghost'],
    },
    {
      name: 'toggleVariant',
      defaultValue: 'ghost',
      values: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
    },
  ],
} satisfies ComponentPageData;
