import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { Avatar, type AvatarShape, type AvatarSize } from '@opnay/city-ds-react';

const avatarImage =
  'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2080%2080%22%3E%3Crect%20width%3D%2280%22%20height%3D%2280%22%20fill%3D%22%23181818%22%2F%3E%3Ccircle%20cx%3D%2240%22%20cy%3D%2230%22%20r%3D%2213%22%20fill%3D%22%23f7f7f7%22%2F%3E%3Cpath%20d%3D%22M20%2064c4-14%2036-14%2040%200%22%20fill%3D%22%23f7f7f7%22%2F%3E%3C%2Fsvg%3E';

function ProfileAvatar({
  shape = 'circle',
  size = 'md',
}: {
  shape?: AvatarShape;
  size?: AvatarSize;
}) {
  return (
    <Avatar.Root shape={shape} size={size}>
      <Avatar.Image alt="Inseop profile photo" src={avatarImage} />
      <Avatar.Fallback>IS</Avatar.Fallback>
    </Avatar.Root>
  );
}

const meta = {
  title: 'Data display/Avatar',
  component: ProfileAvatar,
  tags: ['autodocs'],
  argTypes: {
    shape: { control: 'inline-radio', options: ['circle', 'square'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          '이미지 로딩 상태에 따라 Avatar.Image와 Avatar.Fallback을 조합합니다. 원형은 프로필에, 사각형은 제품·조직 식별자에 사용합니다.',
      },
    },
  },
} satisfies Meta<typeof ProfileAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Image: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByRole('img', { name: 'Inseop profile photo' })).toBeVisible();
  },
  render: (args) => <ProfileAvatar {...args} />,
};

export const Fallback: Story = {
  render: () => (
    <Avatar.Root shape="square" size="lg">
      <Avatar.Fallback>IS</Avatar.Fallback>
    </Avatar.Root>
  ),
};

export const ShapesAndSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div className="flex items-center gap-2" key={size}>
          <ProfileAvatar size={size} />
          <ProfileAvatar shape="square" size={size} />
        </div>
      ))}
    </div>
  ),
};
