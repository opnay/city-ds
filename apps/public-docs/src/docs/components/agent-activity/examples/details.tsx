import { useState } from 'react';
import { AgentActivity, Button } from '@opnay/city-ds-react';
import { Terminal } from 'lucide-react';

export default function DetailsExample() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(true);
  return (
    <div className="grid gap-3">
      <AgentActivity.Root pending={pending} open={open} onOpenChange={setOpen}>
        <AgentActivity.Trigger>
          <AgentActivity.Indicator>
            <Terminal />
          </AgentActivity.Indicator>
          <AgentActivity.Content>문서 검색 도구를 실행하고 있습니다.</AgentActivity.Content>
          <AgentActivity.Meta>지금</AgentActivity.Meta>
        </AgentActivity.Trigger>
        <AgentActivity.Details>
          <pre tabIndex={0} aria-label="검색 도구 입력">
            <code>{'{ "query": "accessibility" }'}</code>
          </pre>
        </AgentActivity.Details>
      </AgentActivity.Root>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => setOpen(!open)}>
          외부에서 상세 {open ? '닫기' : '열기'}
        </Button>
        <Button size="sm" variant="outline" onClick={() => setPending(!pending)}>
          진행 상태 전환
        </Button>
      </div>
    </div>
  );
}
