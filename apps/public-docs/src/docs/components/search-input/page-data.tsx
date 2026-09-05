import clearSource from './examples/clear.tsx?raw';
import SearchInputClearExample from './examples/clear';
import sizesSource from './examples/sizes.tsx?raw';
import SearchInputSizesExample from './examples/sizes';
import statesSource from './examples/states.tsx?raw';
import SearchInputStatesExample from './examples/states';
import usageSource from './examples/usage.tsx?raw';
import SearchInputUsageExample from './examples/usage';
import { SearchInputPreview } from '../../preview-playgrounds/forms';
import { createPlaygroundSource } from '../../preview-playgrounds/source';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'search-input-playground',
  api: [
    {
      name: 'SearchInput.Root value / onValueChange',
      type: 'string / callback',
      description: '검색어를 제어합니다.',
    },
    {
      name: 'SearchInput.Root render',
      type: 'React element / render function',
      description: '기본 div 컨테이너를 소비자 요소로 교체합니다.',
    },
    {
      name: 'SearchInput.Submit',
      type: 'native submit button',
      description: '외부 form의 제출을 실행합니다.',
    },
    { name: 'loading', type: 'boolean', description: '로컬 검색 처리 중 상태입니다.' },
    { name: 'invalid / disabled', type: 'boolean', description: '오류와 비활성 상태입니다.' },
    {
      name: 'size',
      type: "'xsm' | 'sm' | 'md' | 'lg' | 'xlg'",
      defaultValue: "'md'",
      description: '입력 높이입니다.',
    },
    {
      name: 'SearchInput.Clear hideWhenEmpty',
      type: 'boolean',
      defaultValue: 'true',
      description: '빈 검색어에서도 지우기 버튼을 유지할지 정합니다.',
    },
  ],
  examples: [
    {
      Component: SearchInputPreview,
      configurable: true,
      coverage: [{ axis: 'preview', values: ['configurable'] }],
      description: '사이드바에서 크기, 로딩·오류·비활성 상태와 지우기 동작을 조절합니다.',
      id: 'search-input-playground',
      filename: 'playground.tsx',
      source: createPlaygroundSource('@opnay/city-ds-react/search-input', 'SearchInput'),
      title: 'Preview',
    },
    {
      Component: SearchInputUsageExample,
      coverage: [{ axis: 'interaction', values: ['controlled', 'submit'] }],
      description: '검색어를 제어하고 외부 form의 FormData에서 제출 결과를 읽습니다.',
      id: 'search-input-usage',
      filename: 'usage.tsx',
      source: usageSource,
      title: '제어 검색',
    },
    {
      Component: SearchInputSizesExample,
      coverage: [{ axis: 'size', values: ['xsm', 'sm', 'md', 'lg', 'xlg'] }],
      description: '입력과 내부 버튼의 제어 높이를 함께 맞춥니다.',
      id: 'search-input-sizes',
      filename: 'sizes.tsx',
      source: sizesSource,
      title: '크기',
    },
    {
      Component: SearchInputStatesExample,
      coverage: [
        { axis: 'loading', values: ['true'] },
        { axis: 'disabled', values: ['true'] },
        { axis: 'invalid', values: ['true'] },
      ],
      description: '검색 처리 중, 비활성, 오류 상태를 구분합니다.',
      id: 'search-input-states',
      filename: 'states.tsx',
      source: statesSource,
      title: '검색 상태',
    },
    {
      Component: SearchInputClearExample,
      coverage: [{ axis: 'hideWhenEmpty', values: ['false', 'true'] }],
      description: '빈 검색어에서 지우기 버튼을 숨길지 선택합니다.',
      id: 'search-input-clear',
      filename: 'clear.tsx',
      source: clearSource,
      title: '지우기 버튼 표시',
    },
  ],
  optionAxes: [
    {
      control: 'segmented',
      name: 'size',
      defaultValue: 'md',
      values: ['xsm', 'sm', 'md', 'lg', 'xlg'],
    },
    { name: 'loading', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'invalid', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'disabled', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'hideWhenEmpty', defaultValue: 'true', values: ['false', 'true'] },
  ],
} satisfies ComponentPageData;
