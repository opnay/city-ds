import { useState } from 'react';
import { Tooltip } from '@opnay/city-ds-react/tooltip';
const sides = ['top', 'right', 'bottom', 'left'] as const;

function Contents({ side }: { side: (typeof sides)[number] }) {
  return (
    <Tooltip.Portal>
      <Tooltip.Positioner side={side} sideOffset={8}>
        <Tooltip.Popup>
          승인된 변경 요청이 필요합니다.
          <Tooltip.Arrow />
        </Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  );
}

export default function TooltipExample() {
  const [open, setOpen] = useState(false);

  return (
    <Tooltip.Provider delay={0}>
      <div className="city-docs-example-row">
        {sides.map((side) => (
          <Tooltip.Root key={side}>
            <Tooltip.Trigger aria-label={`${side} 배포 정보`}>{side}</Tooltip.Trigger>
            <Contents side={side} />
          </Tooltip.Root>
        ))}
        <Tooltip.Root onOpenChange={setOpen} open={open}>
          <Tooltip.Trigger aria-label="제어된 배포 정보">controlled</Tooltip.Trigger>
          <Contents side="top" />
        </Tooltip.Root>
      </div>
    </Tooltip.Provider>
  );
}
