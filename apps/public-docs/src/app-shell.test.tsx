import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { renderDocs } from './test/render-docs';

describe('public docs routes and shell', () => {
  it.each([
    ['/getting-started', '시작하기'],
    ['/foundations', '기초'],
    ['/patterns', '패턴'],
    ['/accessibility', '접근성'],
    ['/components', '컴포넌트'],
    ['/components/button', 'Button'],
  ])('renders %s', async (path, title) => {
    await renderDocs([path]);

    expect(screen.getByRole('heading', { level: 1, name: title })).toBeVisible();
    expect(screen.getByRole('navigation', { name: '현재 위치' })).toBeVisible();
  });

  it.each(['/components/not-a-component', '/not-a-route'])(
    'recovers unknown route %s',
    async (path) => {
      await renderDocs([path]);

      expect(
        screen.getByRole('heading', { level: 1, name: '문서를 찾을 수 없습니다.' }),
      ).toBeVisible();
      expect(screen.getByRole('link', { name: '컴포넌트 목록으로' })).toBeVisible();
    },
  );

  it('navigates with internal links, focuses main content and supports back history', async () => {
    const user = userEvent.setup();
    const { history } = await renderDocs(['/']);
    const main = screen.getByRole('main');

    await user.click(within(main).getByRole('link', { name: '시작하기' }));

    expect(await screen.findByRole('heading', { level: 1, name: '시작하기' })).toBeVisible();
    await waitFor(() => expect(screen.getByRole('main')).toHaveFocus());

    act(() => history.back());

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: '운영 제품을 위한 React 디자인 시스템',
      }),
    ).toBeVisible();
  });

  it('introduces the product and offers task-oriented starting paths', async () => {
    await renderDocs(['/']);
    const main = screen.getByRole('main');

    expect(
      within(main).getByRole('heading', {
        level: 1,
        name: '운영 제품을 위한 React 디자인 시스템',
      }),
    ).toBeVisible();
    expect(screen.getByRole('navigation', { name: '제품 소개 탐색' })).toBeVisible();
    expect(screen.queryByRole('navigation', { name: '현재 위치' })).not.toBeInTheDocument();
    expect(
      within(main).getByText(/복잡한 운영 도구, 데이터 화면, 폼을 빠르고 일관되게/),
    ).toBeVisible();
    expect(within(main).getByRole('progressbar', { name: '릴리스 준비도' })).toBeVisible();
    expect(
      within(main).getByRole('heading', {
        level: 2,
        name: '컴포넌트뿐 아니라 선택 기준까지 제공합니다.',
      }),
    ).toBeVisible();
    expect(within(main).getByRole('heading', { level: 3, name: '운영 도구' })).toBeVisible();
    expect(within(main).getByRole('heading', { level: 3, name: '데이터 화면' })).toBeVisible();
    expect(within(main).getByRole('heading', { level: 3, name: '입력 흐름' })).toBeVisible();
    expect(within(main).getByRole('link', { name: '설치하고 시작하기' })).toBeVisible();
    expect(within(main).getByRole('link', { name: '전체 컴포넌트 보기' })).toBeVisible();
  });

  it('closes the mobile drawer after navigation', async () => {
    const user = userEvent.setup();
    await renderDocs(['/getting-started']);

    await user.click(screen.getByRole('button', { name: '문서 메뉴 열기' }));
    const drawer = await screen.findByRole('dialog', { name: '문서 메뉴' });
    await user.click(within(drawer).getByRole('link', { name: '패턴' }));

    expect(await screen.findByRole('heading', { level: 1, name: '패턴' })).toBeVisible();
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: '문서 메뉴' })).not.toBeInTheDocument(),
    );
  });
});

describe('catalog and local UI state', () => {
  it('searches English and Korean metadata and recovers an empty result', async () => {
    const user = userEvent.setup();
    await renderDocs(['/components']);
    const main = screen.getByRole('main');
    const search = within(main).getByRole('searchbox', { name: '컴포넌트 검색' });

    await user.type(search, 'Button');
    expect(within(main).getByText('컴포넌트 1개')).toBeVisible();
    expect(within(main).getByRole('link', { name: /Button/ })).toBeVisible();

    await user.clear(search);
    await user.type(search, '체크박스');
    expect(within(main).getByText('컴포넌트 2개')).toBeVisible();

    await user.clear(search);
    await user.type(search, '존재하지 않는 검색어');
    expect(within(main).getByText('조건에 맞는 컴포넌트가 없습니다.')).toBeVisible();

    await user.click(within(main).getAllByRole('button', { name: '필터 초기화' })[0]!);
    expect(search).toHaveValue('');
    expect(within(main).getByText('컴포넌트 40개')).toBeVisible();
  });

  it('filters the catalog by category', async () => {
    const user = userEvent.setup();
    await renderDocs(['/components']);
    const main = screen.getByRole('main');

    await user.click(within(main).getByRole('combobox', { name: '컴포넌트 범주' }));
    await user.click(await screen.findByRole('option', { name: '폼' }));

    expect(within(main).getByText('컴포넌트 15개')).toBeVisible();
    expect(within(main).getByRole('link', { name: /^Field레이블/ })).toBeVisible();
    expect(within(main).queryByRole('link', { name: /Button/ })).not.toBeInTheDocument();
  });

  it('restores only a valid stored theme and lets the user change it', async () => {
    window.localStorage.setItem('city-docs-theme', 'invalid');
    const user = userEvent.setup();
    await renderDocs(['/']);

    await waitFor(() => expect(window.localStorage.getItem('city-docs-theme')).toBe('system'));
    expect(document.documentElement).not.toHaveAttribute('data-theme');

    await user.click(screen.getByRole('combobox', { name: '화면 테마' }));
    await user.click(await screen.findByRole('option', { name: '라이트 테마' }));

    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-theme', 'light'));
    expect(window.localStorage.getItem('city-docs-theme')).toBe('light');

    await user.click(screen.getByRole('combobox', { name: '화면 테마' }));
    await user.click(await screen.findByRole('option', { name: '시스템 테마' }));

    await waitFor(() => expect(document.documentElement).not.toHaveAttribute('data-theme'));
    expect(window.localStorage.getItem('city-docs-theme')).toBe('system');

    await user.click(screen.getByRole('combobox', { name: '화면 테마' }));
    await user.click(await screen.findByRole('option', { name: '다크 테마' }));

    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-theme', 'dark'));
    expect(window.localStorage.getItem('city-docs-theme')).toBe('dark');
  });

  it('announces a clipboard failure and leaves source visible', async () => {
    const user = userEvent.setup();
    const clipboard = vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('no'));
    await renderDocs(['/components/button']);

    const details = screen.getAllByText('코드 보기')[0]!.closest('details');
    if (!details) throw new Error('코드 예제 details를 찾을 수 없습니다.');
    await user.click(within(details).getByText('코드 보기'));
    await user.click(within(details).getByRole('button', { name: '코드 복사' }));

    expect(within(details).getByRole('button', { name: '복사 실패' })).toBeVisible();
    expect(
      within(details).getByText(/variants\.tsx 코드를 복사할 수 없습니다/),
    ).toBeInTheDocument();
    expect(within(details).getByRole('code')).not.toBeEmptyDOMElement();

    clipboard.mockRestore();
  });
});
