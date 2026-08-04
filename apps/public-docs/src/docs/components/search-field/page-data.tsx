import searchSource from './examples/search.tsx?raw';
import SearchFieldExample from './examples/search';
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
      Component: SearchFieldExample,
      coverage: [
        { axis: 'size', values: ['sm', 'md', 'lg'] },
        { axis: 'loading', values: ['true'] },
        { axis: 'disabled', values: ['true'] },
        { axis: 'invalid', values: ['true'] },
        { axis: 'hideWhenEmpty', values: ['false', 'true'] },
      ],
      description: '제어 검색, 로딩, 비활성·오류 상태와 모든 크기입니다.',
      id: 'search-field-states',
      filename: 'search.tsx',
      source: searchSource,
      title: '검색 상태',
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
