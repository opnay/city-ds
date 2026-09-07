import plansSource from './examples/plans.tsx?raw';
import PlansExample from './examples/plans';
import addOnsSource from './examples/add-ons.tsx?raw';
import AddOnsExample from './examples/add-ons';
import { isEnabled, type PreviewOptionProps } from '../../preview-playgrounds/types';
import type { ComponentPageData } from '../../types';

function SelectionCardPreview({ disabled, type }: PreviewOptionProps) {
  return (
    <PlansExample
      disabled={isEnabled(disabled)}
      type={type === 'checkbox' ? 'checkbox' : 'radio'}
    />
  );
}

export const pageData = {
  featuredExampleId: 'selection-card-plans',
  widePreviewIds: ['selection-card-plans', 'selection-card-add-ons'],
  api: [
    {
      name: 'SelectionCard',
      type: 'label props + render',
      description:
        '카드 전체를 내부 입력 하나의 클릭 영역으로 사용합니다. 선택 상태는 입력이 소유합니다.',
    },
    {
      name: 'SelectionCard.Content',
      type: 'span props',
      description: '제목, 설명, 가격 등 카드 정보를 배치합니다.',
    },
    {
      name: 'SelectionCard.Title',
      type: 'span props',
      description: '입력의 aria-labelledby로 연결할 짧은 이름입니다.',
    },
    {
      name: 'SelectionCard.Description',
      type: 'span props',
      description: '입력의 aria-describedby로 연결할 보충 설명입니다.',
    },
    {
      name: 'RadioGroup.Control / Checkbox',
      type: 'input component',
      description:
        '값, 변경 이벤트, disabled 등은 실제 입력에 지정합니다. RadioGroup.Item은 label을 포함하므로 카드 안에는 Control을 사용하십시오.',
    },
  ],
  examples: [
    {
      Component: SelectionCardPreview,
      configurable: true,
      coverage: [
        { axis: 'disabled', values: ['false', 'true'] },
        { axis: 'type', values: ['radio', 'checkbox'] },
      ],
      description:
        '입력 종류와 비활성 상태를 조절하고 카드 전체를 눌러 단일·복수 선택을 비교합니다.',
      id: 'selection-card-plans',
      filename: 'plans.tsx',
      source: plansSource,
      title: '플랜 선택',
    },
    {
      Component: AddOnsExample,
      coverage: [{ axis: 'selection', values: ['multiple'] }],
      description: '서로 독립적인 추가 기능을 여러 개 선택합니다.',
      id: 'selection-card-add-ons',
      filename: 'add-ons.tsx',
      source: addOnsSource,
      title: '복수 선택',
    },
  ],
  optionAxes: [
    { name: 'type', control: 'segmented', defaultValue: 'radio', values: ['radio', 'checkbox'] },
    { name: 'disabled', defaultValue: 'false', values: ['false', 'true'] },
  ],
} satisfies ComponentPageData;
