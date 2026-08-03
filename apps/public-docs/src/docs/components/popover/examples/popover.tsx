import { useState } from 'react';
import { Button } from '@opnay/city-ds-react/button';
import { Popover } from '@opnay/city-ds-react/popover';

const sides = ['top', 'right', 'bottom', 'left'] as const;
const aligns = ['start', 'center', 'end'] as const;

type Align = (typeof aligns)[number];
type Side = (typeof sides)[number];

function Contents({ align, side }: { align: Align; side: Side }) {
  return (
    <Popover.Portal>
      <Popover.Positioner align={align} side={side} sideOffset={8}>
        <Popover.Popup>
          <Popover.Title>{`${side} · ${align} 필터`}</Popover.Title>
          <Popover.Description>결과에 반영할 상태를 선택하십시오.</Popover.Description>
          <Popover.Close>닫기</Popover.Close>
          <Popover.Arrow />
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  );
}
export default function PopoverExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="city-docs-example-row">
      {sides.flatMap((side) =>
        aligns.map((align, index) => (
          <Popover.Root key={`${side}-${align}`} modal={side === 'top' && index === 0}>
            <Popover.Trigger>{`${side} · ${align}`}</Popover.Trigger>
            <Contents align={align} side={side} />
          </Popover.Root>
        )),
      )}
      <Button onClick={() => setOpen((value) => !value)}>외부 제어</Button>
      <Popover.Root onOpenChange={setOpen} open={open}>
        <Popover.Trigger>제어된 패널</Popover.Trigger>
        <Contents align="center" side="top" />
      </Popover.Root>
    </div>
  );
}
