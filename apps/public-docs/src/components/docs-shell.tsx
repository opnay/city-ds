import { useEffect, useMemo, useRef, useState } from 'react';
import { Collapsible } from '@base-ui/react/collapsible';
import {
  ArrowRight,
  BookOpen,
  CreditCard,
  LayoutGrid,
  Menu as MenuIcon,
  Moon,
  ShieldCheck,
  Sun,
  UsersRound,
  X,
} from 'lucide-react';
import { Link, Outlet, useLocation, type ErrorComponentProps } from '@tanstack/react-router';
import type { CityTheme } from '@opnay/city-ds-react';
import { Alert } from '@opnay/city-ds-react/alert';
import { Breadcrumbs } from '@opnay/city-ds-react/breadcrumbs';
import { Button } from '@opnay/city-ds-react/button';
import { Drawer } from '@opnay/city-ds-react/drawer';
import { Field } from '@opnay/city-ds-react/field';
import { SearchInput } from '@opnay/city-ds-react/search-input';
import { Select } from '@opnay/city-ds-react/select';
import { Skeleton } from '@opnay/city-ds-react/skeleton';
import { SegmentedControl } from '@opnay/city-ds-react/segmented-control';

import {
  BLOCK_INDEX_DOC,
  CATEGORY_LABELS,
  COMPONENT_CATEGORIES,
  COMPONENT_DOCS,
  COMPONENT_INDEX_DOC,
  GUIDE_DOCS,
  filterDocumentPages,
  getComponentDoc,
  getStaticDoc,
} from '../docs/doc-catalog';
import {
  USER_MANAGEMENT_MENU,
  SUBSCRIPTION_MENU,
  SECURITY_MENU,
  getBlockDoc,
} from '../blocks/block-catalog';
import type {
  BlockDocEntry,
  ComponentDocEntry,
  DocumentSearchResult,
  StaticDocEntry,
} from '../docs/types';
import { GuidePage } from './doc-page';

const THEME_STORAGE_KEY = 'city-docs-theme';
const THEMES: readonly CityTheme[] = ['system', 'light', 'dark'];
type ResolvedTheme = Exclude<CityTheme, 'system'>;
type NavigationMode = 'guides' | 'components' | 'blocks';

const NAVIGATION_MODE_ITEMS: Record<NavigationMode, string> = {
  guides: 'Guides',
  components: 'Components',
  blocks: 'Blocks',
};

const STATIC_SECTION_LABELS = {
  blocks: '블록',
  components: '컴포넌트',
  guides: '가이드',
  start: '홈',
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

function readSystemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function useSystemTheme(): ResolvedTheme {
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(readSystemTheme);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const updateSystemTheme = () => setSystemTheme(media.matches ? 'dark' : 'light');

    updateSystemTheme();
    media.addEventListener('change', updateSystemTheme);
    return () => media.removeEventListener('change', updateSystemTheme);
  }, []);

  return systemTheme;
}

function resolvePage(pathname: string) {
  const blockMatch = /^\/blocks\/([^/]+)$/.exec(pathname);
  const block = blockMatch?.[1] ? getBlockDoc(blockMatch[1]) : undefined;
  if (block) return { component: undefined, block, title: block.title };
  const componentMatch = /^\/components\/([^/]+)$/.exec(pathname);
  if (componentMatch?.[1]) {
    const component = getComponentDoc(componentMatch[1]);
    if (component) return { component, block: undefined, title: component.title };
  }

  return {
    component: undefined,
    block: undefined,
    title: getStaticDoc(pathname)?.title ?? '페이지 없음',
  };
}

function resolveNavigationMode(pathname: string): NavigationMode {
  if (pathname === '/blocks' || pathname.startsWith('/blocks/')) return 'blocks';
  return pathname === '/components' || pathname.startsWith('/components/')
    ? 'components'
    : 'guides';
}

