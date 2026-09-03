import sizesSource from './examples/sizes.tsx?raw';
import SwitchSizesExample from './examples/sizes';
import statesSource from './examples/states.tsx?raw';
import SwitchStatesExample from './examples/states';
import { SwitchPreview } from '../../preview-playgrounds/forms';
import { createPlaygroundSource } from '../../preview-playgrounds/source';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'switch-playground',
  api: [
    {
      name: 'checked / onCheckedChange',
      type: 'boolean / callback',
      description: '켜짐 상태를 제어합니다.',
    },
    { name: 'defaultChecked', type: 'boolean', description: '비제어 초기 상태입니다.' },
    {
      name: 'size',
      type: "'xsm' | 'sm' | 'md' | 'lg' | 'xlg'",
      defaultValue: "'md'",
      description: '스위치 크기입니다.',
    },
    { name: 'disabled', type: 'boolean', description: '변경을 막습니다.' },
  ],
  examples: [
    {
      Component: SwitchPreview,
      configurable: true,
      coverage: [{ axis: 'preview', values: ['configurable'] }],
      description: '사이드바에서 켜짐, 비활성 상태와 크기를 조절합니다.',
      id: 'switch-playground',
      filename: 'playground.tsx',
      source: createPlaygroundSource('@opnay/city-ds-react/switch', 'Switch'),
      title: 'Preview',
    },
    {
      Component: SwitchStatesExample,
      coverage: [
        { axis: 'checked', values: ['false', 'true'] },
        { axis: 'disabled', values: ['true'] },
      ],
      description: '비제어·제어·비활성 상태와 모든 크기입니다.',
      id: 'switch-states',
      filename: 'states.tsx',
      source: statesSource,
      title: '켜짐 상태',
    },
    {
      Component: SwitchSizesExample,
      coverage: [{ axis: 'size', values: ['xsm', 'sm', 'md', 'lg', 'xlg'] }],
      description: '주변 설정 제어와 스위치 크기를 맞춥니다.',
      id: 'switch-sizes',
      filename: 'sizes.tsx',
      source: sizesSource,
      title: '크기',
    },
  ],
  optionAxes: [
    { name: 'size', defaultValue: 'md', values: ['xsm', 'sm', 'md', 'lg', 'xlg'] },
    { name: 'checked', values: ['false', 'true'] },
    { name: 'disabled', defaultValue: 'false', values: ['false', 'true'] },
  ],
} satisfies ComponentPageData;
