import type { Meta, StoryObj } from '@storybook/react-vite';
import { Meter, type ControlSize, type MeterRange } from '@opnay/city-ds-react';

interface MeterStoryArgs {
  max: number;
  min: number;
  size: ControlSize;
  value: number;
}

const highIsRisk = [
  { from: 0, to: 25, label: 'Low risk', color: 'var(--city-color-success)' },
  { from: 25, to: 50, label: 'Observe', color: 'var(--city-color-info)' },
  { from: 50, to: 75, label: 'At risk', color: 'var(--city-color-warning)' },
  { from: 75, to: 100, label: 'Critical', color: 'var(--city-color-destructive)' },
] satisfies readonly MeterRange[];

const highIsGood = [
  { from: 0, to: 25, label: 'Needs attention', color: 'var(--city-color-destructive)' },
  { from: 25, to: 50, label: 'Observe', color: 'var(--city-color-warning)' },
  { from: 50, to: 75, label: 'Healthy', color: 'var(--city-color-info)' },
  { from: 75, to: 100, label: 'Excellent', color: 'var(--city-color-success)' },
] satisfies readonly MeterRange[];

const rangesWithGap = [
  { from: 0, to: 25, label: 'Low', color: 'var(--city-color-info)' },
  { from: 75, to: 100, label: 'High', color: 'var(--city-color-success)' },
] satisfies readonly MeterRange[];

function StorageMeter({ max, min, size, value }: MeterStoryArgs) {
  return (
    <div style={{ minWidth: 280 }}>
      <Meter.Root max={max} min={min} size={size} value={value}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Meter.Label>Storage used</Meter.Label>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <Meter.RangeLabel />
            <Meter.Value />
          </div>
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
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <Meter.RangeLabel />
            <Meter.Value />
          </div>
        </div>
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>
    </div>
  ),
};

export const FourCustomSteps: Story = {
  args: {
    min: 0,
    max: 100,
    size: 'md',
    value: 62,
  },
  render: (args) => (
    <div style={{ minWidth: 280 }}>
      <Meter.Root
        max={args.max}
        min={args.min}
        ranges={highIsRisk}
        size={args.size}
        value={args.value}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Meter.Label>Deployment failure rate</Meter.Label>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <Meter.RangeLabel />
            <Meter.Value />
          </div>
        </div>
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>
    </div>
  ),
};

export const HigherIsBetter: Story = {
  args: {
    min: 0,
    max: 100,
    size: 'md',
    value: 88,
  },
  render: (args) => (
    <div style={{ minWidth: 280 }}>
      <Meter.Root
        max={args.max}
        min={args.min}
        ranges={highIsGood}
        size={args.size}
        value={args.value}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Meter.Label>Service health score</Meter.Label>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <Meter.RangeLabel />
            <Meter.Value />
          </div>
        </div>
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>
    </div>
  ),
};

export const BoundaryAndGap: Story = {
  args: {
    min: 0,
    max: 100,
    size: 'md',
    value: 25,
  },
  render: () => (
    <div style={{ display: 'grid', gap: 20, minWidth: 280 }}>
      <Meter.Root aria-label="Boundary value" max={100} ranges={highIsRisk} value={25}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Meter.Label>Boundary value at 25</Meter.Label>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <Meter.RangeLabel />
            <Meter.Value />
          </div>
        </div>
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>
      <Meter.Root aria-label="Gap value" max={100} ranges={rangesWithGap} value={50}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Meter.Label>Gap value at 50</Meter.Label>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <Meter.RangeLabel />
            <Meter.Value />
          </div>
        </div>
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>
    </div>
  ),
};
