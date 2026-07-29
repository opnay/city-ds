import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bold, Italic, Underline } from 'lucide-react';
import { expect, userEvent, within } from 'storybook/test';

import { Toolbar } from '@opnay/city-ds-react';

const meta = {
  title: 'Navigation/Toolbar',
  component: Toolbar.Root,
  tags: ['autodocs'],
  argTypes: {
    appearance: {
      control: 'inline-radio',
      options: ['plain', 'band', 'outline'],
    },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Toolbar.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const EditingTools: Story = {
  args: {
    'aria-label': 'Editing tools',
    appearance: 'outline',
    size: 'md',
  },
  render: (args) => (
    <Toolbar.Root {...args}>
      <Toolbar.Button aria-label="Bold">
        <Bold aria-hidden="true" size={16} strokeWidth={1.8} />
      </Toolbar.Button>
      <Toolbar.Button aria-label="Italic">
        <Italic aria-hidden="true" size={16} strokeWidth={1.8} />
      </Toolbar.Button>
      <Toolbar.Button aria-label="Underline">
        <Underline aria-hidden="true" size={16} strokeWidth={1.8} />
      </Toolbar.Button>
      <Toolbar.Separator />
      <Toolbar.Button>Comment</Toolbar.Button>
      <Toolbar.Link href="#history">History</Toolbar.Link>
    </Toolbar.Root>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Bold' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('button', { name: 'Italic' })).toHaveFocus();
  },
};

export const EmbeddedBand: Story = {
  render: () => (
    <Toolbar.Root appearance="band" aria-label="Embedded filters" className="w-full" size="sm">
      <Toolbar.Button variant="ghost">All</Toolbar.Button>
      <Toolbar.Button variant="ghost">Active</Toolbar.Button>
      <Toolbar.Separator />
      <Toolbar.Button variant="outline">Reset</Toolbar.Button>
    </Toolbar.Root>
  ),
};

export const ViewSwitcher: Story = {
  render: () => (
    <Toolbar.Root aria-label="View switcher">
      <Toolbar.ToggleGroup defaultValue={['list']}>
        <Toolbar.Toggle value="list">List</Toolbar.Toggle>
        <Toolbar.Toggle value="grid">Grid</Toolbar.Toggle>
        <Toolbar.Toggle value="map">Map</Toolbar.Toggle>
      </Toolbar.ToggleGroup>
    </Toolbar.Root>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByRole('button', { name: 'List' });
    const grid = canvas.getByRole('button', { name: 'Grid' });

    await expect(list).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(grid);
    await expect(list).toHaveAttribute('aria-pressed', 'false');
    await expect(grid).toHaveAttribute('aria-pressed', 'true');
  },
};

export const VerticalWithDisabledItems: Story = {
  render: () => (
    <Toolbar.Root aria-label="Object tools" orientation="vertical" size="sm">
      <Toolbar.Button>Move up</Toolbar.Button>
      <Toolbar.Button disabled>Move down</Toolbar.Button>
      <Toolbar.Separator />
      <Toolbar.Button variant="destructive">Delete</Toolbar.Button>
    </Toolbar.Root>
  ),
};
