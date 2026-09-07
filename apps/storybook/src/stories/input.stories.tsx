import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input, InputGroup, Textarea } from '@opnay/city-ds-react';

const meta = {
  title: 'Inputs/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    placeholder: 'Search projects',
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['xsm', 'sm', 'md', 'lg', 'xlg'],
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search', 'url'],
    },
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <label className="grid w-80 gap-1.5 text-sm font-medium text-city-foreground">
      Search projects
      <Input {...args} aria-label="Search projects" />
    </label>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="grid w-80 gap-3">
      {(['xsm', 'sm', 'md', 'lg', 'xlg'] as const).map((size) => (
        <Input
          aria-label={`${size} project name`}
          key={size}
          placeholder={size.toUpperCase()}
          size={size}
        />
      ))}
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <label className="grid w-80 gap-1.5 text-sm font-medium text-city-foreground">
      Deployment URL
      <InputGroup.Root>
        <InputGroup.Addon>https://</InputGroup.Addon>
        <Input aria-label="Deployment domain" placeholder="city" />
        <InputGroup.Addon position="trailing">.dev</InputGroup.Addon>
      </InputGroup.Root>
    </label>
  ),
};

export const GroupSizes: Story = {
  render: () => (
    <div className="grid w-80 gap-3">
      {(['xsm', 'sm', 'md', 'lg', 'xlg'] as const).map((size) => (
        <InputGroup.Root key={size} size={size}>
          <InputGroup.Addon>https://</InputGroup.Addon>
          <Input aria-label={`${size} deployment domain`} placeholder="city" />
          <InputGroup.Addon position="trailing">.dev</InputGroup.Addon>
        </InputGroup.Root>
      ))}
    </div>
  ),
};

export const Multiline: Story = {
  render: () => (
    <label className="grid w-80 gap-1.5 text-sm font-medium text-city-foreground">
      Release notes
      <Textarea aria-label="Release notes" placeholder="Summarize this release" />
    </label>
  ),
};

function ControlledInput() {
  const [value, setValue] = useState('city-ds');

  return (
    <label className="grid w-80 gap-1.5 text-sm font-medium text-city-foreground">
      Package name
      <Input aria-label="Package name" onValueChange={setValue} value={value} />
      <span className="text-xs font-normal text-city-muted-foreground">Current value: {value}</span>
    </label>
  );
}

export const Controlled: Story = {
  render: () => <ControlledInput />,
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Read-only by policy',
  },
  render: (args) => <Input {...args} aria-label="Disabled project name" />,
};
