import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { renderDocs } from '../test/render-docs';
import { BLOCK_GROUPS } from './block-catalog';
import { PasswordReset } from './examples/password-reset';
import { Reauthentication } from './examples/reauthentication';
import { RecoveryCodeManagement } from './examples/recovery-code-management';
import PasskeyManagementExample, { PasskeyManagement } from './examples/passkey-management';
import { ConnectedApps, exampleConnectedApps } from './examples/connected-apps';
import { SecurityActivity, exampleSecurityEvents } from './examples/security-activity';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('Block category navigation', () => {
  it.each(BLOCK_GROUPS)('opens the $title category for its block', async ({ title, items }) => {
    const entry = items[0]!;
    await renderDocs([`/blocks/${entry.slug}`]);
    expect(screen.getByRole('heading', { level: 1, name: entry.title })).toBeVisible();
    expect(screen.getByRole('button', { name: title })).toHaveAttribute('aria-expanded', 'true');
    const navigation = within(screen.getByRole('navigation', { name: '문서 탐색' }));
    for (const item of items)
      expect(navigation.getByRole('link', { name: item.title })).toHaveAttribute(
        'href',
        `/blocks/${item.slug}`,
      );
    expect(within(screen.getByRole('main')).getByText(`적용 범위: ${entry.scope}`)).toBeVisible();
  });
});

