import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Menu } from '@city-ds/react';
import type { ReactNode } from 'react';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';

const meta = {
  title: 'Navigation/Menu',
  component: Menu.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Menu.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

function MenuFrame({ children }: { children: ReactNode }) {
  return (
    <Menu.Root>
      <Menu.Trigger aria-label="Row actions">Actions</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={6}>
          <Menu.Popup>
            <Menu.ScrollUpIndicator data-testid="menu-scroll-up" />
            {children}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Row actions' }));

    const menu = await within(document.body).findByRole('menu', { name: 'Row actions' });
    await expect(within(menu).getByTestId('menu-scroll-up')).not.toHaveAttribute('data-visible');
  },
  render: () => (
    <MenuFrame>
      <Menu.Item>Open</Menu.Item>
      <Menu.Item>Duplicate</Menu.Item>
      <Menu.Separator />
      <Menu.Item variant="destructive">Archive</Menu.Item>
    </MenuFrame>
  ),
};

export const Grouped: Story = {
  render: () => (
    <MenuFrame>
      <Menu.Group>
        <Menu.GroupLabel>Project</Menu.GroupLabel>
        <Menu.Item>Rename</Menu.Item>
        <Menu.Item>Move</Menu.Item>
      </Menu.Group>
      <Menu.Separator />
      <Menu.Group>
        <Menu.GroupLabel>Danger zone</Menu.GroupLabel>
        <Menu.Item variant="destructive">Archive</Menu.Item>
      </Menu.Group>
    </MenuFrame>
  ),
};

export const SelectionItems: Story = {
  render: () => (
    <MenuFrame>
      <Menu.CheckboxItem defaultChecked>
        <Menu.CheckboxItemIndicator />
        Show completed tasks
      </Menu.CheckboxItem>
      <Menu.Separator />
      <Menu.RadioGroup defaultValue="comfortable">
        <Menu.RadioItem value="compact">
          <Menu.RadioItemIndicator />
          Compact
        </Menu.RadioItem>
        <Menu.RadioItem value="comfortable">
          <Menu.RadioItemIndicator />
          Comfortable
        </Menu.RadioItem>
      </Menu.RadioGroup>
    </MenuFrame>
  ),
};

export const Submenu: Story = {
  render: () => (
    <MenuFrame>
      <Menu.Item>Open</Menu.Item>
      <Menu.SubmenuRoot>
        <Menu.SubmenuTrigger>Share</Menu.SubmenuTrigger>
        <Menu.Portal>
          <Menu.Positioner sideOffset={8}>
            <Menu.Popup>
              <Menu.Item>Copy link</Menu.Item>
              <Menu.LinkItem href="https://example.com">Open public page</Menu.LinkItem>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.SubmenuRoot>
    </MenuFrame>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Menu.Root disabled>
      <Menu.Trigger render={<Button variant="outline" />}>Unavailable actions</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={6}>
          <Menu.Popup>
            <Menu.Item>Open</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  ),
};

export const LongContent: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Row actions' }));

    const menu = await within(document.body).findByRole('menu', { name: 'Row actions' });
    const scrollUpIndicator = within(menu).getByTestId('menu-scroll-up');

    await expect(scrollUpIndicator).not.toHaveAttribute('data-visible');
    await expect(menu).toHaveClass(
      'max-h-(--available-height)',
      'overflow-y-auto',
      'overscroll-contain',
    );
    await expect(menu.scrollHeight).toBeGreaterThan(menu.clientHeight);

    await fireEvent.scroll(menu, { target: { scrollTop: 64 } });
    await waitFor(() => expect(scrollUpIndicator).toHaveAttribute('data-visible'));

    const indicatorSurface = scrollUpIndicator.firstElementChild;
    if (!(indicatorSurface instanceof HTMLElement)) {
      throw new Error('Menu scroll indicator surface is missing');
    }

    const menuRect = menu.getBoundingClientRect();
    const menuStyle = getComputedStyle(menu);
    const indicatorRect = indicatorSurface.getBoundingClientRect();
    const innerTop = menuRect.top + Number.parseFloat(menuStyle.borderTopWidth);
    const innerLeft = menuRect.left + Number.parseFloat(menuStyle.borderLeftWidth);
    const innerRight = menuRect.right - Number.parseFloat(menuStyle.borderRightWidth);

    await expect(indicatorRect.top).toBeLessThanOrEqual(innerTop);
    await expect(indicatorRect.left).toBeLessThanOrEqual(innerLeft);
    await expect(indicatorRect.right).toBeGreaterThanOrEqual(innerRight);

    await fireEvent.scroll(menu, { target: { scrollTop: 0 } });
    await waitFor(() => expect(scrollUpIndicator).not.toHaveAttribute('data-visible'));
  },
  render: () => (
    <MenuFrame>
      {Array.from({ length: 32 }, (_, index) => (
        <Menu.Item key={index}>Action {index + 1}</Menu.Item>
      ))}
    </MenuFrame>
  ),
};
