import type { Meta, StoryObj } from '@storybook/react-vite';

import { Checkbox, Field, Fieldset, Input, RadioGroup } from '@opnay/city-ds-react';

const meta = {
  title: 'Forms/Fieldset',
  component: Fieldset.Root,
  tags: ['autodocs'],
} satisfies Meta<typeof Fieldset.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Fieldset.Root className="w-96">
      <Fieldset.Legend>Billing details</Fieldset.Legend>
      <Fieldset.Content>
        <Field.Root>
          <Field.Label>Company</Field.Label>
          <Input defaultValue="City Labs" />
        </Field.Root>
        <Field.Root>
          <Field.Label>VAT ID</Field.Label>
          <Input placeholder="KR-000000" />
        </Field.Root>
      </Fieldset.Content>
    </Fieldset.Root>
  ),
};

export const Plain: Story = {
  render: () => (
    <Fieldset.Root appearance="plain" className="w-96">
      <Fieldset.Legend>Workspace defaults</Fieldset.Legend>
      <Fieldset.Description>
        Use a plain group when the surrounding panel owns the surface.
      </Fieldset.Description>
      <Fieldset.Content>
        <Field.Root>
          <Field.Label>Workspace name</Field.Label>
          <Input defaultValue="City Labs" />
        </Field.Root>
      </Fieldset.Content>
    </Fieldset.Root>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <Fieldset.Root className="w-96">
      <Fieldset.Legend>Notification channels</Fieldset.Legend>
      <Fieldset.Description>
        Choose where operational alerts should be delivered.
      </Fieldset.Description>
      <Fieldset.Content>
        <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-city-foreground">
          <Checkbox aria-label="Email alerts" defaultChecked />
          Email alerts
        </label>
        <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-city-foreground">
          <Checkbox aria-label="SMS alerts" />
          SMS alerts
        </label>
      </Fieldset.Content>
    </Fieldset.Root>
  ),
};

export const WithError: Story = {
  render: () => (
    <Fieldset.Root className="w-96" aria-invalid="true">
      <Fieldset.Legend>Deployment window</Fieldset.Legend>
      <Fieldset.Description>Select at least one allowed deployment day.</Fieldset.Description>
      <Fieldset.Content>
        <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-city-foreground">
          <Checkbox aria-label="Weekdays" />
          Weekdays
        </label>
        <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-city-foreground">
          <Checkbox aria-label="Weekends" />
          Weekends
        </label>
      </Fieldset.Content>
      <Fieldset.Error>Pick one or more days before continuing.</Fieldset.Error>
    </Fieldset.Root>
  ),
};

export const DisabledGroup: Story = {
  render: () => (
    <Fieldset.Root className="w-96" disabled>
      <Fieldset.Legend>Managed access</Fieldset.Legend>
      <Fieldset.Description>
        Access settings are controlled by your organization.
      </Fieldset.Description>
      <Fieldset.Content>
        <Field.Root>
          <Field.Label>Team</Field.Label>
          <Input defaultValue="Platform" />
        </Field.Root>
        <label className="flex w-fit items-center gap-2 text-sm text-city-foreground">
          <Checkbox aria-label="Require SSO" defaultChecked />
          Require SSO
        </label>
      </Fieldset.Content>
    </Fieldset.Root>
  ),
};

export const CheckboxGroupComposition: Story = {
  render: () => (
    <Fieldset.Root className="w-96">
      <Fieldset.Legend>Allowed protocols</Fieldset.Legend>
      <Fieldset.Content>
        {['HTTPS', 'SSH', 'SFTP'].map((protocol) => (
          <label
            className="flex w-fit cursor-pointer items-center gap-2 text-sm text-city-foreground"
            key={protocol}
          >
            <Checkbox aria-label={protocol} defaultChecked={protocol === 'HTTPS'} />
            {protocol}
          </label>
        ))}
      </Fieldset.Content>
    </Fieldset.Root>
  ),
};

export const RadioGroupComposition: Story = {
  render: () => (
    <Fieldset.Root render={<RadioGroup defaultValue="standard" />} className="w-96">
      <Fieldset.Legend>Support tier</Fieldset.Legend>
      <RadioGroup.Item value="standard">Standard</RadioGroup.Item>
      <RadioGroup.Item value="priority">Priority</RadioGroup.Item>
      <RadioGroup.Item value="enterprise">Enterprise</RadioGroup.Item>
    </Fieldset.Root>
  ),
};
