import { useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Field, NumberInput } from '@opnay/city-ds-react';

const meta = {
  title: 'Forms/NumberInput',
  component: NumberInput.Root,
  tags: ['autodocs'],
  args: {
    defaultValue: 12,
    min: 0,
    max: 100,
    step: 1,
  },
} satisfies Meta<typeof NumberInput.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

function NumberInputControl(props: NumberInputRootPropsWithLabel) {
  const { label, ...rootProps } = props;

  return (
    <Field.Root className="w-80" disabled={rootProps.disabled}>
      <Field.Label>{label}</Field.Label>
      <NumberInput.Root {...rootProps}>
        <NumberInput.Group>
          <NumberInput.Input />
          <NumberInput.Decrement aria-label={`Decrease ${label}`} />
          <NumberInput.Increment aria-label={`Increase ${label}`} />
        </NumberInput.Group>
      </NumberInput.Root>
    </Field.Root>
  );
}

type NumberInputRootPropsWithLabel = ComponentProps<typeof NumberInput.Root> & {
  label: string;
};

export const Default: Story = {
  render: (args) => <NumberInputControl {...args} label="Quantity" />,
};

export const Range: Story = {
  render: () => <NumberInputControl label="Seats" defaultValue={4} min={1} max={12} step={1} />,
};

export const Formatted: Story = {
  render: () => (
    <NumberInputControl
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
  render: () => <NumberInputControl label="Limit" defaultValue={10} disabled />,
};

export const Invalid: Story = {
  render: () => (
    <Field.Root className="w-80" invalid>
      <Field.Label>Error budget</Field.Label>
      <NumberInput.Root defaultValue={120} max={100} min={0}>
        <NumberInput.Group>
          <NumberInput.Input />
          <NumberInput.Decrement aria-label="Decrease error budget" />
          <NumberInput.Increment aria-label="Increase error budget" />
        </NumberInput.Group>
      </NumberInput.Root>
      <Field.Error match>Enter a value from 0 to 100.</Field.Error>
    </Field.Root>
  ),
};

function ControlledExample() {
  const [value, setValue] = useState<number | null>(25);

  return (
    <div className="grid gap-2">
      <NumberInputControl
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
