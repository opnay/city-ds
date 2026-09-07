import type { Meta, StoryObj } from '@storybook/react-vite';

import { Kbd } from '@opnay/city-ds-react';

const meta = {
  title: 'Data display/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  args: {
    children: '⌘ K',
    size: 'md',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    children: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          '키와 단축키를 native kbd 요소로 표기합니다. 키 이벤트나 운영체제 감지는 수행하지 않습니다.',
      },
    },
  },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Kbd size="sm">⌘ K</Kbd>
      <Kbd size="md">⌘ K</Kbd>
      <Kbd size="lg">⌘ K</Kbd>
    </div>
  ),
};

export const Shortcut: Story = {
  render: () => <Kbd>⌘ K</Kbd>,
};
