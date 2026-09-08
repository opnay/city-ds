import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { toast } from '@opnay/city-ds-react/toast';
import { AccountManagement } from './examples/account-management';
import { ChangePassword } from './examples/change-password';
import { TwoFactorManagement, type TwoFactorActions } from './examples/two-factor-management';
import { SessionHistory, exampleSessions } from './examples/session-history';
import { renderDocs } from '../test/render-docs';
import { ACCOUNT_MENU } from './block-catalog';

beforeEach(() => {
  vi.spyOn(toast, 'success').mockReturnValue(0);
});
afterEach(() => vi.restoreAllMocks());

function twoFactorActions(): TwoFactorActions {
  return {
    startEnrollment: vi
      .fn()
      .mockResolvedValue({ id: 'enrollment-1', secret: 'PUBLICKEY', qrCodeUrl: '/qr.svg' }),
    verifyEnrollment: vi.fn().mockResolvedValue({
      registeredAt: '2026. 9. 7.',
      recoveryCodes: ['CODE-1111', 'CODE-2222'],
    }),
    cancelEnrollment: vi.fn().mockResolvedValue(undefined),
    regenerateRecoveryCodes: vi.fn().mockResolvedValue(['NEW-1111', 'NEW-2222']),
    disableTwoFactor: vi.fn().mockResolvedValue(undefined),
  };
}

