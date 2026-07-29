import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button, Dialog, Field, Input } from '@opnay/city-ds-react';

const meta = {
  title: 'Overlays/Dialog',
  component: Dialog.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Dialog는 현재 화면 위에서 정보 확인, 입력, 편집 같은 작업을 수행하는 표면입니다. 되돌리기 어렵거나 영향이 큰 결정을 확인할 때는 AlertDialog를 사용하세요.',
      },
    },
  },
} satisfies Meta<typeof Dialog.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

function WorkspaceSettingsDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger render={<Button />}>Edit workspace</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Viewport>
          <Dialog.Popup>
            <Dialog.Title>Workspace settings</Dialog.Title>
            <Dialog.Description>
              Update how this workspace appears to members. You can change these details later.
            </Dialog.Description>
            <form className="mt-5 grid gap-4" onSubmit={(event) => event.preventDefault()}>
              <Field.Root>
                <Field.Label>Workspace name</Field.Label>
                <Input defaultValue="Platform" />
                <Field.Description>This name appears in the workspace switcher.</Field.Description>
              </Field.Root>
              <Field.Root>
                <Field.Label>Workspace slug</Field.Label>
                <Input defaultValue="platform" />
                <Field.Description>Used in workspace URLs.</Field.Description>
              </Field.Root>
              <div className="flex justify-end gap-2">
                <Dialog.Close render={<Button variant="secondary" />}>Cancel</Dialog.Close>
                <Dialog.Close render={<Button type="submit" />}>Save changes</Dialog.Close>
              </div>
            </form>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function ProjectDetailsDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger render={<Button variant="secondary" />}>View project details</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Viewport>
          <Dialog.Popup>
            <Dialog.Title>Project details</Dialog.Title>
            <Dialog.Description>
              Review the current project configuration without leaving this page.
            </Dialog.Description>
            <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
              <dt className="text-city-muted-foreground">Owner</dt>
              <dd className="text-right font-medium">Ari Kim</dd>
              <dt className="text-city-muted-foreground">Region</dt>
              <dd className="text-right font-medium">Seoul</dd>
              <dt className="text-city-muted-foreground">Created</dt>
              <dd className="text-right font-medium">July 18, 2026</dd>
              <dt className="text-city-muted-foreground">Visibility</dt>
              <dd className="text-right font-medium">Workspace members</dd>
            </dl>
            <div className="mt-5 flex justify-end">
              <Dialog.Close render={<Button variant="secondary" />}>Close</Dialog.Close>
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function ControlledDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col items-center gap-3">
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger render={<Button />}>Invite member</Dialog.Trigger>
        <span className="text-sm text-city-muted-foreground">
          Dialog is {open ? 'open' : 'closed'}
        </span>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Viewport>
            <Dialog.Popup>
              <Dialog.Title>Invite workspace member</Dialog.Title>
              <Dialog.Description>
                Add a teammate by entering the email address associated with their account.
              </Dialog.Description>
              <form className="mt-5 grid gap-4" onSubmit={(event) => event.preventDefault()}>
                <Field.Root>
                  <Field.Label>Email address</Field.Label>
                  <Input placeholder="colleague@example.com" type="email" />
                </Field.Root>
                <div className="flex justify-end gap-2">
                  <Dialog.Close render={<Button variant="secondary" />}>Cancel</Dialog.Close>
                  <Dialog.Close render={<Button type="submit" />}>Send invitation</Dialog.Close>
                </div>
              </form>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

function ActivityLogDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger render={<Button variant="secondary" />}>View activity log</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Viewport>
          <Dialog.Popup scroll="body" size="lg">
            <Dialog.Header>
              <div>
                <Dialog.Title>Project activity</Dialog.Title>
                <Dialog.Description>
                  Recent changes made by workspace members, newest first.
                </Dialog.Description>
              </div>
            </Dialog.Header>
            <Dialog.Body>
              <ul className="divide-y divide-city-border">
                {Array.from({ length: 12 }, (_, index) => (
                  <li key={index} className="py-3">
                    <p className="text-sm font-medium">Configuration update {12 - index}</p>
                    <p className="mt-1 text-xs leading-5 text-city-muted-foreground">
                      Ari updated project settings on July {26 - index}, 2026.
                    </p>
                  </li>
                ))}
              </ul>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.Close render={<Button variant="secondary" />}>Close</Dialog.Close>
            </Dialog.Footer>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: '입력과 편집처럼 사용자가 내용을 다루는 작업 공간으로 사용합니다.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Edit workspace' });

    await userEvent.click(trigger);

    const dialog = await within(document.body).findByRole('dialog', {
      name: 'Workspace settings',
    });
    await expect(dialog).toBeVisible();
    await expect(within(dialog).getByRole('textbox', { name: 'Workspace name' })).toHaveFocus();

    await userEvent.keyboard('{Escape}');
    await expect(
      within(document.body).queryByRole('dialog', { name: 'Workspace settings' }),
    ).toBeNull();
    await expect(trigger).toHaveFocus();
  },
  render: () => <WorkspaceSettingsDialog />,
};

export const Information: Story = {
  parameters: {
    docs: {
      description: {
        story: '현재 화면의 맥락을 유지하면서 관련 정보를 확인할 때 사용합니다.',
      },
    },
  },
  render: () => <ProjectDetailsDialog />,
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story: '외부 상태로 열림 여부를 제어하면서 입력 작업을 구성할 수 있습니다.',
      },
    },
  },
  render: () => <ControlledDialog />,
};

export const ScrollableContent: Story = {
  parameters: {
    docs: {
      description: {
        story: '내용이 길면 본문만 스크롤하고 제목과 닫기 액션은 고정할 수 있습니다.',
      },
    },
  },
  render: () => <ActivityLogDialog />,
};
