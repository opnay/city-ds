import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from '@opnay/city-ds-react/toast';
import { afterEach, describe, expect, it } from 'vitest';

import FiltersExample from './components/filter-bar/examples/filters';
import DialogControlledExample from './components/dialog/examples/controlled';
import AlertDialogConfirmExample from './components/alert-dialog/examples/confirm';
import SearchInputUsageExample from './components/search-input/examples/usage';
import ToastUsageExample from './components/toast/examples/usage';
import ToastPresentationExample from './components/toast/examples/presentation';
import DrawerModalityExample from './components/drawer/examples/modality';
import DrawerSidesExample from './components/drawer/examples/sides';
import ProgressStatesExample from './components/progress/examples/states';
import TableInteractionsExample from './components/table/examples/interactions';
import { pageData as progressPageData } from './components/progress/page-data';
import { pageData as toastPageData } from './components/toast/page-data';

afterEach(() => {
  toast.dismiss();
});

// Example behavior runs without the router, sidebar, and MDX of the whole document.
describe('documented example behavior', () => {
  it('combines filter conditions and resets them together', async () => {
    const user = userEvent.setup();
    const { container } = render(<FiltersExample />);
    const preview = within(container);
    await user.type(preview.getByRole('textbox', { name: '프로젝트 이름' }), '공원');
    expect(preview.getByRole('status')).toHaveTextContent('2개');
    await user.click(preview.getByRole('combobox', { name: '상태' }));
    const options = await screen.findByRole('listbox');
    await user.click(await within(options).findByRole('option', { name: '완료' }));
    expect(preview.getByRole('status')).toHaveTextContent('1개 · 공원 안내판 교체');
    await user.clear(preview.getByRole('textbox', { name: '프로젝트 이름' }));
    await user.type(preview.getByRole('textbox', { name: '프로젝트 이름' }), '도로');
    expect(preview.getByRole('status')).toHaveTextContent('조건에 맞는 프로젝트가 없어요.');
    await user.click(preview.getByRole('button', { name: '초기화' }));
    expect(preview.getByRole('textbox', { name: '프로젝트 이름' })).toHaveValue('');
    expect(preview.getByRole('combobox', { name: '상태' })).toHaveTextContent('모든 상태');
    expect(preview.getByRole('status')).toHaveTextContent('3개');
  });

  it('opens and closes an overlay example', async () => {
    const user = userEvent.setup();
    render(<DialogControlledExample />);

    await user.click(screen.getByRole('button', { name: 'MD 크기' }));
    const dialog = await screen.findByRole('dialog', { name: '프로젝트 세부 정보' });
    expect(
      within(dialog).getByText('운영에 필요한 핵심 정보와 공개 범위를 확인합니다.'),
    ).toBeVisible();
    expect(within(dialog).getByText('워크스페이스 멤버')).toBeVisible();

    await user.click(within(dialog).getByRole('button', { name: '닫기' }));
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: '프로젝트 세부 정보' })).not.toBeInTheDocument(),
    );
  });

  it('explains destructive consequences before confirming an alert dialog', async () => {
    const user = userEvent.setup();
    render(<AlertDialogConfirmExample />);

    await user.click(screen.getByRole('button', { name: '프로젝트 삭제' }));
    const dialog = await screen.findByRole('alertdialog', {
      name: 'Atlas 프로젝트를 삭제하시겠습니까?',
    });

    expect(
      within(dialog).getByText(
        '연결된 배포 12개와 활동 기록이 영구적으로 삭제되며 복구할 수 없습니다.',
      ),
    ).toBeVisible();
    expect(within(dialog).getByRole('button', { name: '취소' })).toBeVisible();
    expect(within(dialog).getByRole('button', { name: '프로젝트 삭제' })).toBeVisible();
  });

  it('updates a controlled form example and exposes its local result', async () => {
    const user = userEvent.setup();
    render(<SearchInputUsageExample />);
    const search = screen.getByRole('searchbox', {
      name: '문서 검색',
    });

    expect(search).toHaveValue('city');
    await user.clear(search);
    expect(screen.getByText('빈 검색어')).toBeVisible();
    await user.type(search, 'Button');

    expect(search).toHaveValue('Button');
    expect(screen.getByText('Button')).toBeVisible();
  });

  it('adds transient feedback through the documented Sonner API', async () => {
    const user = userEvent.setup();
    render(<ToastUsageExample />);

    await user.click(screen.getByRole('button', { name: '저장' }));

    const savedTitle = await screen.findByText('저장되었습니다.');
    const savedToast = savedTitle.closest<HTMLElement>('[data-sonner-toast]');
    expect(savedToast).not.toBeNull();
    expect(savedToast).toHaveAttribute('data-type', 'success');
    expect(savedToast?.querySelector('[data-icon] [data-city-toast-default-icon]')).not.toBeNull();
    expect(screen.getByText('변경 사항을 반영했습니다.')).toBeVisible();

    const savedClose = savedToast?.querySelector<HTMLButtonElement>(
      'button[aria-label="Close notification"]',
    );
    expect(savedClose).not.toBeNull();
    fireEvent.click(savedClose!);
    await waitFor(() => expect(screen.queryByText('저장되었습니다.')).not.toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: '새로고침' }));

    const refreshedTitle = await screen.findByText('새로고침했습니다.');
    const refreshedToast = refreshedTitle.closest<HTMLElement>('[data-sonner-toast]');
    expect(refreshedToast).toHaveAttribute('data-type', 'info');
    expect(
      refreshedToast?.querySelector('[data-icon] [data-city-toast-default-icon]'),
    ).not.toBeNull();

    const refreshedClose = refreshedToast?.querySelector<HTMLButtonElement>(
      'button[aria-label="Close notification"]',
    );
    expect(refreshedClose).not.toBeNull();
    fireEvent.click(refreshedClose!);
    await waitFor(() => expect(screen.queryByText('새로고침했습니다.')).not.toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: '상태 확인' }));

    const errorTitle = await screen.findByText('상태를 확인하지 못했습니다.');
    const errorToast = errorTitle.closest<HTMLElement>('[data-sonner-toast]');
    expect(errorToast).toHaveAttribute('data-type', 'error');
    expect(errorToast?.querySelector('[data-icon] [data-city-toast-default-icon]')).not.toBeNull();
    expect(within(errorToast!).getByRole('button', { name: '다시 확인' })).toHaveAttribute(
      'data-action',
    );
  });

  it('keeps the documented non-modal Drawer free of a backdrop and inert page state', async () => {
    const user = userEvent.setup();
    render(
      <>
        <DrawerModalityExample />
        <DrawerSidesExample />
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'right · md · non-modal' }));
    const drawer = await screen.findByRole('dialog', { name: 'right Drawer' });
    expect(drawer).toBeVisible();
    expect(drawer.parentElement).toHaveClass('city-docs-nonmodal-drawer-viewport');
    expect(document.querySelector('[data-docs-drawer-backdrop]')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'left · sm' })).toBeVisible();
  });

  it('renders every declared Progress shape, status and size combination', () => {
    const { container } = render(<ProgressStatesExample />);

    const declared = progressPageData.examples
      .flatMap((example) => example.coverage)
      .flatMap((coverage) =>
        'combinations' in coverage && Array.isArray(coverage.combinations)
          ? coverage.combinations
          : [],
      )
      .sort((first, second) => first.localeCompare(second));
    const progressExample = container;
    const rendered = [...progressExample.querySelectorAll<HTMLElement>('[data-docs-combination]')]
      .map((element) => element.dataset.docsCombination ?? '')
      .sort((first, second) => first.localeCompare(second));

    expect(rendered).toEqual(declared);
    expect(within(progressExample).getAllByRole('progressbar')).toHaveLength(30);
  });

  it('renders every declared Toast tone', async () => {
    const user = userEvent.setup();
    render(<ToastPresentationExample />);

    const declared = toastPageData.examples
      .flatMap((example) => example.coverage)
      .flatMap((coverage) =>
        'combinations' in coverage && Array.isArray(coverage.combinations)
          ? coverage.combinations.filter((value): value is string => typeof value === 'string')
          : [],
      )
      .sort((a, b) => a.localeCompare(b));

    for (const tone of ['neutral', 'info', 'success', 'warning', 'destructive']) {
      await user.click(screen.getByRole('button', { name: tone }));
    }

    await waitFor(() =>
      expect(document.querySelectorAll('[data-sonner-toast]')).toHaveLength(declared.length),
    );

    const rendered = [...document.querySelectorAll<HTMLElement>('[data-sonner-toast]')]
      .map((element) => {
        const type = element.dataset.type;
        return `tone=${type === 'error' ? 'destructive' : (type ?? 'neutral')}`;
      })
      .sort();

    expect(rendered).toEqual(declared);
  });

  it('updates table sorting and indeterminate row selection', async () => {
    const user = userEvent.setup();
    render(<TableInteractionsExample />);
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
