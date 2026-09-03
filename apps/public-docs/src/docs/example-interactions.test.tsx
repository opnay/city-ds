import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';

import { renderDocs } from '../test/render-docs';
import { pageData as progressPageData } from './components/progress/page-data';
import { pageData as toastPageData } from './components/toast/page-data';
import { toast } from '@opnay/city-ds-react/toast';

afterEach(() => {
  toast.dismiss();
});

describe('documented component interactions', () => {
  it('configures the Button preview from the global options sidebar', async () => {
    const user = userEvent.setup();
    await renderDocs(['/components/button']);

    const example = screen.getByRole('region', { name: 'Button' });
    const preview = example.querySelector('.city-docs-example-preview');
    const previewButton = within(example).getByRole('button', { name: '미리보기 버튼' });
    const optionsTrigger = within(example).getByRole('button', { name: '미리보기 옵션 닫기' });

    expect(preview).not.toBeNull();
    const sidebar = within(example).getByRole('complementary', { name: '미리보기 옵션' });
    expect(preview).toContainElement(sidebar);
    expect(optionsTrigger).toHaveAttribute('aria-controls', 'preview-options-button-playground');
    expect(optionsTrigger).toHaveAttribute('aria-expanded', 'true');
    expect(within(sidebar).queryByText('옵션')).toBeNull();
    expect(Array.from(sidebar.querySelectorAll('code'), (label) => label.textContent)).toEqual([
      'size',
      'variant',
      'iconOnly',
      'disabled',
    ]);
    expect(within(sidebar).getByRole('radiogroup', { name: 'size' })).toBeVisible();
    expect(within(sidebar).getByRole('radio', { name: 'md' })).toBeChecked();

    await user.click(within(sidebar).getByRole('radio', { name: 'lg' }));
    expect(previewButton).toHaveAttribute('data-city-size', 'lg');

    await user.click(within(sidebar).getByRole('combobox', { name: 'variant' }));
    await user.click(await screen.findByRole('option', { name: 'destructive' }));
    expect(previewButton).toHaveClass('bg-city-destructive');

    await user.click(within(sidebar).getByRole('switch', { name: 'disabled' }));
    expect(previewButton).toBeDisabled();

    await user.click(optionsTrigger);
    expect(within(example).queryByRole('complementary', { name: '미리보기 옵션' })).toBeNull();
    expect(document.getElementById('preview-options-button-playground')).toHaveAttribute('hidden');

    await user.click(within(example).getByRole('button', { name: '미리보기 옵션 열기' }));
    expect(within(example).getByRole('complementary', { name: '미리보기 옵션' })).toBeVisible();

    await user.click(within(example).getByRole('button', { name: '미리보기 설정' }));
    const settings = await screen.findByRole('menu', { name: '미리보기 설정' });
    expect(within(settings).queryByRole('menuitemcheckbox', { name: '옵션 패널' })).toBeNull();
  });

  it('opens and closes an overlay example', async () => {
    const user = userEvent.setup();
    await renderDocs(['/components/dialog']);

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
    await renderDocs(['/components/alert-dialog']);

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

  it('separates popover state ownership and modal interaction scope', async () => {
    const user = userEvent.setup();
    await renderDocs(['/components/popover']);

    const controlledPreview = screen.getByRole('region', { name: '열림 상태 소유권' });
    expect(within(controlledPreview).getByText('컴포넌트 소유')).toBeVisible();
    expect(within(controlledPreview).getByText('외부 상태 소유')).toBeVisible();

    await user.click(within(controlledPreview).getByRole('button', { name: '릴리스 정보' }));
    const releasePopover = await screen.findByRole('dialog', { name: '릴리스 정보' });
    expect(
      within(releasePopover).getByText('v0.1.1이 8분 전에 프로덕션에 배포되었습니다.'),
    ).toBeVisible();
    await user.click(within(releasePopover).getByRole('button', { name: '확인' }));

    const modalPreview = screen.getByRole('region', { name: '상호작용 범위' });
    await user.click(within(modalPreview).getByRole('button', { name: '공유 범위 변경' }));
    const modalPopover = await screen.findByRole('dialog', { name: '공유 범위 변경' });
    expect(
      within(modalPopover).getByText('링크가 있는 모든 사용자가 프로젝트를 볼 수 있게 됩니다.'),
    ).toBeVisible();
    expect(document.querySelector('.bg-city-backdrop-subtle')).toBeInTheDocument();
  });

  it('updates a controlled form example and exposes its local result', async () => {
    const user = userEvent.setup();
    await renderDocs(['/components/search-input']);
    const searchExample = screen.getByRole('region', { name: '제어 검색' });
    const search = within(searchExample).getByRole('searchbox', {
      name: '문서 검색',
    });

    expect(search).toHaveValue('city');
    await user.clear(search);
    expect(screen.getByText('빈 검색어')).toBeVisible();
    await user.type(search, 'Button');

    expect(search).toHaveValue('Button');
    expect(within(searchExample).getByText('Button')).toBeVisible();
  });

  it('uses chips when the Combobox preview switches to multiple selection', async () => {
    const user = userEvent.setup();
    await renderDocs(['/components/combobox']);

    const example = screen.getByRole('region', { name: 'Combobox' });
    const sidebar = within(example).getByRole('complementary', { name: '미리보기 옵션' });
    await user.click(within(sidebar).getByRole('switch', { name: 'multiple' }));

    expect(within(example).getByRole('button', { name: '도시 포털 제거' })).toBeVisible();
    expect(within(example).getByRole('button', { name: '모든 프로젝트 지우기' })).toBeVisible();
  });

  it('keeps DatePicker open state with the picker instead of the options panel', async () => {
    const user = userEvent.setup();
    await renderDocs(['/components/date-picker']);

    const example = screen.getByRole('region', { name: 'DatePicker' });
    const sidebar = within(example).getByRole('complementary', { name: '미리보기 옵션' });
    expect(within(sidebar).queryByRole('switch', { name: 'open' })).toBeNull();
    expect(within(sidebar).getByRole('radiogroup', { name: 'size' })).toBeVisible();

    await user.click(within(example).getByRole('button', { name: '검토 날짜 달력 열기' }));
    expect(await screen.findByLabelText('검토 날짜 달력')).toBeVisible();
  });

  it('syncs ToggleGroup selection when the pressed preview option changes', async () => {
    const user = userEvent.setup();
    await renderDocs(['/components/toggle-group']);

    const example = screen.getByRole('region', { name: 'ToggleGroup' });
    const sidebar = within(example).getByRole('complementary', { name: '미리보기 옵션' });
    await user.click(
      within(sidebar).getByRole('switch', {
        name: 'pressed',
      }),
    );

    await waitFor(() =>
      expect(within(example).getByRole('button', { name: '굵게' })).toHaveAttribute(
        'aria-pressed',
        'true',
      ),
    );
  });

  it('syncs Table sorting and selection when preview options change', async () => {
    const user = userEvent.setup();
    await renderDocs(['/components/table']);

    const example = screen.getByRole('region', { name: 'Table' });
    const table = within(example).getByRole('table', { name: '옵션을 조절할 수 있는 장소' });
    const sidebar = within(example).getByRole('complementary', { name: '미리보기 옵션' });

    await user.click(within(sidebar).getByRole('radio', { name: 'asc' }));
    await waitFor(() =>
      expect(within(table).getByRole('button', { name: '이름 (sorted ascending)' })).toBeVisible(),
    );

    await user.click(within(sidebar).getByRole('combobox', { name: 'selection' }));
    await user.click(await screen.findByRole('option', { name: 'indeterminate' }));
    await waitFor(() =>
      expect(within(table).getByRole('checkbox', { name: '모든 장소 선택' })).toHaveAttribute(
        'aria-checked',
        'mixed',
      ),
    );
    expect(within(table).getByRole('checkbox', { name: '한강 선택' })).toBeChecked();
    expect(within(table).getByRole('checkbox', { name: '도시 공원 선택' })).not.toBeChecked();
  });

  it('limits the Badge preview to non-conflicting presentation options', async () => {
    const user = userEvent.setup();
    await renderDocs(['/components/badge']);

    const example = screen.getByRole('region', { name: 'Badge' });
    const sidebar = within(example).getByRole('complementary', { name: '미리보기 옵션' });

    expect(within(sidebar).queryByRole('combobox', { name: 'variant' })).toBeNull();
    await user.click(within(sidebar).getByRole('combobox', { name: 'tone' }));
    await user.click(await screen.findByRole('option', { name: 'destructive' }));
    expect(within(example).getByText('알림').closest('[data-city-badge]')).toHaveAttribute(
      'data-tone',
      'destructive',
    );
  });

  it('adds transient feedback through the documented Sonner API', async () => {
    const user = userEvent.setup();
    await renderDocs(['/components/toast']);

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
    await renderDocs(['/components/drawer']);

    await user.click(screen.getByRole('button', { name: 'right · md · non-modal' }));
    const drawer = await screen.findByRole('dialog', { name: 'right Drawer' });
    expect(drawer).toBeVisible();
    expect(drawer.parentElement).toHaveClass('city-docs-nonmodal-drawer-viewport');
    expect(document.querySelector('[data-docs-drawer-backdrop]')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'left · sm' })).toBeVisible();
  });

  it('names Fieldset controls and keeps a controlled SegmentedControl selection', async () => {
    const user = userEvent.setup();
    const fieldset = await renderDocs(['/components/fieldset']);

    const defaultPreview = screen.getByRole('region', { name: 'Fieldset' });
    for (const name of ['이메일', '문자', '푸시']) {
      expect(within(defaultPreview).getByRole('checkbox', { name })).toBeVisible();
    }

    const statesPreview = screen.getByRole('region', { name: '그룹 상태' });
    for (const name of ['평일', '주말', '서울', '경기']) {
      expect(within(statesPreview).getByRole('checkbox', { name })).toBeVisible();
    }

    fieldset.unmount();
    await renderDocs(['/components/segmented-control']);
    const segmentedControl = screen.getByRole('region', { name: '필수 단일 선택' });
    const grid = within(segmentedControl).getByRole('radio', { name: '격자' });
    const list = within(segmentedControl).getByRole('radio', { name: '목록' });
    const map = within(segmentedControl).getByRole('radio', { name: '지도' });

    await user.click(list);

    expect(grid).toHaveAttribute('aria-checked', 'false');
    expect(list).toHaveAttribute('aria-checked', 'true');
    expect(map).toHaveAttribute('data-disabled');
  });

  it('renders every declared Progress shape, status and size combination', async () => {
    await renderDocs(['/components/progress']);

    const declared = progressPageData.examples
      .flatMap((example) => example.coverage)
      .flatMap((coverage) =>
        'combinations' in coverage && Array.isArray(coverage.combinations)
          ? coverage.combinations
          : [],
      )
      .sort((first, second) => first.localeCompare(second));
    const progressExample = screen.getByRole('region', { name: '진행 상태' });
    const rendered = [...progressExample.querySelectorAll<HTMLElement>('[data-docs-combination]')]
      .map((element) => element.dataset.docsCombination ?? '')
      .sort((first, second) => first.localeCompare(second));

    expect(rendered).toEqual(declared);
    expect(within(progressExample).getAllByRole('progressbar')).toHaveLength(30);
  });

  it('renders every declared Toast tone', async () => {
    const user = userEvent.setup();
    await renderDocs(['/components/toast']);

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
