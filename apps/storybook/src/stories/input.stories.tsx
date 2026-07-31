import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input, InputGroup, Textarea } from '@city-ds/react';

const meta = {
  title: 'Forms/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    placeholder: 'Search projects',
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
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
    <label className="text-city-foreground grid w-80 gap-1.5 text-sm font-medium">
      Search projects
      <Input {...args} aria-label="Search projects" />
    </label>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="grid w-80 gap-3">
      <Input aria-label="Small project name" placeholder="Small" size="sm" />
      <Input aria-label="Medium project name" placeholder="Medium" size="md" />
      <Input aria-label="Large project name" placeholder="Large" size="lg" />
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <label className="text-city-foreground grid w-80 gap-1.5 text-sm font-medium">
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
      <InputGroup.Root size="sm">
        <InputGroup.Addon>https://</InputGroup.Addon>
        <Input aria-label="Small deployment domain" placeholder="city" />
        <InputGroup.Addon position="trailing">.dev</InputGroup.Addon>
      </InputGroup.Root>
      <InputGroup.Root size="md">
        <InputGroup.Addon>https://</InputGroup.Addon>
        <Input aria-label="Medium deployment domain" placeholder="city" />
        <InputGroup.Addon position="trailing">.dev</InputGroup.Addon>
      </InputGroup.Root>
      <InputGroup.Root size="lg">
        <InputGroup.Addon>https://</InputGroup.Addon>
        <Input aria-label="Large deployment domain" placeholder="city" />
        <InputGroup.Addon position="trailing">.dev</InputGroup.Addon>
      </InputGroup.Root>
    </div>
  ),
};

export const Multiline: Story = {
  render: () => (
    <label className="text-city-foreground grid w-80 gap-1.5 text-sm font-medium">
      Release notes
      <Textarea aria-label="Release notes" placeholder="Summarize this release" />
    </label>
  ),
};

function ControlledInput() {
  const [value, setValue] = useState('city-ds');

  return (
    <label className="text-city-foreground grid w-80 gap-1.5 text-sm font-medium">
      Package name
      <Input aria-label="Package name" onValueChange={setValue} value={value} />
      <span className="text-city-muted-foreground text-xs font-normal">Current value: {value}</span>
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
