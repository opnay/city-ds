import type { Meta, StoryObj } from '@storybook/react-vite';
import { Collapsible } from '@city-ds/react';

const meta = {
  title: 'Disclosure/Collapsible',
  component: Collapsible.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Collapsible.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Collapsible.Root className="w-80">
      <Collapsible.Trigger>Project notes</Collapsible.Trigger>
      <Collapsible.Panel>Capture short-lived context without leaving the page.</Collapsible.Panel>
    </Collapsible.Root>
  ),
};

export const InitiallyOpen: Story = {
  render: () => (
    <Collapsible.Root defaultOpen className="w-80">
      <Collapsible.Trigger>Notification routing</Collapsible.Trigger>
      <Collapsible.Panel>
        Email summaries are sent to workspace owners every Monday.
      </Collapsible.Panel>
    </Collapsible.Root>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Collapsible.Root disabled className="w-80">
      <Collapsible.Trigger>Billing controls</Collapsible.Trigger>
      <Collapsible.Panel>Only administrators can manage billing controls.</Collapsible.Panel>
    </Collapsible.Root>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Collapsible.Root className="w-96">
      <Collapsible.Trigger>Release checklist</Collapsible.Trigger>
      <Collapsible.Panel>
        Confirm owner approval, review accessibility notes, verify light and dark theme contrast,
        and keep this supplemental guidance close to the action that reveals it.
      </Collapsible.Panel>
    </Collapsible.Root>
  ),
};
