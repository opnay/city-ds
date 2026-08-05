import { useState } from 'react';
import { Button } from '@opnay/city-ds-react/button';
import { Menu } from '@opnay/city-ds-react/menu';

function Items() {
  return (
    <>
      <Menu.Item>이름 변경</Menu.Item>
      <Menu.CheckboxItem defaultChecked>즐겨찾기</Menu.CheckboxItem>
    </>
  );
}

export default function MenuControlledExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="city-docs-example-row">
      <Menu.Root>
        <Menu.Trigger render={<Button variant="outline" />}>비제어 메뉴</Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner>
            <Menu.Popup>
              <Items />
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
      <Menu.Root onOpenChange={setOpen} open={open}>
        <Menu.Trigger render={<Button variant="outline" />}>제어된 메뉴</Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner>
            <Menu.Popup>
              <Items />
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </div>
  );
}
