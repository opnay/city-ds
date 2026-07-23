import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from '@city-ds/react';

const meta = {
  title: 'Forms/Select',
  component: Select.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Select.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

function StatusSelect() {
  return (
    <Select.Root defaultValue="in-progress">
      <Select.Label>Status</Select.Label>
      <Select.Trigger aria-label="Project status" className="w-56">
        <Select.Value placeholder="Choose a status" />
        <Select.Icon />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner sideOffset={6}>
          <Select.Popup>
            <Select.Arrow />
            <Select.List>
              <Select.Item value="backlog">
                <Select.ItemIndicator />
                <Select.ItemText>Backlog</Select.ItemText>
              </Select.Item>
              <Select.Item value="in-progress">
                <Select.ItemIndicator />
                <Select.ItemText>In progress</Select.ItemText>
              </Select.Item>
              <Select.Item value="done">
                <Select.ItemIndicator />
                <Select.ItemText>Done</Select.ItemText>
              </Select.Item>
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}

export const Default: Story = {
  render: () => <StatusSelect />,
};

export const Grouped: Story = {
  render: () => (
    <Select.Root defaultValue="seoul">
      <Select.Label>Deployment region</Select.Label>
      <Select.Trigger aria-label="Deployment region" className="w-56">
        <Select.Value placeholder="Choose a region" />
        <Select.Icon />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner sideOffset={6}>
          <Select.Popup>
            <Select.List>
              <Select.Group>
                <Select.GroupLabel>Asia Pacific</Select.GroupLabel>
                <Select.Item value="seoul">
                  <Select.ItemIndicator />
                  <Select.ItemText>Seoul</Select.ItemText>
                </Select.Item>
                <Select.Item value="tokyo">
                  <Select.ItemIndicator />
                  <Select.ItemText>Tokyo</Select.ItemText>
                </Select.Item>
              </Select.Group>
              <Select.Separator />
              <Select.Group>
                <Select.GroupLabel>North America</Select.GroupLabel>
                <Select.Item value="virginia">
                  <Select.ItemIndicator />
                  <Select.ItemText>Virginia</Select.ItemText>
                </Select.Item>
                <Select.Item disabled value="oregon">
                  <Select.ItemIndicator />
                  <Select.ItemText>Oregon (unavailable)</Select.ItemText>
                </Select.Item>
              </Select.Group>
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  ),
};
