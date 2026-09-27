import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import ContentExample from '../../../public-docs/src/docs/components/article/examples/content';
import ChatExample from '../../../public-docs/src/docs/components/article/examples/chat';
import HeadingsExample from '../../../public-docs/src/docs/components/article/examples/headings';

const meta = {
  title: 'AI & Chat/Article',
  component: ContentExample,
  tags: ['autodocs'],
  args: { format: 'markdown' },
  argTypes: {
    format: { control: 'inline-radio', options: ['markdown', 'react'] },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 560, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ContentExample>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Markdown: Story = {};
export const ReactChildren: Story = { args: { format: 'react' } };
export const InConversation: Story = { render: () => <ChatExample /> };
export const Headings: Story = { render: () => <HeadingsExample /> };
export const Narrow: Story = {
  render: (args) => (
    <div style={{ width: 240 }}>
      <ContentExample {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector<HTMLElement>('[data-city-article]')!;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth);
    await expect(root.querySelectorAll('ul li').length).toBeGreaterThan(0);
    await expect(root.querySelectorAll('ol li').length).toBeGreaterThan(0);
  },
};
export const Dark: Story = { ...Narrow, globals: { theme: 'dark' } };
