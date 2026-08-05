import { Button } from '@opnay/city-ds-react/button';
import { Drawer } from '@opnay/city-ds-react/drawer';

const sides = ['left', 'right', 'bottom'] as const;
const sizes = ['sm', 'md', 'lg', 'xl', 'full'] as const;

export default function DrawerSidesExample() {
  return (
    <div className="city-docs-example-row">
      {sides.flatMap((side) =>
        sizes.map((size) => (
          <Drawer.Root key={`${side}-${size}`} swipeDirection={side === 'bottom' ? 'down' : side}>
            <Drawer.Trigger render={<Button variant="secondary" />}>
              {side} · {size}
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Backdrop />
              <Drawer.Viewport side={side}>
                <Drawer.Popup side={side} size={size}>
                  <Drawer.Header>
                    <div>
                      <Drawer.Title>{side} Drawer</Drawer.Title>
                      <Drawer.Description>{size} 크기의 보조 표면입니다.</Drawer.Description>
                    </div>
                  </Drawer.Header>
                  <Drawer.Body>작업 내용을 배치합니다.</Drawer.Body>
                  <Drawer.Footer>
                    <Drawer.Close render={<Button variant="secondary" />}>닫기</Drawer.Close>
                  </Drawer.Footer>
                </Drawer.Popup>
              </Drawer.Viewport>
            </Drawer.Portal>
          </Drawer.Root>
        )),
      )}
    </div>
  );
}
