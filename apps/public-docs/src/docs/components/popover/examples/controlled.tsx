import { useState } from 'react';
import { Button } from '@opnay/city-ds-react/button';
import { Popover } from '@opnay/city-ds-react/popover';

function Contents() {
  return (
    <Popover.Portal>
      <Popover.Positioner sideOffset={8}>
        <Popover.Popup>
          <Popover.Title>상태 필터</Popover.Title>
          <Popover.Description>결과에 반영할 상태를 선택하십시오.</Popover.Description>
          <Popover.Close>닫기</Popover.Close>
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  );
}

export default function PopoverControlledExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="city-docs-example-row">
      <Popover.Root>
        <Popover.Trigger>비제어 패널</Popover.Trigger>
        <Contents />
      </Popover.Root>
      <Button onClick={() => setOpen((value) => !value)}>외부 제어</Button>
      <Popover.Root onOpenChange={setOpen} open={open}>
        <Popover.Trigger>제어된 패널</Popover.Trigger>
        <Contents />
      </Popover.Root>
    </div>
  );
}
