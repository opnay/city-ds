import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderDocs } from '../test/render-docs';
import { filterDocumentPages, getComponentDoc } from '../docs/doc-catalog';
import { BLOCK_DOCS } from './block-catalog';

describe('Blocks', () => {
  it('connects the catalog, search, source and component references', async () => {
    const user = userEvent.setup();
    await renderDocs(['/blocks']);
    const main = within(screen.getByRole('main'));
    expect(screen.getByRole('combobox', { name: '문서 영역' })).toHaveTextContent('Blocks');
    await user.click(main.getByRole('link', { name: /프로필 관리/ }));
    expect(await screen.findByRole('heading', { level: 1, name: '프로필 관리' })).toBeVisible();
    const group = screen.getByRole('button', { name: '사용자 관리' });
    expect(group).toHaveAttribute('aria-expanded', 'true');
    await user.click(group);
    expect(group).toHaveAttribute('aria-expanded', 'false');
    await user.click(group);
    expect(screen.getByText('비밀번호 변경')).toBeVisible();
    expect(
      within(screen.getByRole('navigation', { name: '현재 위치' })).getByRole('link', {
        name: '블록',
      }),
    ).toHaveAttribute('href', '/blocks');
    await user.click(screen.getByRole('button', { name: '코드 보기' }));
    expect(await screen.findByLabelText('미리보기 예제 소스 코드')).toHaveTextContent(
      'export function ProfileManagement',
    );
    expect(
      filterDocumentPages('팀원').some(
        (result) => result.kind === 'block' && result.entry.slug === 'member-directory',
      ),
    ).toBe(true);
    for (const entry of BLOCK_DOCS) {
      expect(entry.components.every((slug) => getComponentDoc(slug))).toBe(true);
    }
  });

  it('saves profile edits locally and cancels back to the saved snapshot', async () => {
    const user = userEvent.setup();
    await renderDocs(['/blocks/account-settings']);
    const preview = within(screen.getByRole('region', { name: '미리보기' }));
    const name = preview.getByRole('textbox', { name: '이름' });
    const save = preview.getByRole('button', { name: '변경 사항 저장' });
    expect(save).toBeDisabled();
    await user.clear(name);
    await user.type(name, '김민수');
    await user.click(save);
    expect(save).toBeDisabled();
    expect(preview.getByText('변경 사항을 미리보기에 저장했습니다.')).toBeVisible();
    await user.type(name, ' 수정');
    await user.click(preview.getByRole('button', { name: '취소' }));
    expect(name).toHaveValue('김민수');
    await user.click(preview.getByRole('switch', { name: '이메일 알림' }));
    expect(save).toBeEnabled();
  });

  it('shows a code mismatch, accepts the demo code and resets for another attempt', async () => {
    const user = userEvent.setup();
    await renderDocs(['/blocks/verification-code']);
    const preview = within(screen.getByRole('region', { name: '미리보기' }));
    const confirm = preview.getByRole('button', { name: '코드 확인' });
    expect(confirm).toBeDisabled();
    await user.click(preview.getAllByRole('textbox')[0]!);
    await user.paste('000000');
    await user.click(confirm);
    expect(preview.getByText('코드가 일치하지 않습니다. 다시 확인하십시오.')).toBeVisible();
    await user.click(preview.getAllByRole('textbox')[0]!);
    await user.paste('123456');
    await user.click(confirm);
    expect(preview.getByText('코드가 일치합니다')).toBeVisible();
    expect(confirm).toBeDisabled();
    await user.click(preview.getByRole('button', { name: '다시 입력' }));
    expect(preview.getAllByRole('textbox')[0]).toHaveValue('');
    expect(preview.queryByText('코드가 일치합니다')).not.toBeInTheDocument();
  });

  it('combines member search with status filtering and recovers from empty results', async () => {
    const user = userEvent.setup();
    await renderDocs(['/blocks/member-directory']);
    const preview = within(screen.getByRole('region', { name: '미리보기' }));
    await user.click(preview.getByRole('combobox', { name: '팀원 상태' }));
    await user.click(await screen.findByRole('option', { name: '초대 중' }));
    expect(preview.getByText('팀원 1명')).toBeVisible();
    expect(preview.getByText('박지우')).toBeVisible();
    await user.type(preview.getByRole('searchbox', { name: '팀원 검색' }), 'seoyeon');
    expect(preview.getByText('일치하는 팀원이 없습니다')).toBeVisible();
    await user.click(preview.getByRole('button', { name: '필터 초기화' }));
    expect(preview.getByText('팀원 3명')).toBeVisible();
  });
});
