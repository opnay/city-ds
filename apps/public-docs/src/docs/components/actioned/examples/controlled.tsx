import { useState } from 'react';
import { Actioned, Button } from '@opnay/city-ds-react';

export default function ControlledExample() {
  const [open, setOpen] = useState(false);
  const [completed, setCompleted] = useState(false);
  return (
    <div className="grid gap-3">
      <Actioned.Root
        status={completed ? 'completed' : 'running'}
        open={open}
        onOpenChange={setOpen}
      >
        <Actioned.Header>
          <Actioned.Trigger>검색 결과</Actioned.Trigger>
          <Actioned.Status />
        </Actioned.Header>
        <Actioned.Content>상태가 바뀌어도 사용자가 선택한 펼침 상태를 유지합니다.</Actioned.Content>
      </Actioned.Root>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => setOpen(!open)}>
          외부에서 상세 {open ? '닫기' : '열기'}
        </Button>
        <Button size="sm" variant="outline" onClick={() => setCompleted(!completed)}>
          상태 전환
        </Button>
      </div>
    </div>
  );
}
