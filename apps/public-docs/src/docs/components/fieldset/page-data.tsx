import bandSource from './examples/band.tsx?raw';
import FieldsetBandExample from './examples/band';
import outlineSource from './examples/outline.tsx?raw';
import FieldsetOutlineExample from './examples/outline';
import plainSource from './examples/plain.tsx?raw';
import FieldsetPlainExample from './examples/plain';
import statesSource from './examples/states.tsx?raw';
import FieldsetStatesExample from './examples/states';
import { FieldsetPreview } from '../../preview-playgrounds/forms';
import { createPlaygroundSource } from '../../preview-playgrounds/source';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'fieldset-playground',
  widePreviewIds: [
    'fieldset-playground',
    'fieldset-outline',
    'fieldset-plain',
    'fieldset-band',
    'fieldset-states',
  ],
  api: [
    {
      name: 'appearance',
      type: "'plain' | 'band' | 'outline'",
      defaultValue: "'outline'",
      description: '필드 그룹의 표면을 지정합니다.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      description: '그룹의 하위 제어를 비활성화합니다.',
    },
    { name: 'Legend', type: 'Fieldset.Legend', description: '질문의 이름을 제공합니다.' },
    {
      name: 'Description / Error',
      type: 'Fieldset parts',
      description: '그룹 수준의 안내와 오류를 제공합니다.',
    },
  ],
  examples: [
    {
      Component: FieldsetPreview,
      configurable: true,
      coverage: [{ axis: 'preview', values: ['configurable'] }],
      description: '사이드바에서 그룹 표면과 비활성 상태를 조절합니다.',
      id: 'fieldset-playground',
      filename: 'playground.tsx',
      source: createPlaygroundSource('@opnay/city-ds-react/fieldset', 'Fieldset'),
      title: 'Preview',
    },
    {
      Component: FieldsetOutlineExample,
      coverage: [{ axis: 'appearance', values: ['outline'] }],
      description: '경계가 필요한 독립적인 필드 그룹입니다.',
      id: 'fieldset-outline',
      filename: 'outline.tsx',
      source: outlineSource,
      title: 'Outline',
    },
    {
      Component: FieldsetPlainExample,
      coverage: [{ axis: 'appearance', values: ['plain'] }],
      description: '주변 레이아웃과 같은 표면에서 필드를 묶습니다.',
      id: 'fieldset-plain',
      filename: 'plain.tsx',
      source: plainSource,
      title: 'Plain',
    },
    {
      Component: FieldsetBandExample,
      coverage: [{ axis: 'appearance', values: ['band'] }],
      description: '배경 대비로 필드 그룹을 구분합니다.',
      id: 'fieldset-band',
      filename: 'band.tsx',
      source: bandSource,
      title: 'Band',
    },
    {
      Component: FieldsetStatesExample,
      coverage: [
        { axis: 'invalid', values: ['true'] },
        { axis: 'disabled', values: ['true'] },
      ],
      description: '그룹 수준 오류와 하위 제어를 변경할 수 없는 상태를 구분합니다.',
      id: 'fieldset-states',
      filename: 'states.tsx',
      source: statesSource,
      title: '그룹 상태',
    },
  ],
  optionAxes: [
    { name: 'appearance', defaultValue: 'outline', values: ['plain', 'band', 'outline'] },
    { name: 'disabled', defaultValue: 'false', values: ['false', 'true'] },
  ],
} satisfies ComponentPageData;
