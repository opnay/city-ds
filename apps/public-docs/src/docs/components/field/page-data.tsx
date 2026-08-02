import statesSource from './examples/states.tsx?raw';
import StatesExample from './examples/states';
import type { ComponentPageData } from '../../types';

export const pageData = {
  api: [
    {
      name: 'invalid',
      type: 'boolean',
      defaultValue: 'false',
      description: '연결된 Error와 control의 오류 상태를 표시합니다.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      description: '하위 제어를 사용할 수 없게 합니다.',
    },
    {
      name: 'Label / Description / Error',
      type: 'Field parts',
      description: '제어의 이름, 도움말, 검증 메시지를 연결합니다.',
    },
    { name: 'Control', type: 'Field.Control', description: '합성 제어를 field 관계에 연결합니다.' },
  ],
  examples: [
    {
      Component: StatesExample,
      coverage: [
        { axis: 'invalid', values: ['false', 'true'] },
        { axis: 'disabled', values: ['false', 'true'] },
      ],
      description: '도움말, 오류, 비활성 상태를 제어와 함께 제공합니다.',
      id: 'field-states',
      source: statesSource,
      title: '폼 제어 문맥',
    },
  ],
  optionAxes: [
    { name: 'invalid', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'disabled', defaultValue: 'false', values: ['false', 'true'] },
  ],
} satisfies ComponentPageData;
