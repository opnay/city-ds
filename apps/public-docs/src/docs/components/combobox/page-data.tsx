import multipleSource from './examples/multiple.tsx?raw';
import ComboboxMultipleExample from './examples/multiple';
import singleSource from './examples/single.tsx?raw';
import ComboboxSingleExample from './examples/single';
import statesSource from './examples/states.tsx?raw';
import ComboboxStatesExample from './examples/states';
import { ComboboxPreview } from '../../preview-playgrounds/forms';
import { createPlaygroundSource } from '../../preview-playgrounds/source';
import type { ComponentPageData } from '../../types';

const sizes = ['xsm', 'sm', 'md', 'lg', 'xlg'] as const;
const singleCombinations = sizes.map((size) => `size=${size}|multiple=false`);
const multipleCombinations = sizes.map((size) => `size=${size}|multiple=true`);

export const pageData = {
  featuredExampleId: 'combobox-playground',
  api: [
    { name: 'items', type: 'readonly Value[]', description: '검색하고 선택할 컬렉션입니다.' },
    {
      name: 'multiple',
      type: 'boolean',
      defaultValue: 'false',
      description: '여러 값을 선택하고 Chip으로 표시합니다.',
    },
    {
      name: 'size',
      type: "'xsm' | 'sm' | 'md' | 'lg' | 'xlg'",
      defaultValue: "'md'",
      description: '입력 그룹과 제어 크기를 정합니다.',
    },
    {
      name: 'value / onValueChange / defaultValue',
      type: 'Value | Value[] / callback',
      description: '선택 값을 제어하거나 초기화합니다.',
    },
  ],
  examples: [
    {
      Component: ComboboxPreview,
      configurable: true,
      coverage: [{ axis: 'preview', values: ['configurable'] }],
      description: '사이드바에서 크기, 단일·복수 선택과 값 소유 방식을 조절합니다.',
      id: 'combobox-playground',
      filename: 'playground.tsx',
      source: createPlaygroundSource('@opnay/city-ds-react/combobox', 'Combobox'),
      title: 'Preview',
    },
    {
      Component: ComboboxSingleExample,
      coverage: [
        {
          axis: 'size',
          values: sizes,
          combinations: singleCombinations,
        },
        {
          axis: 'multiple',
          values: ['false'],
          combinations: singleCombinations,
        },
      ],
      description: '한 개의 값을 검색하고 선택합니다.',
      id: 'combobox-single',
      filename: 'single.tsx',
      source: singleSource,
      title: '단일 선택',
    },
    {
      Component: ComboboxMultipleExample,
      coverage: [
        {
          axis: 'size',
          values: sizes,
          combinations: multipleCombinations,
        },
        {
          axis: 'multiple',
          values: ['true'],
          combinations: multipleCombinations,
        },
      ],
      description: '여러 값을 검색해 Chip으로 선택하고 제거합니다.',
      id: 'combobox-multiple',
      filename: 'multiple.tsx',
      source: multipleSource,
      title: '복수 선택',
    },
    {
      Component: ComboboxStatesExample,
      coverage: [
        { axis: 'disabled', values: ['true'] },
        { axis: 'mode', values: ['uncontrolled', 'controlled'] },
      ],
      description: '외부에서 값을 제어하는 입력과 선택할 수 없는 입력을 구분합니다.',
      id: 'combobox-states',
      filename: 'states.tsx',
      source: statesSource,
      title: '상태 제어',
    },
  ],
  optionAxes: [
    { control: 'segmented', name: 'size', defaultValue: 'md', values: sizes },
    { name: 'multiple', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'disabled', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'mode', defaultValue: 'uncontrolled', values: ['uncontrolled', 'controlled'] },
  ],
} satisfies ComponentPageData;
