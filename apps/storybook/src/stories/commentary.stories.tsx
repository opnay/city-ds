import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import MessageExample from '../../../public-docs/src/docs/components/commentary/examples/message';
import AppearancesExample from '../../../public-docs/src/docs/components/commentary/examples/appearances';

const meta = {
  title: 'AI & Chat/Commentary',
  component: MessageExample,
  tags: ['autodocs'],
  args: { appearance: 'plain', align: 'start', density: 'comfortable' },
  argTypes: {
    appearance: { control: 'inline-radio', options: ['plain', 'bubble'] },
    align: { control: 'inline-radio', options: ['start', 'end'] },
    density: { control: 'inline-radio', options: ['comfortable', 'compact'] },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 560, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MessageExample>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const BubbleEnd: Story = { args: { appearance: 'bubble', align: 'end' } };
export const Compact: Story = { args: { density: 'compact' } };
export const Appearances: Story = { render: () => <AppearancesExample /> };
export const Narrow: Story = {
  render: (args) => (
    <div style={{ width: 240 }}>
      <MessageExample {...args} />
    </div>
  ),
  args: { appearance: 'bubble', align: 'end' },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector<HTMLElement>('[data-city-commentary]')!;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth);
    const code = root.querySelector('pre')!;
    await expect(code.getBoundingClientRect().width).toBeLessThanOrEqual(root.clientWidth);
  },
};
export const Dark: Story = { ...Narrow, globals: { theme: 'dark' } };
