import { useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Field, NumberField } from '@opnay/city-ds-react';

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
  const { label, ...rootProps } = props;

  return (
    <Field.Root className="w-80" disabled={rootProps.disabled}>
      <Field.Label>{label}</Field.Label>
      <NumberField.Root {...rootProps}>
        <NumberField.Group>
          <NumberField.Input />
          <NumberField.Decrement aria-label={`Decrease ${label}`} />
          <NumberField.Increment aria-label={`Increase ${label}`} />
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
  render: () => <NumberFieldControl label="Limit" defaultValue={10} disabled />,
};

export const Invalid: Story = {
  render: () => (
    <Field.Root className="w-80" invalid>
      <Field.Label>Error budget</Field.Label>
      <NumberField.Root defaultValue={120} max={100} min={0}>
        <NumberField.Group>
          <NumberField.Input />
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
        label="Threshold"
        max={100}
        min={0}
        onValueChange={setValue}
        step={5}
        value={value}
      />
      <span className="text-xs text-city-muted-foreground">Current value: {value ?? 'empty'}</span>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
};
