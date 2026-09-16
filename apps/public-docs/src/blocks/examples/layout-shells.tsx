import { useState, type MouseEvent, type ReactNode } from 'react';
import {
  Bell,
  FileText,
  FolderKanban,
  Grid2X2,
  LayoutDashboard,
  ListTodo,
  Menu as MenuIcon,
  Settings,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import { Avatar, Badge, Breadcrumbs, Button, Drawer, SearchInput } from '@opnay/city-ds-react';
import './blocks.css';

type NavigationItem = {
  description?: string;
  icon: LucideIcon;
  id: string;
  label: string;
};

const globalNavigation: readonly NavigationItem[] = [
  { id: 'overview', label: '개요', icon: LayoutDashboard },
  { id: 'projects', label: '프로젝트', icon: FolderKanban },
  { id: 'team', label: '팀', icon: Users },
  { id: 'settings', label: '설정', icon: Settings },
];

const projectNavigation: readonly NavigationItem[] = [
  { id: 'overview', label: '프로젝트 개요', icon: LayoutDashboard },
  { id: 'tasks', label: '작업', icon: ListTodo },
  { id: 'files', label: '파일', icon: FileText },
  { id: 'members', label: '멤버', icon: Users },
];

const railNavigation: readonly NavigationItem[] = [
  { id: 'projects', label: '프로젝트', icon: FolderKanban },
  { id: 'team', label: '팀', icon: Users },
  { id: 'settings', label: '설정', icon: Settings },
];

const secondaryNavigation: Record<string, readonly NavigationItem[]> = {
  projects: projectNavigation,
  team: [
    { id: 'members', label: '멤버', icon: Users },
    { id: 'roles', label: '역할과 권한', icon: Settings },
  ],
  settings: [
    { id: 'general', label: '일반 설정', icon: Settings },
    { id: 'notifications', label: '알림', icon: Bell },
  ],
};

const documents = [
  {
    id: 'brief',
    title: '9월 운영 정리',
    meta: '오늘 · 서유진',
    excerpt: '이번 주 우선순위와 담당자 배정을 정리했습니다.',
  },
  {
    id: 'release',
    title: '릴리스 준비 사항',
    meta: '어제 · 김서연',
    excerpt: '검증 항목과 배포 전 확인이 필요한 내용을 모았습니다.',
  },
  {
    id: 'research',
    title: '사용자 조사 노트',
    meta: '9월 12일 · 박민수',
    excerpt: '최근 인터뷰에서 반복된 요구와 다음 실험 가설입니다.',
  },
] as const;

function preventSampleNavigation(event: MouseEvent<HTMLAnchorElement>, onSelect: () => void) {
  event.preventDefault();
  onSelect();
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className="city-block-layout-brand">
      <span className="city-block-layout-brand-mark" aria-hidden="true">
        <Grid2X2 size={16} strokeWidth={2} />
      </span>
      {!compact && (
        <span>
          <strong>city studio</strong>
          <small>프로젝트 운영</small>
        </span>
      )}
    </span>
  );
}

function UserActions() {
  return (
    <div className="city-block-layout-user-actions">
      <Button aria-label="알림" iconOnly size="sm" type="button" variant="ghost">
        <Bell aria-hidden="true" size={16} />
      </Button>
      <Avatar.Root aria-label="서유진" size="sm">
        <Avatar.Fallback>서</Avatar.Fallback>
      </Avatar.Root>
    </div>
  );
}

