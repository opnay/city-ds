import type { Meta, StoryObj } from '@storybook/react-vite';
import { RefreshCw } from 'lucide-react';
import { Button, Panel } from '@opnay/city-ds-react';

const meta = {
  title: 'Layout/Panel',
  component: Panel.Root,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Panel은 Header의 문맥·액션과 Body의 관계만 정의합니다. 배경, padding, border, radius와 overflow는 콘텐츠를 구성하는 소비자가 소유합니다.',
      },
    },
  },
} satisfies Meta<typeof Panel.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HeaderAndBody: Story = {
  render: () => (
    <Panel.Root className="w-full max-w-2xl overflow-hidden rounded-city-md border border-city-border">
      <Panel.Header
        actions={
          <Button size="sm" type="button" variant="ghost">
            <RefreshCw aria-hidden="true" size={15} />
            Refresh
          </Button>
        }
        className="border-b border-city-border px-3 py-2"
      >
        <div className="grid gap-0.5">
          <strong className="text-sm">Deployment</strong>
          <span className="text-xs text-city-muted-foreground">Production · Seoul</span>
        </div>
      </Panel.Header>
      <Panel.Body className="p-4">
        <p className="m-0 text-sm">The consumer owns this Body's spacing and surface.</p>
      </Panel.Body>
    </Panel.Root>
  ),
};

export const WithoutActions: Story = {
  render: () => (
    <Panel.Root className="w-full max-w-md rounded-city-md border border-city-border">
      <Panel.Header className="border-b border-city-border px-3 py-2 text-sm font-medium">
        Activity
      </Panel.Header>
      <Panel.Body className="p-3 text-sm">No recent activity.</Panel.Body>
    </Panel.Root>
  ),
};
