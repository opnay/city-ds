import { AgentActivity, DensityProvider } from '@opnay/city-ds-react';
import { ArrowRightLeft, Ban } from 'lucide-react';

export default function EventsExample() {
  return (
    <DensityProvider density="compact" className="grid gap-2">
      <AgentActivity.Root>
        <AgentActivity.Indicator>
          <ArrowRightLeft />
        </AgentActivity.Indicator>
        <AgentActivity.Content>
          모델을 research-model-2026-09-extended-context-with-a-long-name으로 변경했습니다.
        </AgentActivity.Content>
        <AgentActivity.Meta>09:31</AgentActivity.Meta>
      </AgentActivity.Root>
      <AgentActivity.Root>
        <AgentActivity.Indicator>
          <Ban />
        </AgentActivity.Indicator>
        <AgentActivity.Content>사용자가 작업을 중단했습니다.</AgentActivity.Content>
      </AgentActivity.Root>
    </DensityProvider>
  );
}
