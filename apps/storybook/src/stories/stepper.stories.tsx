import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Stepper, type StepperRootProps } from '@opnay/city-ds-react';

function Steps({
  orientation = 'horizontal',
  error = false,
  onBack,
}: Pick<StepperRootProps, 'orientation'> & { error?: boolean; onBack?: () => void }) {
  return (
    <div style={{ width: 640, maxWidth: '100%' }}>
      <Stepper.Root aria-label="Setup steps" orientation={orientation}>
        <Stepper.Item status="completed">
          <Stepper.Indicator>1</Stepper.Indicator>
          <Stepper.Content>
            <Stepper.Trigger onClick={onBack}>Project details</Stepper.Trigger>
            <Stepper.Description>City Web</Stepper.Description>
          </Stepper.Content>
        </Stepper.Item>
        <Stepper.Item current status={error ? 'error' : 'pending'}>
          <Stepper.Indicator>2</Stepper.Indicator>
          <Stepper.Content>
            <Stepper.Title>Team members</Stepper.Title>
            <Stepper.Description>
              {error ? 'Review the invitation addresses.' : 'Invite your collaborators.'}
            </Stepper.Description>
          </Stepper.Content>
        </Stepper.Item>
        <Stepper.Item>
          <Stepper.Indicator>3</Stepper.Indicator>
          <Stepper.Content>
            <Stepper.Trigger disabled>Review settings</Stepper.Trigger>
            <Stepper.Description>Confirm before creating.</Stepper.Description>
          </Stepper.Content>
        </Stepper.Item>
      </Stepper.Root>
    </div>
  );
}
const meta = {
  title: 'Navigation/Stepper',
  component: Steps,
  tags: ['autodocs'],
  args: { orientation: 'horizontal', error: false, onBack: fn() },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    error: { control: 'boolean' },
  },
} satisfies Meta<typeof Steps>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Horizontal: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Project details' }));
    await expect(args.onBack).toHaveBeenCalledOnce();
    await expect(canvas.getByRole('button', { name: 'Review settings' })).toBeDisabled();
    await expect(canvas.getAllByRole('listitem')[1]).toHaveAttribute('aria-current', 'step');
  },
};
export const Vertical: Story = { args: { orientation: 'vertical' } };
export const Error: Story = { args: { error: true } };
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole('list');
    await expect(list.scrollWidth).toBeLessThanOrEqual(list.clientWidth);
    const items = within(canvasElement).getAllByRole('listitem');
    await expect(items[0]!.getBoundingClientRect().top).toBe(items[1]!.getBoundingClientRect().top);
    await expect(within(canvasElement).queryByText('City Web')).not.toBeInTheDocument();
    for (const item of items) {
      const indicator = item.querySelector('[aria-hidden="true"]')!.getBoundingClientRect();
      const bounds = item.getBoundingClientRect();
      await expect(
        Math.abs(indicator.left + indicator.width / 2 - bounds.left - bounds.width / 2),
      ).toBeLessThan(1);
    }
  },
};
