import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { renderDocs } from './test/render-docs';

describe('public docs routes and shell', () => {
  it.each([
    ['/getting-started', '시작하기'],
    ['/foundations', '기초'],
    ['/color', '색상'],
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

  it('omits redundant state captions while preserving accessible control names', async () => {
    const { container } = await renderDocs(['/components/select']);

    expect(await screen.findByRole('heading', { level: 1, name: 'Select' })).toBeVisible();
    await waitFor(() =>
      expect(container.querySelectorAll('.city-docs-example-variant').length).toBeGreaterThan(0),
    );

    const selectionExample = screen.getByRole('region', { name: '선택 방식' });
    expect(selectionExample.querySelector('.city-docs-example-label')).toBeNull();
    expect(within(selectionExample).getAllByRole('combobox', { name: '작업 상태' })).toHaveLength(
      3,
    );
  });

  it('separates Fieldset surfaces and keeps each preview as a real group', async () => {
    await renderDocs(['/components/fieldset']);

    for (const name of ['Fieldset', 'Outline', 'Plain', 'Band']) {
      const preview = screen.getByRole('region', { name });
      expect(preview.querySelector('.city-docs-example-preview-content')).toHaveAttribute(
        'data-city-docs-layout',
        'wide',
      );
      expect(within(preview).getByRole('group', { name: '알림 채널' })).toBeVisible();
      expect(within(preview).getAllByRole('checkbox')).toHaveLength(3);
      expect(preview.querySelector('.city-docs-fieldset-options-3')).toBeVisible();
    }

    expect(
      screen
        .getByRole('region', { name: '그룹 상태' })
        .querySelector('.city-docs-example-preview-content'),
    ).toHaveAttribute('data-city-docs-layout', 'wide');
    expect(
      screen
        .getByRole('region', { name: '그룹 상태' })
        .querySelectorAll('.city-docs-fieldset-options-2'),
    ).toHaveLength(2);
    expect(screen.queryByText(/^(plain|band|outline) 알림 채널$/)).not.toBeInTheDocument();
  });

  it('navigates with internal links, focuses main content and supports back history', async () => {
    const user = userEvent.setup();
    const { history } = await renderDocs(['/']);

    await user.click(screen.getByRole('link', { name: '문서 열기' }));

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

  it('introduces the product before presenting ten organism examples', async () => {
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
    expect(within(main).getByRole('link', { name: '문서 보기' })).toBeVisible();
    expect(within(main).getByText(/Base UI의 접근 가능한 동작과/)).toBeVisible();
    expect(within(main).getAllByRole('heading', { level: 2 })).toHaveLength(10);
    expect(within(main).getByRole('heading', { level: 2, name: 'Orders' })).toBeVisible();
    expect(within(main).getByRole('heading', { level: 2, name: 'Issue triage' })).toBeVisible();
    expect(within(main).getByRole('heading', { level: 2, name: 'Checkout' })).toBeVisible();
    expect(within(main).queryByRole('button', { name: '전체' })).not.toBeInTheDocument();
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
    expect(container.querySelector('.city-docs-page-heading-copy')).not.toBeNull();
    expect(container.querySelector('.city-docs-prose')).toHaveClass('city-prose');
  });

  it('documents component and layout spacing roles for consumers', async () => {
    await renderDocs(['/patterns']);
    const main = screen.getByRole('main');

    expect(
      within(main).getByRole('heading', { level: 2, name: '프로젝트 패턴 계층을 구축하십시오' }),
    ).toBeVisible();
    expect(
      within(main).getByText(
        '사용자 목표 > 프로젝트 패턴 선택·정의 > 컴포넌트 구성 > 레이아웃 구성 > 페이지 구현',
      ),
    ).toBeVisible();
    expect(
      within(main).getByText(/여러 프로젝트에서 같은 의미와 변경 이유로 반복될/),
    ).toBeVisible();
    expect(
      within(main).getByRole('heading', { level: 2, name: '간격은 역할에 따라 나누십시오' }),
    ).toBeVisible();
    expect(
      within(main).getByRole('heading', { level: 3, name: 'Component Spacing' }),
    ).toBeVisible();
    expect(within(main).getByRole('heading', { level: 3, name: 'Layout Spacing' })).toBeVisible();
    expect(within(main).getByText('Spacious Container')).toBeVisible();
    expect(within(main).getByText('Page gutter')).toBeVisible();
    expect(within(main).getByText(/spacing 소유자를 하나만 둡니다/)).toBeVisible();
    expect(within(main).getByRole('link', { name: '기초 문서' })).toHaveAttribute(
      'href',
      '/foundations',
    );
  });

  it('documents color roles and compares light and dark specimens', async () => {
    const { container } = await renderDocs(['/color']);

    expect(screen.getByRole('heading', { level: 2, name: '원시 팔레트' })).toBeVisible();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Surface 위계를 구분하십시오' }),
    ).toBeVisible();
    expect(screen.getByRole('heading', { level: 2, name: 'Tone과 Appearance' })).toBeVisible();
    expect(screen.getByRole('region', { name: 'Light와 Dark 의미 색상 비교' })).toBeVisible();
    expect(screen.getByRole('region', { name: 'Feedback tone과 appearance 비교' })).toBeVisible();

    const themePanels = container.querySelectorAll('.city-docs-color-theme-panel');
    expect(themePanels).toHaveLength(2);
    expect([...themePanels].map((panel) => panel.getAttribute('data-theme'))).toEqual([
      'light',
      'dark',
    ]);
    for (const panel of themePanels) {
      expect(within(panel as HTMLElement).getByText('--city-color-surface-raised')).toBeVisible();
      expect(panel.querySelectorAll('[data-city-badge][data-appearance="solid"]')).toHaveLength(4);
    }
  });

  it('renders the accessibility checklist with interactive city-ds controls', async () => {
    const user = userEvent.setup();
    const { container } = await renderDocs(['/accessibility']);
    const checklist = container.querySelector('.city-docs-checklist');

    expect(checklist).not.toBeNull();
    expect(checklist).toHaveClass('contains-task-list');
    expect(checklist?.querySelectorAll('.city-docs-checklist-item')).toHaveLength(7);

    const firstItem = screen.getByRole('checkbox', {
      name: 'light, dark, system에서 텍스트·경계·focus ring을 확인했습니다.',
    });

    expect(firstItem).toHaveClass('city-docs-checklist-control');
    expect(firstItem).not.toBeChecked();
    expect(firstItem).toBeEnabled();

    await user.click(
      within(checklist as HTMLElement).getByText(
        'light, dark, system에서 텍스트·경계·focus ring을 확인했습니다.',
      ),
    );

    expect(firstItem).toBeChecked();
  });

  it('groups the full navigation and searches every document page', async () => {
    const user = userEvent.setup();
    const { container } = await renderDocs(['/components']);
    const sidebar = container.querySelector<HTMLElement>('.city-docs-sidebar');
    if (!sidebar) throw new Error('문서 사이드바를 찾을 수 없습니다.');
    const navigation = screen.getByRole('navigation', { name: '문서 탐색' });
    const search = within(navigation).getByRole('searchbox', { name: '문서 검색' });
    const mode = within(navigation).getByRole('combobox', { name: '문서 영역' });

    expect(within(sidebar).getByRole('link', { name: 'city-ds 홈' })).toHaveClass(
      'city-docs-brand',
      'city-docs-home-link',
      'hover:bg-city-accent',
    );
    expect(within(sidebar).getByRole('link', { name: 'city-ds 홈' })).toHaveAttribute(
      'data-city-size',
      'md',
    );
    expect(within(sidebar).getByText('소비자 문서')).toBeVisible();
    expect(mode).toHaveTextContent('Components');
    expect(within(navigation).queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    expect(within(navigation).getByRole('link', { name: '전체 보기' })).toBeVisible();
    expect(within(navigation).getByRole('heading', { level: 3, name: '폼' })).toBeVisible();

    await user.click(mode);
    await user.click(await screen.findByRole('option', { name: 'Guides' }));

    expect(mode).toHaveTextContent('Guides');
    expect(within(navigation).queryByRole('heading')).not.toBeInTheDocument();
    expect(
      [...navigation.querySelectorAll('.city-docs-nav-scroll a')].map((link) => link.textContent),
    ).toEqual(['시작하기', '기초', '색상', '패턴', '접근성']);
    expect(within(navigation).queryByRole('link', { name: '전체 보기' })).not.toBeInTheDocument();

    await user.type(search, '설치');
    expect(within(navigation).getByText('1개')).toBeVisible();
    expect(within(navigation).getByRole('link', { name: /시작하기/ })).toBeVisible();

    await user.clear(search);
    await user.type(search, 'Button');
    expect(within(navigation).getByRole('link', { name: /Button/ })).toBeVisible();
    expect(within(navigation).getByText('컴포넌트 · 액션')).toBeVisible();

    await user.clear(search);
    await user.type(search, '존재하지 않는 검색어');
    expect(within(navigation).getByText('일치하는 문서가 없습니다.')).toBeVisible();

    await user.clear(search);
    await user.type(search, 'Getting started');
    await user.click(within(navigation).getByRole('link', { name: /시작하기/ }));

    expect(await screen.findByRole('heading', { level: 1, name: '시작하기' })).toBeVisible();
    await waitFor(() => expect(search).toHaveValue(''));
  });

  it('closes the mobile drawer after navigation', async () => {
    const user = userEvent.setup();
    await renderDocs(['/getting-started']);

    await user.click(screen.getByRole('button', { name: '문서 메뉴 열기' }));
    const drawer = await screen.findByRole('dialog', { name: '문서 메뉴' });
    await user.type(within(drawer).getByRole('searchbox', { name: '문서 검색' }), 'Patterns');
    await user.click(within(drawer).getByRole('link', { name: /패턴/ }));

    expect(await screen.findByRole('heading', { level: 1, name: '패턴' })).toBeVisible();
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: '문서 메뉴' })).not.toBeInTheDocument(),
    );
  });
});

