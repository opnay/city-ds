import { AgentActivity, DensityProvider } from '@opnay/city-ds-react';
import { ArrowRightLeft, Ban, Terminal } from 'lucide-react';

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
      <AgentActivity.Root>
        <AgentActivity.Trigger>
          <AgentActivity.Indicator>
            <Terminal />
          </AgentActivity.Indicator>
          <AgentActivity.Content>프로젝트 파일을 읽었습니다.</AgentActivity.Content>
          <AgentActivity.Meta>09:32</AgentActivity.Meta>
        </AgentActivity.Trigger>
        <AgentActivity.Details>
          <pre tabIndex={0} aria-label="파일 읽기 입력">
            <code>{'{ "path": "README.md" }'}</code>
          </pre>
        </AgentActivity.Details>
      </AgentActivity.Root>
    </DensityProvider>
  );
}
