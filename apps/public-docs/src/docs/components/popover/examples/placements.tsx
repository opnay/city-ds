import { Popover } from '@opnay/city-ds-react/popover';

const sides = ['top', 'right', 'bottom', 'left'] as const;
const aligns = ['start', 'center', 'end'] as const;

export default function PopoverPlacementsExample() {
  return (
    <div className="city-docs-example-row">
      {sides.flatMap((side) =>
        aligns.map((align) => (
          <Popover.Root key={`${side}-${align}`}>
            <Popover.Trigger>{`${side} · ${align}`}</Popover.Trigger>
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
          </Popover.Root>
        )),
      )}
    </div>
  );
}
