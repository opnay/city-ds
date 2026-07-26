import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { CheckboxGroup, Field, type CheckboxGroupProps } from '@city-ds/react';

const meta = {
  title: 'Forms/Checkbox group',
  component: CheckboxGroup,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof CheckboxGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

function ChannelSelector({
  disabled,
  size,
}: {
  disabled: boolean;
  size: NonNullable<CheckboxGroupProps['size']>;
}) {
  const [value, setValue] = useState(['email']);

  return (
    <Field.Root>
      <Field.Label id="channels-label">Notification channels</Field.Label>
      <CheckboxGroup
        aria-labelledby="channels-label"
        disabled={disabled}
        onValueChange={setValue}
        size={size}
        value={value}
      >
        <CheckboxGroup.Item value="email">Email</CheckboxGroup.Item>
        <CheckboxGroup.Item value="sms">SMS</CheckboxGroup.Item>
        <CheckboxGroup.Item value="push">Push</CheckboxGroup.Item>
      </CheckboxGroup>
      <Field.Description>Selected: {value.join(', ') || 'none'}</Field.Description>
    </Field.Root>
  );
}

export const Default: Story = {
  args: {
    disabled: false,
    size: 'md',
  },
  render: (args) => <ChannelSelector disabled={args.disabled ?? false} size={args.size ?? 'md'} />,
};

export const Sizes: Story = {
  render: () => (
    <div className="grid gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <CheckboxGroup
          aria-label={`${size} notification channels`}
          defaultValue={['email']}
          key={size}
          size={size}
        >
          <CheckboxGroup.Item value="email">Email</CheckboxGroup.Item>
          <CheckboxGroup.Item value="sms">SMS</CheckboxGroup.Item>
        </CheckboxGroup>
      ))}
    </div>
  ),
};

export const Required: Story = {
  render: () => (
    <Field.Root>
      <Field.Label id="required-channels-label">Required channels</Field.Label>
      <CheckboxGroup aria-labelledby="required-channels-label">
        <CheckboxGroup.Item name="channels" required value="email">
          Email
        </CheckboxGroup.Item>
        <CheckboxGroup.Item name="channels" value="sms">
          SMS
        </CheckboxGroup.Item>
      </CheckboxGroup>
      <Field.Description>Choose at least one delivery channel.</Field.Description>
    </Field.Root>
  ),
};

export const Error: Story = {
  render: () => (
    <Field.Root invalid>
      <Field.Label id="error-channels-label">Notification channels</Field.Label>
      <CheckboxGroup aria-labelledby="error-channels-label">
        <CheckboxGroup.Item name="channels" required value="email">
          Email
        </CheckboxGroup.Item>
        <CheckboxGroup.Item name="channels" value="sms">
          SMS
        </CheckboxGroup.Item>
      </CheckboxGroup>
      <Field.Error match>Select at least one channel.</Field.Error>
    </Field.Root>
  ),
};

export const Disabled: Story = {
  render: () => (
    <CheckboxGroup aria-label="Locked channels" defaultValue={['email']} disabled>
      <CheckboxGroup.Item value="email">Email</CheckboxGroup.Item>
      <CheckboxGroup.Item value="sms">SMS</CheckboxGroup.Item>
    </CheckboxGroup>
  ),
};
