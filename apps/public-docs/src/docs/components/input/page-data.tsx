import controlsSource from './examples/controls.tsx?raw';
import InputControlsExample from './examples/controls';
import type { ComponentPageData } from '../../types';

export const pageData = {
  api: [
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      description: '입력과 그룹의 제어 높이입니다.',
    },
    {
      name: 'Field.Root invalid',
      type: 'boolean',
      description: 'Field.Control로 합성한 Input에 오류 문맥을 전달합니다.',
    },
    { name: 'disabled', type: 'boolean', description: '값 편집을 막습니다.' },
    {
      name: 'render',
      type: 'ReactElement | render function',
      description: '입력 요소를 합성합니다.',
    },
    {
      name: 'InputGroup.Addon position',
      type: "'leading' | 'trailing'",
      defaultValue: "'leading'",
      description: '입력 앞뒤에 접두어·접미어를 배치합니다.',
    },
  ],
  examples: [
    {
      Component: InputControlsExample,
      coverage: [
        { axis: 'size', values: ['sm', 'md', 'lg'] },
        { axis: 'invalid', values: ['true'] },
        { axis: 'disabled', values: ['true'] },
        { axis: 'Textarea', values: ['true'] },
        { axis: 'addonPosition', values: ['leading', 'trailing'] },
      ],
      description: '단일 입력, 오류, 접두어 그룹, 여러 줄 입력을 보여줍니다.',
      id: 'input-controls',
      filename: 'controls.tsx',
      source: controlsSource,
      title: '입력과 그룹',
    },
  ],
  optionAxes: [
    { name: 'size', defaultValue: 'md', values: ['sm', 'md', 'lg'] },
    { name: 'invalid', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'disabled', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'addonPosition', defaultValue: 'leading', values: ['leading', 'trailing'] },
  ],
} satisfies ComponentPageData;
