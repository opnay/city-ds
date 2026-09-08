import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { toast } from '@opnay/city-ds-react/toast';
import { ProfileManagement } from './examples/profile-management';

beforeEach(() => {
  vi.spyOn(toast, 'success').mockReturnValue(0);
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('Profile management block', () => {
  it('rejects whitespace names and preserves edits after a failed save', async () => {
    const user = userEvent.setup();
    const save = vi.fn().mockRejectedValueOnce(new Error('network')).mockResolvedValue(undefined);
    render(<ProfileManagement onSave={save} />);
    const name = screen.getByRole('textbox', { name: '표시 이름' });
    await user.clear(name);
    await user.type(name, '   ');
    await user.click(screen.getByRole('button', { name: '변경 사항 저장' }));
    expect(screen.getByText('표시 이름을 입력하십시오.')).toBeVisible();
    expect(save).not.toHaveBeenCalled();
    await user.clear(name);
    await user.type(name, '김민수');
    await user.click(screen.getByRole('button', { name: '변경 사항 저장' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('저장하지 못했습니다');
    expect(toast.success).not.toHaveBeenCalled();
    expect(name).toHaveValue('김민수');
    await user.click(screen.getByRole('button', { name: '변경 사항 저장' }));
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('프로필을 저장했습니다.'));
    await user.type(name, ' 수정');
    await user.click(screen.getByRole('button', { name: '취소' }));
    expect(name).toHaveValue('김민수');
  });

  it('locks editing and prevents duplicate submissions while saving', async () => {
    const user = userEvent.setup();
    let finish!: () => void;
    const save = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    );
    const { container } = render(<ProfileManagement onSave={save} />);
    const name = screen.getByRole('textbox', { name: '표시 이름' });
    await user.type(name, ' 변경');
    fireEvent.submit(container.querySelector('form')!);
    fireEvent.submit(container.querySelector('form')!);
    expect(save).toHaveBeenCalledTimes(1);
    expect(name).toBeDisabled();
    expect(screen.getByRole('textbox', { name: '자기소개' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '취소' })).toBeDisabled();
    finish();
    await waitFor(() => expect(name).toBeEnabled());
  });

  it('validates images, restores a saved image on cancel and releases preview URLs', async () => {
    const user = userEvent.setup();
    const create = vi.fn(() => 'blob:profile-preview');
    const revoke = vi.fn();
    vi.stubGlobal('URL', { createObjectURL: create, revokeObjectURL: revoke });
    const { unmount } = render(<ProfileManagement onSave={async () => {}} />);
    const input = screen.getByLabelText('프로필 이미지', { selector: 'input' });
    fireEvent.change(input, {
      target: { files: [new File(['bad'], 'bad.txt', { type: 'text/plain' })] },
    });
    expect(screen.getByText('5MB 이하의 PNG, JPG, WebP 이미지를 선택하십시오.')).toBeVisible();
    const file = new File(['image'], 'profile.png', { type: 'image/png' });
    fireEvent.change(input, { target: { files: [file] } });
    expect(create).toHaveBeenCalledWith(file);
    await user.click(screen.getByRole('button', { name: '변경 사항 저장' }));
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('프로필을 저장했습니다.'));
    await user.click(screen.getByRole('button', { name: '이미지 제거' }));
    expect(revoke).toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: '취소' }));
    expect(screen.getByRole('button', { name: '이미지 제거' })).toBeEnabled();
    unmount();
    expect(revoke).toHaveBeenCalledTimes(2);
  });
});
