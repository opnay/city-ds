import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import { Button } from '@city-ds/react';

const meta = {
  title: 'Actions/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Deploy',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="primary">Deploy</Button>
      <Button variant="secondary">Preview</Button>
      <Button variant="outline">Duplicate</Button>
      <Button variant="ghost">Dismiss</Button>
      <Button variant="destructive">Delete</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Button size="sm">Compact</Button>
      <Button size="md">Default</Button>
      <Button size="lg">Prominent</Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Deploy',
  },
};

export const FocusVisible: Story = {
  args: {
    children: 'Keyboard focus',
  },
  parameters: {
    docs: {
      autoplay: true,
    },
  },
  play: async ({ canvasElement }) => {
    await userEvent.tab();
    await expect(within(canvasElement).getByRole('button')).toHaveFocus();
  },
};

function CounterButton() {
  const [count, setCount] = useState(0);

  return (
    <Button
      aria-label="Increment deployment counter"
      onClick={() => setCount((value) => value + 1)}
    >
      Deployments: {count}
    </Button>
  );
}

export const Interactive: Story = {
  render: () => <CounterButton />,
};

export const RenderedAsLink: Story = {
  render: () => (
    <Button render={<a href="https://base-ui.com" />} variant="outline">
      Open Base UI
    </Button>
  ),
};
