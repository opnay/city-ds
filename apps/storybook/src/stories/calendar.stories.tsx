import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ko } from '@daypicker/react/locale';
import { expect, userEvent, within } from 'storybook/test';

import { Calendar } from '@opnay/city-ds-react';

const meta = {
  title: 'Forms/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '`Calendar`는 단일 로컬 날짜를 선택하는 인라인 캘린더입니다. 날짜 그리드의 키보드 이동과 접근성 이름은 DayPicker를 사용하고, 시각 상태는 City 토큰으로 표현합니다. 값은 로컬 날짜이므로 저장에는 `YYYY-MM-DD`를 사용하고 `toISOString()`은 사용하지 마십시오.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj<typeof meta>;

const referenceDate = new Date(2026, 6, 15);

export const Default: Story = {
  args: {
    'aria-label': 'Release calendar',
    defaultValue: referenceDate,
    today: referenceDate,
  },
};

function ControlledCalendar() {
  const [value, setValue] = useState<Date | null>(referenceDate);

  return (
    <div className="grid w-fit gap-3">
      <Calendar
        aria-label="Controlled calendar"
        onValueChange={setValue}
        today={referenceDate}
        value={value}
      />
      <output className="text-center text-xs text-city-muted-foreground">
        Selected: {value?.toLocaleDateString() ?? 'None'}
      </output>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledCalendar />,
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-8">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="grid gap-2">
          <span className="text-xs font-medium text-city-muted-foreground">
            {size.toUpperCase()}
          </span>
          <Calendar
            aria-label={`${size} calendar`}
            defaultValue={referenceDate}
            size={size}
            today={referenceDate}
          />
        </div>
      ))}
    </div>
  ),
};

export const Constraints: Story = {
  args: {
    'aria-label': 'Deployment calendar',
    defaultMonth: referenceDate,
    isDateUnavailable: (date) => date.getDay() === 0 || date.getDay() === 6,
    maxValue: new Date(2026, 6, 25),
    minValue: new Date(2026, 6, 10),
    today: referenceDate,
  },
};

export const KoreanDropdownNavigation: Story = {
  args: {
    'aria-label': '날짜 선택',
    captionLayout: 'dropdown',
    defaultValue: referenceDate,
    locale: ko,
    maxValue: new Date(2030, 11, 31),
    minValue: new Date(2020, 0, 1),
    today: referenceDate,
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-8">
      <div className="grid gap-2">
        <span className="text-xs font-medium text-city-muted-foreground">Disabled</span>
        <Calendar
          aria-label="Disabled calendar"
          defaultValue={referenceDate}
          disabled
          size="sm"
          today={referenceDate}
        />
      </div>
      <div className="grid gap-2">
        <span className="text-xs font-medium text-city-muted-foreground">Read only</span>
        <Calendar
          aria-label="Read-only calendar"
          defaultValue={referenceDate}
          readOnly
          size="sm"
          today={referenceDate}
        />
      </div>
      <div className="grid gap-2">
        <span className="text-xs font-medium text-city-muted-foreground">Invalid</span>
        <Calendar
          aria-label="Invalid calendar"
          defaultValue={referenceDate}
          invalid
          size="sm"
          today={referenceDate}
        />
      </div>
    </div>
  ),
};

function KeyboardCalendar() {
  const [value, setValue] = useState<Date | null>(referenceDate);

  return (
    <div className="grid gap-3">
      <Calendar
        aria-label="Keyboard calendar"
        autoFocus
        onValueChange={setValue}
        today={referenceDate}
        value={value}
      />
      <output className="text-center text-xs text-city-muted-foreground">
        Selected day: {value?.getDate() ?? 'None'}
      </output>
    </div>
  );
}

export const KeyboardNavigation: Story = {
  render: () => <KeyboardCalendar />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.keyboard('{ArrowRight}{Enter}');

    await expect(canvas.getByText('Selected day: 16')).toBeVisible();
    await expect(canvas.getByRole('gridcell', { name: '16' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  },
};
