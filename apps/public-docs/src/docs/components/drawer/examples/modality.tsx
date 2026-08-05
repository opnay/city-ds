import { Button } from '@opnay/city-ds-react/button';
import { Drawer } from '@opnay/city-ds-react/drawer';

function DrawerContents() {
  return (
    <Drawer.Popup side="right" size="md">
      <Drawer.Header>
        <div>
          <Drawer.Title>right Drawer</Drawer.Title>
          <Drawer.Description>모달 동작을 문맥에 맞게 선택합니다.</Drawer.Description>
        </div>
      </Drawer.Header>
      <Drawer.Body>작업 내용을 배치합니다.</Drawer.Body>
      <Drawer.Footer>
        <Drawer.Close render={<Button variant="secondary" />}>닫기</Drawer.Close>
      </Drawer.Footer>
    </Drawer.Popup>
  );
}

export default function DrawerModalityExample() {
  return (
    <div className="city-docs-example-row">
      <Drawer.Root modal>
        <Drawer.Trigger render={<Button variant="secondary" />}>right · md · modal</Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Backdrop data-docs-drawer-backdrop="" />
          <Drawer.Viewport side="right">
            <DrawerContents />
          </Drawer.Viewport>
        </Drawer.Portal>
      </Drawer.Root>
      <Drawer.Root modal={false}>
        <Drawer.Trigger render={<Button variant="secondary" />}>
          right · md · non-modal
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Viewport className="city-docs-nonmodal-drawer-viewport" side="right">
            <DrawerContents />
          </Drawer.Viewport>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}
