import { useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Field, NumberField } from '@city-ds/react';

const meta = {
  title: 'Forms/NumberField',
  component: NumberField.Root,
  tags: ['autodocs'],
  args: {
    defaultValue: 12,
    min: 0,
    max: 100,
    step: 1,
  },
} satisfies Meta<typeof NumberField.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

function NumberFieldControl(props: NumberFieldRootPropsWithLabel) {
  const { label, size = 'md', ...rootProps } = props;

  return (
    <Field.Root className="w-80">
      <Field.Label>{label}</Field.Label>
      <NumberField.Root {...rootProps}>
        <NumberField.Group size={size}>
          <NumberField.Input aria-label={label} size={size} />
          <NumberField.Decrement aria-label={`Decrease ${label}`} size={size} />
          <NumberField.Increment aria-label={`Increase ${label}`} size={size} />
        </NumberField.Group>
      </NumberField.Root>
    </Field.Root>
  );
}

type NumberFieldRootPropsWithLabel = ComponentProps<typeof NumberField.Root> & {
  label: string;
  size?: 'sm' | 'md' | 'lg';
};

export const Default: Story = {
  render: (args) => <NumberFieldControl {...args} label="Quantity" />,
};

export const Range: Story = {
  render: () => <NumberFieldControl label="Seats" defaultValue={4} min={1} max={12} step={1} />,
};

export const Formatted: Story = {
  render: () => (
    <NumberFieldControl
      label="Completion"
      defaultValue={0.42}
      format={{ style: 'percent', maximumFractionDigits: 0 }}
      max={1}
      min={0}
      step={0.01}
    />
  ),
};

export const Disabled: Story = {
  render: () => <NumberFieldControl label="Locked limit" defaultValue={10} disabled />,
};

export const Invalid: Story = {
  render: () => (
    <Field.Root className="w-80" invalid>
      <Field.Label>Error budget</Field.Label>
      <NumberField.Root defaultValue={120} max={100} min={0}>
        <NumberField.Group>
          <NumberField.Input aria-label="Error budget" />
          <NumberField.Decrement aria-label="Decrease error budget" />
          <NumberField.Increment aria-label="Increase error budget" />
        </NumberField.Group>
      </NumberField.Root>
      <Field.Error match>Enter a value from 0 to 100.</Field.Error>
    </Field.Root>
  ),
};

function ControlledExample() {
  const [value, setValue] = useState<number | null>(25);

  return (
    <div className="grid gap-2">
      <NumberFieldControl
        label="Controlled threshold"
        max={100}
        min={0}
        onValueChange={setValue}
        step={5}
        value={value}
      />
      <span className="text-city-muted-foreground text-xs">Current value: {value ?? 'empty'}</span>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
};
