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

    expect(screen.getByRole('heading', { level: 1, name: title })).toHaveClass(
      'city-text-page-title',
    );
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
    const productNavigation = screen.getByRole('navigation', { name: '제품 소개 탐색' });

    const pageTitle = within(main).getByRole('heading', {
      level: 1,
      name: '운영 제품을 위한 React 디자인 시스템',
    });
    expect(pageTitle).toHaveClass('city-text-display');
    expect(
      within(main).getByRole('heading', {
        level: 2,
        name: '일관된 선택을 위한 기준을 제공합니다.',
      }),
    ).toHaveClass('city-text-section-title');
    expect(productNavigation).toBeVisible();
    expect(within(productNavigation).getByRole('link', { name: '제품 기반' })).toHaveAttribute(
      'href',
      '#product-foundation',
    );
    expect(within(productNavigation).getByRole('link', { name: '사용 맥락' })).toHaveAttribute(
      'href',
      '#product-contexts',
    );
    expect(within(productNavigation).getByRole('link', { name: '컴포넌트' })).toHaveAttribute(
      'href',
      '#product-components',
    );
    expect(screen.queryByRole('navigation', { name: '현재 위치' })).not.toBeInTheDocument();
    expect(
      within(main).getByText(/복잡한 운영 도구와 데이터 화면을 빠르고 일관되게/),
    ).toBeVisible();
    expect(within(main).getByRole('region', { name: '거래 검토' })).toBeVisible();
    expect(within(main).getByRole('searchbox', { name: '거래 ID 또는 사용자 검색' })).toBeVisible();
    expect(
      within(main).getByRole('region', {
        name: '일관된 선택을 위한 기준을 제공합니다.',
      }),
    ).toHaveAttribute('id', 'product-foundation');
    expect(
      within(main).getByRole('region', {
        name: '실제 운영 흐름에 맞춘 상호작용을 지원합니다.',
      }),
    ).toHaveAttribute('id', 'product-contexts');
    expect(
      within(main).getByRole('region', {
        name: '즉시 사용할 수 있는 컴포넌트를 제공합니다.',
      }),
    ).toHaveAttribute('id', 'product-components');
    expect(within(main).getByRole('link', { name: '설치 가이드 보기' })).toBeVisible();
    expect(within(main).getByRole('img', { name: '그림자 토큰' })).toBeVisible();
  });

  it('filters the landing preview and copies the install command', async () => {
    const user = userEvent.setup();
    const clipboard = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();
    await renderDocs(['/']);
    const main = screen.getByRole('main');
    const search = within(main).getByRole('searchbox', { name: '거래 ID 또는 사용자 검색' });

    await user.type(search, 'lee.ys');
    expect(within(main).getByText('TX-98719')).toBeVisible();
    expect(within(main).queryByText('TX-98721')).not.toBeInTheDocument();

    await user.click(within(main).getByRole('button', { name: '복사' }));
    expect(clipboard).toHaveBeenCalledWith('pnpm add @opnay/city-ds-react');
    expect(within(main).getByRole('button', { name: '복사됨' })).toBeVisible();

    clipboard.mockRestore();
  });

  it('documents content typography roles and semantic structure', async () => {
    const { container } = await renderDocs(['/foundations']);
    const main = screen.getByRole('main');

    expect(
      within(main).getByRole('heading', { level: 2, name: '콘텐츠 타이포그래피' }),
    ).toHaveClass('city-text-section-title');
    expect(within(main).getAllByText('city-text-page-title').length).toBeGreaterThan(0);
    expect(within(main).getByText(/heading 수준은 문서 구조를 나타내고/)).toHaveClass(
      'city-text-body',
    );
    expect(container.querySelector('.city-docs-page-description')).toHaveClass('city-text-lead');
    expect(container.querySelector('.city-docs-prose')).toHaveClass('city-prose');
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

  it('uses content roles for every catalog group and description', async () => {
    const { container } = await renderDocs(['/components']);

    const groupHeadings = container.querySelectorAll('.city-docs-component-groups h2');
    const descriptions = container.querySelectorAll(
      '.city-docs-component-grid .city-text-supporting',
    );

    expect(groupHeadings.length).toBeGreaterThan(0);
    for (const heading of groupHeadings) {
      expect(heading).toHaveClass('city-text-section-title');
    }
    expect(descriptions).toHaveLength(40);
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
