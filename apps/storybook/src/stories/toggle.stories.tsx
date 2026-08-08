import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import { Toggle } from '@opnay/city-ds-react';

const meta = {
  title: 'Actions/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  args: {
    children: 'Bold',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
    },
    size: {
      control: 'inline-radio',
      options: ['xsm', 'sm', 'md', 'lg', 'xlg'],
    },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Text: Story = {};

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Toggle defaultPressed>
        <span aria-hidden="true" className="font-bold">
          B
        </span>
        Bold
      </Toggle>
      <Toggle variant="secondary">
        <span aria-hidden="true">📌</span>
        Pin
      </Toggle>
    </div>
  ),
};

export const IconOnly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Icon-only toggles must provide an accessible name with `aria-label` or `aria-labelledby` because the icon is hidden from assistive technology.',
      },
    },
  },
  render: () => (
    <Toggle aria-label="Add to favorites" defaultPressed size="sm" variant="ghost">
      <span aria-hidden="true">★</span>
    </Toggle>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Toggle>Unpressed</Toggle>
      <Toggle defaultPressed>Pressed</Toggle>
      <Toggle disabled>Disabled</Toggle>
      <Toggle defaultPressed disabled>
        Pressed disabled
      </Toggle>
    </div>
  ),
};

function ControlledToggle() {
  const [pressed, setPressed] = useState(false);

  return (
    <Toggle pressed={pressed} onPressedChange={setPressed}>
      {pressed ? 'Pinned' : 'Pin'}
    </Toggle>
  );
}

export const Controlled: Story = {
  render: () => <ControlledToggle />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: 'Pin' });

    await userEvent.click(toggle);

    await expect(canvas.getByRole('button', { name: 'Pinned' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  },
};
