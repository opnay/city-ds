import { useState } from 'react';
import type { ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import { DatePicker } from '@opnay/city-ds-react';

const meta = {
  title: 'Forms/DatePicker',
  component: DatePicker.Root,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '`DatePicker`는 DateField와 Calendar를 Outline Frame과 팝오버로 조합합니다. 날짜를 선택하면 값을 반영하고 팝오버를 닫으며, 초점은 달력 트리거로 돌아갑니다. 값은 `YYYY-MM-DD`로 저장하고, 날짜가 달라질 수 있는 `toISOString()` 변환은 피하십시오.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof DatePicker.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

const referenceDate = new Date(2026, 6, 15);

function Picker({
  label,
  size = 'md',
  ...props
}: ComponentProps<typeof DatePicker.Root> & {
  label: string;
}) {
  return (
    <DatePicker.Root {...props} size={size}>
      <DatePicker.Label>{label}</DatePicker.Label>
      <DatePicker.Group>
        <DatePicker.Input />
        <DatePicker.Trigger />
      </DatePicker.Group>
      <DatePicker.Description>Type YYYY-MM-DD or choose from the calendar.</DatePicker.Description>
      <DatePicker.Error>Enter an available date.</DatePicker.Error>
      <DatePicker.Portal>
        <DatePicker.Positioner>
          <DatePicker.Popup>
            <DatePicker.Calendar aria-label={`${label} calendar`} today={referenceDate} />
          </DatePicker.Popup>
        </DatePicker.Positioner>
      </DatePicker.Portal>
    </DatePicker.Root>
  );
}

export const Default: Story = {
  render: (args) => (
    <div className="w-80">
      <Picker {...args} defaultValue={referenceDate} label="Release date" />
    </div>
  ),
};

function ControlledDatePicker() {
  const [value, setValue] = useState<Date | null>(referenceDate);

  return (
    <div className="grid w-80 gap-3">
      <Picker label="Review date" onValueChange={setValue} value={value} />
      <output className="text-xs text-city-muted-foreground">
        Selected: {value?.toLocaleDateString() ?? 'None'}
      </output>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDatePicker />,
};

export const Sizes: Story = {
  render: () => (
    <div className="grid w-80 gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Picker
          key={size}
          defaultValue={referenceDate}
          label={`${size.toUpperCase()} date picker`}
          size={size}
        />
      ))}
    </div>
  ),
};

export const Constraints: Story = {
  render: () => (
    <div className="w-80">
      <Picker
        isDateUnavailable={(date) => date.getDay() === 0 || date.getDay() === 6}
        label="Deployment date"
        maxValue={new Date(2026, 6, 31)}
        minValue={new Date(2026, 6, 1)}
        required
      />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="grid w-80 gap-4">
      <Picker defaultValue={referenceDate} disabled label="Disabled" />
      <Picker defaultValue={referenceDate} label="Read only" readOnly />
      <Picker invalid label="Invalid" />
    </div>
  ),
};

export const NarrowViewport: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <div className="w-full max-w-72">
      <Picker defaultOpen defaultValue={referenceDate} label="Inspection date" />
    </div>
  ),
};

export const KeyboardNavigation: Story = {
  render: () => (
    <div className="w-80">
      <Picker defaultValue={referenceDate} label="Keyboard date" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const trigger = page.getByRole('button', { name: 'Open calendar' });

    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await expect(page.getByLabelText('Keyboard date calendar')).toBeVisible();

    await userEvent.keyboard('{ArrowRight}{Enter}');

    await expect(page.getByRole('textbox', { name: 'Keyboard date' })).toHaveValue('2026-07-16');
    await expect(trigger).toHaveFocus();
  },
};
