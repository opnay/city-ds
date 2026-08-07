import sizesSource from './examples/sizes.tsx?raw';
import ToggleSizesExample from './examples/sizes';
import statesSource from './examples/states.tsx?raw';
import ToggleStatesExample from './examples/states';
import variantsSource from './examples/variants.tsx?raw';
import ToggleVariantsExample from './examples/variants';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'toggle-variants',
  api: [
    {
      name: 'variant',
      type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'",
      defaultValue: "'outline'",
      description: '토글 표면입니다.',
    },
    {
      name: 'pressed / onPressedChange',
      type: 'boolean / callback',
      description: '켜짐 상태를 제어합니다.',
    },
    { name: 'defaultPressed', type: 'boolean', description: '비제어 초기 상태입니다.' },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      description: '제어 높이입니다.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      description: '상태 변경을 막고 비활성 이유를 주변 문맥에서 설명합니다.',
    },
  ],
  examples: [
    {
      Component: ToggleVariantsExample,
      coverage: [
        {
          axis: 'variant',
          values: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
          combinations: [
            'variant=primary|pressed=true',
            'variant=primary|pressed=false',
            'variant=secondary|pressed=true',
            'variant=secondary|pressed=false',
            'variant=outline|pressed=true',
            'variant=outline|pressed=false',
            'variant=ghost|pressed=true',
            'variant=ghost|pressed=false',
            'variant=destructive|pressed=true',
            'variant=destructive|pressed=false',
          ],
        },
        { axis: 'pressed', values: ['false', 'true'] },
      ],
      description: '각 표면에서 선택·해제 상태를 나란히 비교합니다.',
      id: 'toggle-variants',
      filename: 'variants.tsx',
      source: variantsSource,
      title: '표면과 선택 상태',
    },
    {
      Component: ToggleSizesExample,
      coverage: [{ axis: 'size', values: ['sm', 'md', 'lg'] }],
      description: '같은 도구 모음에서는 토글 높이를 일관되게 맞춥니다.',
      id: 'toggle-sizes',
      filename: 'sizes.tsx',
      source: sizesSource,
      title: '크기',
    },
    {
      Component: ToggleStatesExample,
      coverage: [
        { axis: 'mode', values: ['uncontrolled', 'controlled'] },
        { axis: 'disabled', values: ['true'] },
      ],
      description: '비제어·제어 상태와 변경할 수 없는 상태를 구분합니다.',
      id: 'toggle-states',
      filename: 'states.tsx',
      source: statesSource,
      title: '상태 제어',
    },
  ],
  optionAxes: [
    {
      name: 'variant',
      defaultValue: 'outline',
      values: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
    },
    { name: 'pressed', values: ['false', 'true'] },
    { name: 'size', defaultValue: 'md', values: ['sm', 'md', 'lg'] },
    { name: 'mode', defaultValue: 'uncontrolled', values: ['uncontrolled', 'controlled'] },
    { name: 'disabled', defaultValue: 'false', values: ['false', 'true'] },
  ],
} satisfies ComponentPageData;
