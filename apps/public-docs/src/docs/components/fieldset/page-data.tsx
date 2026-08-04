import groupSource from './examples/group.tsx?raw';
import GroupExample from './examples/group';
import type { ComponentPageData } from '../../types';

export const pageData = {
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
      Component: GroupExample,
      coverage: [
        { axis: 'appearance', values: ['plain', 'band', 'outline'] },
        { axis: 'invalid', values: ['true'] },
        { axis: 'disabled', values: ['true'] },
      ],
      description: '관련 선택을 하나의 질문과 그룹 오류로 묶습니다.',
      id: 'fieldset-group',
      filename: 'group.tsx',
      source: groupSource,
      title: '관련 필드 묶기',
    },
  ],
  optionAxes: [
    { name: 'appearance', defaultValue: 'outline', values: ['plain', 'band', 'outline'] },
    { name: 'disabled', defaultValue: 'false', values: ['false', 'true'] },
  ],
} satisfies ComponentPageData;
