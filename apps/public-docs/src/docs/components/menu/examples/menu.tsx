import { useState } from 'react';
import { Button } from '@opnay/city-ds-react/button';
import { Menu } from '@opnay/city-ds-react/menu';

function Items() {
  return (
    <>
      <Menu.Item onClick={() => undefined}>이름 변경</Menu.Item>
      <Menu.CheckboxItem defaultChecked>즐겨찾기</Menu.CheckboxItem>
      <Menu.Separator />
      <Menu.Item variant="destructive">삭제</Menu.Item>
    </>
  );
}
export default function MenuExample() {
  const [compactOpen, setCompactOpen] = useState(true);

  return (
    <div className="city-docs-example-row">
      <Menu.Root>
        <Menu.Trigger render={<Button variant="outline" />}>기본 메뉴</Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner>
            <Menu.Popup>
              <Items />
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
      <Menu.Root density="compact" onOpenChange={setCompactOpen} open={compactOpen}>
        <Menu.Trigger render={<Button variant="outline" />}>작은 메뉴</Menu.Trigger>
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
