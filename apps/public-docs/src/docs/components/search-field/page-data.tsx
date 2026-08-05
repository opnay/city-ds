import clearSource from './examples/clear.tsx?raw';
import SearchFieldClearExample from './examples/clear';
import sizesSource from './examples/sizes.tsx?raw';
import SearchFieldSizesExample from './examples/sizes';
import statesSource from './examples/states.tsx?raw';
import SearchFieldStatesExample from './examples/states';
import usageSource from './examples/usage.tsx?raw';
import SearchFieldUsageExample from './examples/usage';
import type { ComponentPageData } from '../../types';

export const pageData = {
  api: [
    {
      name: 'value / onValueChange',
      type: 'string / callback',
      description: '검색어를 제어합니다.',
    },
    { name: 'onSubmit', type: '(value) => void', description: '폼 제출을 처리합니다.' },
    { name: 'loading', type: 'boolean', description: '로컬 검색 처리 중 상태입니다.' },
    { name: 'invalid / disabled', type: 'boolean', description: '오류와 비활성 상태입니다.' },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      description: '입력 높이입니다.',
    },
    {
      name: 'SearchField.Clear hideWhenEmpty',
      type: 'boolean',
      defaultValue: 'true',
      description: '빈 검색어에서도 지우기 버튼을 유지할지 정합니다.',
    },
  ],
  examples: [
    {
      Component: SearchFieldUsageExample,
      coverage: [{ axis: 'interaction', values: ['controlled', 'submit'] }],
      description: '검색어와 제출 결과를 소비자 상태에서 제어합니다.',
      id: 'search-field-usage',
      filename: 'usage.tsx',
      source: usageSource,
      title: '제어 검색',
    },
    {
      Component: SearchFieldSizesExample,
      coverage: [{ axis: 'size', values: ['sm', 'md', 'lg'] }],
      description: '입력과 내부 버튼의 제어 높이를 함께 맞춥니다.',
      id: 'search-field-sizes',
      filename: 'sizes.tsx',
      source: sizesSource,
      title: '크기',
    },
    {
      Component: SearchFieldStatesExample,
      coverage: [
        { axis: 'loading', values: ['true'] },
        { axis: 'disabled', values: ['true'] },
        { axis: 'invalid', values: ['true'] },
      ],
      description: '검색 처리 중, 비활성, 오류 상태를 구분합니다.',
      id: 'search-field-states',
      filename: 'states.tsx',
      source: statesSource,
      title: '검색 상태',
    },
    {
      Component: SearchFieldClearExample,
      coverage: [{ axis: 'hideWhenEmpty', values: ['false', 'true'] }],
      description: '빈 검색어에서 지우기 버튼을 숨길지 선택합니다.',
      id: 'search-field-clear',
      filename: 'clear.tsx',
      source: clearSource,
      title: '지우기 버튼 표시',
    },
  ],
  optionAxes: [
    { name: 'size', defaultValue: 'md', values: ['sm', 'md', 'lg'] },
    { name: 'loading', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'invalid', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'disabled', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'hideWhenEmpty', defaultValue: 'true', values: ['false', 'true'] },
  ],
} satisfies ComponentPageData;
