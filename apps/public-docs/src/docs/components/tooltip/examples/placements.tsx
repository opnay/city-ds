import { Tooltip } from '@opnay/city-ds-react/tooltip';

const sides = ['top', 'right', 'bottom', 'left'] as const;

export default function TooltipPlacementsExample() {
  return (
    <Tooltip.Provider delay={0}>
      <div className="city-docs-example-row">
        {sides.map((side) => (
          <Tooltip.Root key={side}>
            <Tooltip.Trigger aria-label={`${side} 배포 정보`}>{side}</Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Positioner side={side} sideOffset={8}>
                <Tooltip.Popup>
                  승인된 변경 요청이 필요합니다.
                  <Tooltip.Arrow />
                </Tooltip.Popup>
              </Tooltip.Positioner>
            </Tooltip.Portal>
          </Tooltip.Root>
        ))}
      </div>
    </Tooltip.Provider>
  );
}
