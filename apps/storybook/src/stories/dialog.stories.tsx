import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Dialog } from '@city-ds/react';

const meta = {
  title: 'Overlays/Dialog',
  component: Dialog.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Dialog.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

function DialogExample({
  title,
  description,
  triggerLabel,
}: {
  title: string;
  description: string;
  triggerLabel: string;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger render={<Button />}>{triggerLabel}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Viewport>
          <Dialog.Popup>
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Description>{description}</Dialog.Description>
            <div className="mt-5 flex justify-end gap-2">
              <Dialog.Close render={<Button variant="secondary" />}>Cancel</Dialog.Close>
              <Dialog.Close render={<Button />}>Confirm</Dialog.Close>
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export const Default: Story = {
  render: () => (
    <DialogExample
      title="Create workspace"
      description="Set up a focused space for this project. You can change these details later."
      triggerLabel="New workspace"
    />
  ),
};

export const Confirmation: Story = {
  render: () => (
    <DialogExample
      title="Archive this project?"
      description="Archived projects remain available to restore from your project settings."
      triggerLabel="Archive project"
    />
  ),
};
