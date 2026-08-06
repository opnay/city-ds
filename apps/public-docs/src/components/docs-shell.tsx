import { useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Code2, Menu as MenuIcon, Search, X } from 'lucide-react';
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  type ErrorComponentProps,
} from '@tanstack/react-router';
import type { CityTheme } from '@opnay/city-ds-react';
import { Breadcrumbs } from '@opnay/city-ds-react/breadcrumbs';
import { Button } from '@opnay/city-ds-react/button';
import { Callout } from '@opnay/city-ds-react/callout';
import { Combobox } from '@opnay/city-ds-react/combobox';
import { Drawer } from '@opnay/city-ds-react/drawer';
import { SearchField } from '@opnay/city-ds-react/search-field';
import { Select } from '@opnay/city-ds-react/select';
import { Skeleton } from '@opnay/city-ds-react/skeleton';

import {
  CATEGORY_LABELS,
  COMPONENT_CATEGORIES,
  COMPONENT_DOCS,
  COMPONENT_INDEX_DOC,
  GUIDE_DOCS,
  START_DOCS,
  filterDocumentPages,
  getComponentDoc,
  getStaticDoc,
} from '../docs/doc-catalog';
import type { ComponentDocEntry, DocumentSearchResult, StaticDocEntry } from '../docs/types';
import { GuidePage } from './doc-page';

const THEME_STORAGE_KEY = 'city-docs-theme';
const THEMES: readonly CityTheme[] = ['system', 'light', 'dark'];
const THEME_ITEMS: Record<CityTheme, string> = {
  dark: '다크 테마',
  light: '라이트 테마',
  system: '시스템 테마',
};

const STATIC_SECTION_LABELS = {
  components: '컴포넌트',
  guides: '가이드',
  start: '시작',
};

function isCityTheme(value: string | null): value is CityTheme {
  return THEMES.some((theme) => theme === value);
}

function readStoredTheme(): CityTheme {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isCityTheme(value) ? value : 'system';
  } catch {
    return 'system';
  }
}

function resolvePage(pathname: string) {
  const componentMatch = /^\/components\/([^/]+)$/.exec(pathname);
  if (componentMatch?.[1]) {
    const component = getComponentDoc(componentMatch[1]);
    if (component) return { component, title: component.title };
  }

  return { component: undefined, title: getStaticDoc(pathname)?.title ?? '페이지 없음' };
}

interface DocsNavigationProps {
  onNavigate?: () => void;
  query: string;
  setQuery: (query: string) => void;
}

function StaticNavigationLink({
  entry,
  onNavigate,
  showContext = false,
}: {
  entry: StaticDocEntry;
  onNavigate: () => void;
  showContext?: boolean;
}) {
  return (
    <Link
      activeOptions={{ exact: true }}
      activeProps={{ 'aria-current': 'page' }}
      onClick={onNavigate}
      to={entry.path}
    >
      {showContext ? (
        <span className="city-docs-nav-result-copy">
          <span>{entry.label}</span>
          <small>{STATIC_SECTION_LABELS[entry.section]}</small>
        </span>
      ) : (
        entry.label
      )}
    </Link>
  );
}

function ComponentNavigationLink({
  entry,
  onNavigate,
  showContext = false,
}: {
  entry: ComponentDocEntry;
  onNavigate: () => void;
  showContext?: boolean;
}) {
  return (
    <Link
      activeProps={{ 'aria-current': 'page' }}
      onClick={onNavigate}
      params={{ slug: entry.slug }}
      to="/components/$slug"
    >
      {showContext ? (
        <span className="city-docs-nav-result-copy">
          <span>{entry.title}</span>
          <small>컴포넌트 · {CATEGORY_LABELS[entry.category]}</small>
        </span>
      ) : (
        entry.title
      )}
    </Link>
  );
}

