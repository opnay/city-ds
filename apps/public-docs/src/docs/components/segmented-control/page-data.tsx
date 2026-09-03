import selectionSource from './examples/selection.tsx?raw';
import SegmentedControlSelectionExample from './examples/selection';
import sizesSource from './examples/sizes.tsx?raw';
import SegmentedControlSizesExample from './examples/sizes';
import { SegmentedControlPreview } from '../../preview-playgrounds/forms';
import { createPlaygroundSource } from '../../preview-playgrounds/source';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'segmented-control-playground',
  api: [
    {
      name: 'value / onValueChange',
      type: 'Value / callback',
      description: '항상 하나인 선택 값을 제어합니다.',
    },
    {
      name: 'defaultValue',
      type: 'Value',
      description: '비제어 초기 선택이며 반드시 제공해야 합니다.',
    },
    {
      name: 'size',
      type: "'xsm' | 'sm' | 'md' | 'lg' | 'xlg'",
      defaultValue: "'md'",
      description: '모든 Item의 제어 높이를 맞춥니다.',
    },
    {
      name: 'disabled / readOnly',
      type: 'boolean',
      defaultValue: 'false',
      description: '그룹 또는 Item의 선택 변경을 막습니다.',
    },
  ],
  examples: [
    {
      Component: SegmentedControlPreview,
      configurable: true,
      coverage: [{ axis: 'preview', values: ['configurable'] }],
      description: '사이드바에서 크기, 값 소유 방식과 비활성 상태를 조절합니다.',
      id: 'segmented-control-playground',
      filename: 'playground.tsx',
      source: createPlaygroundSource('@opnay/city-ds-react/segmented-control', 'SegmentedControl'),
      title: 'Preview',
    },
    {
      Component: SegmentedControlSelectionExample,
      coverage: [
        { axis: 'mode', values: ['controlled', 'uncontrolled'] },
        { axis: 'disabled', values: ['true'] },
      ],
      description: '제어·비제어 상태에서 하나의 보기나 기간을 항상 유지합니다.',
      id: 'segmented-control-selection',
      filename: 'selection.tsx',
      source: selectionSource,
      title: '필수 단일 선택',
    },
    {
      Component: SegmentedControlSizesExample,
      coverage: [{ axis: 'size', values: ['xsm', 'sm', 'md', 'lg', 'xlg'] }],
      description: '한 그룹 안의 Item은 동일한 제어 높이를 사용합니다.',
      id: 'segmented-control-sizes',
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
      values: ['xsm', 'sm', 'md', 'lg', 'xlg'],
    },
    { name: 'mode', values: ['controlled', 'uncontrolled'] },
    { name: 'disabled', defaultValue: 'false', values: ['false', 'true'] },
  ],
} satisfies ComponentPageData;
