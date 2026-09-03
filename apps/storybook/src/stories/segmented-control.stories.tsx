import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import { SegmentedControl } from '@opnay/city-ds-react';

const meta = {
  title: 'Forms/SegmentedControl',
  component: SegmentedControl,
  subcomponents: { Item: SegmentedControl.Item },
  tags: ['autodocs'],
  args: {
    'aria-label': 'View mode',
    defaultValue: 'grid',
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['xsm', 'sm', 'md', 'lg', 'xlg'],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'SegmentedControl keeps exactly one compact option selected. Use it for view modes or ranges, ToggleGroup for releasable tool states, and Tabs when each option owns a content panel.',
      },
    },
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <SegmentedControl {...args}>
      <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
      <SegmentedControl.Item value="list">List</SegmentedControl.Item>
      <SegmentedControl.Item value="map">Map</SegmentedControl.Item>
    </SegmentedControl>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const grid = canvas.getByRole('radio', { name: 'Grid' });
    const list = canvas.getByRole('radio', { name: 'List' });

    await expect(grid).toHaveAttribute('aria-checked', 'true');
    grid.focus();
    await userEvent.keyboard('[ArrowRight]');
    await expect(list).toHaveFocus();
    await expect(list).toHaveAttribute('aria-checked', 'true');
  },
};

function ControlledPeriod() {
  const [period, setPeriod] = useState('week');

  return (
    <div className="grid gap-3">
      <SegmentedControl aria-label="Reporting period" onValueChange={setPeriod} value={period}>
        <SegmentedControl.Item value="day">Today</SegmentedControl.Item>
        <SegmentedControl.Item value="week">7 days</SegmentedControl.Item>
        <SegmentedControl.Item value="month">30 days</SegmentedControl.Item>
      </SegmentedControl>
      <span aria-live="polite" className="text-sm text-city-muted-foreground">
        Selected period: {period}
      </span>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledPeriod />,
};

export const Sizes: Story = {
  render: () => (
    <div className="grid gap-4">
      {(['xsm', 'sm', 'md', 'lg', 'xlg'] as const).map((size) => (
        <SegmentedControl aria-label={`${size} view`} defaultValue="grid" key={size} size={size}>
          <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
          <SegmentedControl.Item value="list">List</SegmentedControl.Item>
        </SegmentedControl>
      ))}
    </div>
  ),
};

export const DisabledItem: Story = {
  render: () => (
    <SegmentedControl aria-label="Available views" defaultValue="grid">
      <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
      <SegmentedControl.Item value="list">List</SegmentedControl.Item>
      <SegmentedControl.Item disabled value="map">
        Map
      </SegmentedControl.Item>
    </SegmentedControl>
  ),
};
