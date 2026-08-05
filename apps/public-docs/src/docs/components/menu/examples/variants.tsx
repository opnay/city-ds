import { Button } from '@opnay/city-ds-react/button';
import { Menu } from '@opnay/city-ds-react/menu';

export default function MenuVariantsExample() {
  return (
    <Menu.Root>
      <Menu.Trigger render={<Button variant="outline" />}>프로젝트 메뉴</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup>
            <Menu.Item variant="default">이름 변경</Menu.Item>
            <Menu.Separator />
            <Menu.Item variant="destructive">삭제</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
