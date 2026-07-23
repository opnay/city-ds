import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Popover } from '@city-ds/react';

const meta = {
  title: 'Overlays/Popover',
  component: Popover.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Popover.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

function PopoverExample({
  align = 'center',
  defaultOpen = false,
}: {
  align?: 'start' | 'center' | 'end';
  defaultOpen?: boolean;
}) {
  return (
    <Popover.Root defaultOpen={defaultOpen}>
      <Popover.Trigger>Open filters</Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8} align={align}>
          <Popover.Popup>
            <Popover.Title>Deployment filters</Popover.Title>
            <Popover.Description>
              Choose which release events are shown in the list.
            </Popover.Description>
            <div className="mt-3 grid gap-2 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked /> Successful
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" /> Failed
              </label>
            </div>
            <div className="mt-4 flex justify-end">
              <Popover.Close>Apply</Popover.Close>
            </div>
            <Popover.Arrow />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

function ControlledPopover() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="grid gap-3">
      <Button variant="outline" onClick={() => setOpen((value) => !value)}>
        {open ? 'Close externally' : 'Open externally'}
      </Button>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger>Trigger</Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner sideOffset={8}>
            <Popover.Popup>
              <Popover.Title>Controlled popover</Popover.Title>
              <Popover.Description>Open state is owned by the story component.</Popover.Description>
              <Popover.Close className="mt-4">Close</Popover.Close>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}

export const Default: Story = {
  render: () => <PopoverExample />,
};

export const AlignedEnd: Story = {
  render: () => <PopoverExample align="end" defaultOpen />,
};

export const LongContent: Story = {
  render: () => (
    <Popover.Root defaultOpen>
      <Popover.Trigger>View notes</Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8}>
          <Popover.Popup className="max-h-72 overflow-auto">
            <Popover.Title>Release notes</Popover.Title>
            <Popover.Description>
              This panel demonstrates a longer body while preserving Base UI positioning and focus
              behavior.
            </Popover.Description>
            <div className="mt-3 space-y-2 text-sm">
              {Array.from({ length: 8 }, (_, index) => (
                <p key={index}>Checklist item {index + 1}: verify deployment telemetry.</p>
              ))}
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger disabled>Unavailable filters</Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner>
          <Popover.Popup>Disabled triggers do not open popovers.</Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  ),
};

export const Controlled: Story = {
  render: () => <ControlledPopover />,
};
