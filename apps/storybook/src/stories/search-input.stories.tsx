import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Field, SearchInput } from '@opnay/city-ds-react';

const meta = {
  title: 'Inputs/SearchInput',
  component: SearchInput.Root,
  tags: ['autodocs'],
} satisfies Meta<typeof SearchInput.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

function SearchControls({ placeholder }: { placeholder?: string }) {
  return (
    <SearchInput.Group>
      <SearchInput.Input placeholder={placeholder} />
      <SearchInput.Clear />
      <SearchInput.Submit />
    </SearchInput.Group>
  );
}

function SearchForm({ children }: { children: React.ReactNode }) {
  return <form onSubmit={(event) => event.preventDefault()}>{children}</form>;
}

export const Default: Story = {
  render: () => (
    <Field.Root className="w-96">
      <Field.Label>Search projects</Field.Label>
      <SearchForm>
        <SearchInput.Root>
          <SearchControls placeholder="Search by name" />
        </SearchInput.Root>
      </SearchForm>
      <Field.Description>Press Enter to submit the current query.</Field.Description>
    </Field.Root>
  ),
};

export const WithValue: Story = {
  render: () => <ControlledSearchInput initialValue="city" />,
};

export const Loading: Story = {
  render: () => (
    <Field.Root className="w-96">
      <Field.Label>Search documentation</Field.Label>
      <SearchForm>
        <SearchInput.Root defaultValue="design" loading>
          <SearchControls />
          <SearchInput.Loading>Searching…</SearchInput.Loading>
        </SearchInput.Root>
      </SearchForm>
    </Field.Root>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Field.Root className="w-96" disabled>
      <Field.Label>Search archived projects</Field.Label>
      <SearchForm>
        <SearchInput.Root defaultValue="archived" disabled>
          <SearchControls />
        </SearchInput.Root>
      </SearchForm>
    </Field.Root>
  ),
};

export const Error: Story = {
  render: () => (
    <Field.Root className="w-96" invalid>
      <Field.Label>Search users</Field.Label>
      <SearchForm>
        <SearchInput.Root defaultValue="x" invalid>
          <SearchControls />
        </SearchInput.Root>
      </SearchForm>
      <Field.Error match>Enter at least 2 characters.</Field.Error>
    </Field.Root>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="grid gap-4">
      {(['xsm', 'sm', 'md', 'lg', 'xlg'] as const).map((size) => (
        <div className="grid gap-2" key={size}>
          <span className="text-xs text-city-muted-foreground">{size.toUpperCase()}</span>
          <Field.Root className="w-96">
            <Field.Label>Search documentation</Field.Label>
            <SearchForm>
              <SearchInput.Root defaultValue={`${size} search`} size={size}>
                <SearchControls />
              </SearchInput.Root>
            </SearchForm>
          </Field.Root>
        </div>
      ))}
    </div>
  ),
};

function ControlledSearchInput({ initialValue }: { initialValue: string }) {
  const [value, setValue] = useState(initialValue);

  return (
    <Field.Root className="w-96">
      <Field.Label>Search packages</Field.Label>
      <SearchForm>
        <SearchInput.Root onValueChange={setValue} value={value}>
          <SearchControls />
        </SearchInput.Root>
      </SearchForm>
      <Field.Description>Current query: {value || 'empty'}</Field.Description>
    </Field.Root>
  );
}
