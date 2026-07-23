import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table, type ControlSize, type TableVariant } from '@city-ds/react';

const rows = [
  { id: 'BLD-104', name: 'Beacon', owner: 'Operations', status: 'Active' },
  { id: 'BLD-118', name: 'Courier', owner: 'Platform', status: 'Review' },
  { id: 'BLD-125', name: 'District', owner: 'Design', status: 'Draft' },
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

export const Default: Story = {
  args: {
    size: 'md',
    variant: 'line',
  },
};

export const Surface: Story = {
  args: {
    size: 'md',
    variant: 'surface',
  },
};

export const Compact: Story = {
  args: {
    size: 'sm',
    variant: 'line',
  },
};

export const Spacious: Story = {
  args: {
    size: 'lg',
    variant: 'line',
  },
};
