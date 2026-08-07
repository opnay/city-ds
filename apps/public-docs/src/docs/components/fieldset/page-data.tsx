import appearancesSource from './examples/appearances.tsx?raw';
import FieldsetAppearancesExample from './examples/appearances';
import statesSource from './examples/states.tsx?raw';
import FieldsetStatesExample from './examples/states';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'fieldset-appearances',
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
      Component: FieldsetAppearancesExample,
      coverage: [{ axis: 'appearance', values: ['plain', 'band', 'outline'] }],
      description: '주변 레이아웃과 정보 위계에 맞는 그룹 표면을 선택합니다.',
      id: 'fieldset-appearances',
      filename: 'appearances.tsx',
      source: appearancesSource,
      title: '표면',
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
