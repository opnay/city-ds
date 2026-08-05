import { useState } from 'react';
import { Tooltip } from '@opnay/city-ds-react/tooltip';

function Contents() {
  return (
    <Tooltip.Portal>
      <Tooltip.Positioner side="top" sideOffset={8}>
        <Tooltip.Popup>
          승인된 변경 요청이 필요합니다.
          <Tooltip.Arrow />
        </Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  );
}

export default function TooltipControlledExample() {
  const [open, setOpen] = useState(false);

  return (
    <Tooltip.Provider delay={0}>
      <div className="city-docs-example-row">
        <Tooltip.Root>
          <Tooltip.Trigger aria-label="비제어 배포 정보">uncontrolled</Tooltip.Trigger>
          <Contents />
        </Tooltip.Root>
        <Tooltip.Root onOpenChange={setOpen} open={open}>
          <Tooltip.Trigger aria-label="제어된 배포 정보">controlled</Tooltip.Trigger>
          <Contents />
        </Tooltip.Root>
      </div>
    </Tooltip.Provider>
  );
}
