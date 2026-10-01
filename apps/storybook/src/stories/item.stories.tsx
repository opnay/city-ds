import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { FileTextIcon, ChevronRightIcon } from 'lucide-react';
import {
  Avatar,
  Badge,
  Button,
  DensityProvider,
  Item,
  type ItemRootProps,
} from '@opnay/city-ds-react';

function ContentRow(props: Pick<ItemRootProps, 'appearance' | 'density'>) {
  const [saved, setSaved] = useState(false);

  return (
    <Item.Root {...props}>
      <Item.Media variant="icon">
        <FileTextIcon aria-hidden="true" />
      </Item.Media>
      <Item.Content>
        <Item.Title>Project guide</Item.Title>
        <Item.Description>Team conventions and resources for your next project.</Item.Description>
      </Item.Content>
      <Item.Actions>
        <Button size="sm" aria-pressed={saved} onClick={() => setSaved(!saved)}>
          {saved ? 'Saved' : 'Save'}
        </Button>
      </Item.Actions>
    </Item.Root>
  );
}

const meta = {
  title: 'Data display/Item',
  component: ContentRow,
  tags: ['autodocs'],
  args: { appearance: 'plain', density: 'comfortable' },
  argTypes: {
    appearance: { control: 'inline-radio', options: ['plain', 'band', 'outline'] },
    density: { control: 'inline-radio', options: ['comfortable', 'compact'] },
  },
} satisfies Meta<typeof ContentRow>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 560, maxWidth: '100%' }}>
      <ContentRow {...args} />
    </div>
  ),
};
export const Outline: Story = { ...Default, args: { appearance: 'outline' } };
export const Band: Story = { ...Default, args: { appearance: 'band' } };
export const Compact: Story = { ...Default, args: { density: 'compact' } };

export const Links: Story = {
  render: () => (
    <div style={{ width: 560, maxWidth: '100%' }}>
      <Item.Group aria-label="Resources">
        <Item.Root render={<a href="#guide" />}>
          <Item.Content>
            <Item.Title>Guide</Item.Title>
            <Item.Description>Getting started with the design system.</Item.Description>
          </Item.Content>
          <ChevronRightIcon aria-hidden="true" className="size-4 shrink-0" />
        </Item.Root>
        <Item.Separator />
        <Item.Root render={<a href="#accessibility" />}>
          <Item.Content>
            <Item.Title>Accessibility</Item.Title>
            <Item.Description>Keyboard and screen reader guidance.</Item.Description>
          </Item.Content>
          <ChevronRightIcon aria-hidden="true" className="size-4 shrink-0" />
        </Item.Root>
      </Item.Group>
    </div>
  ),
};

export const MediaAndSections: Story = {
  render: () => (
    <div style={{ width: 560, maxWidth: '100%' }}>
      <DensityProvider density="compact">
        <Item.Group aria-label="Team">
          <Item.Root appearance="outline">
            <Item.Header>
              <span>Team member</span>
              <Badge appearance="subtle">Active</Badge>
            </Item.Header>
            <Item.Media>
              <Avatar.Root size="sm">
                <Avatar.Fallback>MC</Avatar.Fallback>
              </Avatar.Root>
            </Item.Media>
            <Item.Content>
              <Item.Title>Maya Chen</Item.Title>
              <Item.Description>Product designer</Item.Description>
            </Item.Content>
            <Item.Footer>
              <span>Joined today</span>
            </Item.Footer>
          </Item.Root>
        </Item.Group>
      </DensityProvider>
    </div>
  ),
};

export const NarrowContent: Story = {
  render: (args) => (
    <div style={{ width: 280, maxWidth: '100%' }}>
      <Item.Root {...args}>
        <Item.Media variant="icon">
          <FileTextIcon aria-hidden="true" />
        </Item.Media>
        <Item.Content>
          <Item.Title>A long title that remains readable on a narrow screen</Item.Title>
          <Item.Description>
            resource_0123456789abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz
          </Item.Description>
        </Item.Content>
        <Item.Actions>
          <Button size="sm">View details</Button>
          <Button size="sm">Download</Button>
        </Item.Actions>
      </Item.Root>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const row = canvas
      .getByText('A long title that remains readable on a narrow screen')
      .closest('[data-city-item]') as HTMLElement;
    await expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth);
    await expect(canvas.getByRole('button', { name: 'Download' })).toBeVisible();
  },
};
