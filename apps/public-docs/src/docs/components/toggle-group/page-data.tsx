import orientationSource from './examples/orientation.tsx?raw';
import ToggleGroupOrientationExample from './examples/orientation';
import selectionSource from './examples/selection.tsx?raw';
import ToggleGroupSelectionExample from './examples/selection';
import sizesSource from './examples/sizes.tsx?raw';
import ToggleGroupSizesExample from './examples/sizes';
import variantsSource from './examples/variants.tsx?raw';
import ToggleGroupVariantsExample from './examples/variants';
import type { ComponentPageData } from '../../types';

export const pageData = {
  api: [
    {
      name: 'variant',
      type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'",
      defaultValue: "'ghost'",
      description: '그룹 항목 표면입니다.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      description: '그룹의 모든 항목 크기를 맞춥니다.',
    },
    {
      name: 'multiple',
      type: 'boolean',
      defaultValue: 'false',
      description: '여러 항목을 선택합니다.',
    },
    {
      name: 'value / onValueChange',
      type: 'Value[] / callback',
      description: '선택 값을 제어합니다.',
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      defaultValue: "'horizontal'",
      description: '배치 방향입니다.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      description: '그룹 또는 개별 Item의 선택을 막습니다.',
    },
  ],
  examples: [
    {
      Component: ToggleGroupVariantsExample,
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
      description: '각 표면에서 선택된 항목과 선택되지 않은 항목을 비교합니다.',
      id: 'toggle-group-variants',
      filename: 'variants.tsx',
      source: variantsSource,
      title: '항목 표면',
    },
    {
      Component: ToggleGroupSizesExample,
      coverage: [{ axis: 'size', values: ['sm', 'md', 'lg'] }],
      description: '그룹 안의 모든 항목에 동일한 제어 높이를 적용합니다.',
      id: 'toggle-group-sizes',
      filename: 'sizes.tsx',
      source: sizesSource,
      title: '크기',
    },
    {
      Component: ToggleGroupOrientationExample,
      coverage: [{ axis: 'orientation', values: ['horizontal', 'vertical'] }],
      description: '도구 배치 방향과 키보드 탐색 방향을 함께 맞춥니다.',
      id: 'toggle-group-orientation',
      filename: 'orientation.tsx',
      source: orientationSource,
      title: '방향',
    },
    {
      Component: ToggleGroupSelectionExample,
      coverage: [
        { axis: 'multiple', values: ['false', 'true'] },
        { axis: 'mode', values: ['uncontrolled', 'controlled'] },
        { axis: 'disabled', values: ['true'] },
      ],
      description: '단일·복수 선택과 외부 상태 제어, 비활성 항목을 구분합니다.',
      id: 'toggle-group-selection',
      filename: 'selection.tsx',
      source: selectionSource,
      title: '선택 방식',
    },
  ],
  optionAxes: [
    {
      name: 'variant',
      defaultValue: 'ghost',
      values: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
    },
    { name: 'pressed', values: ['false', 'true'] },
    { name: 'multiple', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'orientation', defaultValue: 'horizontal', values: ['horizontal', 'vertical'] },
    { name: 'size', defaultValue: 'md', values: ['sm', 'md', 'lg'] },
    { name: 'mode', defaultValue: 'uncontrolled', values: ['uncontrolled', 'controlled'] },
    { name: 'disabled', defaultValue: 'false', values: ['false', 'true'] },
  ],
} satisfies ComponentPageData;
