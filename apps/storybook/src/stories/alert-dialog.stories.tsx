import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { AlertDialog, Button } from '@city-ds/react';

const meta = {
  title: 'Overlays/AlertDialog',
  component: AlertDialog.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'AlertDialog는 실수 시 의미 있는 손실이 생기거나 복구가 어려운 작업 전에 명시적인 결정을 요청합니다. 일반적인 입력과 편집에는 Dialog를 사용하고, 쉽게 복구할 수 있는 작업은 실행 후 Undo 제공을 우선하세요.',
      },
    },
  },
} satisfies Meta<typeof AlertDialog.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

function AlertDialogExample({
  actionLabel,
  description,
  destructive = false,
  title,
  triggerLabel,
}: {
  actionLabel: string;
  description: string;
  destructive?: boolean;
  title: string;
  triggerLabel: string;
}) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger render={<Button variant={destructive ? 'destructive' : 'primary'} />}>
        {triggerLabel}
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop />
        <AlertDialog.Viewport>
          <AlertDialog.Popup>
            <AlertDialog.Title>{title}</AlertDialog.Title>
            <AlertDialog.Description>{description}</AlertDialog.Description>
            <div className="mt-5 flex justify-end gap-2">
              <AlertDialog.Cancel render={<Button variant="secondary" />}>
                Cancel
              </AlertDialog.Cancel>
              <AlertDialog.Action
                render={<Button variant={destructive ? 'destructive' : 'primary'} />}
              >
                {actionLabel}
              </AlertDialog.Action>
            </div>
          </AlertDialog.Popup>
        </AlertDialog.Viewport>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: '파괴적이지 않아도 공개 범위처럼 영향이 큰 변경에는 명시적인 확인을 사용합니다.',
      },
    },
  },
  render: () => (
    <AlertDialogExample
      actionLabel="Make public"
      description="Anyone with the link will be able to view this project."
      title="Make this project public?"
      triggerLabel="Make project public"
    />
  ),
};

export const Destructive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '복구할 수 없는 삭제는 결과를 분명히 설명하고 실행 버튼을 파괴적 액션으로 표시합니다.',
      },
    },
  },
  render: () => (
    <AlertDialogExample
      destructive
      actionLabel="Delete project"
      description="This permanently removes the project and cannot be undone."
      title="Delete this project?"
      triggerLabel="Delete project"
    />
  ),
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story: '외부 상태로 열림 여부를 제어해도 취소 후에는 트리거로 포커스가 돌아갑니다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Discard changes' });

    await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);

    const dialog = await within(document.body).findByRole('alertdialog', {
      name: 'Discard unsaved changes?',
    });
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveFocus();
  },
  render: function ControlledAlertDialog() {
    const [open, setOpen] = React.useState(false);

    return (
      <div className="flex flex-col items-center gap-3">
        <AlertDialog.Root open={open} onOpenChange={setOpen}>
          <AlertDialog.Trigger render={<Button variant="destructive" />}>
            Discard changes
          </AlertDialog.Trigger>
          <span className="text-sm text-city-muted-foreground">
            Alert dialog is {open ? 'open' : 'closed'}
          </span>
          <AlertDialog.Portal>
            <AlertDialog.Backdrop />
            <AlertDialog.Viewport>
              <AlertDialog.Popup>
                <AlertDialog.Title>Discard unsaved changes?</AlertDialog.Title>
                <AlertDialog.Description>
                  Changes made since your last save will be permanently lost.
                </AlertDialog.Description>
                <div className="mt-5 flex justify-end gap-2">
                  <AlertDialog.Cancel render={<Button variant="secondary" />}>
                    Cancel
                  </AlertDialog.Cancel>
                  <AlertDialog.Action render={<Button variant="destructive" />}>
                    Discard changes
                  </AlertDialog.Action>
                </div>
              </AlertDialog.Popup>
            </AlertDialog.Viewport>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      </div>
    );
  },
};
