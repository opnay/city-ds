import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from '@city-ds/react';

const meta = {
  title: 'Data display/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: {
    children: 'Stable',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'subtle', 'outline', 'destructive'],
    },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="solid">Stable</Badge>
      <Badge variant="subtle">Draft</Badge>
      <Badge variant="outline">v2.1.0</Badge>
      <Badge variant="destructive">Failed</Badge>
    </div>
  ),
};

export const RenderedAsLink: Story = {
  render: () => (
    <Badge render={<a href="https://github.com" />} variant="outline">
      View release
    </Badge>
  ),
};
