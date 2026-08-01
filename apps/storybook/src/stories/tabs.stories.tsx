import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from '@opnay/city-ds-react';

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Tabs.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

function ProjectTabs({ orientation = 'horizontal' }: { orientation?: 'horizontal' | 'vertical' }) {
  const vertical = orientation === 'vertical';

  return (
    <Tabs.Root
      defaultValue="overview"
      orientation={orientation}
      className={vertical ? 'flex gap-5' : ''}
    >
      <Tabs.List aria-label="Project views" className={vertical ? 'h-auto flex-col' : ''}>
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="activity">Activity</Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
      </Tabs.List>
      <div className="w-72">
        <Tabs.Panel value="overview">A clear summary of project health and ownership.</Tabs.Panel>
        <Tabs.Panel value="activity">No new activity in the last 24 hours.</Tabs.Panel>
        <Tabs.Panel value="settings">Team-wide defaults are applied to this project.</Tabs.Panel>
      </div>
    </Tabs.Root>
  );
}

export const Default: Story = {
  render: () => <ProjectTabs />,
};

export const Compact: Story = {
  render: () => (
    <Tabs.Root defaultValue="overview" density="compact">
      <Tabs.List aria-label="Compact project views">
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="activity">Activity</Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
      </Tabs.List>
      <div className="w-72">
        <Tabs.Panel value="overview">A compact summary of project health.</Tabs.Panel>
        <Tabs.Panel value="activity">No new activity.</Tabs.Panel>
        <Tabs.Panel value="settings">Compact defaults are active.</Tabs.Panel>
      </div>
    </Tabs.Root>
  ),
};

export const Vertical: Story = {
  render: () => <ProjectTabs orientation="vertical" />,
};

export const WithDisabledTab: Story = {
  render: () => (
    <Tabs.Root defaultValue="overview">
      <Tabs.List aria-label="Workspace views">
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab disabled value="billing">
          Billing
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">
        Billing access is limited to workspace administrators.
      </Tabs.Panel>
      <Tabs.Panel value="billing">This panel is unavailable.</Tabs.Panel>
    </Tabs.Root>
  ),
};
