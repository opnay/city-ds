import { AgentActivity, type AgentActivityRootProps } from '@opnay/city-ds-react';

export default function ActivityExample({
  pending = false,
  density = 'comfortable',
}: Pick<AgentActivityRootProps, 'pending' | 'density'>) {
  return (
    <AgentActivity.Root pending={pending} density={density}>
      <AgentActivity.Indicator />
      <AgentActivity.Content>
        {pending ? 'Thinking — 답변에 필요한 자료를 검토하고 있습니다.' : '자료 검토를 마쳤습니다.'}
      </AgentActivity.Content>
      <AgentActivity.Meta render={<time dateTime="2026-09-17T09:30:00+09:00" />}>
        09:30
      </AgentActivity.Meta>
    </AgentActivity.Root>
  );
}
