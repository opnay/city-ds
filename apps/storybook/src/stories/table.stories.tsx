import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  DataTableRegion,
  Input,
  Pagination,
  Table,
  type ControlSize,
  type TableSortDirection,
  type TableVariant,
} from '@opnay/city-ds-react';

const rows = [
  { id: 'BLD-104', name: 'Beacon', owner: 'Operations', status: 'Active', budget: '$42K' },
  { id: 'BLD-118', name: 'Courier', owner: 'Platform', status: 'Review', budget: '$31K' },
  { id: 'BLD-125', name: 'District', owner: 'Design', status: 'Draft', budget: '$18K' },
] as const;

interface TableStoryArgs {
  size: ControlSize;
  variant: TableVariant;
}

function DataTable({ size, variant }: TableStoryArgs) {
  return (
    <div style={{ maxWidth: 720, width: '100%' }}>
      <Table.Root aria-label="Project inventory" size={size} variant={variant}>
        <Table.Caption>Current project inventory</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.Head scope="col">ID</Table.Head>
            <Table.Head scope="col">Project</Table.Head>
            <Table.Head scope="col">Owner</Table.Head>
            <Table.Head scope="col">Status</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((row) => (
            <Table.Row key={row.id}>
              <Table.Cell>{row.id}</Table.Cell>
              <Table.Cell>{row.name}</Table.Cell>
              <Table.Cell>{row.owner}</Table.Cell>
              <Table.Cell>{row.status}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.Cell colSpan={3}>Total projects</Table.Cell>
            <Table.Cell>{rows.length}</Table.Cell>
          </Table.Row>
        </Table.Footer>
      </Table.Root>
    </div>
  );
}

function InteractiveDataTable({ size, variant }: TableStoryArgs) {
  const [sortDirection, setSortDirection] = React.useState<TableSortDirection>('asc');
  const [selectedRows, setSelectedRows] = React.useState<string[]>(['BLD-104']);
  const sortedRows = [...rows].sort((a, b) =>
    sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
  );
  const allSelected = selectedRows.length === rows.length;
  const partiallySelected = selectedRows.length > 0 && !allSelected;

  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 760, width: '100%' }}>
      <Input aria-label="Search projects" placeholder="Search projects..." />
      <Table.ScrollArea>
        <Table.Root aria-label="Selectable projects" size={size} variant={variant}>
          <Table.Header>
            <Table.Row>
              <Table.SelectionHead
                checked={partiallySelected ? 'indeterminate' : allSelected}
                onCheckedChange={(checked) =>
                  setSelectedRows(checked ? rows.map((row) => row.id) : [])
                }
              />
              <Table.Head aria-sort={sortDirection === 'asc' ? 'ascending' : 'descending'}>
                <Table.SortButton direction={sortDirection} onDirectionChange={setSortDirection}>
                  Project
                </Table.SortButton>
              </Table.Head>
              <Table.Head>Owner</Table.Head>
              <Table.Head>Status</Table.Head>
              <Table.Head>Budget</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {sortedRows.map((row) => (
              <Table.Row key={row.id} data-selected={selectedRows.includes(row.id) || undefined}>
                <Table.SelectionCell
                  checked={selectedRows.includes(row.id)}
                  label={`Select ${row.name}`}
                  onCheckedChange={(checked) =>
                    setSelectedRows((current) =>
                      checked ? [...current, row.id] : current.filter((id) => id !== row.id),
                    )
                  }
                />
                <Table.Cell>{row.name}</Table.Cell>
                <Table.Cell>{row.owner}</Table.Cell>
                <Table.Cell>{row.status}</Table.Cell>
                <Table.Cell>{row.budget}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
      <Pagination.Root onPageChange={() => {}} page={1} totalPages={4} />
    </div>
  );
}

const meta = {
  title: 'Data display/Table',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '밀도와 표면 변형을 선택할 수 있는 합성형 데이터 테이블입니다.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'inline-radio', options: ['line', 'surface'] },
  },
  render: (args) => <DataTable {...args} />,
} satisfies Meta<TableStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { size: 'md', variant: 'line' } };
export const Surface: Story = { args: { size: 'md', variant: 'surface' } };
export const Compact: Story = { args: { size: 'sm', variant: 'line' } };
export const Spacious: Story = { args: { size: 'lg', variant: 'line' } };

export const SortingAndSelection: Story = {
  args: { size: 'md', variant: 'line' },
  render: (args) => <InteractiveDataTable {...args} />,
};

export const Empty: Story = {
  args: { size: 'md', variant: 'line' },
  render: (args) => (
    <Table.Root aria-label="Empty projects" size={args.size} variant={args.variant}>
      <Table.Body>
        <Table.StateRow colSpan={4}>No projects match the current filters.</Table.StateRow>
      </Table.Body>
    </Table.Root>
  ),
};

export const Loading: Story = {
  args: { size: 'md', variant: 'surface' },
  render: (args) => (
    <Table.Root aria-label="Loading projects" size={args.size} variant={args.variant}>
      <Table.Body>
        <Table.StateRow colSpan={4} status="loading">
          Loading projects...
        </Table.StateRow>
      </Table.Body>
    </Table.Root>
  ),
};

export const HorizontalOverflow: Story = {
  args: { size: 'md', variant: 'line' },
  render: (args) => (
    <DataTableRegion
      hint="Scroll horizontally to view every column."
      label="Wide project inventory scroll area"
      style={{ maxWidth: 420 }}
    >
      <Table.Root aria-label="Wide project inventory" size={args.size} variant={args.variant}>
        <Table.Header>
          <Table.Row>
            {['ID', 'Project', 'Owner', 'Status', 'Budget', 'Updated', 'Region'].map((header) => (
              <Table.Head key={header}>{header}</Table.Head>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((row) => (
            <Table.Row key={row.id}>
              <Table.Cell>{row.id}</Table.Cell>
              <Table.Cell>{row.name}</Table.Cell>
              <Table.Cell>{row.owner}</Table.Cell>
              <Table.Cell>{row.status}</Table.Cell>
              <Table.Cell>{row.budget}</Table.Cell>
              <Table.Cell>Today</Table.Cell>
              <Table.Cell>North</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </DataTableRegion>
  ),
};
