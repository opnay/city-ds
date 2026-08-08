import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import { DateField } from '@opnay/city-ds-react';

const meta = {
  title: 'Forms/DateField',
  component: DateField.Root,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '`DateField`는 시간대가 없는 로컬 달력 날짜를 `YYYY-MM-DD`로 입력합니다. 값의 시·분·초는 의미가 없으며, 폼 제출과 저장에는 `YYYY-MM-DD`를 사용하십시오. `toISOString()`은 시간대에 따라 날짜를 바꿀 수 있습니다.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof DateField.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DateField.Root {...args} defaultValue={new Date(2026, 6, 15)}>
      <DateField.Label>Release date</DateField.Label>
      <DateField.Input />
      <DateField.Description>Use YYYY-MM-DD.</DateField.Description>
    </DateField.Root>
  ),
};

function ControlledDateField() {
  const [value, setValue] = useState<Date | null>(new Date(2026, 6, 15));

  return (
    <div className="grid w-80 gap-3">
      <DateField.Root onValueChange={setValue} value={value}>
        <DateField.Label>Review date</DateField.Label>
        <DateField.Input />
      </DateField.Root>
      <output className="text-xs text-city-muted-foreground">
        Value:{' '}
        {value
          ? `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`
          : 'null'}
      </output>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDateField />,
};

export const Sizes: Story = {
  render: () => (
    <div className="grid w-80 gap-3">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div className="grid gap-2" key={size}>
          <span className="text-xs text-city-muted-foreground">{size.toUpperCase()}</span>
          <DateField.Root defaultValue={new Date(2026, 6, 15)} size={size}>
            <DateField.Label>Review date</DateField.Label>
            <DateField.Input />
          </DateField.Root>
        </div>
      ))}
    </div>
  ),
};

export const Constraints: Story = {
  render: () => (
    <DateField.Root
      isDateUnavailable={(date) => date.getDay() === 0 || date.getDay() === 6}
      maxValue={new Date(2026, 6, 31)}
      minValue={new Date(2026, 6, 1)}
      required
    >
      <DateField.Label>Deployment date</DateField.Label>
      <DateField.Input />
      <DateField.Description>Choose a weekday in July 2026.</DateField.Description>
      <DateField.Error>Enter an available date in July.</DateField.Error>
    </DateField.Root>
  ),
};

export const States: Story = {
  render: () => (
    <div className="grid w-80 gap-4">
      <div className="grid gap-2">
        <span className="text-xs text-city-muted-foreground">Disabled</span>
        <DateField.Root defaultValue={new Date(2026, 6, 15)} disabled>
          <DateField.Label>Review date</DateField.Label>
          <DateField.Input />
        </DateField.Root>
      </div>
      <div className="grid gap-2">
        <span className="text-xs text-city-muted-foreground">Read only</span>
        <DateField.Root defaultValue={new Date(2026, 6, 15)} readOnly>
          <DateField.Label>Review date</DateField.Label>
          <DateField.Input />
        </DateField.Root>
      </div>
      <div className="grid gap-2">
        <span className="text-xs text-city-muted-foreground">Invalid</span>
        <DateField.Root invalid>
          <DateField.Label>Review date</DateField.Label>
          <DateField.Input />
          <DateField.Error>Check the release date.</DateField.Error>
        </DateField.Root>
      </div>
    </div>
  ),
};

export const KeyboardValidation: Story = {
  render: () => (
    <DateField.Root required>
      <DateField.Label>Invoice date</DateField.Label>
      <DateField.Input />
      <DateField.Description>Enter a leap-day date, then leave the field.</DateField.Description>
      <DateField.Error>Enter a valid date.</DateField.Error>
    </DateField.Root>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Invoice date' });

    await userEvent.type(input, '2023-02-29');
    await userEvent.tab();

    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(canvas.getByText('Enter a valid date.')).toBeVisible();
  },
};
