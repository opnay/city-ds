import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Button,
  DataTableRegion,
  FilterBar,
  Input,
  SegmentedControl,
  Select,
  Table,
} from '@opnay/city-ds-react';

const statusItems = {
  all: 'All statuses',
  active: 'Active',
  paused: 'Paused',
};

const meta = {
  title: 'Layout/FilterBar',
  component: FilterBar,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Project filters',
    children: null,
  },
  argTypes: {
    density: {
      control: 'inline-radio',
      options: ['comfortable', 'compact'],
    },
  },
} satisfies Meta<typeof FilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ResponsiveFilters: Story = {
  render: (args) => (
    <div className="w-full max-w-4xl overflow-hidden rounded-city-md border border-city-border">
      <div className="border-b border-city-border px-4 py-3">
        <FilterBar
          {...args}
          actions={
            <Button size="sm" type="button" variant="outline">
              Reset filters
            </Button>
          }
        >
          <Input aria-label="Search projects" placeholder="Search…" size="sm" />
          <Select.Root defaultValue="all" items={statusItems} size="sm">
            <Select.Label className="city-sr-only">Project status</Select.Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Icon />
            </Select.Trigger>
            <Select.Portal>
              <Select.Positioner sideOffset={6}>
                <Select.Popup>
                  <Select.List>
                    {Object.entries(statusItems).map(([value, label]) => (
                      <Select.Item key={value} value={value}>
                        <Select.ItemIndicator />
                        <Select.ItemText>{label}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.List>
                </Select.Popup>
              </Select.Positioner>
            </Select.Portal>
          </Select.Root>
          <SegmentedControl aria-label="Project period" defaultValue="week" size="sm">
            <SegmentedControl.Item value="today">Today</SegmentedControl.Item>
            <SegmentedControl.Item value="week">7 days</SegmentedControl.Item>
            <SegmentedControl.Item value="month">30 days</SegmentedControl.Item>
          </SegmentedControl>
        </FilterBar>
      </div>
      <DataTableRegion label="Project list">
        <Table.Root size="sm">
          <Table.Header>
            <Table.Row>
              <Table.Head>Project</Table.Head>
              <Table.Head>Status</Table.Head>
              <Table.Head>Updated</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Water quality</Table.Cell>
              <Table.Cell>Active</Table.Cell>
              <Table.Cell>Today</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </DataTableRegion>
    </div>
  ),
};