describe('organism mosaic interactions', () => {
  it('updates order selection and switches issue queues', async () => {
    const user = userEvent.setup();
    await renderDocs(['/']);
    const main = screen.getByRole('main');

    await user.click(within(main).getByRole('checkbox', { name: 'Select ORD-98421' }));
    expect(within(main).getByText('2 selected')).toBeVisible();
    await user.click(within(main).getByRole('tab', { name: 'Mine' }));
    expect(within(main).getByText('Mobile drawer traps focus')).toBeVisible();
  });

  it('validates invitations, filters commands and manages local files and sessions', async () => {
    const user = userEvent.setup();
    await renderDocs(['/']);
    const main = screen.getByRole('main');

    const invite = within(main).getByRole('heading', { name: 'Invite members' }).closest('article');
    if (!invite) throw new Error('Invite members card was not rendered.');
    await user.click(within(invite).getByRole('button', { name: /Send invite as/ }));
    expect(within(invite).getByText('Enter a valid email address.')).toBeVisible();
    await user.type(within(invite).getByRole('textbox', { name: 'Email' }), 'new@acme.com');
    await user.click(within(invite).getByRole('button', { name: /Send invite as/ }));
    expect(within(invite).getByText('new@acme.com')).toBeVisible();

    const command = within(main).getByRole('heading', { name: 'Quick command' }).closest('article');
    if (!command) throw new Error('Quick command card was not rendered.');
    const commandSearch = within(command).getByRole('searchbox', { name: 'Search commands' });
    expect(commandSearch.previousElementSibling).toHaveAttribute('data-city-position', 'leading');
    await user.type(commandSearch, 'access');
    expect(within(command).getByRole('link', { name: /Accessibility guide/ })).toBeVisible();
    expect(within(command).queryByRole('link', { name: /Open orders/ })).not.toBeInTheDocument();

    const file = new File(['local only'], 'contract.pdf', { type: 'application/pdf' });
    await user.upload(within(main).getByLabelText('Upload local documents'), file);
    expect(within(main).getByText('contract.pdf')).toBeVisible();

    await user.click(within(main).getByRole('button', { name: 'Revoke Safari on iOS' }));
    expect(within(main).queryByText('Safari on iOS')).not.toBeInTheDocument();
  });

  it('confirms checkout and scheduling and reports notification saves', async () => {
    const user = userEvent.setup();
    await renderDocs(['/']);
    const main = screen.getByRole('main');

    await user.click(within(main).getByRole('button', { name: 'Place order' }));
    expect(await screen.findByText('Order placed')).toBeVisible();
    expect(within(main).getByText('Order AC-20984 confirmed')).toBeVisible();

    await user.click(within(main).getByRole('button', { name: '11:00 AM' }));
    await user.click(within(main).getByRole('button', { name: 'Confirm' }));
    expect(within(main).getByText(/Confirmed for .* at 11:00 AM/)).toBeVisible();

    await user.click(within(main).getByRole('switch', { name: 'Weekly digest' }));
    await user.click(within(main).getByRole('button', { name: 'Save preferences' }));
    expect(await screen.findByText('Preferences saved')).toBeVisible();
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
    const emptyResult = within(main).getByText('조건에 맞는 컴포넌트가 없습니다.');
    expect(emptyResult).toBeVisible();
    expect(emptyResult.closest('section')).toHaveClass('city-docs-catalog-empty-state');

    await user.click(within(main).getAllByRole('button', { name: '필터 초기화' })[0]!);
    expect(search).toHaveValue('');
    expect(within(main).getByText('컴포넌트 39개')).toBeVisible();
  });

  it('filters the catalog by category', async () => {
    const user = userEvent.setup();
    await renderDocs(['/components']);
    const main = screen.getByRole('main');

    await user.click(within(main).getByRole('combobox', { name: '컴포넌트 범주' }));
    await user.click(await screen.findByRole('option', { name: '폼' }));

    expect(within(main).getByText('컴포넌트 15개')).toBeVisible();
    expect(within(main).getByRole('link', { name: /^Field외부 입력/ })).toBeVisible();
    expect(within(main).getByRole('link', { name: /^SegmentedControl보기/ })).toBeVisible();
    expect(within(main).queryByRole('link', { name: /Button/ })).not.toBeInTheDocument();
  });

  it('uses content roles for every catalog group and description', async () => {
    const { container } = await renderDocs(['/components']);
    const filter = screen.getByRole('group', { name: '컴포넌트 필터' });

    expect(filter).toHaveClass('city-docs-catalog-filter');
    expect(filter.querySelector('.city-docs-catalog-search')).not.toBeNull();
    expect(filter.querySelector('.city-docs-catalog-search-input')).not.toBeNull();
    expect(filter.querySelector('.city-docs-catalog-category')).not.toBeNull();
    expect(
      within(filter).getByRole('combobox', { name: '컴포넌트 범주' }).parentElement,
    ).toHaveClass('city-docs-catalog-category');
    expect(screen.getByText('컴포넌트 39개')).toHaveClass('city-docs-results-count');
    const groupHeadings = container.querySelectorAll('.city-docs-component-groups h2');
    const descriptions = container.querySelectorAll(
      '.city-docs-component-grid .city-text-supporting',
    );

    expect(groupHeadings.length).toBeGreaterThan(0);
    for (const heading of groupHeadings) {
      expect(heading).toHaveClass('city-text-section-title');
    }
    expect(descriptions).toHaveLength(39);
  });

  it('uses the system theme initially and lets the user choose light or dark', async () => {
    window.localStorage.setItem('city-docs-theme', 'invalid');
    const user = userEvent.setup();
    await renderDocs(['/']);

    await waitFor(() => expect(window.localStorage.getItem('city-docs-theme')).toBe('system'));
    expect(document.documentElement).not.toHaveAttribute('data-theme');
    const themeGroup = screen.getByRole('radiogroup', { name: '화면 테마' });
    expect(themeGroup).toHaveAttribute('data-city-size', 'sm');
    const darkTheme = within(themeGroup).getByRole('radio', { name: '다크 테마' });
    const lightTheme = within(themeGroup).getByRole('radio', { name: '라이트 테마' });
    expect(darkTheme).toHaveAttribute('aria-checked', 'false');
    expect(lightTheme).toHaveAttribute('aria-checked', 'true');
    expect(screen.queryByRole('combobox', { name: '화면 테마' })).not.toBeInTheDocument();

    await user.click(darkTheme);

    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-theme', 'dark'));
    expect(window.localStorage.getItem('city-docs-theme')).toBe('dark');
    expect(darkTheme).toHaveAttribute('aria-checked', 'true');
    expect(lightTheme).toHaveAttribute('aria-checked', 'false');

    await user.click(lightTheme);

    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-theme', 'light'));
    expect(window.localStorage.getItem('city-docs-theme')).toBe('light');
    expect(darkTheme).toHaveAttribute('aria-checked', 'false');
    expect(lightTheme).toHaveAttribute('aria-checked', 'true');

    await user.click(lightTheme);
    expect(lightTheme).toHaveAttribute('aria-checked', 'true');
    expect(window.localStorage.getItem('city-docs-theme')).toBe('light');
  });

  it('restores a valid explicit theme', async () => {
    window.localStorage.setItem('city-docs-theme', 'dark');
    await renderDocs(['/components/button']);

    const themeGroup = screen.getByRole('radiogroup', { name: '화면 테마' });

    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-theme', 'dark'));
    expect(window.localStorage.getItem('city-docs-theme')).toBe('dark');
    expect(within(themeGroup).getByRole('radio', { name: '다크 테마' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('opens the options panel by default across document pages', async () => {
    const { router } = await renderDocs(['/components/button']);

    expect(screen.getByRole('complementary', { name: '미리보기 옵션' })).toBeVisible();

    await act(async () => {
      await router.navigate({ params: { slug: 'calendar' }, to: '/components/$slug' });
    });
    expect(await screen.findByRole('heading', { level: 1, name: 'Calendar' })).toBeVisible();
    expect(screen.getByRole('complementary', { name: '미리보기 옵션' })).toBeVisible();
  });

  it('applies persisted preview settings across document pages', async () => {
    window.localStorage.setItem('city-docs-preview-density', 'compact');
    window.localStorage.setItem('city-docs-preview-grid', 'off');
    window.localStorage.setItem('city-docs-preview-theme', 'dark');
    window.localStorage.setItem('city-docs-theme', 'light');
    const user = userEvent.setup();
    const { container, router } = await renderDocs(['/components/button']);

    expect(screen.queryByRole('menuitemcheckbox', { name: '격자 보기' })).not.toBeInTheDocument();
    await user.click(screen.getAllByRole('button', { name: '미리보기 설정' })[0]!);
    const previewMenu = await screen.findByRole('menu', { name: '미리보기 설정' });
    expect(previewMenu).toBeVisible();
    const darkTheme = within(previewMenu).getByRole('menuitemradio', { name: '다크' });
    const comfortableDensity = within(previewMenu).getByRole('menuitemradio', {
      name: 'Comfortable',
    });
    const compactDensity = within(previewMenu).getByRole('menuitemradio', { name: 'Compact' });
    const gridOption = await screen.findByRole('menuitemcheckbox', { name: '격자 보기' });
    expect(darkTheme).toBeChecked();
    expect(compactDensity).toBeChecked();
    expect(gridOption).not.toBeChecked();
    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-city-docs-preview-grid', 'off');
      expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    });
    for (const preview of container.querySelectorAll('.city-docs-example-preview')) {
      expect(preview).toHaveAttribute('data-theme', 'dark');
      expect(preview.querySelector('.city-docs-example-preview-content')).toHaveAttribute(
        'data-city-density',
        'compact',
      );
    }

    const systemTheme = within(previewMenu).getByRole('menuitemradio', { name: '시스템' });
    await user.click(systemTheme);
    expect(systemTheme).toBeChecked();
    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-theme', 'light');
      expect(window.localStorage.getItem('city-docs-theme')).toBe('light');
      expect(window.localStorage.getItem('city-docs-preview-theme')).toBe('system');
    });
    for (const preview of container.querySelectorAll('.city-docs-example-preview')) {
      expect(preview).toHaveAttribute('data-theme', 'light');
    }

    await user.click(comfortableDensity);
    expect(comfortableDensity).toBeChecked();
    await waitFor(() => {
      expect(window.localStorage.getItem('city-docs-preview-density')).toBe('comfortable');
    });
    for (const preview of container.querySelectorAll('.city-docs-example-preview-content')) {
      expect(preview).toHaveAttribute('data-city-density', 'comfortable');
    }

    await user.click(gridOption);
    expect(gridOption).toBeChecked();
    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-city-docs-preview-grid', 'on');
      expect(window.localStorage.getItem('city-docs-preview-grid')).toBe('on');
    });

    await act(async () => {
      await router.navigate({ params: { slug: 'calendar' }, to: '/components/$slug' });
    });
    expect(await screen.findByRole('heading', { level: 1, name: 'Calendar' })).toBeVisible();
    await user.click(screen.getAllByRole('button', { name: '미리보기 설정' })[0]!);
    expect(await screen.findByRole('menuitemradio', { name: '시스템' })).toBeChecked();
    expect(await screen.findByRole('menuitemradio', { name: 'Comfortable' })).toBeChecked();
    expect(await screen.findByRole('menuitemcheckbox', { name: '격자 보기' })).toBeChecked();
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    expect(document.documentElement).toHaveAttribute('data-city-docs-preview-grid', 'on');
    for (const preview of container.querySelectorAll('.city-docs-example-preview')) {
      expect(preview).toHaveAttribute('data-theme', 'light');
      expect(preview.querySelector('.city-docs-example-preview-content')).toHaveAttribute(
        'data-city-density',
        'comfortable',
      );
    }
  });

  it('announces a clipboard failure and leaves source visible', async () => {
    const user = userEvent.setup();
    const clipboard = vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('no'));
    await renderDocs(['/components/button']);

    const codeTrigger = screen.getAllByRole('button', { name: '코드 보기' })[0];
    if (!(codeTrigger instanceof HTMLElement)) {
      throw new Error('코드 보기 Trigger를 찾을 수 없습니다.');
    }
    const disclosure = codeTrigger.closest('.city-docs-example-code');
    if (!(disclosure instanceof HTMLElement)) {
      throw new Error('코드 예제 Accordion을 찾을 수 없습니다.');
    }
    await user.click(codeTrigger);
    await user.click(within(disclosure).getByRole('button', { name: '코드 복사' }));

    expect(within(disclosure).getByRole('button', { name: '복사 실패' })).toBeVisible();
    expect(
      within(disclosure).getByText(/playground\.tsx 코드를 복사할 수 없습니다/),
    ).toBeInTheDocument();
    expect(within(disclosure).getByRole('code')).not.toBeEmptyDOMElement();

    clipboard.mockRestore();
  });
});
