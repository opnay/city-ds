import { useCallback, useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import {
  Activity,
  Building2,
  CalendarRange,
  ChartNoAxesColumnIncreasing,
  ClipboardList,
  History,
  Landmark,
  LayoutDashboard,
  Menu as MenuIcon,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import { Breadcrumbs, Button, Drawer, Select, type CityTheme } from '@opnay/city-ds-react';

export interface DashboardRoute {
  description: string;
  group: '운영' | '시설·인력' | '분석';
  icon: LucideIcon;
  label: string;
  path: string;
}

export const DASHBOARD_ROUTES: readonly DashboardRoute[] = [
  {
    description: '먼저 조치할 작업과 오늘 일정을 확인해 주세요.',
    group: '운영',
    icon: LayoutDashboard,
    label: '운영 현황',
    path: '/',
  },
  {
    description: '담당팀을 배정하고 진행 상태를 확인해 주세요.',
    group: '운영',
    icon: ClipboardList,
    label: '현장 작업',
    path: '/work-orders',
  },
  {
    description: '점검 일정과 준비 상태를 확인해 주세요.',
    group: '운영',
    icon: CalendarRange,
    label: '정비 계획',
    path: '/maintenance',
  },
  {
    description: '시설 상태와 최근 점검 기록을 확인해 주세요.',
    group: '시설·인력',
    icon: Building2,
    label: '시설 자산',
    path: '/assets',
  },
  {
    description: '팀별 작업과 배정 가능한 인력을 확인해 주세요.',
    group: '시설·인력',
    icon: Users,
    label: '현장팀',
    path: '/crews',
  },
  {
    description: '자치구별 작업 처리 결과를 확인해 주세요.',
    group: '분석',
    icon: ChartNoAxesColumnIncreasing,
    label: '운영 리포트',
    path: '/reports',
  },
  {
    description: '담당자별 조치 내역을 확인해 주세요.',
    group: '분석',
    icon: History,
    label: '활동 기록',
    path: '/activity',
  },
  {
    description: '채널별 연결 상태와 응답 시간을 확인해 주세요.',
    group: '분석',
    icon: Activity,
    label: '서비스 상태',
    path: '/service-status',
  },
];

const ROUTE_GROUPS: readonly DashboardRoute['group'][] = ['운영', '시설·인력', '분석'];

const THEME_ITEMS: Record<CityTheme, string> = {
  system: '시스템 테마',
  light: '라이트 테마',
  dark: '다크 테마',
};

export function normalizePathname(pathname: string): string {
  const withLeadingSlash = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const normalized = withLeadingSlash.replace(/\/+$/, '');
  return normalized.length === 0 ? '/' : normalized;
}

export function getDashboardRoute(pathname: string): DashboardRoute | undefined {
  const normalizedPath = normalizePathname(pathname);
  return DASHBOARD_ROUTES.find((route) => route.path === normalizedPath);
}

export function useDashboardPath() {
  const [pathname, setPathname] = useState(() => normalizePathname(window.location.pathname));

  useEffect(() => {
    const handlePopState = () => setPathname(normalizePathname(window.location.pathname));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((nextPath: string) => {
    const normalizedPath = normalizePathname(nextPath);
    if (normalizePathname(window.location.pathname) !== normalizedPath) {
      window.history.pushState(null, '', normalizedPath);
    }
    setPathname(normalizedPath);
  }, []);

  return { navigate, pathname };
}

interface AppShellProps {
  children: ReactNode;
  navigate: (path: string) => void;
  pathname: string;
  theme: CityTheme;
  onThemeChange: (theme: CityTheme) => void;
}

interface NavigationProps {
  label: string;
  navigate: (path: string) => void;
  onNavigate?: () => void;
  pathname: string;
}

function Navigation({ label, navigate, onNavigate, pathname }: NavigationProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>, path: string) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    navigate(path);
    onNavigate?.();
  };

  return (
    <nav aria-label={label} className="city-shell-navigation">
      {ROUTE_GROUPS.map((group) => (
        <section className="city-shell-nav-group" key={group}>
          <h2>{group}</h2>
          <ul>
            {DASHBOARD_ROUTES.filter((route) => route.group === group).map((route) => {
              const Icon = route.icon;
              const active = pathname === route.path;

              return (
                <li key={route.path}>
                  <a
                    aria-current={active ? 'page' : undefined}
                    href={route.path}
                    onClick={(event) => handleClick(event, route.path)}
                  >
                    <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
                    <span>{route.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </nav>
  );
}

function ThemeSelect({ onThemeChange, theme }: Pick<AppShellProps, 'onThemeChange' | 'theme'>) {
  return (
    <Select.Root
      items={THEME_ITEMS}
      onValueChange={(value) => onThemeChange((value as CityTheme | null) ?? 'system')}
      size="sm"
      value={theme}
    >
      <Select.Label className="city-sr-only">화면 테마</Select.Label>
      <Select.Trigger className="city-shell-theme-trigger">
        <Select.Value />
        <Select.Icon />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner sideOffset={6}>
          <Select.Popup>
            <Select.List>
              {Object.entries(THEME_ITEMS).map(([value, label]) => (
                <Select.Item key={value} value={value}>
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

function Brand() {
  return (
    <div className="city-shell-brand" aria-label="서울 도시운영 통합 관제">
      <span className="city-shell-brand-mark" aria-hidden="true">
        <Landmark size={19} strokeWidth={1.8} />
      </span>
      <span>
        <strong>서울 도시운영</strong>
        <small>통합 관제</small>
      </span>
    </div>
  );
}

export function AppShell({ children, navigate, onThemeChange, pathname, theme }: AppShellProps) {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const previousPathRef = useRef(pathname);
  const currentRoute = getDashboardRoute(pathname);

  useEffect(() => {
    if (previousPathRef.current === pathname) return;
    previousPathRef.current = pathname;
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <div className="city-shell">
      <a className="city-shell-skip-link" href="#main-content">
        본문으로 건너뛰기
      </a>

      <aside className="city-shell-sidebar">
        <Brand />
        <Navigation label="주요 메뉴" navigate={navigate} pathname={pathname} />
        <p className="city-shell-system-note">
          <span aria-hidden="true" />
          모든 운영 채널 정상
        </p>
      </aside>

      <div className="city-shell-workspace">
        <header className="city-shell-topbar">
          <Drawer.Root
            onOpenChange={setMobileNavigationOpen}
            open={mobileNavigationOpen}
            swipeDirection="right"
          >
            <div className="city-shell-mobile-brand">
              <Drawer.Trigger
                render={<Button aria-label="메뉴 열기" size="sm" variant="outline" />}
              >
                <MenuIcon aria-hidden="true" size={16} strokeWidth={1.8} />
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
                      <Drawer.Title>전체 메뉴</Drawer.Title>
                      <Drawer.Description>이동할 메뉴를 선택해 주세요.</Drawer.Description>
                    </div>
                    <Drawer.Close
                      render={<Button aria-label="메뉴 닫기" size="sm" variant="ghost" />}
                    >
                      <X aria-hidden="true" size={17} strokeWidth={1.8} />
                    </Drawer.Close>
                  </Drawer.Header>
                  <Drawer.Content className="city-shell-mobile-nav-body">
                    <Navigation
                      label="모바일 주요 메뉴"
                      navigate={navigate}
                      onNavigate={() => setMobileNavigationOpen(false)}
                      pathname={pathname}
                    />
                  </Drawer.Content>
                </Drawer.Popup>
              </Drawer.Viewport>
            </Drawer.Portal>
          </Drawer.Root>

          <div className="city-shell-route-context">
            <span>현재 화면</span>
            <strong>{currentRoute?.label ?? '페이지 없음'}</strong>
          </div>

          <div className="city-shell-topbar-actions">
            <span>2026.08.01</span>
            <ThemeSelect onThemeChange={onThemeChange} theme={theme} />
          </div>
        </header>

        <main className="city-shell-main" id="main-content" ref={mainRef} tabIndex={-1}>
          <Breadcrumbs.Root aria-label="현재 위치">
            <Breadcrumbs.List>
              {pathname === '/' ? (
                <Breadcrumbs.Item>
                  <Breadcrumbs.Page>운영 현황</Breadcrumbs.Page>
                </Breadcrumbs.Item>
              ) : (
                <>
                  <Breadcrumbs.Item>
                    <Breadcrumbs.Link
                      href="/"
                      onClick={(event) => {
                        if (
                          event.button !== 0 ||
                          event.metaKey ||
                          event.ctrlKey ||
                          event.shiftKey ||
                          event.altKey
                        ) {
                          return;
                        }
                        event.preventDefault();
                        navigate('/');
                      }}
                    >
                      운영 현황
                    </Breadcrumbs.Link>
                    <Breadcrumbs.Separator />
                  </Breadcrumbs.Item>
                  <Breadcrumbs.Item>
                    <Breadcrumbs.Page>{currentRoute?.label ?? '페이지 없음'}</Breadcrumbs.Page>
                  </Breadcrumbs.Item>
                </>
              )}
            </Breadcrumbs.List>
          </Breadcrumbs.Root>
          {children}
        </main>
      </div>
    </div>
  );
}
