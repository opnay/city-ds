import { Button } from '@opnay/city-ds-react/button';
import { Menu } from '@opnay/city-ds-react/menu';

const densities = ['comfortable', 'compact'] as const;

export default function MenuDensityExample() {
  return (
    <div className="city-docs-example-row">
      {densities.map((density) => (
        <Menu.Root density={density} key={density}>
          <Menu.Trigger render={<Button variant="outline" />}>{density} 메뉴</Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner>
              <Menu.Popup>
                <Menu.Item>이름 변경</Menu.Item>
                <Menu.Item>복제</Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      ))}
    </div>
  );
}
