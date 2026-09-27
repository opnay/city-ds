import MessageExample from './examples/message';
import messageSource from './examples/message.tsx?raw';
import AppearancesExample from './examples/appearances';
import appearancesSource from './examples/appearances.tsx?raw';
import type { PreviewOptionProps } from '../../preview-playgrounds/types';
import type { ComponentPageData } from '../../types';

function Preview({ appearance, align, density }: PreviewOptionProps) {
  return (
    <MessageExample
      appearance={appearance === 'bubble' ? 'bubble' : 'plain'}
      align={align === 'end' ? 'end' : 'start'}
      density={density === 'compact' ? 'compact' : 'comfortable'}
    />
  );
}

export const pageData = {
  featuredExampleId: 'commentary-preview',
  widePreviewIds: ['commentary-preview', 'commentary-appearances'],
  api: [
    { name: 'Commentary.Root', type: 'div props + render', description: '대화 메시지를 묶습니다.' },
    {
      name: 'appearance',
      type: "'plain' | 'bubble'",
      defaultValue: "'plain'",
      description: '본문을 로그형 또는 말풍선형으로 표시합니다.',
    },
    {
      name: 'align',
      type: "'start' | 'end'",
      defaultValue: "'start'",
      description: '작성자 종류와 무관하게 논리 방향으로 정렬합니다.',
    },
    {
      name: 'density',
      type: "'comfortable' | 'compact'",
      description: '생략하면 DensityProvider를 따릅니다.',
    },
    {
      name: 'Commentary.Header',
      type: 'div props + render',
      description: '아바타·작성자·메타데이터를 배치합니다.',
    },
    { name: 'Commentary.Author', type: 'span props + render', description: '작성자 이름입니다.' },
    {
      name: 'Commentary.Meta',
      type: 'span props + render',
      description: '시간·모델명 등 부가 정보입니다.',
    },
    {
      name: 'Commentary.Content',
      type: 'div props + render',
      description:
        '임의의 React 본문입니다. Markdown 문자열은 Article로 표시하고 스트리밍은 소비자가 연결합니다.',
    },
    {
      name: 'Commentary.Actions',
      type: 'div props + render',
      description: '기존 Button 등으로 메시지 액션을 구성합니다.',
    },
  ],
  optionAxes: [
    {
      name: 'appearance',
      control: 'segmented',
      defaultValue: 'plain',
      values: ['plain', 'bubble'],
    },
    { name: 'align', control: 'segmented', defaultValue: 'start', values: ['start', 'end'] },
    {
      name: 'density',
      control: 'segmented',
      defaultValue: 'comfortable',
      values: ['comfortable', 'compact'],
    },
  ],
  examples: [
    {
      id: 'commentary-preview',
      title: 'Preview',
      description: '본문·코드·모델명과 액션을 조합합니다.',
      Component: Preview,
      configurable: true,
      filename: 'message.tsx',
      source: messageSource,
      coverage: [
        { axis: 'appearance', values: ['plain', 'bubble'] },
        { axis: 'align', values: ['start', 'end'] },
        { axis: 'density', values: ['comfortable', 'compact'] },
      ],
    },
    {
      id: 'commentary-appearances',
      title: '표현과 정렬',
      description: '같은 작성자로 네 가지 조합을 비교합니다.',
      Component: AppearancesExample,
      filename: 'appearances.tsx',
      source: appearancesSource,
      coverage: [
        { axis: 'appearance', values: ['plain', 'bubble'] },
        { axis: 'align', values: ['start', 'end'] },
        { axis: 'density', values: ['compact'] },
      ],
    },
  ],
} satisfies ComponentPageData;
