import ActivityExample from './examples/activity';
import activitySource from './examples/activity.tsx?raw';
import EventsExample from './examples/events';
import eventsSource from './examples/events.tsx?raw';
import { isEnabled, type PreviewOptionProps } from '../../preview-playgrounds/types';
import type { ComponentPageData } from '../../types';

function Preview({ pending, density }: PreviewOptionProps) {
  return (
    <ActivityExample
      pending={isEnabled(pending)}
      density={density === 'compact' ? 'compact' : 'comfortable'}
    />
  );
}

export const pageData = {
  featuredExampleId: 'agent-activity-preview',
  widePreviewIds: ['agent-activity-preview', 'agent-activity-events'],
  api: [
    {
      name: 'AgentActivity.Root',
      type: 'div props + render',
      description: '짧은 상태·이벤트 라인입니다.',
    },
    {
      name: 'pending',
      type: 'boolean',
      defaultValue: 'false',
      description:
        '기본 Indicator에 진행 표시를 적용합니다. 실행이나 자동 낭독은 시작하지 않습니다.',
    },
    {
      name: 'density',
      type: "'comfortable' | 'compact'",
      description: '생략하면 DensityProvider를 따릅니다.',
    },
    {
      name: 'AgentActivity.Indicator',
      type: 'span props + render',
      description:
        '기본 점·로더 또는 children 아이콘을 표시합니다. 기본적으로 보조 기술에서 숨겨집니다.',
    },
    {
      name: 'AgentActivity.Content',
      type: 'div props + render',
      description: '임의의 상태·이벤트 문구입니다. 긴 문구는 줄바꿈합니다.',
    },
    {
      name: 'AgentActivity.Meta',
      type: 'span props + render',
      description: '시간 등 부가 정보를 표시합니다.',
    },
  ],
  optionAxes: [
    { name: 'pending', control: 'switch', defaultValue: 'false', values: ['false', 'true'] },
    {
      name: 'density',
      control: 'segmented',
      defaultValue: 'comfortable',
      values: ['comfortable', 'compact'],
    },
  ],
  examples: [
    {
      id: 'agent-activity-preview',
      title: 'Preview',
      description: '진행 표시와 밀도를 조절합니다.',
      Component: Preview,
      configurable: true,
      filename: 'activity.tsx',
      source: activitySource,
      coverage: [
        { axis: 'pending', values: ['false', 'true'] },
        { axis: 'density', values: ['comfortable', 'compact'] },
      ],
    },
    {
      id: 'agent-activity-events',
      title: '이벤트 조합',
      description: '모델 변경과 중단을 임의의 아이콘·문구로 표시합니다.',
      Component: EventsExample,
      filename: 'events.tsx',
      source: eventsSource,
      coverage: [
        { axis: 'pending', values: ['false'] },
        { axis: 'density', values: ['compact'] },
      ],
    },
  ],
} satisfies ComponentPageData;
