import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import ActivityExample from '../../../public-docs/src/docs/components/agent-activity/examples/activity';
import DetailsExample from '../../../public-docs/src/docs/components/agent-activity/examples/details';
import EventsExample from '../../../public-docs/src/docs/components/agent-activity/examples/events';

const meta = {
  title: 'AI & Chat/AgentActivity',
  component: ActivityExample,
  tags: ['autodocs'],
  args: { pending: false, density: 'comfortable' },
  argTypes: {
    pending: { control: 'boolean' },
    density: { control: 'inline-radio', options: ['comfortable', 'compact'] },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 560, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ActivityExample>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Thinking: Story = { args: { pending: true } };
export const Compact: Story = { args: { pending: true, density: 'compact' } };
export const Events: Story = { render: () => <EventsExample /> };
export const Details: Story = { render: () => <DetailsExample /> };
export const Narrow: Story = {
  render: () => (
    <div style={{ width: 240 }}>
      <ActivityExample pending />
      <EventsExample />
      <DetailsExample />
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const root of canvasElement.querySelectorAll<HTMLElement>('[data-city-agent-activity]')) {
      await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth);
    }
  },
};
export const Dark: Story = { ...Narrow, globals: { theme: 'dark' } };
