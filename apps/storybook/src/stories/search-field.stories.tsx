import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { SearchField } from '@opnay/city-ds-react';

const meta = {
  title: 'Forms/SearchField',
  component: SearchField.Root,
  tags: ['autodocs'],
} satisfies Meta<typeof SearchField.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

function SearchControls({ placeholder }: { placeholder?: string }) {
  return (
    <SearchField.Group>
      <SearchField.Input placeholder={placeholder} />
      <SearchField.Clear />
      <SearchField.Submit />
    </SearchField.Group>
  );
}

export const Default: Story = {
  render: () => (
    <SearchField.Root className="w-96" onSubmit={() => undefined}>
      <SearchField.Label>Search projects</SearchField.Label>
      <SearchControls placeholder="Search by name" />
      <SearchField.Description>Press Enter to submit the current query.</SearchField.Description>
    </SearchField.Root>
  ),
};

export const WithValue: Story = {
  render: () => <ControlledSearchField initialValue="city" />,
};

export const Loading: Story = {
  render: () => (
    <SearchField.Root className="w-96" defaultValue="design" loading>
      <SearchField.Label>Search documentation</SearchField.Label>
      <SearchControls />
      <SearchField.Loading>Searching…</SearchField.Loading>
    </SearchField.Root>
  ),
};

export const Disabled: Story = {
  render: () => (
    <SearchField.Root className="w-96" defaultValue="archived" disabled>
      <SearchField.Label>Search archived projects</SearchField.Label>
      <SearchControls />
    </SearchField.Root>
  ),
};

export const Error: Story = {
  render: () => (
    <SearchField.Root className="w-96" defaultValue="x" invalid>
      <SearchField.Label>Search users</SearchField.Label>
      <SearchControls />
      <SearchField.Error match>Enter at least 2 characters.</SearchField.Error>
    </SearchField.Root>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="grid gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <SearchField.Root key={size} className="w-96" defaultValue={`${size} search`} size={size}>
          <SearchField.Label>{size.toUpperCase()} search</SearchField.Label>
          <SearchControls />
        </SearchField.Root>
      ))}
    </div>
  ),
};

function ControlledSearchField({ initialValue }: { initialValue: string }) {
  const [value, setValue] = useState(initialValue);

  return (
    <SearchField.Root className="w-96" onValueChange={setValue} value={value}>
      <SearchField.Label>Search packages</SearchField.Label>
      <SearchControls />
      <SearchField.Description>Current query: {value || 'empty'}</SearchField.Description>
    </SearchField.Root>
  );
}
