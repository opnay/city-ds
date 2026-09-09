import TimelineBuildHistoryExample from './examples/build-history';
import buildHistorySource from './examples/build-history.tsx?raw';
import TimelineActivityExample from './examples/activity';
import activitySource from './examples/activity.tsx?raw';
import TimelineDensityExample from './examples/density';
import densitySource from './examples/density.tsx?raw';
import type { PreviewOptionProps } from '../../preview-playgrounds/types';
import type { ComponentPageData } from '../../types';

function TimelinePreview({ density }: PreviewOptionProps) {
  return <TimelineActivityExample density={density === 'compact' ? 'compact' : 'comfortable'} />;
}

export const pageData = {
  featuredExampleId: 'timeline-preview',
  widePreviewIds: ['timeline-preview', 'timeline-density', 'timeline-build-history'],
  api: [
    {
      name: 'Timeline.Root',
      type: 'ol props + render',
      description:
        '시간순 이벤트 목록입니다. aria-label 또는 aria-labelledby로 목록의 이름을 지정하십시오.',
    },
    {
      name: 'density',
      type: "'comfortable' | 'compact'",
      description: '이벤트 사이의 간격입니다. 생략하면 DensityProvider를 따릅니다.',
    },
    {
      name: 'Timeline.Item',
      type: 'li props + render',
      description: '하나의 이벤트를 묶습니다. Root의 직접 자식으로 배치하십시오.',
    },
    {
      name: 'Timeline.Indicator',
      type: 'div props + render',
      description:
        '이벤트 지점입니다. 기본 점 대신 아이콘 등을 children으로 넣을 수 있습니다. 기본적으로 접근성 트리에서 숨겨집니다.',
    },
    {
      name: 'Timeline.Indicator tone',
      type: "'neutral' | 'info' | 'success' | 'warning' | 'destructive'",
      defaultValue: "'neutral'",
      description:
        '원의 상태 색상입니다. 실패에는 destructive를 사용하십시오. 상태는 색상 외에 아이콘과 내용에도 표시하십시오.',
    },
    {
      name: 'Timeline.Connector',
      type: 'div props + render',
      description: '다음 이벤트까지 이어지는 장식선입니다. 마지막 Item에서는 자동으로 숨겨집니다.',
    },
    {
      name: 'Timeline.Content',
      type: 'div props + render',
      description: '제목·설명·시간·카드·액션을 조합하는 내용 영역입니다.',
    },
    {
      name: 'Timeline.Title',
      type: 'p props + render',
      description:
        '이벤트 제목입니다. 문서 제목이 필요하면 render로 적절한 heading을 지정하십시오.',
    },
    {
      name: 'Timeline.Description',
      type: 'p props + render',
      description: '이벤트의 부가 설명입니다.',
    },
    {
      name: 'Timeline.Time',
      type: 'time props + render',
      description:
        'children을 그대로 표시합니다. 날짜 해석·포맷·시간대 변환은 소비자가 담당합니다.',
    },
    {
      name: 'Timeline.Time dateTime',
      type: 'string',
      description:
        '기계가 읽을 수 있는 HTML 날짜·시간 값입니다. “오늘”, “방금 전”처럼 표시하면 함께 지정하십시오.',
    },
  ],
  optionAxes: [
    {
      name: 'density',
      control: 'segmented',
      defaultValue: 'comfortable',
      values: ['comfortable', 'compact'],
    },
  ],
  examples: [
    {
      id: 'timeline-build-history',
      title: '빌드 상태 색상',
      description: '대기·실행·경고·실패·성공을 원의 색상과 아이콘, 상태 문구로 구분합니다.',
      Component: TimelineBuildHistoryExample,
      filename: 'build-history.tsx',
      source: buildHistorySource,
      coverage: [
        { axis: 'tone', values: ['neutral', 'info', 'success', 'warning', 'destructive'] },
      ],
    },
    {
      id: 'timeline-preview',
      title: 'Preview',
      description: '점·아이콘·배지와 자유로운 시간 표현을 조합합니다.',
      Component: TimelinePreview,
      configurable: true,
      filename: 'activity.tsx',
      source: activitySource,
      coverage: [{ axis: 'density', values: ['comfortable', 'compact'] }],
    },
    {
      id: 'timeline-density',
      title: '간격 비교',
      description: '같은 활동 기록을 두 가지 밀도로 비교합니다.',
      Component: TimelineDensityExample,
      filename: 'density.tsx',
      source: densitySource,
      coverage: [{ axis: 'density', values: ['comfortable', 'compact'] }],
    },
  ],
} satisfies ComponentPageData;
