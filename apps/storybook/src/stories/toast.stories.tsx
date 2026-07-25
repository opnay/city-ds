import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button, Toast } from '@city-ds/react';

const meta = {
  title: 'Feedback/Toast',
  component: Toast.Provider,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Toast.Provider>;

export default meta;
type Story = StoryObj<typeof meta>;

function ToastExample({ withAction = false }: { withAction?: boolean }) {
  const manager = Toast.useToastManager();

  const showToast = () => {
    manager.add({
      title: withAction ? 'Deployment needs review' : 'Changes saved',
      description: withAction
        ? 'Two environment variables require confirmation before release.'
        : 'Your project configuration is up to date.',
    });
  };

  return (
    <>
      <Button onClick={showToast}>Show notification</Button>
      <Toast.Portal>
        <Toast.Viewport>
          {manager.toasts.map((toast) => (
            <Toast.Root key={toast.id} toast={toast}>
              <Toast.Content>
                <div>
                  <Toast.Title />
                  <Toast.Description />
                </div>
                {withAction ? <Toast.Action>Review</Toast.Action> : null}
                <Toast.Close />
              </Toast.Content>
            </Toast.Root>
          ))}
        </Toast.Viewport>
      </Toast.Portal>
    </>
  );
}

function ToastStory({ withAction = false }: { withAction?: boolean }) {
  return (
    <Toast.Provider timeout={0} limit={3}>
      <ToastExample withAction={withAction} />
    </Toast.Provider>
  );
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Show notification' }));

    const notification = await within(document.body).findByText('Changes saved');
    await expect(notification).toBeVisible();

    await userEvent.click(
      within(document.body).getByRole('button', { name: 'Close notification' }),
    );
    await expect(within(document.body).queryByText('Changes saved')).toBeNull();
  },
  render: () => <ToastStory />,
};

export const WithAction: Story = {
  render: () => <ToastStory withAction />,
};
