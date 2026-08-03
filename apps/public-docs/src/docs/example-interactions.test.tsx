import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { renderDocs } from '../test/render-docs';
import { pageData as progressPageData } from './components/progress/page-data';
import { pageData as toastPageData } from './components/toast/page-data';

describe('documented component interactions', () => {
  it('opens and closes an overlay example', async () => {
    const user = userEvent.setup();
    await renderDocs(['/components/dialog']);

    await user.click(screen.getByRole('button', { name: '세부 정보' }));
    const dialog = await screen.findByRole('dialog', { name: '프로젝트 세부 정보' });
    expect(within(dialog).getByText('현재 페이지를 벗어나지 않고 확인합니다.')).toBeVisible();

    await user.click(within(dialog).getByRole('button', { name: '닫기' }));
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: '프로젝트 세부 정보' })).not.toBeInTheDocument(),
    );
  });

  it('updates a controlled form example and exposes its local result', async () => {
    const user = userEvent.setup();
    await renderDocs(['/components/search-field']);
    const search = screen.getByRole('searchbox', { name: '문서 검색' });

    expect(search).toHaveValue('city');
    await user.clear(search);
    expect(screen.getByText('빈 검색어')).toBeVisible();
    await user.type(search, 'Button');

    expect(search).toHaveValue('Button');
    const form = search.closest('form');
    if (!form) throw new Error('문서 검색 form을 찾을 수 없습니다.');
    expect(within(form).getByText('Button')).toBeVisible();
  });

  it('adds transient feedback through the documented toast manager', async () => {
    const user = userEvent.setup();
    await renderDocs(['/components/toast']);

    await user.click(screen.getByRole('button', { name: '알림 표시' }));

    expect(await screen.findByText('저장되었습니다.')).toBeVisible();
    expect(screen.getByText('변경 사항을 반영했습니다.')).toBeVisible();
  });

  it('keeps the documented non-modal Drawer free of a backdrop and inert page state', async () => {
    const user = userEvent.setup();
    await renderDocs(['/components/drawer']);

    await user.click(screen.getByRole('button', { name: 'right · md · non-modal' }));
    const drawer = await screen.findByRole('dialog', { name: 'right Drawer' });
    expect(drawer).toBeVisible();
    expect(drawer.parentElement).toHaveClass('city-docs-nonmodal-drawer-viewport');
    expect(document.querySelector('[data-docs-drawer-backdrop]')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'left · sm' })).toBeVisible();
  });

  it('names Fieldset controls and updates controlled Toggle state', async () => {
    const user = userEvent.setup();
    const fieldset = await renderDocs(['/components/fieldset']);

    for (const name of ['이메일', '문자', '평일', '서울']) {
      expect(screen.getByRole('checkbox', { name })).toBeVisible();
    }

    fieldset.unmount();
    await renderDocs(['/components/toggle']);
    const controlled = screen.getByRole('button', { name: '제어됨: 해제' });
    await user.click(controlled);

    expect(screen.getByRole('button', { name: '제어됨: 선택' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: '비활성 토글' })).toBeDisabled();
  });

  it('renders every declared Progress shape, status and size combination', async () => {
    await renderDocs(['/components/progress']);

    const declared = progressPageData.examples
      .flatMap((example) => example.coverage)
      .flatMap((coverage) => coverage.combinations ?? [])
      .sort();
    const rendered = [...document.querySelectorAll<HTMLElement>('[data-docs-combination]')]
      .map((element) => element.dataset.docsCombination ?? '')
      .sort();

    expect(rendered).toEqual(declared);
    expect(screen.getAllByRole('progressbar')).toHaveLength(18);
  });

  it('renders every declared Toast tone and appearance combination', async () => {
    await renderDocs(['/components/toast']);

    const declared = toastPageData.examples
      .flatMap((example) => example.coverage)
      .flatMap((coverage) => coverage.combinations ?? [])
      .sort();

    await waitFor(() =>
      expect(document.querySelectorAll('[data-city-toast-root]')).toHaveLength(declared.length),
    );

    const matrix = screen.getByLabelText('토스트 옵션 행렬');
    expect(within(matrix).queryByRole('dialog')).not.toBeInTheDocument();
    expect(within(matrix).queryByRole('button')).not.toBeInTheDocument();

    const rendered = [...document.querySelectorAll<HTMLElement>('[data-city-toast-root]')]
      .map((element) => `tone=${element.dataset.tone}|appearance=${element.dataset.appearance}`)
      .sort();

    expect(rendered).toEqual(declared);
  });

  it('updates table sorting and indeterminate row selection', async () => {
    const user = userEvent.setup();
    await renderDocs(['/components/table']);
    const table = screen.getByRole('table', { name: '정렬하고 선택할 수 있는 장소' });
    const selectAll = within(table).getByRole('checkbox', { name: '모든 장소 선택' });

    expect(selectAll).toHaveAttribute('aria-checked', 'mixed');
    await user.click(within(table).getByRole('button', { name: '이름 (not sorted)' }));
    expect(within(table).getByRole('button', { name: '이름 (sorted ascending)' })).toBeVisible();

    await user.click(selectAll);
    expect(within(table).getByRole('checkbox', { name: '한강 선택' })).toBeChecked();
    expect(within(table).getByRole('checkbox', { name: '도시 공원 선택' })).toBeChecked();
  });
});
