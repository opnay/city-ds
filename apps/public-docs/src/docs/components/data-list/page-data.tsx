import DataListDetailsExample from './examples/details';
import detailsSource from './examples/details.tsx?raw';
import DataListLayoutsExample from './examples/layouts';
import layoutsSource from './examples/layouts.tsx?raw';
import { isEnabled, type PreviewOptionProps } from '../../preview-playgrounds/types';
import type { ComponentPageData } from '../../types';

function DataListPreview({ orientation, density, dividers }: PreviewOptionProps) {
  return (
    <DataListDetailsExample
      orientation={orientation === 'vertical' ? 'vertical' : 'horizontal'}
      density={density === 'compact' ? 'compact' : 'comfortable'}
      dividers={isEnabled(dividers)}
    />
  );
}

export const pageData = {
  featuredExampleId: 'data-list-preview',
  widePreviewIds: ['data-list-preview', 'data-list-layouts'],
  api: [
    {
      name: 'DataList.Root',
      type: 'dl props + render',
      description:
        '이름과 값의 목록입니다. 이름이 필요하면 aria-label 또는 aria-labelledby를 지정하십시오.',
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      defaultValue: "'horizontal'",
      description:
        '이름과 값의 배치입니다. horizontal도 컨테이너가 24rem보다 좁으면 세로로 배치합니다.',
    },
    {
      name: 'density',
      type: "'comfortable' | 'compact'",
      description: '항목의 세로 간격입니다. 생략하면 DensityProvider를 따릅니다.',
    },
    {
      name: 'dividers',
      type: 'boolean',
      defaultValue: 'false',
      description: '항목 사이에 구분선을 표시합니다.',
    },
    {
      name: 'DataList.Item',
      type: 'div props + render',
      description: '한 이름과 해당 값을 묶습니다.',
    },
    {
      name: 'DataList.Label',
      type: 'dt props + render',
      description: '데이터의 이름입니다. 폼 입력의 label을 대신하지 않습니다.',
    },
    {
      name: 'DataList.Value',
      type: 'dd props + render',
      description: '텍스트·배지·링크·목록·버튼 등을 담는 값입니다.',
    },
    {
      name: '--city-data-list-label-width',
      type: 'CSS length',
      defaultValue: '10rem',
      description:
        '가로 배치에서 이름 열의 너비입니다. Root의 style 또는 className으로 조절하십시오.',
    },
  ],
  optionAxes: [
    {
      name: 'orientation',
      control: 'segmented',
      defaultValue: 'horizontal',
      values: ['horizontal', 'vertical'],
    },
    {
      name: 'density',
      control: 'segmented',
      defaultValue: 'comfortable',
      values: ['comfortable', 'compact'],
    },
    { name: 'dividers', control: 'switch', defaultValue: 'false', values: ['false', 'true'] },
  ],
  examples: [
    {
      id: 'data-list-preview',
      title: 'Preview',
      description: '텍스트·배지·목록·버튼을 값으로 조합하고 배치와 간격을 조절합니다.',
      Component: DataListPreview,
      configurable: true,
      filename: 'details.tsx',
      source: detailsSource,
      coverage: [
        { axis: 'orientation', values: ['horizontal', 'vertical'] },
        { axis: 'density', values: ['comfortable', 'compact'] },
        { axis: 'dividers', values: ['false', 'true'] },
      ],
    },
    {
      id: 'data-list-layouts',
      title: '배치와 밀도',
      description: '같은 데이터를 가로·세로 배치와 두 가지 간격으로 비교합니다.',
      Component: DataListLayoutsExample,
      filename: 'layouts.tsx',
      source: layoutsSource,
      coverage: [
        { axis: 'orientation', values: ['horizontal', 'vertical'] },
        { axis: 'density', values: ['comfortable', 'compact'] },
        { axis: 'dividers', values: ['true'] },
      ],
    },
  ],
} satisfies ComponentPageData;