function SearchResultLink({
  onNavigate,
  result,
}: {
  onNavigate: () => void;
  result: DocumentSearchResult;
}) {
  return result.kind === 'static' ? (
    <StaticNavigationLink entry={result.entry} onNavigate={onNavigate} showContext />
  ) : (
    <ComponentNavigationLink entry={result.entry} onNavigate={onNavigate} showContext />
  );
}

function DocsNavigation({ onNavigate, query, setQuery }: DocsNavigationProps) {
  const isSearching = query.trim().length > 0;
  const searchResults = useMemo(
    () => (isSearching ? filterDocumentPages(query) : []),
    [isSearching, query],
  );
  const handleNavigate = () => {
    setQuery('');
    onNavigate?.();
  };

  return (
    <nav aria-label="문서 탐색" className="city-docs-navigation">
      <SearchField.Root
        className="city-docs-nav-search"
        onValueChange={setQuery}
        size="sm"
        value={query}
      >
        <SearchField.Label className="city-docs-sr-only">문서 검색</SearchField.Label>
        <SearchField.Group>
          <SearchField.Input placeholder="문서 검색" />
          <SearchField.Clear aria-label="검색어 지우기" />
        </SearchField.Group>
      </SearchField.Root>

      <div className="city-docs-nav-scroll">
        {isSearching ? (
          <section className="city-docs-nav-section city-docs-nav-search-results">
            <div className="city-docs-nav-results-heading">
              <h2>검색 결과</h2>
              <span role="status">{searchResults.length}개</span>
            </div>
            {searchResults.length === 0 ? (
              <p className="city-docs-nav-empty">일치하는 문서가 없습니다.</p>
            ) : (
              <ul>
                {searchResults.map((result) => {
                  const key =
                    result.kind === 'static'
                      ? result.entry.path
                      : `/components/${result.entry.slug}`;

                  return (
                    <li key={key}>
                      <SearchResultLink onNavigate={handleNavigate} result={result} />
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        ) : (
          <>
            <section className="city-docs-nav-section">
              <h2>시작</h2>
              <ul>
                {START_DOCS.map((entry) => (
                  <li key={entry.path}>
                    <StaticNavigationLink entry={entry} onNavigate={handleNavigate} />
                  </li>
                ))}
              </ul>
            </section>

            <section className="city-docs-nav-section">
              <h2>가이드</h2>
              <ul>
                {GUIDE_DOCS.map((entry) => (
                  <li key={entry.path}>
                    <StaticNavigationLink entry={entry} onNavigate={handleNavigate} />
                  </li>
                ))}
              </ul>
            </section>

            <section className="city-docs-nav-section city-docs-nav-components">
              <h2>컴포넌트</h2>
              <ul>
                <li>
                  <StaticNavigationLink entry={COMPONENT_INDEX_DOC} onNavigate={handleNavigate} />
                </li>
              </ul>
              <div className="city-docs-nav-categories">
                {COMPONENT_CATEGORIES.map((category) => {
                  const entries = COMPONENT_DOCS.filter((entry) => entry.category === category);

                  return (
                    <section className="city-docs-nav-subsection" key={category}>
                      <h3>{CATEGORY_LABELS[category]}</h3>
                      <ul>
                        {entries.map((entry) => (
                          <li key={entry.slug}>
                            <ComponentNavigationLink entry={entry} onNavigate={handleNavigate} />
                          </li>
                        ))}
                      </ul>
                    </section>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>
    </nav>
  );
}

function ThemeSelect({
  onChange,
  value,
}: {
  onChange: (theme: CityTheme) => void;
  value: CityTheme;
}) {
  return (
    <Select.Root
      items={THEME_ITEMS}
      onValueChange={(nextValue) => onChange(isCityTheme(nextValue) ? nextValue : 'system')}
      size="sm"
      value={value}
    >
      <Select.Label className="city-docs-sr-only">화면 테마</Select.Label>
      <Select.Trigger className="city-docs-theme-trigger">
        <Select.Value />
        <Select.Icon />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner sideOffset={6}>
          <Select.Popup>
            <Select.List>
              {Object.entries(THEME_ITEMS).map(([theme, label]) => (
                <Select.Item key={theme} value={theme}>
                  <Select.ItemIndicator />
                  <Select.ItemText>{label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}

function Brand({
  onNavigate,
  subtitle = '소비자 문서',
}: {
  onNavigate?: () => void;
  subtitle?: string;
}) {
  return (
    <Link className="city-docs-brand" onClick={onNavigate} to="/">
      <span aria-hidden="true">
        <BookOpen size={18} strokeWidth={1.8} />
      </span>
      <span>
        <strong>city-ds</strong>
        <small>{subtitle}</small>
      </span>
    </Link>
  );
}

function getSearchResultLabel(result: DocumentSearchResult) {
  return result.kind === 'static' ? result.entry.label : result.entry.title;
}

function getSearchResultPath(result: DocumentSearchResult) {
  return result.kind === 'static' ? result.entry.path : `/components/${result.entry.slug}`;
}

function ProductSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const results = useMemo(
    () => (query.trim() ? filterDocumentPages(query).slice(0, 8) : []),
    [query],
  );
  const labels = results.map(getSearchResultLabel);

  return (
    <Combobox.Root
      inputValue={query}
      items={labels}
      onInputValueChange={setQuery}
      onValueChange={(label) => {
        const result = results.find((item) => getSearchResultLabel(item) === label);
        if (!result) return;
        setQuery('');
        void navigate({ to: getSearchResultPath(result) });
      }}
      size="sm"
      value={null}
    >
      <Combobox.InputGroup className="city-docs-product-search">
        <Search aria-hidden="true" className="city-docs-product-search-icon" size={15} />
        <Combobox.Input aria-label="전체 문서 검색" placeholder="전체 문서 검색" />
        <Combobox.Clear aria-label="검색어 지우기" />
      </Combobox.InputGroup>
      <Combobox.Portal>
        <Combobox.Positioner sideOffset={5}>
          <Combobox.Popup className="city-docs-product-search-popup">
            <Combobox.Empty>일치하는 문서가 없습니다.</Combobox.Empty>
            <Combobox.List>
              {labels.map((label) => {
                const result = results.find((item) => getSearchResultLabel(item) === label);
                if (!result) return null;
                return (
                  <Combobox.Item key={getSearchResultPath(result)} value={label}>
                    <Combobox.ItemIndicator />
                    <span className="city-docs-product-search-result">
                      <span>{label}</span>
                      <small>
                        {result.kind === 'static'
                          ? '문서'
                          : `컴포넌트 · ${CATEGORY_LABELS[result.entry.category]}`}
                      </small>
                    </span>
                  </Combobox.Item>
                );
              })}
            </Combobox.List>
            <Combobox.Status>{results.length}개 결과</Combobox.Status>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}

function ProductHeader({
  onThemeChange,
  theme,
}: {
  onThemeChange: (theme: CityTheme) => void;
  theme: CityTheme;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="city-docs-product-header">
      <div className="city-docs-product-header-inner">
        <Brand subtitle="React 디자인 시스템" />
        <nav aria-label="주요 문서" className="city-docs-product-navigation">
          <Link to="/getting-started">문서</Link>
          <Link to="/foundations">기초</Link>
          <Link to="/patterns">패턴</Link>
          <Link to="/components">컴포넌트</Link>
        </nav>
        <div className="city-docs-product-actions">
          <ProductSearch />
          <ThemeSelect onChange={onThemeChange} value={theme} />
          <Button
            nativeButton={false}
            render={<a href="https://github.com/opnay/city-ds" rel="noreferrer" target="_blank" />}
            role="link"
            size="sm"
            variant="ghost"
            aria-label="GitHub에서 city-ds 열기"
          >
            <Code2 aria-hidden="true" size={17} />
          </Button>
          <Drawer.Root onOpenChange={setMobileOpen} open={mobileOpen} swipeDirection="left">
            <Drawer.Trigger
              className="city-docs-product-menu-trigger"
              render={<Button aria-label="랜딩 메뉴 열기" size="sm" variant="outline" />}
            >
              <MenuIcon aria-hidden="true" size={16} />
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Backdrop />
              <Drawer.Viewport side="left">
                <Drawer.Popup side="left" size="sm">
                  <Drawer.Header>
                    <div>
                      <Drawer.Title>문서 메뉴</Drawer.Title>
                      <Drawer.Description>city-ds의 주요 문서로 이동합니다.</Drawer.Description>
                    </div>
                    <Drawer.Close
                      render={<Button aria-label="랜딩 메뉴 닫기" size="sm" variant="ghost" />}
                    >
                      <X aria-hidden="true" size={17} />
                    </Drawer.Close>
                  </Drawer.Header>
                  <Drawer.Body>
                    <nav
                      aria-label="모바일 주요 문서"
                      className="city-docs-product-mobile-navigation"
                    >
                      <Link onClick={() => setMobileOpen(false)} to="/getting-started">
                        문서
                      </Link>
                      <Link onClick={() => setMobileOpen(false)} to="/foundations">
                        기초
                      </Link>
                      <Link onClick={() => setMobileOpen(false)} to="/patterns">
                        패턴
                      </Link>
                      <Link onClick={() => setMobileOpen(false)} to="/components">
                        컴포넌트
                      </Link>
                    </nav>
                  </Drawer.Body>
                </Drawer.Popup>
              </Drawer.Viewport>
            </Drawer.Portal>
          </Drawer.Root>
        </div>
      </div>
    </header>
  );
}

function CurrentBreadcrumbs({ pathname }: { pathname: string }) {
  const page = resolvePage(pathname);
  const isHome = pathname === '/';
  const isComponent = page.component !== undefined;
  const isComponentIndex = pathname === '/components';

  return (
    <Breadcrumbs.Root aria-label="현재 위치">
      <Breadcrumbs.List>
        {isHome ? (
          <Breadcrumbs.Item>
            <Breadcrumbs.Page>소개</Breadcrumbs.Page>
          </Breadcrumbs.Item>
        ) : (
          <>
            <Breadcrumbs.Item>
              <Breadcrumbs.Link render={<Link to="/" />}>소개</Breadcrumbs.Link>
              <Breadcrumbs.Separator />
            </Breadcrumbs.Item>
            {isComponent ? (
              <>
                <Breadcrumbs.Item>
                  <Breadcrumbs.Link render={<Link to="/components" />}>컴포넌트</Breadcrumbs.Link>
                  <Breadcrumbs.Separator />
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>
                  <Breadcrumbs.Page>{page.title}</Breadcrumbs.Page>
                </Breadcrumbs.Item>
              </>
            ) : (
              <Breadcrumbs.Item>
                <Breadcrumbs.Page>{isComponentIndex ? '컴포넌트' : page.title}</Breadcrumbs.Page>
              </Breadcrumbs.Item>
            )}
          </>
        )}
      </Breadcrumbs.List>
    </Breadcrumbs.Root>
  );
}

export function DocsShell() {
  const location = useLocation();
  const pathname = location.pathname;
  const page = resolvePage(pathname);
  const mainRef = useRef<HTMLElement>(null);
  const previousPathRef = useRef(pathname);
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState<CityTheme>(readStoredTheme);

  useEffect(() => {
    document.title = pathname === '/' ? 'city-ds · React 디자인 시스템' : `${page.title} · city-ds`;
  }, [page.title, pathname]);

  useEffect(() => {
    if (theme === 'system') delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = theme;

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // The theme still applies for this session when storage is unavailable.
    }
  }, [theme]);

  useEffect(() => {
    if (previousPathRef.current === pathname) return;
    previousPathRef.current = pathname;
    setMobileNavigationOpen(false);
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  if (pathname === '/') {
    return (
      <div className="city-docs-product-shell">
        <a className="city-docs-skip-link" href="#main-content">
          본문으로 건너뛰기
        </a>
        <ProductHeader onThemeChange={setTheme} theme={theme} />
        <main className="city-docs-product-main" id="main-content" ref={mainRef} tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="city-docs-shell">
      <a className="city-docs-skip-link" href="#main-content">
        본문으로 건너뛰기
      </a>
      <aside className="city-docs-sidebar">
        <Brand />
        <DocsNavigation query={query} setQuery={setQuery} />
        <p className="city-docs-sidebar-note">React 18·19 · Vite · Next.js</p>
      </aside>
      <div className="city-docs-workspace">
        <header className="city-docs-topbar">
          <Drawer.Root
            onOpenChange={setMobileNavigationOpen}
            open={mobileNavigationOpen}
            swipeDirection="left"
          >
            <div className="city-docs-mobile-brand">
              <Drawer.Trigger
                render={<Button aria-label="문서 메뉴 열기" size="sm" variant="outline" />}
              >
                <MenuIcon aria-hidden="true" size={16} />
                메뉴
              </Drawer.Trigger>
              <Brand />
            </div>
            <Drawer.Portal>
              <Drawer.Backdrop />
              <Drawer.Viewport side="left">
                <Drawer.Popup side="left" size="sm">
                  <Drawer.Header>
                    <div>
                      <Drawer.Title>문서 메뉴</Drawer.Title>
                      <Drawer.Description>
                        시작 안내, 가이드와 컴포넌트 문서로 이동합니다.
                      </Drawer.Description>
                    </div>
                    <Drawer.Close
                      render={<Button aria-label="문서 메뉴 닫기" size="sm" variant="ghost" />}
                    >
                      <X aria-hidden="true" size={17} />
                    </Drawer.Close>
                  </Drawer.Header>
                  <Drawer.Body className="city-docs-mobile-nav-body">
                    <DocsNavigation
                      onNavigate={() => setMobileNavigationOpen(false)}
                      query={query}
                      setQuery={setQuery}
                    />
                  </Drawer.Body>
                </Drawer.Popup>
              </Drawer.Viewport>
            </Drawer.Portal>
          </Drawer.Root>
          <div className="city-docs-current-page">
            <span>현재 문서</span>
            <strong>{page.title}</strong>
          </div>
          <ThemeSelect onChange={setTheme} value={theme} />
        </header>
        <main className="city-docs-main" id="main-content" ref={mainRef} tabIndex={-1}>
          <CurrentBreadcrumbs pathname={pathname} />
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function DocsPending() {
  return (
    <div aria-label="문서 불러오는 중" className="city-docs-pending" role="status">
      <Skeleton size="sm" variant="text" />
      <Skeleton size="lg" variant="text" />
      <Skeleton size="md" variant="rectangular" />
    </div>
  );
}

export function DocsNotFound() {
  return (
    <GuidePage
      description="주소가 바뀌었거나 존재하지 않는 문서입니다. 컴포넌트 목록에서 다시 찾으십시오."
      eyebrow="404"
      title="문서를 찾을 수 없습니다."
    >
      <Button nativeButton={false} render={<Link to="/components" />} role="link" variant="primary">
        컴포넌트 목록으로
      </Button>
    </GuidePage>
  );
}

export function DocsError({ error, reset }: ErrorComponentProps) {
  return (
    <GuidePage
      description="문서 모듈을 불러오지 못했습니다. 다시 시도하거나 컴포넌트 목록으로 이동하십시오."
      eyebrow="Error"
      title="문서를 표시할 수 없습니다."
    >
      <Callout.Root tone="destructive">
        <Callout.Title>불러오기 오류</Callout.Title>
        <Callout.Description>{error.message}</Callout.Description>
        <Callout.Action>
          <Button onClick={reset} type="button" variant="outline">
            다시 시도
          </Button>
        </Callout.Action>
      </Callout.Root>
    </GuidePage>
  );
}