function NavigationLinks({
  current,
  items,
  label,
  onSelect,
  variant = 'default',
}: {
  current: string;
  items: readonly NavigationItem[];
  label: string;
  onSelect: (id: string) => void;
  variant?: 'default' | 'rail';
}) {
  return (
    <nav
      aria-label={label}
      className={`city-block-layout-navigation city-block-layout-navigation--${variant}`}
    >
      <ul>
        {items.map(({ icon: Icon, id, label: itemLabel }) => (
          <li key={id}>
            <a
              aria-current={current === id ? 'page' : undefined}
              href={`#${id}`}
              onClick={(event) => preventSampleNavigation(event, () => onSelect(id))}
              title={variant === 'rail' ? itemLabel : undefined}
            >
              <Icon aria-hidden="true" size={variant === 'rail' ? 18 : 16} strokeWidth={1.8} />
              <span>{itemLabel}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Breadcrumb({ current }: { current: string }) {
  return (
    <Breadcrumbs.Root aria-label="현재 위치" className="city-block-layout-breadcrumbs">
      <Breadcrumbs.List>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link href="#workspace">워크스페이스</Breadcrumbs.Link>
          <Breadcrumbs.Separator />
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Breadcrumbs.Page>{current}</Breadcrumbs.Page>
        </Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs.Root>
  );
}

function PageHeading({
  actions,
  description,
  eyebrow,
  title,
}: {
  actions?: ReactNode;
  description: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <header className="city-block-layout-page-heading">
      <div>
        <p>{eyebrow}</p>
        <h3>{title}</h3>
        <span>{description}</span>
      </div>
      {actions && <div className="city-block-layout-page-actions">{actions}</div>}
    </header>
  );
}

function OverviewContent({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`city-block-layout-content ${compact ? 'city-block-layout-content--compact' : ''}`}
    >
      <div className="city-block-layout-stat-grid">
        <section>
          <span>진행 중</span>
          <strong>12</strong>
          <small>이번 주 작업</small>
        </section>
        <section>
          <span>검토 요청</span>
          <strong>4</strong>
          <small>확인이 필요함</small>
        </section>
        <section>
          <span>완료율</span>
          <strong>78%</strong>
          <small>지난주보다 6% 증가</small>
        </section>
      </div>
      <section className="city-block-layout-activity" aria-labelledby="layout-activity-title">
        <div className="city-block-layout-section-heading">
          <div>
            <h4 id="layout-activity-title">최근 활동</h4>
            <p>팀에서 처리한 업데이트입니다.</p>
          </div>
          <Button size="sm" type="button" variant="outline">
            전체 보기
          </Button>
        </div>
        <ul>
          <li>
            <span className="city-block-layout-activity-mark" aria-hidden="true" />
            <div>
              <strong>디자인 검토를 요청했습니다</strong>
              <span>2시간 전 · 서유진</span>
            </div>
            <Badge appearance="subtle" tone="info">
              검토 중
            </Badge>
          </li>
          <li>
            <span className="city-block-layout-activity-mark" aria-hidden="true" />
            <div>
              <strong>운영 리포트를 공유했습니다</strong>
              <span>어제 · 김서연</span>
            </div>
            <Badge appearance="subtle" tone="success">
              완료
            </Badge>
          </li>
        </ul>
      </section>
    </div>
  );
}

function GnbHeader({ current, onSelect }: { current: string; onSelect: (id: string) => void }) {
  return (
    <header className="city-block-layout-gnb">
      <Brand />
      <NavigationLinks
        current={current}
        items={globalNavigation}
        label="주요 메뉴"
        onSelect={onSelect}
      />
      <UserActions />
    </header>
  );
}

export function TopNavigation() {
  const [current, setCurrent] = useState('overview');
  const currentLabel = globalNavigation.find((item) => item.id === current)?.label ?? '개요';

  return (
    <section
      className="city-block-layout city-block-layout--top-navigation"
      aria-label="상단 GNB 기본 레이아웃"
    >
      <GnbHeader current={current} onSelect={setCurrent} />
      <div className="city-block-layout-workspace">
        <Breadcrumb current={currentLabel} />
        <PageHeading
          eyebrow="프로젝트 운영"
          title={currentLabel}
          description="주요 메뉴가 적고 본문 폭을 넓게 쓰는 서비스 화면입니다."
          actions={
            <Button size="sm" type="button">
              새 프로젝트
            </Button>
          }
        />
        <OverviewContent />
      </div>
    </section>
  );
}

export function TopNavigationWithLocalMenu() {
  const [current, setCurrent] = useState('overview');
  const currentLabel =
    projectNavigation.find((item) => item.id === current)?.label ?? '프로젝트 개요';

  return (
    <section
      className="city-block-layout city-block-layout--top-navigation"
      aria-label="상단 GNB와 로컬 메뉴 레이아웃"
    >
      <header className="city-block-layout-gnb city-block-layout-gnb--local">
        <Brand />
        <span className="city-block-layout-product-name">프로젝트</span>
        <UserActions />
      </header>
      <div className="city-block-layout-local-menu">
        <NavigationLinks
          current={current}
          items={projectNavigation}
          label="프로젝트 메뉴"
          onSelect={setCurrent}
        />
        <Button size="sm" type="button" variant="outline">
          공유
        </Button>
      </div>
      <div className="city-block-layout-workspace">
        <Breadcrumb current={currentLabel} />
        <PageHeading
          eyebrow="도시환경 개선"
          title={currentLabel}
          description="전역 서비스 안에서 한 프로젝트의 하위 탐색이 이어지는 구성입니다."
          actions={
            <Button size="sm" type="button">
              작업 추가
            </Button>
          }
        />
        <OverviewContent />
      </div>
    </section>
  );
}

export function SidebarNavigation() {
  const [current, setCurrent] = useState('overview');
  const currentLabel = globalNavigation.find((item) => item.id === current)?.label ?? '개요';

  return (
    <section
      className="city-block-layout city-block-layout--sidebar"
      aria-label="사이드바 메뉴 레이아웃"
    >
      <aside className="city-block-layout-sidebar">
        <Brand />
        <NavigationLinks
          current={current}
          items={globalNavigation}
          label="주요 메뉴"
          onSelect={setCurrent}
        />
        <p className="city-block-layout-sidebar-note">모든 운영 채널 정상</p>
      </aside>
      <div className="city-block-layout-workspace">
        <header className="city-block-layout-topbar">
          <span>현재 화면 · {currentLabel}</span>
          <UserActions />
        </header>
        <div className="city-block-layout-page">
          <Breadcrumb current={currentLabel} />
          <PageHeading
            eyebrow="운영 워크스페이스"
            title={currentLabel}
            description="탐색이 많은 운영 도구에 맞는 기본 사이드바 구성입니다."
            actions={
              <Button size="sm" type="button">
                새로 만들기
              </Button>
            }
          />
          <OverviewContent />
        </div>
      </div>
    </section>
  );
}

export function HamburgerSidebar() {
  const [current, setCurrent] = useState('overview');
  const [open, setOpen] = useState(false);
  const currentLabel = globalNavigation.find((item) => item.id === current)?.label ?? '개요';

  function selectNavigation(id: string) {
    setCurrent(id);
    setOpen(false);
  }

  return (
    <section
      className="city-block-layout city-block-layout--drawer"
      aria-label="햄버거 사이드 패널 레이아웃"
    >
      <Drawer.Root onOpenChange={setOpen} open={open} swipeDirection="right">
        <header className="city-block-layout-topbar">
          <div className="city-block-layout-drawer-context">
            <Drawer.Trigger
              render={<Button aria-label="메뉴 열기" size="sm" type="button" variant="outline" />}
            >
              <MenuIcon aria-hidden="true" size={16} />
              메뉴
            </Drawer.Trigger>
            <span>프로젝트 운영</span>
          </div>
          <UserActions />
        </header>
        <div className="city-block-layout-workspace">
          <div className="city-block-layout-page">
            <Breadcrumb current={currentLabel} />
            <PageHeading
              eyebrow="모바일 우선 탐색"
              title={currentLabel}
              description="본문을 우선 보여 주고 필요할 때 햄버거 메뉴에서 사이드 패널을 여는 구성입니다."
              actions={
                <Button size="sm" type="button">
                  새 작업
                </Button>
              }
            />
            <OverviewContent />
          </div>
        </div>
        <Drawer.Portal>
          <Drawer.Backdrop />
          <Drawer.Viewport side="left">
            <Drawer.Popup side="left" size="sm">
              <Drawer.Header>
                <div>
                  <Drawer.Title>프로젝트 메뉴</Drawer.Title>
                  <Drawer.Description>이동할 화면을 선택하십시오.</Drawer.Description>
                </div>
                <Drawer.Close
                  render={
                    <Button
                      aria-label="메뉴 닫기"
                      iconOnly
                      size="sm"
                      type="button"
                      variant="ghost"
                    />
                  }
                >
                  <X aria-hidden="true" size={16} />
                </Drawer.Close>
              </Drawer.Header>
              <Drawer.Content className="city-block-layout-drawer-content">
                <div className="city-block-layout-drawer-sidebar">
                  <Brand />
                  <NavigationLinks
                    current={current}
                    items={globalNavigation}
                    label="프로젝트 메뉴"
                    onSelect={selectNavigation}
                  />
                </div>
              </Drawer.Content>
            </Drawer.Popup>
          </Drawer.Viewport>
        </Drawer.Portal>
      </Drawer.Root>
    </section>
  );
}

export function SidebarFloatingPage() {
  const [current, setCurrent] = useState('overview');
  const currentLabel = globalNavigation.find((item) => item.id === current)?.label ?? '개요';

  return (
    <section
      className="city-block-layout city-block-layout--floating"
      aria-label="사이드바 플로팅 페이지 레이아웃"
    >
      <aside className="city-block-layout-sidebar">
        <Brand />
        <NavigationLinks
          current={current}
          items={globalNavigation}
          label="주요 메뉴"
          onSelect={setCurrent}
        />
      </aside>
      <div className="city-block-layout-floating-workspace">
        <header className="city-block-layout-topbar">
          <span>워크스페이스</span>
          <UserActions />
        </header>
        <section className="city-block-layout-floating-page" aria-label="현재 페이지">
          <Breadcrumb current={currentLabel} />
          <PageHeading
            eyebrow="프로젝트 운영"
            title="팀 설정"
            description="사이드바와 본문을 별도 표면으로 구분해 설정이나 집중 작업에 쓰는 구성입니다."
            actions={
              <Button size="sm" type="button">
                변경 사항 저장
              </Button>
            }
          />
          <section className="city-block-layout-settings-list" aria-label="팀 설정 항목">
            <div>
              <div>
                <strong>팀 이름</strong>
                <span>도시환경 개선팀</span>
              </div>
              <Button size="sm" type="button" variant="outline">
                수정
              </Button>
            </div>
            <div>
              <div>
                <strong>기본 알림</strong>
                <span>업무 배정과 검토 요청을 팀에 알립니다.</span>
              </div>
              <Badge appearance="subtle" tone="success">
                사용 중
              </Badge>
            </div>
          </section>
        </section>
      </div>
    </section>
  );
}

export function SidebarTwoColumn() {
  const [area, setArea] = useState('projects');
  const [current, setCurrent] = useState('overview');
  const currentItems = secondaryNavigation[area] ?? projectNavigation;
  const areaLabel = railNavigation.find((item) => item.id === area)?.label ?? '프로젝트';
  const currentLabel =
    currentItems.find((item) => item.id === current)?.label ?? currentItems[0]!.label;

  function selectArea(id: string) {
    setArea(id);
    setCurrent((secondaryNavigation[id] ?? projectNavigation)[0]!.id);
  }

  return (
    <section
      className="city-block-layout city-block-layout--two-column"
      aria-label="사이드바 2열 탐색 레이아웃"
    >
      <aside className="city-block-layout-rail">
        <Brand compact />
        <NavigationLinks
          current={area}
          items={railNavigation}
          label="영역 선택"
          onSelect={selectArea}
          variant="rail"
        />
      </aside>
      <aside className="city-block-layout-secondary-sidebar">
        <div>
          <p>워크스페이스</p>
          <strong>{areaLabel}</strong>
        </div>
        <NavigationLinks
          current={current}
          items={currentItems}
          label={`${areaLabel} 메뉴`}
          onSelect={setCurrent}
        />
      </aside>
      <div className="city-block-layout-workspace">
        <header className="city-block-layout-topbar">
          <span>{areaLabel}</span>
          <UserActions />
        </header>
        <div className="city-block-layout-page">
          <Breadcrumb current={currentLabel} />
          <PageHeading
            eyebrow={areaLabel}
            title={currentLabel}
            description="제품 영역과 그 안의 메뉴를 분리해야 할 때 쓰는 2열 탐색 구성입니다."
            actions={
              <Button size="sm" type="button">
                새 작업
              </Button>
            }
          />
          <OverviewContent />
        </div>
      </div>
    </section>
  );
}

export function SidebarListDetail() {
  const [selectedId, setSelectedId] = useState<(typeof documents)[number]['id']>('brief');
  const selected = documents.find((document) => document.id === selectedId) ?? documents[0];

  return (
    <section
      className="city-block-layout city-block-layout--list-detail"
      aria-label="사이드바 목록 상세 레이아웃"
    >
      <aside className="city-block-layout-sidebar">
        <Brand />
        <NavigationLinks
          current="projects"
          items={globalNavigation}
          label="주요 메뉴"
          onSelect={() => undefined}
        />
      </aside>
      <section className="city-block-layout-item-list" aria-labelledby="layout-document-list-title">
        <header>
          <div>
            <p>문서</p>
            <h3 id="layout-document-list-title">최근 문서</h3>
          </div>
          <Button aria-label="문서 추가" iconOnly size="sm" type="button" variant="outline">
            +
          </Button>
        </header>
        <SearchInput.Root>
          <SearchInput.Group>
            <SearchInput.Input aria-label="문서 검색" placeholder="문서 검색" />
          </SearchInput.Group>
        </SearchInput.Root>
        <ul>
          {documents.map((document) => (
            <li key={document.id}>
              <button
                aria-current={selectedId === document.id ? 'page' : undefined}
                onClick={() => setSelectedId(document.id)}
                type="button"
              >
                <strong>{document.title}</strong>
                <span>{document.meta}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
      <article
        className="city-block-layout-document-detail"
        aria-labelledby="layout-document-title"
      >
        <Breadcrumb current="최근 문서" />
        <header>
          <div>
            <p>{selected.meta}</p>
            <h3 id="layout-document-title">{selected.title}</h3>
          </div>
          <Button size="sm" type="button" variant="outline">
            공유
          </Button>
        </header>
        <p className="city-block-layout-document-lead">{selected.excerpt}</p>
        <div className="city-block-layout-document-lines" aria-label="문서 내용 예시">
          <span />
          <span />
          <span />
          <span />
        </div>
      </article>
    </section>
  );
}
