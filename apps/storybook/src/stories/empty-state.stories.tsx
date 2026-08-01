import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, EmptyState, type EmptyStateDensity } from '@opnay/city-ds-react';

function TableIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x={3} y={4} width={18} height={16} rx={2} />
      <path d="M3 10h18M9 4v16" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx={11} cy={11} r={7} />
      <path d="m16 16 4 4" />
    </svg>
  );
}

interface EmptyStateStoryArgs {
  density: EmptyStateDensity;
}

function EmptyStateExample({ density }: EmptyStateStoryArgs) {
  return (
    <EmptyState.Root density={density}>
      <EmptyState.Icon>
        <TableIcon />
      </EmptyState.Icon>
      <EmptyState.Title level={3}>No records yet</EmptyState.Title>
      <EmptyState.Description>
        Create a record or import data to populate this table.
      </EmptyState.Description>
    </EmptyState.Root>
  );
}

const meta = {
  title: 'Feedback/EmptyState',
  component: EmptyStateExample,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '데이터 없음, 검색 결과 없음, 초기 설정 필요 상태를 제목·설명·아이콘·액션으로 안내합니다.',
      },
    },
  },
  argTypes: {
    density: { control: 'inline-radio', options: ['default', 'compact'] },
  },
  args: {
    density: 'default',
  },
  render: (args) => <EmptyStateExample {...args} />,
} satisfies Meta<EmptyStateStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoData: Story = {};

export const NoSearchResults: Story = {
  render: (args) => (
    <EmptyState.Root {...args}>
      <EmptyState.Icon>
        <SearchIcon />
      </EmptyState.Icon>
      <EmptyState.Title level={3}>No results found</EmptyState.Title>
      <EmptyState.Description>
        Try adjusting filters or search terms, then run the search again.
      </EmptyState.Description>
    </EmptyState.Root>
  ),
};

export const WithActions: Story = {
  render: (args) => (
    <EmptyState.Root {...args}>
      <EmptyState.Icon>
        <TableIcon />
      </EmptyState.Icon>
      <EmptyState.Title level={3}>Connect your first data source</EmptyState.Title>
      <EmptyState.Description>
        Add a source to start collecting records for this workspace.
      </EmptyState.Description>
      <EmptyState.Actions>
        <Button>Connect source</Button>
        <Button variant="outline">Read guide</Button>
      </EmptyState.Actions>
    </EmptyState.Root>
  ),
};
