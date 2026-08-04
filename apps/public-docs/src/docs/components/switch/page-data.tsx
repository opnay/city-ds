import statesSource from './examples/states.tsx?raw';
import SwitchStatesExample from './examples/states';
import type { ComponentPageData } from '../../types';
export const pageData = {
  api: [
    {
      name: 'checked / onCheckedChange',
      type: 'boolean / callback',
      description: '켜짐 상태를 제어합니다.',
    },
    { name: 'defaultChecked', type: 'boolean', description: '비제어 초기 상태입니다.' },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      description: '스위치 크기입니다.',
    },
    { name: 'disabled', type: 'boolean', description: '변경을 막습니다.' },
  ],
  examples: [
    {
      Component: SwitchStatesExample,
      coverage: [
        { axis: 'size', values: ['sm', 'md', 'lg'] },
        { axis: 'checked', values: ['false', 'true'] },
        { axis: 'disabled', values: ['true'] },
      ],
      description: '비제어·제어·비활성 상태와 모든 크기입니다.',
      id: 'switch-states',
      filename: 'states.tsx',
      source: statesSource,
      title: '켜짐 상태',
    },
  ],
  optionAxes: [
    { name: 'size', defaultValue: 'md', values: ['sm', 'md', 'lg'] },
    { name: 'checked', values: ['false', 'true'] },
    { name: 'disabled', defaultValue: 'false', values: ['false', 'true'] },
  ],
} satisfies ComponentPageData;
