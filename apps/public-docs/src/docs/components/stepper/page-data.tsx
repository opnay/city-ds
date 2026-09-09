import StepperSetupExample from './examples/setup';
import setupSource from './examples/setup.tsx?raw';
import { isEnabled, type PreviewOptionProps } from '../../preview-playgrounds/types';
import type { ComponentPageData } from '../../types';

function StepperPreview({ orientation, error }: PreviewOptionProps) {
  return (
    <StepperSetupExample
      orientation={orientation === 'vertical' ? 'vertical' : 'horizontal'}
      error={isEnabled(error)}
    />
  );
}

export const pageData = {
  featuredExampleId: 'stepper-preview',
  widePreviewIds: ['stepper-preview'],
  api: [
    {
      name: 'Stepper.Root',
      type: 'ol props + render',
      description: '단계 목록입니다. aria-label 또는 aria-labelledby로 작업 이름을 지정하십시오.',
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      defaultValue: "'horizontal'",
      description:
        '화면 너비와 관계없이 지정한 방향을 유지합니다. 가로 배치는 짧은 제목으로 구성하십시오.',
    },
    {
      name: 'Stepper.Item',
      type: 'li props + render',
      description: '하나의 단계입니다. 입력 검증·이동 조건·완료 상태는 소비자가 관리합니다.',
    },
    {
      name: 'current',
      type: 'boolean',
      defaultValue: 'false',
      description:
        '현재 단계에 aria-current="step"을 지정합니다. 목록당 하나만 지정하고 전체 완료 시 모두 해제하십시오.',
    },
    {
      name: 'status',
      type: "'pending' | 'completed' | 'error'",
      defaultValue: "'pending'",
      description: '단계 상태입니다. 오류 상태와 현재 위치를 함께 표현할 수 있습니다.',
    },
    {
      name: 'statusLabel',
      type: 'string',
      description:
        '보조 기술에 전달하는 상태 문구입니다. 기본값은 완료 시 Completed, 오류 시 Error이며 화면 언어에 맞게 지정하십시오.',
    },
    {
      name: 'Stepper.Indicator',
      type: 'span props + render',
      description:
        'children으로 단계 번호를 전달합니다. 완료·오류 상태는 아이콘으로 바뀌며 보조 기술에는 숨겨집니다.',
    },
    { name: 'Stepper.Content', type: 'div props + render', description: '제목과 설명을 묶습니다.' },
    {
      name: 'Stepper.Title',
      type: 'span props + render',
      description: '이동할 수 없는 단계의 제목입니다.',
    },
    {
      name: 'Stepper.Description',
      type: 'p props + render',
      description:
        '세로 배치에서 완료한 단계의 입력·결과를 요약합니다. 현재·대기 단계에서는 렌더링하지 않습니다. 작업 안내와 오류 설명은 현재 단계 본문에 표시하십시오.',
    },
    {
      name: 'Stepper.Trigger',
      type: 'Base UI Button props',
      description:
        '이동 가능한 단계의 버튼입니다. onClick으로 이동을 연결하고 disabled로 제한합니다. 링크 합성 시 render, role="link", nativeButton={false}를 사용하십시오.',
    },
  ],
  optionAxes: [
    {
      name: 'orientation',
      control: 'segmented',
      defaultValue: 'horizontal',
      values: ['horizontal', 'vertical'],
    },
    { name: 'error', control: 'switch', defaultValue: 'false', values: ['false', 'true'] },
  ],
  examples: [
    {
      id: 'stepper-preview',
      title: 'Preview',
      description: '이전·다음 이동, 완료 단계 재방문, 오류와 전체 완료 상태를 확인합니다.',
      Component: StepperPreview,
      configurable: true,
      filename: 'setup.tsx',
      source: setupSource,
      coverage: [
        { axis: 'orientation', values: ['horizontal', 'vertical'] },
        { axis: 'error', values: ['false', 'true'] },
      ],
    },
  ],
} satisfies ComponentPageData;
