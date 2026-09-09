import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Check } from 'lucide-react';
import { Timeline, type TimelineRootProps } from '@opnay/city-ds-react';

function History(props: Pick<TimelineRootProps, 'density'>) {
  return (
    <Timeline.Root {...props} aria-label="Activity history">
      {['Review completed', 'Document updated', 'Project created'].map((title, index) => (
        <Timeline.Item key={title}>
          <Timeline.Indicator>{index === 0 ? <Check /> : undefined}</Timeline.Indicator>
          <Timeline.Connector data-testid={`connector-${index}`} />
          <Timeline.Content>
            <Timeline.Time dateTime="2026-09-09">September 9</Timeline.Time>
            <Timeline.Title>{title}</Timeline.Title>
            <Timeline.Description>
              {index === 1
                ? 'document_0123456789abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz'
                : 'Seoyeon Kim updated the project.'}
            </Timeline.Description>
          </Timeline.Content>
        </Timeline.Item>
      ))}
    </Timeline.Root>
  );
}

const meta = {
  title: 'Data display/Timeline',
  component: History,
  tags: ['autodocs'],
  args: { density: 'comfortable' },
  argTypes: { density: { control: 'inline-radio', options: ['comfortable', 'compact'] } },
} satisfies Meta<typeof History>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  render: (args) => (
    <div style={{ width: 480, maxWidth: '100%' }}>
      <History {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('listitem')).toHaveLength(3);
    await expect(canvas.getByTestId('connector-0')).toBeVisible();
    await expect(canvas.getByTestId('connector-1')).toBeVisible();
    await expect(canvas.getByTestId('connector-2')).not.toBeVisible();
    const first = canvas.getAllByRole('listitem')[0];
    const next = canvas.getAllByRole('listitem')[1];
    if (!first || !next) throw new Error('Expected at least two timeline events');
    const connector = canvas.getByTestId('connector-0').getBoundingClientRect();
    await expect(connector.height).toBeGreaterThan(0);
    await expect(Math.abs(connector.bottom - next.getBoundingClientRect().top)).toBeLessThan(1);
    await expect(first.getBoundingClientRect().height).toBeGreaterThan(24);
  },
} satisfies Story;
export const Compact: Story = {
  args: { density: 'compact' },
  render: Default.render,
  play: Default.play,
};
export const Narrow: Story = {
  render: (args) => (
    <div style={{ width: 240 }}>
      <History {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole('list');
    await expect(list.scrollWidth).toBeLessThanOrEqual(list.clientWidth);
  },
};
export const SingleItem: Story = {
  render: () => (
    <Timeline.Root>
      <Timeline.Item>
        <Timeline.Indicator />
        <Timeline.Connector data-testid="single-connector" />
        <Timeline.Content>
          <Timeline.Title>Project created</Timeline.Title>
        </Timeline.Content>
      </Timeline.Item>
    </Timeline.Root>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByTestId('single-connector')).not.toBeVisible();
  },
};
