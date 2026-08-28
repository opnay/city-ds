import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button, Toaster, toast } from '@opnay/city-ds-react';

const meta = {
  title: 'Feedback/Toast',
  component: Toaster,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

function ToastStory({ withAction = false }: { withAction?: boolean }) {
  const toasterId = withAction ? 'toast-story-action' : 'toast-story-default';

  const showToast = () => {
    if (withAction) {
      toast.warning('Deployment needs review', {
        action: {
          label: 'Review',
          onClick: () => undefined,
        },
        description: 'Two environment variables require confirmation before release.',
        toasterId,
      });
      return;
    }

    toast.success('Changes saved', {
      description: 'Your project configuration is up to date.',
      toasterId,
    });
  };

  return (
    <>
      <Button onClick={showToast}>Show notification</Button>
      <Toaster duration={Infinity} id={toasterId} />
    </>
  );
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Show notification' }));

    const notification = await within(document.body).findByText('Changes saved');
    await waitFor(async () => {
      await expect(notification).toBeVisible();
    });

    await userEvent.click(
      within(document.body).getByRole('button', { name: 'Close notification' }),
    );
    await waitFor(async () => {
      await expect(within(document.body).queryByText('Changes saved')).toBeNull();
    });
  },
  render: () => <ToastStory />,
};

export const WithAction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Show notification' }));

    const title = await within(document.body).findByText('Deployment needs review');
    const notification = title.closest<HTMLElement>('[data-sonner-toast]');
    if (!notification) throw new Error('Sonner toast를 찾을 수 없습니다.');

    await waitFor(async () => {
      await expect(title).toBeVisible();
    });
    await expect(within(notification).getByRole('button', { name: 'Review' })).toBeVisible();
    await expect(notification.querySelector('[data-icon]')).not.toBeVisible();
  },
  render: () => <ToastStory withAction />,
};
