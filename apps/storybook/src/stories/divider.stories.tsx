import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { Divider } from '@opnay/city-ds-react';

const meta = {
  title: 'Layout/Divider',
  component: Divider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '일반 Divider는 콘텐츠를 시각적으로 구분하고, plain Divider는 가로선 가운데에 접근 가능한 라벨을 제공합니다.',
      },
    },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="grid w-[min(24rem,calc(100vw-2rem))] gap-3 text-sm">
      <span>Current deployment</span>
      <Divider />
      <span>Previous deployment</span>
    </div>
  ),
};

export const Plain: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('separator', { name: 'Deployment stages' })).toBeVisible();
  },
  render: () => (
    <div className="grid w-[min(24rem,calc(100vw-2rem))] gap-3 text-sm">
      <span>Build</span>
      <Divider plain>Deployment stages</Divider>
      <span>Release</span>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-24 items-stretch gap-4 text-sm">
      <span className="flex items-center">Build</span>
      <Divider orientation="vertical" />
      <span className="flex items-center">Deploy</span>
    </div>
  ),
};
