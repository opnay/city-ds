import { useState } from 'react';
import { AgentActivity, Button } from '@opnay/city-ds-react';
import { FileSearch, FileText, Terminal } from 'lucide-react';

export default function GroupedExample() {
  const [open, setOpen] = useState(false);
  return (
    <div className="grid gap-3">
      <AgentActivity.Root open={open} onOpenChange={setOpen}>
        <AgentActivity.Trigger>
          <AgentActivity.Indicator>
            <FileSearch />
          </AgentActivity.Indicator>
          <AgentActivity.Content>3개 파일을 검사했습니다.</AgentActivity.Content>
          <AgentActivity.Meta>09:32</AgentActivity.Meta>
        </AgentActivity.Trigger>
        <AgentActivity.Details>
          <AgentActivity.List aria-label="파일 검사 활동">
            <AgentActivity.Root>
              <AgentActivity.Indicator>
                <FileText />
              </AgentActivity.Indicator>
              <AgentActivity.Content>README.md를 읽었습니다.</AgentActivity.Content>
              <AgentActivity.Meta>09:30</AgentActivity.Meta>
            </AgentActivity.Root>
            <AgentActivity.Root>
              <AgentActivity.Trigger>
                <AgentActivity.Indicator>
                  <Terminal />
                </AgentActivity.Indicator>
                <AgentActivity.Content>package.json의 export를 확인했습니다.</AgentActivity.Content>
                <AgentActivity.Meta>09:31</AgentActivity.Meta>
              </AgentActivity.Trigger>
              <AgentActivity.Details>
                <pre tabIndex={0} aria-label="package.json export">
                  <code>{'./commentary\n./agent-activity'}</code>
                </pre>
              </AgentActivity.Details>
            </AgentActivity.Root>
            <AgentActivity.Root>
              <AgentActivity.Indicator>
                <FileText />
              </AgentActivity.Indicator>
              <AgentActivity.Content>변경할 파일 목록을 정리했습니다.</AgentActivity.Content>
              <AgentActivity.Meta>09:32</AgentActivity.Meta>
            </AgentActivity.Root>
          </AgentActivity.List>
        </AgentActivity.Details>
      </AgentActivity.Root>
      <Button size="sm" variant="outline" onClick={() => setOpen(!open)}>
        요약 {open ? '닫기' : '열기'}
      </Button>
    </div>
  );
}