interface DocsNavigationProps {
  mode: NavigationMode;
  onModeChange: (mode: NavigationMode) => void;
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
      ) : entry.path === '/blocks' ? (
        <span className="city-docs-nav-icon-label">
          <LayoutGrid aria-hidden="true" size={16} strokeWidth={1.8} />
          {entry.label}
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

function BlockNavigationLink({
  entry,
  onNavigate,
  showContext = false,
}: {
  entry: BlockDocEntry;
  onNavigate: () => void;
  showContext?: boolean;
}) {
  return (
    <Link
      to="/blocks/$slug"
      params={{ slug: entry.slug }}
      onClick={onNavigate}
      activeProps={{ 'aria-current': 'page' }}
    >
      {showContext ? (
        <span className="city-docs-nav-result-copy">
          <span>{entry.title}</span>
          <small>블록 · {entry.category}</small>
        </span>
      ) : (
        entry.title
      )}
    </Link>
  );
}

function BlockNavigationGroup({
  onNavigate,
  title,
  items,
  icon: Icon,
}: {
  onNavigate: () => void;
  title: string;
  items: readonly { title: string; slug: string }[];
  icon: typeof UsersRound;
}) {
  const pathname = useLocation().pathname;
  return (
    <Collapsible.Root
      key={pathname}
      render={<li />}
      defaultOpen={items.some((item) => pathname === `/blocks/${item.slug}`)}
    >
      <Collapsible.Trigger className="city-docs-block-group-trigger">
        <span className="city-docs-nav-icon-label">
          <Icon aria-hidden="true" size={16} strokeWidth={1.8} />
          {title}
        </span>
        <span className="city-docs-block-group-chevron" aria-hidden="true">
          ⌄
        </span>
      </Collapsible.Trigger>
      <Collapsible.Panel>
        <ul className="city-docs-block-submenu">
          {items.map((item) => (
            <li key={item.title}>
              <BlockNavigationLink entry={getBlockDoc(item.slug)!} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}

function SearchResultLink({
  onNavigate,
  result,
}: {
  onNavigate: () => void;
  result: DocumentSearchResult;
}) {
  if (result.kind === 'block')
    return <BlockNavigationLink entry={result.entry} onNavigate={onNavigate} showContext />;
  return result.kind === 'static' ? (
    <StaticNavigationLink entry={result.entry} onNavigate={onNavigate} showContext />
  ) : (
    <ComponentNavigationLink entry={result.entry} onNavigate={onNavigate} showContext />
  );
}

function NavigationModeSelect({
  onChange,
  value,
}: {
  onChange: (mode: NavigationMode) => void;
  value: NavigationMode;
}) {
  return (
    <Select.Root
      items={NAVIGATION_MODE_ITEMS}
      onValueChange={(nextValue) => {
        if (nextValue === 'guides' || nextValue === 'components' || nextValue === 'blocks')
          onChange(nextValue);
      }}
      size="sm"
      value={value}
    >
      <Select.Label className="city-docs-sr-only">문서 영역</Select.Label>
      <Select.Trigger className="city-docs-nav-mode-trigger">
        <Select.Value />
        <Select.Icon />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner sideOffset={6}>
          <Select.Popup>
            <Select.List>
              {Object.entries(NAVIGATION_MODE_ITEMS).map(([mode, label]) => (
                <Select.Item key={mode} value={mode}>
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

function DocsNavigation({ mode, onModeChange, onNavigate, query, setQuery }: DocsNavigationProps) {
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
      <div className="city-docs-nav-controls">
        <Field.Root className="city-docs-nav-search">
          <Field.Label className="city-docs-sr-only">문서 검색</Field.Label>
          <SearchInput.Root onValueChange={setQuery} size="sm" value={query}>
            <SearchInput.Group>
              <SearchInput.Input placeholder="문서 검색" />
              <SearchInput.Clear aria-label="검색어 지우기" />
            </SearchInput.Group>
          </SearchInput.Root>
        </Field.Root>
        <NavigationModeSelect onChange={onModeChange} value={mode} />
      </div>

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
                      : `/${result.kind === 'block' ? 'blocks' : 'components'}/${result.entry.slug}`;

                  return (
                    <li key={key}>
                      <SearchResultLink onNavigate={handleNavigate} result={result} />
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        ) : mode === 'guides' ? (
          <section className="city-docs-nav-section">
            <ul>
              {GUIDE_DOCS.map((entry) => (
                <li key={entry.path}>
                  <StaticNavigationLink entry={entry} onNavigate={handleNavigate} />
                </li>
              ))}
            </ul>
          </section>
        ) : mode === 'blocks' ? (
          <section className="city-docs-nav-section">
            <ul>
              <li>
                <StaticNavigationLink entry={BLOCK_INDEX_DOC} onNavigate={handleNavigate} />
              </li>
              <BlockNavigationGroup
                onNavigate={handleNavigate}
                title="사용자 관리"
                items={USER_MANAGEMENT_MENU}
                icon={UsersRound}
              />
              <BlockNavigationGroup
                onNavigate={handleNavigate}
                title="구독·결제"
                items={SUBSCRIPTION_MENU}
                icon={CreditCard}
              />
              <BlockNavigationGroup
                onNavigate={handleNavigate}
                title="보안"
                items={SECURITY_MENU}
                icon={ShieldCheck}
              />
            </ul>
          </section>
        ) : (
          <section className="city-docs-nav-section city-docs-nav-components">
            <div className="city-docs-nav-section-primary">
              <ul>
                <li>
                  <StaticNavigationLink entry={COMPONENT_INDEX_DOC} onNavigate={handleNavigate} />
                </li>
              </ul>
            </div>
            <div className="city-docs-nav-categories">
              {COMPONENT_CATEGORIES.map((category) => {
                const entries = COMPONENT_DOCS.filter((entry) => entry.category === category).sort(
                  (a, b) => a.title.localeCompare(b.title, 'en'),
                );

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
        )}
      </div>
    </nav>
  );
}

function ThemeButtons({
  onChange,
  value,
}: {
  onChange: (theme: ResolvedTheme) => void;
  value: ResolvedTheme;
}) {
  return (
    <SegmentedControl
      aria-label="화면 테마"
      className="city-docs-theme-controls"
      onValueChange={onChange}
      size="sm"
      value={value}
    >
      <SegmentedControl.Item
        aria-label="다크 테마"
        className="w-(--city-control-sm) px-0"
        title="다크 테마"
        value="dark"
      >
        <Moon aria-hidden="true" size={16} />
      </SegmentedControl.Item>
      <SegmentedControl.Item
        aria-label="라이트 테마"
        className="w-(--city-control-sm) px-0"
        title="라이트 테마"
        value="light"
      >
        <Sun aria-hidden="true" size={16} />
      </SegmentedControl.Item>
    </SegmentedControl>
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

function DocsHomeLink({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Button
      aria-label="city-ds 홈"
      className="city-docs-brand city-docs-home-link"
      nativeButton={false}
      render={<Link onClick={onNavigate} to="/" />}
      role="link"
      size="md"
      title="홈으로"
      variant="ghost"
    >
      <span aria-hidden="true">
        <BookOpen size={18} strokeWidth={1.8} />
      </span>
      <span>
        <strong>city-ds</strong>
        <small>소비자 문서</small>
      </span>
    </Button>
  );
}

function ProductHeader({
  onThemeChange,
  resolvedTheme,
}: {
  onThemeChange: (theme: CityTheme) => void;
  resolvedTheme: ResolvedTheme;
}) {
  return (
    <header className="city-docs-product-header">
      <div className="city-docs-product-header-inner">
        <Brand subtitle="React 디자인 시스템" />
        <nav aria-label="제품 소개 탐색" className="city-docs-product-navigation">
          <a href="#product-foundation">제품 기반</a>
          <a href="#product-contexts">사용 맥락</a>
          <Link to="/components">컴포넌트</Link>
          <Link to="/blocks">블록</Link>
        </nav>
        <div className="city-docs-product-actions">
          <ThemeButtons onChange={onThemeChange} value={resolvedTheme} />
          <Button
            nativeButton={false}
            render={<Link to="/getting-started" />}
            role="link"
            size="sm"
            variant="primary"
          >
            문서 열기
            <ArrowRight aria-hidden="true" size={16} />
          </Button>
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
            <Breadcrumbs.Page>홈</Breadcrumbs.Page>
          </Breadcrumbs.Item>
        ) : (
          <>
            <Breadcrumbs.Item>
              <Breadcrumbs.Link render={<Link to="/" />}>홈</Breadcrumbs.Link>
              <Breadcrumbs.Separator />
            </Breadcrumbs.Item>
            {isComponent || page.block ? (
              <>
                <Breadcrumbs.Item>
                  <Breadcrumbs.Link render={<Link to={page.block ? '/blocks' : '/components'} />}>
                    {page.block ? '블록' : '컴포넌트'}
                  </Breadcrumbs.Link>
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
  const [navigationMode, setNavigationMode] = useState<NavigationMode>(() =>
    resolveNavigationMode(pathname),
  );
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState<CityTheme>(readStoredTheme);
  const systemTheme = useSystemTheme();
  const resolvedTheme = theme === 'system' ? systemTheme : theme;

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
    setNavigationMode(resolveNavigationMode(pathname));
    setMobileNavigationOpen(false);
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  if (pathname === '/') {
    return (
      <div className="city-docs-product-shell">
        <a className="city-docs-skip-link" href="#main-content">
          본문으로 건너뛰기
        </a>
        <ProductHeader onThemeChange={setTheme} resolvedTheme={resolvedTheme} />
        <main className="city-docs-product-main" id="main-content" ref={mainRef} tabIndex={-1}>
          <Outlet />
        </main>
        <footer className="city-docs-product-footer">
          <strong>city-ds</strong>
          <span>Base UI 기반 · React 18·19 · Vite · Next.js</span>
        </footer>
      </div>
    );
  }

  return (
    <div className="city-docs-shell">
      <a className="city-docs-skip-link" href="#main-content">
        본문으로 건너뛰기
      </a>
      <aside className="city-docs-sidebar">
        <DocsHomeLink />
        <DocsNavigation
          mode={navigationMode}
          onModeChange={setNavigationMode}
          query={query}
          setQuery={setQuery}
        />
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
              <DocsHomeLink onNavigate={() => setMobileNavigationOpen(false)} />
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
                  <Drawer.Content className="city-docs-mobile-nav-body">
                    <DocsNavigation
                      mode={navigationMode}
                      onModeChange={setNavigationMode}
                      onNavigate={() => setMobileNavigationOpen(false)}
                      query={query}
                      setQuery={setQuery}
                    />
                  </Drawer.Content>
                </Drawer.Popup>
              </Drawer.Viewport>
            </Drawer.Portal>
          </Drawer.Root>
          <div className="city-docs-current-page">
            <span>현재 문서</span>
            <strong>{page.title}</strong>
          </div>
          <div className="city-docs-topbar-actions">
            <ThemeButtons onChange={setTheme} value={resolvedTheme} />
          </div>
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
      <Alert.Root tone="destructive">
        <Alert.Title>불러오기 오류</Alert.Title>
        <Alert.Description>{error.message}</Alert.Description>
        <Alert.Action>
          <Button onClick={reset} type="button" variant="outline">
            다시 시도
          </Button>
        </Alert.Action>
      </Alert.Root>
    </GuidePage>
  );
}
