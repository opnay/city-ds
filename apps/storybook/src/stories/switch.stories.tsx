import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Switch } from '@city-ds/react';

const meta = {
  title: 'Forms/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

function NotificationSwitch() {
  const [checked, setChecked] = useState(true);

  return (
    <label className="text-city-foreground flex w-fit cursor-pointer items-center gap-2 text-sm">
      <Switch
        aria-label="Enable deployment notifications"
        checked={checked}
        onCheckedChange={setChecked}
      />
      Deployment notifications
    </label>
  );
}

export const Default: Story = {
  render: () => <NotificationSwitch />,
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Switch aria-label="Small switch" size="sm" />
      <Switch aria-label="Medium switch" size="md" />
      <Switch aria-label="Large switch" size="lg" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <label className="text-city-muted-foreground flex w-fit items-center gap-2 text-sm">
      <Switch aria-label="Locked preview setting" checked disabled />
      Preview environment is locked
    </label>
  ),
};
