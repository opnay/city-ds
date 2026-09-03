import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import { ToggleGroup } from '@opnay/city-ds-react';

const meta = {
  title: 'Actions/ToggleGroup',
  component: ToggleGroup,
  subcomponents: { Item: ToggleGroup.Item },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'ToggleGroup groups related tool states that may be pressed or released. Use SegmentedControl when one option must always remain selected. Provide an accessible group name with `aria-label` or `aria-labelledby`, and provide `aria-label` on icon-only items.',
      },
    },
  },
  args: {
    'aria-label': 'Pinned column',
    defaultValue: ['left'],
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    size: {
      control: 'inline-radio',
      options: ['xsm', 'sm', 'md', 'lg', 'xlg'],
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
    },
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Single: Story = {
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
      <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
    </ToggleGroup>
  ),
};

export const Multiple: Story = {
  args: {
    'aria-label': 'Text style',
    defaultValue: ['bold', 'italic'],
    multiple: true,
  },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
      <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
      <ToggleGroup.Item value="underline">Underline</ToggleGroup.Item>
    </ToggleGroup>
  ),
};

export const IconOnly: Story = {
  args: {
    'aria-label': 'Editor tools',
    defaultValue: ['bold'],
  },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroup.Item aria-label="Bold" value="bold">
        <span aria-hidden="true" className="font-bold">
          B
        </span>
      </ToggleGroup.Item>
      <ToggleGroup.Item aria-label="Italic" value="italic">
        <span aria-hidden="true" className="italic">
          I
        </span>
      </ToggleGroup.Item>
      <ToggleGroup.Item aria-label="Underline" value="underline">
        <span aria-hidden="true" className="underline">
          U
        </span>
      </ToggleGroup.Item>
    </ToggleGroup>
  ),
};

export const Vertical: Story = {
  args: {
    'aria-label': 'Pinned panel',
    defaultValue: ['top'],
    orientation: 'vertical',
  },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroup.Item value="top">Top</ToggleGroup.Item>
      <ToggleGroup.Item value="bottom">Bottom</ToggleGroup.Item>
    </ToggleGroup>
  ),
};

export const Disabled: Story = {
  args: {
    'aria-label': 'Disabled formatting tools',
    defaultValue: ['bold'],
    disabled: true,
    multiple: true,
  },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
      <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
    </ToggleGroup>
  ),
};

function ControlledExample() {
  const [value, setValue] = useState<string[]>(['left']);

  return (
    <ToggleGroup aria-label="Pinned column" value={value} onValueChange={setValue}>
      <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
      <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
    </ToggleGroup>
  );
}

export const KeyboardNavigation: Story = {
  render: () => <ControlledExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const left = canvas.getByRole('button', { name: 'Left' });

    left.focus();
    await userEvent.keyboard('[ArrowRight][Space]');

    await expect(canvas.getByRole('button', { name: 'Right' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  },
};
