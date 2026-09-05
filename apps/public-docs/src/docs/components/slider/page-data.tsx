import sizesSource from './examples/sizes.tsx?raw';
import SliderSizesExample from './examples/sizes';
import statesSource from './examples/states.tsx?raw';
import SliderStatesExample from './examples/states';
import { SliderPreview } from '../../preview-playgrounds/forms';
import { createPlaygroundSource } from '../../preview-playgrounds/source';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'slider-playground',
  api: [
    {
      name: 'Root / Control / Track / Indicator / Thumb / Value',
      type: 'compound parts',
      description: 'Root 안에서 상호작용 영역, 진행 표시, thumb과 읽기 값을 조합합니다.',
    },
    {
      name: 'value / onValueChange',
      type: 'number | readonly number[] / callback',
      description: '단일 값 또는 범위 값을 제어합니다.',
    },
    {
      name: 'defaultValue',
      type: 'number | readonly number[]',
      description: '비제어 초기 값입니다.',
    },
    {
      name: 'min / max / step',
      type: 'number',
      description: '허용 범위와 키보드·포인터 증감 단위입니다.',
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      defaultValue: "'horizontal'",
      description: '슬라이더 방향입니다.',
    },
    {
      name: 'size',
      type: "'xsm' | 'sm' | 'md' | 'lg' | 'xlg'",
      defaultValue: "'md'",
      description: '트랙과 thumb의 시각 크기를 함께 정합니다.',
    },
    { name: 'disabled', type: 'boolean', description: '값 변경을 막습니다.' },
  ],
  examples: [
    {
      Component: SliderPreview,
      configurable: true,
      coverage: [{ axis: 'preview', values: ['configurable'] }],
      description: '사이드바에서 크기, 값 소유 방식, 범위·방향과 비활성 상태를 조절합니다.',
      id: 'slider-playground',
      filename: 'playground.tsx',
      source: createPlaygroundSource('@opnay/city-ds-react/slider', 'Slider'),
      title: 'Preview',
    },
    {
      Component: SliderSizesExample,
      coverage: [{ axis: 'size', values: ['xsm', 'sm', 'md', 'lg', 'xlg'] }],
      description: '주변 제어의 밀도에 맞춰 트랙과 thumb을 같은 크기로 조절합니다.',
      id: 'slider-sizes',
      filename: 'sizes.tsx',
      source: sizesSource,
      title: '크기',
    },
    {
      Component: SliderStatesExample,
      coverage: [
        { axis: 'mode', values: ['controlled', 'uncontrolled'] },
        { axis: 'range', values: ['single', 'range'] },
        { axis: 'orientation', values: ['horizontal', 'vertical'] },
        { axis: 'disabled', values: ['true'] },
      ],
      description: '제어·비제어 단일 값, 범위 값, 세로 방향과 비활성 상태를 확인합니다.',
      id: 'slider-states',
      filename: 'states.tsx',
      source: statesSource,
      title: '값과 방향',
    },
  ],
  optionAxes: [
    {
      control: 'segmented',
      name: 'size',
      defaultValue: 'md',
      values: ['xsm', 'sm', 'md', 'lg', 'xlg'],
    },
    {
      name: 'mode',
      defaultValue: 'uncontrolled',
      values: ['controlled', 'uncontrolled'],
    },
    { name: 'range', defaultValue: 'single', values: ['single', 'range'] },
    {
      name: 'orientation',
      defaultValue: 'horizontal',
      values: ['horizontal', 'vertical'],
    },
    { name: 'disabled', defaultValue: 'false', values: ['false', 'true'] },
  ],
} satisfies ComponentPageData;
