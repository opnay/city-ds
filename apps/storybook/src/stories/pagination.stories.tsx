import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from '@city-ds/react';

interface PaginationStoryArgs {
  boundaryCount: number;
  groupSize: number;
  initialPage: number;
  siblingCount: number;
  totalPages: number;
}

function PaginationExample({
  boundaryCount,
  groupSize,
  initialPage,
  siblingCount,
  totalPages,
}: PaginationStoryArgs) {
  const [page, setPage] = React.useState(initialPage);

  const resolvedPage = Math.min(Math.max(page, 1), totalPages);

  return (
    <Pagination.Root
      aria-label="Project pages"
      boundaryCount={boundaryCount}
      groupSize={groupSize}
      onPageChange={setPage}
      page={resolvedPage}
      siblingCount={siblingCount}
      totalPages={totalPages}
    />
  );
}

const meta = {
  title: 'Navigation/Pagination',
  component: PaginationExample,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '페이지 범위와 경계 상태를 관리하는 접근성 높은 페이지네이션입니다.',
      },
    },
  },
  argTypes: {
    boundaryCount: { control: { min: 0, max: 3, step: 1 }, type: 'number' },
    groupSize: { control: { min: 1, max: 10, step: 1 }, type: 'number' },
    initialPage: { control: { min: 1, max: 30, step: 1 }, type: 'number' },
    siblingCount: { control: { min: 0, max: 3, step: 1 }, type: 'number' },
    totalPages: { control: { min: 1, max: 30, step: 1 }, type: 'number' },
  },
  render: (args) => <PaginationExample key={`${args.initialPage}-${args.totalPages}`} {...args} />,
} satisfies Meta<PaginationStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    boundaryCount: 1,
    groupSize: 5,
    initialPage: 4,
    siblingCount: 1,
    totalPages: 9,
  },
};

export const ManyPages: Story = {
  args: {
    boundaryCount: 1,
    groupSize: 5,
    initialPage: 14,
    siblingCount: 1,
    totalPages: 30,
  },
};

export const FirstPage: Story = {
  args: {
    boundaryCount: 1,
    groupSize: 5,
    initialPage: 1,
    siblingCount: 1,
    totalPages: 12,
  },
};

export const FinalPage: Story = {
  args: {
    boundaryCount: 1,
    groupSize: 5,
    initialPage: 12,
    siblingCount: 1,
    totalPages: 12,
  },
};
