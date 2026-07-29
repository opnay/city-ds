import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { RadioGroup } from '@opnay/city-ds-react';

const meta = {
  title: 'Forms/Radio group',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

function ThemeSelector() {
  const [value, setValue] = useState('system');

  return (
    <RadioGroup aria-label="Color theme" onValueChange={setValue} value={value}>
      <RadioGroup.Item value="system">System</RadioGroup.Item>
      <RadioGroup.Item value="light">Light</RadioGroup.Item>
      <RadioGroup.Item value="dark">Dark</RadioGroup.Item>
    </RadioGroup>
  );
}

export const Default: Story = {
  render: () => <ThemeSelector />,
};

export const Sizes: Story = {
  render: () => (
    <div className="grid gap-4">
      <RadioGroup aria-label="Small density" defaultValue="comfortable" size="sm">
        <RadioGroup.Item value="compact">Compact</RadioGroup.Item>
        <RadioGroup.Item value="comfortable">Comfortable</RadioGroup.Item>
      </RadioGroup>
      <RadioGroup aria-label="Large density" defaultValue="comfortable" size="lg">
        <RadioGroup.Item value="compact">Compact</RadioGroup.Item>
        <RadioGroup.Item value="comfortable">Comfortable</RadioGroup.Item>
      </RadioGroup>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup aria-label="Locked environment" defaultValue="production" disabled>
      <RadioGroup.Item value="preview">Preview</RadioGroup.Item>
      <RadioGroup.Item value="production">Production</RadioGroup.Item>
    </RadioGroup>
  ),
};
