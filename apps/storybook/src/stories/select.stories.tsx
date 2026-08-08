import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Field, Select, type ControlSize } from '@opnay/city-ds-react';

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

const statusItems = {
  backlog: 'Backlog',
  'in-progress': 'In progress',
  done: 'Done',
} as const;

const regionItems = {
  seoul: 'Seoul',
  tokyo: 'Tokyo',
  virginia: 'Virginia',
  oregon: 'Oregon (unavailable)',
} as const;

function StatusSelect({
  disabled = false,
  size = 'md',
}: {
  disabled?: boolean;
  size?: ControlSize;
}) {
  return (
    <Select.Root defaultValue="in-progress" disabled={disabled} items={statusItems} size={size}>
      <Select.Label>Status</Select.Label>
      <Select.Trigger className="w-56">
        <Select.Value placeholder="Choose a status" />
        <Select.Icon />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner>
          <Select.Popup>
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('combobox', { name: 'Status' });
    const value = within(trigger).getByText('In progress');
    const icon = trigger.querySelector('[data-city-select-icon]');

    await expect(trigger).toHaveTextContent('In progress');
    await userEvent.click(value);
    await waitFor(async () => {
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      await expect(icon).toHaveAttribute('data-popup-open');
    });
    await userEvent.click(await within(document.body).findByRole('option', { name: 'Done' }));

    await expect(trigger).toHaveTextContent('Done');
  },
  render: () => <StatusSelect />,
};

export const Disabled: Story = {
  render: () => <StatusSelect disabled />,
};

export const Sizes: Story = {
  render: () => (
    <div className="grid gap-3">
      {(['xsm', 'sm', 'md', 'lg', 'xlg'] as const).map((size) => (
        <StatusSelect key={size} size={size} />
      ))}
    </div>
  ),
};

export const Invalid: Story = {
  render: () => (
    <Field.Root invalid>
      <Field.Label>Status</Field.Label>
      <Select.Root items={statusItems}>
        <Select.Trigger className="w-56">
          <Select.Value placeholder="Choose a status" />
          <Select.Icon />
        </Select.Trigger>
      </Select.Root>
      <Field.Error match>Choose a valid status.</Field.Error>
    </Field.Root>
  ),
};

export const Grouped: Story = {
  render: () => (
    <Select.Root defaultValue="seoul" items={regionItems}>
      <Select.Label>Deployment region</Select.Label>
      <Select.Trigger className="w-56">
        <Select.Value placeholder="Choose a region" />
        <Select.Icon />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner>
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
