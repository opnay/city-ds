import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Field, Input } from '@city-ds/react';

const meta = {
  title: 'Forms/Field',
  component: Field.Root,
  tags: ['autodocs'],
  argTypes: {
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Field.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

function ProjectField() {
  const [value, setValue] = useState('city-ds');

  return (
    <Field.Root className="w-80">
      <Field.Label>Project slug</Field.Label>
      <Input
        aria-label="Project slug"
        value={value}
        onValueChange={setValue}
        placeholder="city-ds"
      />
      <Field.Description>Lowercase letters, digits, and hyphens only.</Field.Description>
    </Field.Root>
  );
}

export const Default: Story = {
  render: () => <ProjectField />,
};

export const Required: Story = {
  render: () => (
    <Field.Root className="w-80">
      <Field.Label>
        Workspace name <span aria-hidden="true">*</span>
      </Field.Label>
      <Input aria-label="Workspace name" placeholder="Platform" required />
      <Field.Description>This name appears in the workspace switcher.</Field.Description>
    </Field.Root>
  ),
};

export const Invalid: Story = {
  render: () => (
    <Field.Root className="w-80" invalid>
      <Field.Label>Email address</Field.Label>
      <Input aria-label="Email address" defaultValue="city" type="email" />
      <Field.Description>Use a company email address.</Field.Description>
      <Field.Error match>Enter a valid work email address.</Field.Error>
    </Field.Root>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Field.Root className="w-80" disabled>
      <Field.Label>Region</Field.Label>
      <Input aria-label="Region" defaultValue="Seoul" />
      <Field.Description>Region is managed by your organization.</Field.Description>
    </Field.Root>
  ),
};
