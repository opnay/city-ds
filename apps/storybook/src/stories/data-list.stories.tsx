import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Badge, DataList, type DataListRootProps } from '@opnay/city-ds-react';

function Details(props: Pick<DataListRootProps, 'orientation' | 'density' | 'dividers'>) {
  return (
    <DataList.Root {...props} aria-label="Account details" className="w-full">
      <DataList.Item>
        <DataList.Label>Name</DataList.Label>
        <DataList.Value>Seoyeon Kim</DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label>Status</DataList.Label>
        <DataList.Value>
          <Badge appearance="subtle">Active</Badge>
        </DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label>Connection ID</DataList.Label>
        <DataList.Value>
          connection_0123456789abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz
        </DataList.Value>
      </DataList.Item>
    </DataList.Root>
  );
}

const meta = {
  title: 'Data display/Data list',
  component: Details,
  tags: ['autodocs'],
  args: { orientation: 'horizontal', density: 'comfortable', dividers: false },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    density: { control: 'inline-radio', options: ['comfortable', 'compact'] },
    dividers: { control: 'boolean' },
  },
} satisfies Meta<typeof Details>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal = {
  render: (args) => (
    <div style={{ width: 640, maxWidth: '100%' }}>
      <Details {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const name = canvas.getByText('Name');
    const value = canvas.getByText('Seoyeon Kim');
    await expect(name.tagName).toBe('DT');
    await expect(value.tagName).toBe('DD');
    await expect(value.getBoundingClientRect().left).toBeGreaterThan(
      name.getBoundingClientRect().left,
    );
    await expect(
      Math.abs(value.getBoundingClientRect().top - name.getBoundingClientRect().top),
    ).toBeLessThan(2);
  },
} satisfies Story;
export const Vertical: Story = { args: { orientation: 'vertical' }, render: Horizontal.render };
export const CompactWithDividers: Story = {
  args: { density: 'compact', dividers: true },
  render: Horizontal.render,
};
export const NarrowContainer: Story = {
  render: (args) => (
    <div style={{ width: 280, maxWidth: '100%' }}>
      <Details {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const label = canvas.getByText('Name');
    const value = canvas.getByText('Seoyeon Kim');
    await expect(value.getBoundingClientRect().top).toBeGreaterThan(
      label.getBoundingClientRect().top,
    );
    const list = canvas.getByLabelText('Account details');
    await expect(list.scrollWidth).toBeLessThanOrEqual(list.clientWidth);
  },
};
