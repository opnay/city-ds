import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton, type SkeletonSize, type SkeletonVariant } from '@city-ds/react';
import type { ReactNode } from 'react';

interface SkeletonStoryArgs {
  size: SkeletonSize;
  variant: SkeletonVariant;
}

function SkeletonExample({ size, variant }: SkeletonStoryArgs) {
  if (variant === 'rectangular') {
    return <Skeleton className="w-[min(16rem,calc(100vw-2rem))]" size={size} variant={variant} />;
  }

  return <Skeleton size={size} variant={variant} />;
}

interface LoadingPreviewProps {
  children: ReactNode;
  className: string;
  label: string;
}

function LoadingPreview({ children, className, label }: LoadingPreviewProps) {
  return (
    <div className={className} role="status">
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

const meta = {
  title: 'Feedback/Skeleton',
  component: SkeletonExample,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '콘텐츠가 로드되는 동안 레이아웃을 유지하는 장식용 자리 표시자입니다. 로딩 상태와 접근 가능한 이름은 상위 영역에서 관리합니다.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'inline-radio', options: ['text', 'circular', 'rectangular'] },
  },
  args: {
    size: 'md',
    variant: 'text',
  },
  render: (args) => <SkeletonExample {...args} />,
} satisfies Meta<SkeletonStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TextBlock: Story = {
  render: () => (
    <LoadingPreview
      className="flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2"
      label="Loading article"
    >
      <Skeleton className="w-3/4" />
      <Skeleton className="w-full" />
      <Skeleton className="w-5/6" size="sm" />
    </LoadingPreview>
  ),
};

export const Avatar: Story = {
  render: () => (
    <LoadingPreview className="flex" label="Loading avatar">
      <Skeleton variant="circular" size="lg" />
    </LoadingPreview>
  ),
};

export const Card: Story = {
  render: () => (
    <LoadingPreview
      className="flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-4 rounded-city-lg border border-city-border p-4"
      label="Loading card"
    >
      <Skeleton variant="rectangular" size="lg" />
      <div className="flex flex-col gap-2">
        <Skeleton className="w-2/3" />
        <Skeleton className="w-full" size="sm" />
      </div>
    </LoadingPreview>
  ),
};

export const TableRow: Story = {
  render: () => (
    <LoadingPreview
      className="grid w-[min(36rem,calc(100vw-2rem))] grid-cols-4 gap-3"
      label="Loading table row"
    >
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </LoadingPreview>
  ),
};
