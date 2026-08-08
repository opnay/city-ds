import type { Meta, StoryObj } from '@storybook/react-vite';
import { Progress, type ControlSize } from '@opnay/city-ds-react';

interface ProgressStoryArgs {
  size: ControlSize;
  value: number | null;
}

function LinearProgress({ size, value }: ProgressStoryArgs) {
  return (
    <div style={{ minWidth: 280 }}>
      <Progress.Root aria-label="Build progress" size={size} value={value}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Progress.Label>Build artifact</Progress.Label>
          <Progress.Value />
        </div>
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>
    </div>
  );
}

const meta = {
  title: 'Feedback/Progress',
  component: LinearProgress,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '선형·원형과 결정·비결정 상태를 제공하는 진행 상태 표시기입니다.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['xsm', 'sm', 'md', 'lg', 'xlg'] },
    value: { control: { min: 0, max: 100, step: 1 }, type: 'number' },
  },
  render: (args) => <LinearProgress {...args} />,
} satisfies Meta<ProgressStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'md',
    value: 64,
  },
};

export const Complete: Story = {
  args: {
    size: 'md',
    value: 100,
  },
};

export const Indeterminate: Story = {
  args: {
    size: 'md',
    value: null,
  },
};

export const Circular: Story = {
  args: {
    size: 'md',
    value: 64,
  },
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <Progress.Circular aria-label="Deployment progress" size="lg" value={72} />
      <Progress.Circular aria-label="Sync in progress" size="lg" value={null} />
    </div>
  ),
};
