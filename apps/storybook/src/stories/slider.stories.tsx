import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import { Slider } from '@opnay/city-ds-react';

function SingleSlider({
  disabled = false,
  orientation = 'horizontal',
}: {
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
}) {
  const [value, setValue] = useState(40);
  const vertical = orientation === 'vertical';

  return (
    <div className={vertical ? 'h-56 w-16' : 'w-[min(24rem,calc(100vw-2rem))]'}>
      <Slider.Root
        aria-label="Build priority"
        disabled={disabled}
        onValueChange={setValue}
        orientation={orientation}
        step={5}
        value={value}
      >
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Anchor aria-label="Preset 20" value={20} />
            <Slider.Anchor aria-label="Preset 80" value={80} />
          </Slider.Track>
          <Slider.Thumb aria-label="Build priority value" />
        </Slider.Control>
        <Slider.Value />
      </Slider.Root>
    </div>
  );
}

const meta = {
  title: 'Inputs/Slider',
  component: SingleSlider,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          '단일 값·범위 값, 방향, Anchor 바로 선택과 Thumb 현재 값 툴팁을 제공합니다. Anchor는 Track 안에서 사용합니다.',
      },
    },
  },
} satisfies Meta<typeof SingleSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const slider = canvas.getByRole('slider', { name: 'Build priority value' });

    slider.focus();
    await userEvent.keyboard('[ArrowRight]');
    await expect(slider).toHaveValue('45');
    await expect(within(document.body).getByRole('tooltip')).toHaveTextContent('45');

    await userEvent.click(canvas.getByRole('button', { name: 'Preset 80' }));
    await expect(slider).toHaveValue('80');
  },
  render: () => <SingleSlider />,
};

export const Range: Story = {
  render: () => (
    <div className="w-[min(24rem,calc(100vw-2rem))]">
      <Slider.Root
        aria-label="Deployment window"
        defaultValue={[25, 75]}
        minStepsBetweenValues={1}
        step={5}
      >
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Anchor aria-label="Preset 40" value={40} />
            <Slider.Anchor aria-label="Preset 60" value={60} />
          </Slider.Track>
          <Slider.Thumb aria-label="Start deployment window" index={0} />
          <Slider.Thumb aria-label="End deployment window" index={1} />
        </Slider.Control>
        <Slider.Value />
      </Slider.Root>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => <SingleSlider orientation="vertical" />,
};

export const Disabled: Story = {
  render: () => <SingleSlider disabled />,
};