describe('User management blocks', () => {
  it.each(ACCOUNT_MENU)(
    'opens $title from its URL with the complete menu',
    async ({ title, slug }) => {
      await renderDocs([`/blocks/${slug}`]);
      expect(screen.getByRole('heading', { level: 1, name: title })).toBeVisible();
      expect(screen.getByRole('button', { name: '계정 관리' })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
      const navigation = screen.getByRole('navigation', { name: '문서 탐색' });
      for (const item of ACCOUNT_MENU)
        expect(within(navigation).getByRole('link', { name: item.title })).toHaveAttribute(
          'href',
          `/blocks/${item.slug}`,
        );
      expect(within(navigation).queryByText('준비 중')).not.toBeInTheDocument();
    },
  );

  it('commits a changed email only after code confirmation, and confirms disconnect and deletion', async () => {
    const user = userEvent.setup();
    const actions = {
      requestEmailChange: vi.fn().mockResolvedValue('challenge-1'),
      confirmEmailChange: vi.fn().mockResolvedValue('new@example.com'),
      setProviderConnected: vi.fn().mockResolvedValue(undefined),
      deleteAccount: vi.fn().mockResolvedValue(undefined),
    };
    render(<AccountManagement actions={actions} />);
    await user.click(screen.getByRole('button', { name: '이메일 변경' }));
    await user.type(screen.getByRole('textbox', { name: '새 이메일' }), 'new@example.com');
    await user.type(
      screen.getByLabelText('현재 비밀번호', { selector: 'input' }),
      'current-password',
    );
    await user.click(screen.getByRole('button', { name: '확인 코드 보내기' }));
    expect(actions.requestEmailChange).toHaveBeenCalledWith('new@example.com', 'current-password');
    expect(screen.getByText('seoyeon@example.com')).toBeVisible();
    await user.click((await screen.findAllByRole('textbox'))[0]!);
    await user.paste('123456');
    await user.click(screen.getByRole('button', { name: '이메일 변경 완료' }));
    expect(actions.confirmEmailChange).toHaveBeenCalledWith('challenge-1', '123456');
    expect(await screen.findByText('new@example.com')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Google 연결 해제' }));
    const disconnect = within(screen.getByRole('alertdialog'));
    await user.click(disconnect.getByRole('button', { name: '연결 해제' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    expect(actions.setProviderConnected).toHaveBeenCalledWith('Google', false);
    expect(toast.success).toHaveBeenLastCalledWith('로그인 연결을 해제했습니다.');
    await user.click(screen.getByRole('button', { name: '계정 탈퇴' }));
    const removal = within(screen.getByRole('alertdialog'));
    expect(removal.getByRole('button', { name: '계정 탈퇴' })).toBeDisabled();
    await user.type(
      removal.getByLabelText('현재 비밀번호', { selector: 'input' }),
      'current-password',
    );
    await user.type(removal.getByRole('textbox', { name: '확인 문구' }), '탈퇴');
    await user.click(removal.getByRole('button', { name: '계정 탈퇴' }));
    expect(actions.deleteAccount).toHaveBeenCalledWith('current-password');
    expect(await screen.findByRole('heading', { name: '계정이 탈퇴되었습니다' })).toBeVisible();
  });

  it('validates password confirmation, keeps failed inputs and clears them after success', async () => {
    const user = userEvent.setup();
    const change = vi.fn().mockRejectedValueOnce(new Error('network')).mockResolvedValue(undefined);
    render(<ChangePassword onChangePassword={change} />);
    const current = screen.getByLabelText('현재 비밀번호', { selector: 'input' });
    const next = screen.getByLabelText('새 비밀번호', { selector: 'input' });
    const confirmation = screen.getByLabelText('새 비밀번호 확인', { selector: 'input' });
    await user.type(current, 'old-password');
    await user.type(next, 'new-password-123');
    await user.type(confirmation, 'wrong');
    await user.click(screen.getByRole('button', { name: '비밀번호 변경' }));
    expect(screen.getByText('새 비밀번호와 일치하지 않습니다.')).toBeVisible();
    expect(change).not.toHaveBeenCalled();
    await user.clear(confirmation);
    await user.type(confirmation, 'new-password-123');
    await user.click(screen.getByRole('button', { name: '새 비밀번호 보기' }));
    expect(next).toHaveAttribute('type', 'text');
    await user.click(screen.getByRole('button', { name: '비밀번호 변경' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('처리하지 못했습니다');
    expect(next).toHaveValue('new-password-123');
    await user.click(screen.getByRole('button', { name: '비밀번호 변경' }));
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('비밀번호를 변경했습니다.'));
    expect(change).toHaveBeenLastCalledWith({
      currentPassword: 'old-password',
      newPassword: 'new-password-123',
      signOutOtherSessions: true,
    });
    expect(current).toHaveValue('');
    expect(next).toHaveValue('');
    expect(confirmation).toHaveValue('');
    expect(next).toHaveAttribute('type', 'password');
  });

  it('does not submit a password change twice while the request is pending', async () => {
    const user = userEvent.setup();
    let resolve!: () => void;
    const change = vi.fn(
      () =>
        new Promise<void>((finish) => {
          resolve = finish;
        }),
    );
    const { container } = render(<ChangePassword onChangePassword={change} />);
    await user.type(screen.getByLabelText('현재 비밀번호', { selector: 'input' }), 'old-password');
    await user.type(
      screen.getByLabelText('새 비밀번호', { selector: 'input' }),
      'new-password-123',
    );
    await user.type(
      screen.getByLabelText('새 비밀번호 확인', { selector: 'input' }),
      'new-password-123',
    );
    fireEvent.submit(container.querySelector('form')!);
    fireEvent.submit(container.querySelector('form')!);
    expect(change).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText('새 비밀번호', { selector: 'input' })).toBeDisabled();
    resolve();
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('비밀번호를 변경했습니다.'));
  });

  it('retains activation when recovery storage is deferred, resumes and regenerates codes, then disables 2FA', async () => {
    const user = userEvent.setup();
    const actions = twoFactorActions();
    vi.mocked(actions.verifyEnrollment).mockRejectedValueOnce(new Error('invalid code'));
    render(<TwoFactorManagement actions={actions} />);
    await user.click(screen.getByRole('button', { name: '인증 앱 등록' }));
    await user.type(
      screen.getByLabelText('현재 비밀번호', { selector: 'input' }),
      'current-password',
    );
    await user.click(screen.getByRole('button', { name: '다음' }));
    expect(await screen.findByRole('img', { name: '인증 앱 연결 QR 코드' })).toHaveAttribute(
      'src',
      '/qr.svg',
    );
    await user.click(screen.getByRole('button', { name: '앱 연결 완료' }));
    await user.click(screen.getAllByRole('textbox')[0]!);
    await user.paste('123456');
    await user.click(screen.getByRole('button', { name: '코드 확인' }));
    expect(await screen.findByRole('alert')).toBeVisible();
    expect(screen.queryByText('CODE-1111')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '코드 확인' }));
    await screen.findByText('CODE-1111');
    expect(screen.getByRole('button', { name: '등록 마치기' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: '나중에 보관' }));
    expect(screen.getByText('사용 중')).toBeVisible();
    expect(screen.getByRole('button', { name: '보관 계속' })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: '보관 계속' }));
    await user.click(
      screen.getByRole('checkbox', { name: '복구 코드를 안전한 곳에 보관했습니다' }),
    );
    await user.click(screen.getByRole('button', { name: '등록 마치기' }));
    expect(screen.getByRole('button', { name: '재발급' })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: '재발급' }));
    let dialog = within(screen.getByRole('alertdialog'));
    await user.type(
      dialog.getByLabelText('현재 비밀번호', { selector: 'input' }),
      'current-password',
    );
    await user.click(dialog.getByRole('button', { name: '재발급' }));
    expect(await screen.findByText('NEW-1111')).toBeVisible();
    expect(screen.queryByText('CODE-1111')).not.toBeInTheDocument();
    await user.click(
      screen.getByRole('checkbox', { name: '복구 코드를 안전한 곳에 보관했습니다' }),
    );
    await user.click(screen.getByRole('button', { name: '등록 마치기' }));
    expect(screen.getByRole('button', { name: '재발급' })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: '인증 앱 해제' }));
    dialog = within(screen.getByRole('alertdialog'));
    await user.type(
      dialog.getByLabelText('현재 비밀번호', { selector: 'input' }),
      'current-password',
    );
    await user.click(dialog.getByRole('button', { name: '인증 앱 해제' }));
    expect(await screen.findByRole('button', { name: '인증 앱 등록' })).toBeVisible();
    expect(actions.disableTwoFactor).toHaveBeenCalledWith('current-password');
    expect(toast.success).toHaveBeenLastCalledWith('인증 앱을 해제했습니다.');
  });

  it('cancels an unverified enrollment without activating 2FA', async () => {
    const user = userEvent.setup();
    const actions = twoFactorActions();
    render(<TwoFactorManagement actions={actions} />);
    await user.click(screen.getByRole('button', { name: '인증 앱 등록' }));
    await user.type(screen.getByLabelText('현재 비밀번호', { selector: 'input' }), 'password');
    await user.click(screen.getByRole('button', { name: '다음' }));
    await screen.findByText('PUBLICKEY');
    await user.click(screen.getByRole('button', { name: '등록 취소' }));
    expect(actions.cancelEnrollment).toHaveBeenCalledWith('enrollment-1');
    expect(await screen.findByRole('button', { name: '인증 앱 등록' })).toBeVisible();
    expect(screen.queryByText('PUBLICKEY')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '인증 앱 등록' })).toHaveFocus();
  });

  it('keeps sessions on a failed revocation and excludes the current session from bulk revocation', async () => {
    const user = userEvent.setup();
    const revoke = vi.fn().mockRejectedValueOnce(new Error('network')).mockResolvedValue(undefined);
    render(<SessionHistory initialSessions={exampleSessions} onRevoke={revoke} />);
    await user.click(screen.getByRole('button', { name: 'iPhone 세션 종료' }));
    let dialog = within(screen.getByRole('alertdialog'));
    await user.click(dialog.getByRole('button', { name: '세션 종료' }));
    expect(await screen.findByRole('alert')).toBeVisible();
    expect(revoke).toHaveBeenCalledWith(['phone']);
    expect(toast.success).not.toHaveBeenCalled();
    await user.click(dialog.getByRole('button', { name: '세션 종료' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    expect(screen.queryByRole('button', { name: 'iPhone 세션 종료' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '다른 세션 모두 종료' }));
    dialog = within(screen.getByRole('alertdialog'));
    await user.click(dialog.getByRole('button', { name: '세션 종료' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    expect(revoke).toHaveBeenLastCalledWith(['desktop']);
    expect(toast.success).toHaveBeenLastCalledWith('1개 세션을 종료했습니다.');
    expect(screen.getByText('현재 세션')).toBeVisible();
    expect(screen.getByRole('button', { name: '다른 세션 모두 종료' })).toBeDisabled();
    await user.click(screen.getByRole('radio', { name: '전체 기록' }));
    expect(screen.getByText('iPhone')).toBeVisible();
    expect(screen.getAllByText('종료됨')).toHaveLength(3);
  });
});