describe('Security block flows', () => {
  it('verifies the reset challenge before changing a password and retains failed inputs for retry', async () => {
    const user = userEvent.setup();
    const actions = {
      request: vi.fn().mockResolvedValue('challenge'),
      verify: vi.fn().mockRejectedValueOnce(new Error('expired')).mockResolvedValue('reset-token'),
      reset: vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValue(undefined),
    };
    const signIn = vi.fn();
    render(<PasswordReset actions={actions} onSignIn={signIn} />);
    await user.click(screen.getByRole('button', { name: '재설정 코드 요청' }));
    expect(actions.request).not.toHaveBeenCalled();
    await user.click(screen.getByRole('textbox', { name: '이메일' }));
    await user.paste('member@example.com');
    await user.click(screen.getByRole('button', { name: '재설정 코드 요청' }));
    expect(actions.request).toHaveBeenCalledWith('member@example.com');
    expect(screen.getByText(/일치하는 계정이 있으면/)).toBeVisible();
    await user.click(screen.getAllByRole('textbox')[0]!);
    await user.paste('123456');
    await user.click(screen.getByRole('button', { name: '코드 확인' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('처리하지 못했습니다');
    expect(actions.reset).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: '코드 확인' }));
    expect(actions.verify).toHaveBeenLastCalledWith('challenge', '123456');
    const password = screen.getByLabelText('새 비밀번호', { selector: 'input' });
    const confirmation = screen.getByLabelText('새 비밀번호 확인', { selector: 'input' });
    await user.click(password);
    await user.paste('new-password-123');
    await user.type(confirmation, 'wrong');
    await user.click(screen.getByRole('button', { name: '비밀번호 재설정' }));
    expect(actions.reset).not.toHaveBeenCalled();
    await user.clear(confirmation);
    await user.click(confirmation);
    await user.paste('new-password-123');
    await user.click(screen.getByRole('button', { name: '비밀번호 재설정' }));
    expect(await screen.findByRole('alert')).toBeVisible();
    expect(password).toHaveValue('new-password-123');
    await user.click(screen.getByRole('button', { name: '비밀번호 재설정' }));
    expect(actions.reset).toHaveBeenLastCalledWith('reset-token', 'new-password-123');
    expect(await screen.findByRole('heading', { name: '비밀번호를 재설정했습니다' })).toHaveFocus();
    expect(screen.queryByLabelText('새 비밀번호', { selector: 'input' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '로그인으로 돌아가기' }));
    expect(signIn).toHaveBeenCalledOnce();
  });

  it('blocks repeated requests while pending and starts a fresh reset challenge after going back', async () => {
    const user = userEvent.setup();
    let finish!: (id: string) => void;
    const request = vi.fn(
      () =>
        new Promise<string>((resolve) => {
          finish = resolve;
        }),
    );
    const verify = vi.fn().mockResolvedValue('token');
    const { container } = render(
      <PasswordReset actions={{ request, verify, reset: vi.fn() }} onSignIn={vi.fn()} />,
    );
    await user.type(screen.getByRole('textbox', { name: '이메일' }), 'member@example.com');
    fireEvent.submit(container.querySelector('form')!);
    fireEvent.submit(container.querySelector('form')!);
    expect(request).toHaveBeenCalledOnce();
    finish('first');
    await user.click(await screen.findByRole('button', { name: '처음부터' }));
    expect(screen.getByRole('textbox', { name: '이메일' })).toHaveValue('member@example.com');
    expect(verify).not.toHaveBeenCalled();
  });

  it('uses server-required OTP before allowing return to the original action', async () => {
    const user = userEvent.setup();
    const onPassword = vi
      .fn()
      .mockResolvedValue({ status: 'otp-required', challengeId: 'reauth-1' });
    const onCode = vi.fn().mockRejectedValueOnce(new Error('invalid')).mockResolvedValue(undefined);
    const onContinue = vi.fn();
    render(
      <Reauthentication
        reason="이메일 변경 전 확인"
        onPassword={onPassword}
        onCode={onCode}
        onContinue={onContinue}
        onCancel={vi.fn()}
      />,
    );
    await user.type(screen.getByLabelText('현재 비밀번호', { selector: 'input' }), 'password');
    await user.click(screen.getByRole('button', { name: '확인' }));
    expect(screen.queryByLabelText('현재 비밀번호', { selector: 'input' })).not.toBeInTheDocument();
    await user.click(screen.getAllByRole('textbox')[0]!);
    await user.paste('123456');
    await user.click(screen.getByRole('button', { name: '확인' }));
    expect(await screen.findByRole('alert')).toBeVisible();
    expect(onContinue).not.toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: '작업 계속' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '확인' }));
    expect(onCode).toHaveBeenLastCalledWith('reauth-1', '123456');
    await user.click(await screen.findByRole('button', { name: '작업 계속' }));
    expect(onContinue).toHaveBeenCalledOnce();
  });

  it('supports password-only verification and cancellation without continuing', async () => {
    const user = userEvent.setup();
    const onCode = vi.fn();
    const onContinue = vi.fn();
    const onCancel = vi.fn();
    render(
      <Reauthentication
        reason="본인 확인"
        onPassword={async () => ({ status: 'verified' })}
        onCode={onCode}
        onContinue={onContinue}
        onCancel={onCancel}
      />,
    );
    await user.type(screen.getByLabelText('현재 비밀번호', { selector: 'input' }), 'password');
    await user.click(screen.getByRole('button', { name: '취소' }));
    expect(onCancel).toHaveBeenCalledOnce();
    expect(screen.getByLabelText('현재 비밀번호', { selector: 'input' })).toHaveValue('');
    await user.type(screen.getByLabelText('현재 비밀번호', { selector: 'input' }), 'password');
    await user.click(screen.getByRole('button', { name: '확인' }));
    expect(await screen.findByRole('button', { name: '작업 계속' })).toBeVisible();
    expect(onCode).not.toHaveBeenCalled();
    expect(onContinue).not.toHaveBeenCalled();
  });

  it('confirms recovery-code replacement, retries failure and clears codes only after storage acknowledgement', async () => {
    const user = userEvent.setup();
    const generate = vi
      .fn()
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValue(['NEW-1111', 'NEW-2222']);
    render(<RecoveryCodeManagement remainingCount={2} onGenerate={generate} />);
    await user.click(screen.getByRole('button', { name: '복구 코드 재발급' }));
    const dialog = within(screen.getByRole('alertdialog'));
    expect(dialog.getByText(/기존 복구 코드는 즉시 무효화/)).toBeVisible();
    await user.type(dialog.getByLabelText('현재 비밀번호', { selector: 'input' }), 'password');
    await user.click(dialog.getByRole('button', { name: '새 코드 발급' }));
    expect(await screen.findByRole('alert')).toBeVisible();
    expect(screen.queryByText('NEW-1111')).not.toBeInTheDocument();
    await user.click(dialog.getByRole('button', { name: '새 코드 발급' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    expect(screen.getByText('NEW-1111')).toBeVisible();
    expect(screen.getByRole('button', { name: '보관 완료' })).toBeDisabled();
    const copy = vi
      .spyOn(navigator.clipboard, 'writeText')
      .mockRejectedValueOnce(new Error('denied'))
      .mockResolvedValue(undefined);
    await user.click(screen.getByRole('button', { name: '복사' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('복사하지 못했습니다');
    await user.click(screen.getByRole('button', { name: '복사' }));
    expect(copy).toHaveBeenLastCalledWith('NEW-1111\nNEW-2222');
    const createUrl = vi.fn().mockReturnValue('blob:recovery-codes');
    const revokeUrl = vi.fn();
    vi.stubGlobal('URL', { createObjectURL: createUrl, revokeObjectURL: revokeUrl });
    const download = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(function (this: HTMLAnchorElement) {
        expect(this.download).toBe('recovery-codes.txt');
        expect(this.getAttribute('href')).toBe('blob:recovery-codes');
      });
    const downloadButton = screen.getByRole('button', { name: '다운로드' });
    // Only the deferred URL cleanup needs a clock; keep user interactions on real timers.
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    try {
      fireEvent.click(downloadButton);
      expect(download).toHaveBeenCalledOnce();
      expect(revokeUrl).not.toHaveBeenCalled();
      await vi.advanceTimersByTimeAsync(1000);
      expect(revokeUrl).toHaveBeenCalledWith('blob:recovery-codes');
    } finally {
      vi.useRealTimers();
    }
    const contents = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
      reader.readAsText(createUrl.mock.calls[0]![0]);
    });
    expect(contents).toBe('NEW-1111\nNEW-2222');
    await user.click(
      screen.getByRole('checkbox', { name: '복구 코드를 안전한 곳에 보관했습니다' }),
    );
    await user.click(screen.getByRole('button', { name: '보관 완료' }));
    expect(screen.queryByText('NEW-1111')).not.toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByRole('button', { name: '복구 코드 재발급' })).toHaveFocus(),
    );
  });

  it('registers, renames, cancels deletion and removes a passkey', async () => {
    const user = userEvent.setup();
    render(<PasskeyManagementExample />);
    await user.click(screen.getByRole('button', { name: '패스키 추가' }));
    expect(await screen.findByText('새 패스키')).toBeVisible();
    await user.click(screen.getByRole('button', { name: '새 패스키 이름 변경' }));
    const dialog = within(screen.getByRole('dialog'));
    await user.clear(dialog.getByRole('textbox', { name: '패스키 이름' }));
    expect(dialog.getByRole('button', { name: '저장' })).toBeDisabled();
    await user.type(dialog.getByRole('textbox', { name: '패스키 이름' }), '업무 기기');
    await user.click(dialog.getByRole('button', { name: '저장' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: '업무 기기 삭제' }));
    await user.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: '취소' }));
    expect(screen.getByText('업무 기기')).toBeVisible();
    await user.click(screen.getByRole('button', { name: '업무 기기 삭제' }));
    await user.click(
      within(screen.getByRole('alertdialog')).getByRole('button', { name: '패스키 삭제' }),
    );
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    expect(screen.queryByText('업무 기기')).not.toBeInTheDocument();
  });

  it('keeps existing passkeys on registration failure and handles unsupported and read-only states', async () => {
    const user = userEvent.setup();
    const props = {
      passkeys: [{ id: '1', name: 'Mac', createdAt: '오늘', lastUsedAt: '오늘' }],
      onRegister: vi.fn().mockRejectedValue(new Error('cancelled')),
      onRename: vi.fn(),
      onRemove: vi.fn(),
    };
    const { rerender } = render(<PasskeyManagement {...props} />);
    await user.click(screen.getByRole('button', { name: '패스키 추가' }));
    expect(await screen.findByRole('alert')).toBeVisible();
    expect(screen.getByText('Mac')).toBeVisible();
    rerender(<PasskeyManagement {...props} supported={false} />);
    expect(screen.getByRole('button', { name: '패스키 추가' })).toBeDisabled();
    rerender(<PasskeyManagement {...props} canManage={false} />);
    expect(screen.queryByRole('button', { name: 'Mac 삭제' })).not.toBeInTheDocument();
  });

  it('preserves connected apps after failed revocation and removes only the confirmed app on success', async () => {
    const user = userEvent.setup();
    const disconnect = vi
      .fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValue(undefined);
    function Harness() {
      const [apps, setApps] = useState(exampleConnectedApps);
      return (
        <ConnectedApps
          apps={apps}
          onDisconnect={async (id) => {
            await disconnect(id);
            setApps((current) => current.filter((app) => app.id !== id));
          }}
        />
      );
    }
    render(<Harness />);
    expect(screen.getByText('일정 읽기 및 작성')).toBeVisible();
    await user.click(screen.getByRole('button', { name: '일정 도우미 연결 해제' }));
    const dialog = within(screen.getByRole('alertdialog'));
    await user.click(dialog.getByRole('button', { name: '연결 해제' }));
    expect(await screen.findByRole('alert')).toBeVisible();
    expect(screen.getByText('일정 도우미', { exact: true })).toBeVisible();
    await user.click(dialog.getByRole('button', { name: '연결 해제' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    expect(screen.queryByText('일정 도우미', { exact: true })).not.toBeInTheDocument();
    expect(screen.getByText('리포트 내보내기', { exact: true })).toBeVisible();
    expect(disconnect).toHaveBeenLastCalledWith('calendar');
  });

  it('combines activity search and outcome filters and resets empty results', async () => {
    const user = userEvent.setup();
    render(<SecurityActivity events={exampleSecurityEvents} />);
    await user.click(screen.getByRole('combobox', { name: '활동 결과' }));
    await user.click(await screen.findByRole('option', { name: '실패' }));
    expect(screen.getByText('활동 1건')).toBeVisible();
    await user.type(screen.getByRole('searchbox', { name: '보안 활동 검색' }), 'macOS');
    expect(screen.getByText('일치하는 보안 활동이 없습니다.')).toBeVisible();
    await user.click(screen.getByRole('button', { name: '필터 초기화' }));
    expect(screen.getByText('활동 3건')).toBeVisible();
  });
});
