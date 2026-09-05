import type { Meta, StoryObj } from '@storybook/react-vite';
import { Meter, type ControlSize } from '@opnay/city-ds-react';

interface MeterStoryArgs {
  max: number;
  min: number;
  size: ControlSize;
  value: number;
}

function StorageMeter({ max, min, size, value }: MeterStoryArgs) {
  return (
    <div style={{ minWidth: 280 }}>
      <Meter.Root max={max} min={min} size={size} value={value}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Meter.Label>Storage used</Meter.Label>
          <Meter.Value />
        </div>
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>
    </div>
  );
}

const meta = {
  title: 'Data display/Meter',
  component: StorageMeter,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '현재 용량이나 점수처럼 정해진 범위 안의 정적 측정값을 표시합니다.',
      },
    },
  },
  argTypes: {
    min: { control: { type: 'number' } },
    max: { control: { type: 'number' } },
    size: { control: 'inline-radio', options: ['xsm', 'sm', 'md', 'lg', 'xlg'] },
    value: { control: { type: 'number' } },
  },
  render: (args) => <StorageMeter {...args} />,
} satisfies Meta<MeterStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    min: 0,
    max: 256,
    size: 'md',
    value: 192,
  },
};

export const Minimum: Story = {
  args: {
    min: 20,
    max: 120,
    size: 'md',
    value: 20,
  },
};

export const Maximum: Story = {
  args: {
    min: 0,
    max: 100,
    size: 'md',
    value: 100,
  },
};

export const FormattedValue: Story = {
  args: {
    min: 0,
    max: 1024,
    size: 'lg',
    value: 768,
  },
  render: (args) => (
    <div style={{ minWidth: 280 }}>
      <Meter.Root
        format={{ style: 'unit', unit: 'gigabyte', unitDisplay: 'narrow' }}
        locale="en-US"
        max={args.max}
        min={args.min}
        size={args.size}
        value={args.value}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Meter.Label>Storage used</Meter.Label>
          <Meter.Value />
        </div>
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>
    </div>
  ),
};
