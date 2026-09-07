import type { Meta, StoryObj } from '@storybook/react-vite';

import { DensityProvider, FileUpload, Pagination, Tabs } from '@opnay/city-ds-react';

const meta = {
  title: '기초/밀도/Density provider',
  component: DensityProvider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '복합 컴포넌트의 comfortable·compact 밀도를 한 영역에서 일관되게 설정합니다. 개별 컴포넌트의 density prop이 provider보다 우선합니다.',
      },
    },
  },
} satisfies Meta<typeof DensityProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CompactRegion: Story = {
  render: () => (
    <DensityProvider density="compact">
      <div className="grid w-96 gap-4">
        <Tabs.Root defaultValue="overview">
          <Tabs.List>
            <Tabs.Tab value="overview">Overview</Tabs.Tab>
            <Tabs.Tab value="activity">Activity</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="overview">Compact controls share one density context.</Tabs.Panel>
          <Tabs.Panel value="activity">No recent activity.</Tabs.Panel>
        </Tabs.Root>
        <Pagination.Root onPageChange={() => undefined} page={2} totalPages={5} />
        <FileUpload.Root>
          <FileUpload.Trigger />
        </FileUpload.Root>
      </div>
    </DensityProvider>
  ),
};
