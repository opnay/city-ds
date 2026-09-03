import choicesSource from './examples/choices.tsx?raw';
import RadioGroupChoicesExample from './examples/choices';
import sizesSource from './examples/sizes.tsx?raw';
import RadioGroupSizesExample from './examples/sizes';
import { RadioGroupPreview } from '../../preview-playgrounds/forms';
import { createPlaygroundSource } from '../../preview-playgrounds/source';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'radio-group-playground',
  api: [
    {
      name: 'value / onValueChange',
      type: 'Value / callback',
      description: '단일 선택을 제어합니다.',
    },
    { name: 'defaultValue', type: 'Value', description: '비제어 초기 선택입니다.' },
    {
      name: 'size',
      type: "'xsm' | 'sm' | 'md' | 'lg' | 'xlg'",
      defaultValue: "'md'",
      description: '라디오 크기입니다.',
    },
    { name: 'disabled', type: 'boolean', description: '선택할 수 없는 항목입니다.' },
  ],
  examples: [
    {
      Component: RadioGroupPreview,
      configurable: true,
      coverage: [{ axis: 'preview', values: ['configurable'] }],
      description: '사이드바에서 크기, 값 소유 방식과 비활성 상태를 조절합니다.',
      id: 'radio-group-playground',
      filename: 'playground.tsx',
      source: createPlaygroundSource('@opnay/city-ds-react/radio-group', 'RadioGroup'),
      title: 'Preview',
    },
    {
      Component: RadioGroupSizesExample,
      coverage: [{ axis: 'size', values: ['xsm', 'sm', 'md', 'lg', 'xlg'] }],
      description: '그룹 안의 모든 라디오에 동일한 크기를 적용합니다.',
      id: 'radio-group-sizes',
      filename: 'sizes.tsx',
      source: sizesSource,
      title: '크기',
    },
    {
      Component: RadioGroupChoicesExample,
      coverage: [
        { axis: 'mode', values: ['controlled', 'uncontrolled'] },
        { axis: 'disabled', values: ['true'] },
      ],
      description: '제어·비제어 크기와 비활성 단일 선택입니다.',
      id: 'radio-group-choices',
      filename: 'choices.tsx',
      source: choicesSource,
      title: '단일 선택',
    },
  ],
  optionAxes: [
    { name: 'size', defaultValue: 'md', values: ['xsm', 'sm', 'md', 'lg', 'xlg'] },
    { name: 'mode', values: ['controlled', 'uncontrolled'] },
    { name: 'disabled', defaultValue: 'false', values: ['false', 'true'] },
  ],
} satisfies ComponentPageData;
