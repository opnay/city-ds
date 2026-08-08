import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Checkbox } from '@opnay/city-ds-react';

const meta = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['xsm', 'sm', 'md', 'lg', 'xlg'],
    },
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

function CheckboxControl() {
  const [checked, setChecked] = useState(false);

  return (
    <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-city-foreground">
      <Checkbox
        aria-label="Enable automatic deployments"
        checked={checked}
        onCheckedChange={setChecked}
      />
      Enable automatic deployments
    </label>
  );
}

export const Default: Story = {
  render: () => <CheckboxControl />,
};

export const Indeterminate: Story = {
  render: () => (
    <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-city-foreground">
      <Checkbox aria-label="Select some deployments" indeterminate />
      Select all deployments
    </label>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="grid gap-3">
      {(['xsm', 'sm', 'md', 'lg', 'xlg'] as const).map((size) => (
        <Checkbox aria-label={`${size} checkbox`} key={size} size={size} />
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <label className="flex w-fit items-center gap-2 text-sm text-city-muted-foreground">
      <Checkbox aria-label="Locked deployment setting" checked disabled />
      Automatic deployments are managed by policy
    </label>
  ),
};
