import addonsSource from './examples/addons.tsx?raw';
import InputAddonsExample from './examples/addons';
import sizesSource from './examples/sizes.tsx?raw';
import InputSizesExample from './examples/sizes';
import statesSource from './examples/states.tsx?raw';
import InputStatesExample from './examples/states';
import textareaSource from './examples/textarea.tsx?raw';
import InputTextareaExample from './examples/textarea';
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
      Component: InputSizesExample,
      coverage: [{ axis: 'size', values: ['sm', 'md', 'lg'] }],
      description: '주변 제어와 입력 높이를 맞춥니다.',
      id: 'input-sizes',
      filename: 'sizes.tsx',
      source: sizesSource,
      title: '크기',
    },
    {
      Component: InputStatesExample,
      coverage: [
        { axis: 'invalid', values: ['true'] },
        { axis: 'disabled', values: ['true'] },
      ],
      description: '오류 문맥과 편집할 수 없는 상태를 구분합니다.',
      id: 'input-states',
      filename: 'states.tsx',
      source: statesSource,
      title: '입력 상태',
    },
    {
      Component: InputAddonsExample,
      coverage: [{ axis: 'addonPosition', values: ['leading', 'trailing'] }],
      description: '접두어와 접미어를 하나의 입력 그룹 안에 배치합니다.',
      id: 'input-addons',
      filename: 'addons.tsx',
      source: addonsSource,
      title: '접두어와 접미어',
    },
    {
      Component: InputTextareaExample,
      coverage: [{ axis: 'Textarea', values: ['true'] }],
      description: '한 줄 값에는 Input, 여러 줄 값에는 Textarea를 사용합니다.',
      id: 'input-textarea',
      filename: 'textarea.tsx',
      source: textareaSource,
      title: '한 줄과 여러 줄',
    },
  ],
  optionAxes: [
    { name: 'size', defaultValue: 'md', values: ['sm', 'md', 'lg'] },
    { name: 'invalid', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'disabled', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'addonPosition', defaultValue: 'leading', values: ['leading', 'trailing'] },
  ],
} satisfies ComponentPageData;
