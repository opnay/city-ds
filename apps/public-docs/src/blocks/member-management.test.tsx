import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderDocs } from '../test/render-docs';
import { MemberManagement, type TeamMember } from './examples/member-directory';

const members: TeamMember[] = [
  { id: 'self', name: '김서연', email: 'seoyeon@example.com', role: 'admin', status: 'active' },
  { id: 'other', name: '이도윤', email: 'doyun@example.com', role: 'editor', status: 'active' },
];

describe('Member management', () => {
  it('invites, changes a role and removes a member through confirmation', async () => {
    const user = userEvent.setup();
    await renderDocs(['/blocks/member-directory']);
    expect(await screen.findByRole('heading', { level: 1, name: '팀원 관리' })).toBeVisible();
    const preview = within(screen.getByRole('region', { name: '미리보기' }));
    const invite = preview.getByRole('button', { name: '초대' });
    await user.click(invite);
    let dialog = within(screen.getByRole('dialog'));
    await user.click(dialog.getByRole('button', { name: '초대' }));
    expect(dialog.getByText('올바른 이메일 주소를 입력해 주세요.')).toBeVisible();
    await user.type(dialog.getByRole('textbox', { name: '이메일' }), 'new@example.com');
    await user.click(dialog.getByRole('button', { name: '초대' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(preview.getByText('팀원 4명')).toBeVisible();
    expect(preview.getByText('new@example.com')).toBeVisible();

    await user.click(preview.getByRole('button', { name: '이도윤 역할 변경' }));
    dialog = within(screen.getByRole('dialog'));
    await user.click(dialog.getByRole('combobox', { name: '역할' }));
    await user.click(await screen.findByRole('option', { name: '뷰어' }));
    await user.click(dialog.getByRole('button', { name: '저장' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(preview.getByRole('row', { name: /이도윤/ })).toHaveTextContent('뷰어');

    await user.click(preview.getByRole('button', { name: '이도윤 내보내기' }));
    let confirmation = within(screen.getByRole('alertdialog'));
    await user.click(confirmation.getByRole('button', { name: '취소' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    expect(preview.getByText('doyun@example.com')).toBeVisible();
    await user.click(preview.getByRole('button', { name: '이도윤 내보내기' }));
    confirmation = within(screen.getByRole('alertdialog'));
    await user.click(confirmation.getByRole('button', { name: '내보내기' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    expect(preview.queryByText('doyun@example.com')).not.toBeInTheDocument();
    await waitFor(() => expect(invite).toHaveFocus());
  });

  it('keeps a failed invitation open with its input and allows retry', async () => {
    const user = userEvent.setup();
    const onInvite = vi
      .fn()
      .mockRejectedValueOnce(new Error('request failed'))
      .mockResolvedValue(undefined);
    render(
      <MemberManagement
        members={members}
        currentUserId="self"
        onInvite={onInvite}
        onRoleChange={vi.fn()}
        onRemove={vi.fn()}
      />,
    );
    await user.click(screen.getByRole('button', { name: '초대' }));
    const dialog = within(screen.getByRole('dialog'));
    await user.type(dialog.getByRole('textbox', { name: '이메일' }), 'new@example.com');
    await user.click(dialog.getByRole('button', { name: '초대' }));
    expect(await dialog.findByText('변경하지 못했어요. 다시 시도해 주세요.')).toBeVisible();
    expect(dialog.getByRole('textbox', { name: '이메일' })).toHaveValue('new@example.com');
    await user.click(dialog.getByRole('button', { name: '초대' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(onInvite).toHaveBeenCalledTimes(2);
    expect(onInvite).toHaveBeenLastCalledWith({ email: 'new@example.com', role: 'viewer' });
  });

  it('preserves the member and confirmation on failure and blocks duplicate removal', async () => {
    const user = userEvent.setup();
    let rejectRequest!: (error: Error) => void;
    const onRemove = vi.fn(
      () =>
        new Promise<void>((_, reject) => {
          rejectRequest = reject;
        }),
    );
    render(
      <MemberManagement
        members={members}
        currentUserId="self"
        onInvite={vi.fn()}
        onRoleChange={vi.fn()}
        onRemove={onRemove}
      />,
    );
    expect(screen.queryByRole('button', { name: '김서연 내보내기' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '이도윤 내보내기' }));
    const dialog = within(screen.getByRole('alertdialog'));
    await user.dblClick(dialog.getByRole('button', { name: '내보내기' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(dialog.getByRole('button', { name: '취소' })).toBeDisabled();
    rejectRequest(new Error('request failed'));
    expect(await dialog.findByText('변경하지 못했어요. 다시 시도해 주세요.')).toBeVisible();
    expect(screen.getByText('doyun@example.com')).toBeVisible();
  });

  it('keeps read-only members searchable without management actions', async () => {
    const user = userEvent.setup();
    render(
      <MemberManagement
        members={members}
        currentUserId="self"
        canManage={false}
        onInvite={vi.fn()}
        onRoleChange={vi.fn()}
        onRemove={vi.fn()}
      />,
    );
    expect(screen.queryByRole('button', { name: '초대' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /내보내기|역할 변경/ })).not.toBeInTheDocument();
    await user.type(screen.getByRole('searchbox', { name: '팀원 검색' }), 'doyun');
    expect(screen.getByText('팀원 1명')).toBeVisible();
  });
});
