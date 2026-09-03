import { Popover } from '@opnay/city-ds-react/popover';

const sides = ['top', 'right', 'bottom', 'left'] as const;
const aligns = ['start', 'center', 'end'] as const;
const sideLabels = { top: '위', right: '오른쪽', bottom: '아래', left: '왼쪽' } as const;
const alignLabels = { start: '시작', center: '가운데', end: '끝' } as const;

export default function PopoverPlacementsExample() {
  return (
    <div className="city-docs-example-matrix">
      {sides.map((side) => (
        <section className="city-docs-example-item" key={side}>
          <strong>{sideLabels[side]} 방향</strong>
          <p>트리거를 기준으로 정렬 위치를 비교합니다.</p>
          <div className="city-docs-example-row">
            {aligns.map((align) => (
              <Popover.Root key={`${side}-${align}`}>
                <Popover.Trigger>{alignLabels[align]}</Popover.Trigger>
                <Popover.Portal>
                  <Popover.Positioner align={align} side={side} sideOffset={8}>
                    <Popover.Popup>
                      <Popover.Title>{`${sideLabels[side]} · ${alignLabels[align]} 정렬`}</Popover.Title>
                      <Popover.Description>
                        트리거의 {alignLabels[align]} 지점을 기준으로 배치됩니다.
                      </Popover.Description>
                      <div className="mt-4 flex justify-end">
                        <Popover.Close>확인</Popover.Close>
                      </div>
                      <Popover.Arrow />
                    </Popover.Popup>
                  </Popover.Positioner>
                </Popover.Portal>
              </Popover.Root>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
