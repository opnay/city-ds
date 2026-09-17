import { ACTIONED_STATUSES } from '@opnay/city-ds-react';
import ToolExample from './examples/tool';
import toolSource from './examples/tool.tsx?raw';
import ControlledExample from './examples/controlled';
import controlledSource from './examples/controlled.tsx?raw';
import ConversationExample from './examples/conversation';
import conversationSource from './examples/conversation.tsx?raw';
import { isEnabled, type PreviewOptionProps } from '../../preview-playgrounds/types';
import type { ComponentPageData } from '../../types';

function Preview({ status, density, defaultOpen }: PreviewOptionProps) {
  const resolvedStatus = ACTIONED_STATUSES.find((value) => value === status) ?? 'queued';
  return (
    <ToolExample
      key={String(defaultOpen)}
      status={resolvedStatus}
      density={density === 'compact' ? 'compact' : 'comfortable'}
      defaultOpen={isEnabled(defaultOpen)}
    />
  );
}

export const pageData = {
  featuredExampleId: 'actioned-preview',
  widePreviewIds: ['actioned-preview', 'actioned-controlled', 'actioned-conversation'],
  api: [
    {
      name: 'Actioned.Root',
      type: 'Base UI Collapsible.Root props + status',
      description: '실행 상태와 상세 펼침 상태를 독립적으로 관리합니다.',
    },
    {
      name: 'status',
      type: "'queued' | 'approval-required' | 'running' | 'completed' | 'failed' | 'cancelled' | 'rejected'",
      description:
        '필수 속성입니다. 소비자가 전달하며 승인·재시도 동작으로 자동 변경되지 않습니다.',
    },
    {
      name: 'density',
      type: "'comfortable' | 'compact'",
      description: '생략하면 DensityProvider를 따릅니다.',
    },
    {
      name: 'open / defaultOpen / onOpenChange',
      type: 'boolean / boolean / (open, eventDetails) => void',
      defaultValue: 'false (defaultOpen)',
      description: 'Base UI controlled/uncontrolled API입니다. defaultOpen은 최초에만 적용됩니다.',
    },
    {
      name: 'Actioned.Header',
      type: 'div props + render',
      description: 'Trigger와 Status를 조합합니다.',
    },
    {
      name: 'Actioned.Trigger',
      type: 'Base UI Collapsible.Trigger props',
      description: '상세를 여닫는 버튼입니다. 승인·재시도 버튼을 안에 넣지 마십시오.',
    },
    {
      name: 'Actioned.Status',
      type: 'span props + render',
      description:
        '상태 아이콘과 기본 영문 문구를 제공합니다. children으로 표시 문구를 바꿀 수 있습니다.',
    },
    {
      name: 'Actioned.Content',
      type: 'Base UI Collapsible.Panel props',
      description: '도구 입력·결과·오류 상세입니다. keepMounted와 hiddenUntilFound도 지원합니다.',
    },
    {
      name: 'Actioned.Approval',
      type: 'div props + render',
      description: '상세 접힘과 독립적입니다. 소비자가 승인 상태에 맞춰 조건부 렌더링합니다.',
    },
    {
      name: 'Actioned.Actions',
      type: 'div props + render',
      description: '기존 Button과 승인·거절·재시도 콜백을 조합합니다.',
    },
  ],
  optionAxes: [
    { name: 'status', control: 'select', defaultValue: 'queued', values: ACTIONED_STATUSES },
    {
      name: 'density',
      control: 'segmented',
      defaultValue: 'comfortable',
      values: ['comfortable', 'compact'],
    },
    { name: 'defaultOpen', control: 'switch', defaultValue: 'false', values: ['false', 'true'] },
  ],
  examples: [
    {
      id: 'actioned-preview',
      title: 'Preview',
      description:
        '상태·밀도·초기 펼침을 비교합니다. 초기 펼침 옵션을 바꾸면 예제를 다시 마운트합니다.',
      Component: Preview,
      configurable: true,
      filename: 'tool.tsx',
      source: toolSource,
      coverage: [
        { axis: 'status', values: ACTIONED_STATUSES },
        { axis: 'density', values: ['comfortable', 'compact'] },
        { axis: 'defaultOpen', values: ['false', 'true'] },
      ],
    },
    {
      id: 'actioned-controlled',
      title: '외부에서 펼침 제어',
      description: '상태를 바꾸어도 열림을 유지합니다.',
      Component: ControlledExample,
      filename: 'controlled.tsx',
      source: controlledSource,
      coverage: [
        { axis: 'open', values: ['controlled'] },
        { axis: 'status', values: ['running', 'completed'] },
      ],
    },
    {
      id: 'actioned-conversation',
      title: '대화 흐름',
      description:
        '메시지 → Thinking → 승인 요청 → 도구 실행 → 응답을 진행하고 거절·실패·취소를 비교합니다.',
      Component: ConversationExample,
      filename: 'conversation.tsx',
      source: conversationSource,
      coverage: [
        {
          axis: 'status',
          values: ['approval-required', 'running', 'completed', 'failed', 'cancelled', 'rejected'],
        },
        { axis: 'approval', values: ['allow', 'reject', 'retry'] },
      ],
    },
  ],
} satisfies ComponentPageData;
