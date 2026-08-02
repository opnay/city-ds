import compositionSource from './examples/composition.tsx?raw';
import ButtonCompositionExample from './examples/composition';
import sizesSource from './examples/sizes.tsx?raw';
import ButtonSizesExample from './examples/sizes';
import variantsSource from './examples/variants.tsx?raw';
import ButtonVariantsExample from './examples/variants';
import type { ComponentPageData } from '../../types';

export const pageData = {
  api: [
    {
      defaultValue: "'primary'",
      description: '액션의 역할과 우선순위를 나타냅니다.',
      name: 'variant',
      type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'",
    },
    {
      defaultValue: "'md'",
      description: '같은 액션 그룹에서는 동일한 제어 높이를 사용합니다.',
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
    },
    {
      defaultValue: 'false',
      description: '아이콘만 표시할 때 정사각형 제어 크기를 적용합니다.',
      name: 'iconOnly',
      type: 'boolean',
    },
    {
      defaultValue: 'true',
      description: '링크로 합성할 때 false로 지정해 네이티브 button 동작을 제거합니다.',
      name: 'nativeButton',
      type: 'boolean',
    },
    {
      description: 'Base UI 합성 계약으로 실제 링크나 사용자 컴포넌트를 렌더링합니다.',
      name: 'render',
      type: 'ReactElement | render function',
    },
    {
      defaultValue: 'false',
      description: '실행할 수 없는 상태를 표시합니다. 가능한 경우 이유를 연결하십시오.',
      name: 'disabled',
      type: 'boolean',
    },
  ],
  examples: [
    {
      Component: ButtonVariantsExample,
      coverage: [
        {
          axis: 'variant',
          values: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
        },
      ],
      description: '한 액션 그룹에는 primary를 하나만 두고 나머지는 역할에 맞게 낮춥니다.',
      id: 'button-variants',
      source: variantsSource,
      title: '액션 위계',
    },
    {
      Component: ButtonSizesExample,
      coverage: [
        { axis: 'size', values: ['sm', 'md', 'lg'] },
        { axis: 'iconOnly', values: ['false', 'true'] },
      ],
      description: '텍스트 버튼과 접근 가능한 이름이 있는 아이콘 버튼을 크기별로 비교합니다.',
      id: 'button-sizes',
      source: sizesSource,
      title: '크기와 아이콘 전용 모드',
    },
    {
      Component: ButtonCompositionExample,
      coverage: [
        { axis: 'disabled', values: ['true'] },
        { axis: 'render', values: ['TanStack Link'] },
      ],
      description: '비활성 명령과 실제 링크 탐색의 의미를 구분합니다.',
      id: 'button-composition',
      source: compositionSource,
      title: '상태와 링크 합성',
    },
  ],
  optionAxes: [
    {
      defaultValue: 'primary',
      name: 'variant',
      values: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
    },
    { defaultValue: 'md', name: 'size', values: ['sm', 'md', 'lg'] },
    { defaultValue: 'false', name: 'iconOnly', values: ['false', 'true'] },
    { defaultValue: 'false', name: 'disabled', values: ['false', 'true'] },
  ],
} satisfies ComponentPageData;
