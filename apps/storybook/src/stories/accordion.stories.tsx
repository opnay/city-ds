import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Accordion } from '@opnay/city-ds-react';

const meta = {
  title: 'Layout/Accordion',
  component: Accordion.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Accordion.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const profilePanel = canvas.getByRole('region', { name: 'Profile settings' });
    const panelStyle = getComputedStyle(profilePanel);

    await expect(panelStyle.transitionProperty).toContain('grid-template-rows');
    await expect(panelStyle.transitionDuration).toBe('0.16s');
    await expect(panelStyle.transitionTimingFunction).toBe('ease-in-out');
    await expect(getComputedStyle(profilePanel.firstElementChild as Element).minHeight).toBe('0px');

    await userEvent.click(canvas.getByRole('button', { name: 'Billing' }));
    await expect(canvas.getByRole('button', { name: 'Billing' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  },
  render: () => (
    <Accordion.Root className="w-96" defaultValue={['profile']}>
      <Accordion.Item value="profile">
        <Accordion.Header>
          <Accordion.Trigger>Profile settings</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>Update your public profile and workspace identity.</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="billing">
        <Accordion.Header>
          <Accordion.Trigger>Billing</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>Review invoices, payment methods, and plan limits.</Accordion.Panel>
      </Accordion.Item>
    </Accordion.Root>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion.Root multiple className="w-96" defaultValue={['alerts', 'exports']}>
      <Accordion.Item value="alerts">
        <Accordion.Header>
          <Accordion.Trigger>Alerts</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>Choose where operational alerts are delivered.</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="exports">
        <Accordion.Header>
          <Accordion.Trigger>Exports</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>Configure scheduled exports for reports and audit logs.</Accordion.Panel>
      </Accordion.Item>
    </Accordion.Root>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Accordion.Root className="w-96">
      <Accordion.Item value="team">
        <Accordion.Header>
          <Accordion.Trigger>Team access</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>Manage role assignments for the workspace.</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item disabled value="sso">
        <Accordion.Header>
          <Accordion.Trigger>Single sign-on</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>Enterprise plan required.</Accordion.Panel>
      </Accordion.Item>
    </Accordion.Root>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Accordion.Root className="w-[28rem]" defaultValue={['release']}>
      <Accordion.Item value="release">
        <Accordion.Header>
          <Accordion.Trigger>Release checklist</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>
          Confirm owner approval, review accessibility notes, verify light and dark theme contrast,
          document migration guidance, and keep supplemental instructions near the control that
          reveals them.
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion.Root>
  ),
};
