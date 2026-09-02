import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import { DateInput, Field } from '@opnay/city-ds-react';

const meta = {
  title: 'Forms/DateInput',
  component: DateInput.Root,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '`DateInput`는 시간대가 없는 로컬 달력 날짜를 `YYYY-MM-DD`로 입력합니다. 값의 시·분·초는 의미가 없으며, 폼 제출과 저장에는 `YYYY-MM-DD`를 사용하십시오. `toISOString()`은 시간대에 따라 날짜를 바꿀 수 있습니다.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['xsm', 'sm', 'md', 'lg', 'xlg'],
    },
  },
} satisfies Meta<typeof DateInput.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Field.Root>
      <Field.Label>Release date</Field.Label>
      <DateInput.Root {...args} defaultValue={new Date(2026, 6, 15)}>
        <DateInput.Input />
      </DateInput.Root>
      <Field.Description>Use YYYY-MM-DD.</Field.Description>
    </Field.Root>
  ),
};

function ControlledDateInput() {
  const [value, setValue] = useState<Date | null>(new Date(2026, 6, 15));

  return (
    <div className="grid w-80 gap-3">
      <Field.Root>
        <Field.Label>Review date</Field.Label>
        <DateInput.Root onValueChange={setValue} value={value}>
          <DateInput.Input />
        </DateInput.Root>
      </Field.Root>
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
  render: () => <ControlledDateInput />,
};

export const Sizes: Story = {
  render: () => (
    <div className="grid w-80 gap-3">
      {(['xsm', 'sm', 'md', 'lg', 'xlg'] as const).map((size) => (
        <div className="grid gap-2" key={size}>
          <span className="text-xs text-city-muted-foreground">{size.toUpperCase()}</span>
          <Field.Root>
            <Field.Label>Review date</Field.Label>
            <DateInput.Root defaultValue={new Date(2026, 6, 15)} size={size}>
              <DateInput.Input />
            </DateInput.Root>
          </Field.Root>
        </div>
      ))}
    </div>
  ),
};

export const Constraints: Story = {
  render: () => (
    <Field.Root>
      <Field.Label>Deployment date</Field.Label>
      <DateInput.Root
        isDateUnavailable={(date) => date.getDay() === 0 || date.getDay() === 6}
        maxValue={new Date(2026, 6, 31)}
        minValue={new Date(2026, 6, 1)}
        required
      >
        <DateInput.Input />
      </DateInput.Root>
      <Field.Description>Choose a weekday in July 2026.</Field.Description>
    </Field.Root>
  ),
};

export const States: Story = {
  render: () => (
    <div className="grid w-80 gap-4">
      <div className="grid gap-2">
        <span className="text-xs text-city-muted-foreground">Disabled</span>
        <Field.Root disabled>
          <Field.Label>Review date</Field.Label>
          <DateInput.Root defaultValue={new Date(2026, 6, 15)} disabled>
            <DateInput.Input />
          </DateInput.Root>
        </Field.Root>
      </div>
      <div className="grid gap-2">
        <span className="text-xs text-city-muted-foreground">Read only</span>
        <Field.Root>
          <Field.Label>Review date</Field.Label>
          <DateInput.Root defaultValue={new Date(2026, 6, 15)} readOnly>
            <DateInput.Input />
          </DateInput.Root>
        </Field.Root>
      </div>
      <div className="grid gap-2">
        <span className="text-xs text-city-muted-foreground">Invalid</span>
        <Field.Root invalid>
          <Field.Label>Review date</Field.Label>
          <DateInput.Root invalid>
            <DateInput.Input />
          </DateInput.Root>
          <Field.Error match>Check the release date.</Field.Error>
        </Field.Root>
      </div>
    </div>
  ),
};

export const KeyboardValidation: Story = {
  render: () => (
    <Field.Root>
      <Field.Label>Invoice date</Field.Label>
      <DateInput.Root required>
        <DateInput.Input />
      </DateInput.Root>
      <Field.Description>Enter a leap-day date, then leave the field.</Field.Description>
    </Field.Root>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Invoice date' });

    await userEvent.type(input, '2023-02-29');
    await userEvent.tab();

    await expect(input).toHaveAttribute('aria-invalid', 'true');
  },
};
