import { useMemo, useState, type CSSProperties } from 'react';
import { ArrowRight, Check, Clipboard, ListChecks, RefreshCw, ShieldCheck, X } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Badge } from '@opnay/city-ds-react/badge';
import { Button } from '@opnay/city-ds-react/button';
import { Checkbox } from '@opnay/city-ds-react/checkbox';
import { Input } from '@opnay/city-ds-react/input';
import { SearchField } from '@opnay/city-ds-react/search-field';
import { Select } from '@opnay/city-ds-react/select';
import { Switch } from '@opnay/city-ds-react/switch';
import { Table } from '@opnay/city-ds-react/table';

const TRANSACTIONS = [
  {
    amount: '₩125,000',
    id: 'TX-98721',
    requestedAt: '2026-08-05 14:28',
    status: 'normal',
    user: 'park.jh',
  },
  {
    amount: '₩560,000',
    id: 'TX-98720',
    requestedAt: '2026-08-05 14:22',
    status: 'review',
    user: 'kim.sy',
  },
  {
    amount: '₩1,250,000',
    id: 'TX-98719',
    requestedAt: '2026-08-05 14:19',
    status: 'hold',
    user: 'lee.ys',
  },
  {
    amount: '₩85,000',
    id: 'TX-98718',
    requestedAt: '2026-08-05 14:18',
    status: 'normal',
    user: 'cho.mj',
  },
  {
    amount: '₩320,000',
    id: 'TX-98717',
    requestedAt: '2026-08-05 14:16',
    status: 'review',
    user: 'jung.wp',
  },
] as const;

const STATUS_ITEMS = {
  all: '상태 전체',
  hold: '보류',
  normal: '정상',
  review: '검토 중',
} as const;

const STATUS_BADGES = {
  hold: { label: '보류', tone: 'destructive' },
  normal: { label: '정상', tone: 'success' },
  review: { label: '검토 중', tone: 'warning' },
} as const;

const WORKFLOW_STAGES = [
  {
    description: '정책 확인 4건',
    icon: ListChecks,
    title: '거래 검토',
  },
  {
    description: '프로덕션 동기화',
    icon: RefreshCw,
    title: '배포 상태',
  },
  {
    description: '신규 요청 3건',
    icon: ShieldCheck,
    title: '접근 권한',
  },
] as const;

type CopyState = 'error' | 'idle' | 'success';
type StatusFilter = keyof typeof STATUS_ITEMS;

function StatusOptions() {
  return (
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup>
          <Select.List>
            {Object.entries(STATUS_ITEMS).map(([value, label]) => (
              <Select.Item key={value} value={value}>
                <Select.ItemIndicator />
                <Select.ItemText>{label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.List>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  );
}

function ProductPreview() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [updatedAt, setUpdatedAt] = useState('2026-08-05 14:32');
  const visibleTransactions = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('ko-KR');

    return TRANSACTIONS.filter((transaction) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        transaction.id.toLocaleLowerCase('ko-KR').includes(normalizedQuery) ||
        transaction.user.toLocaleLowerCase('ko-KR').includes(normalizedQuery);
      const matchesStatus = status === 'all' || transaction.status === status;

      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  return (
    <section aria-labelledby="product-preview-title" className="city-docs-home-preview">
      <header className="city-docs-home-preview-bar">
        <span>CITY / OPERATIONS / 거래 검토</span>
        <span aria-live="polite">{updatedAt}</span>
      </header>
      <div className="city-docs-home-preview-body">
        <div className="city-docs-home-preview-heading">
          <h2 id="product-preview-title">거래 검토</h2>
          <Button
            onClick={() => setUpdatedAt('방금 업데이트됨')}
            size="sm"
            type="button"
            variant="ghost"
          >
            <RefreshCw aria-hidden="true" size={15} />
            새로고침
          </Button>
        </div>

        <div className="city-docs-home-preview-toolbar">
          <SearchField.Root onValueChange={setQuery} value={query}>
            <SearchField.Group>
              <SearchField.Input
                aria-label="거래 ID 또는 사용자 검색"
                placeholder="거래 ID 또는 사용자 검색"
              />
              <SearchField.Clear aria-label="거래 검색어 지우기" />
            </SearchField.Group>
          </SearchField.Root>
          <Select.Root
            items={STATUS_ITEMS}
            onValueChange={(value) => {
              if (value && value in STATUS_ITEMS) setStatus(value as StatusFilter);
            }}
            size="md"
            value={status}
          >
            <Select.Trigger aria-label="거래 상태">
              <Select.Value />
              <Select.Icon />
            </Select.Trigger>
            <StatusOptions />
          </Select.Root>
        </div>

        <Table.ScrollArea appearance="plain" className="city-docs-home-preview-table">
          <Table.Root aria-label="거래 검토 목록" size="sm">
            <Table.Header>
              <Table.Row>
                <Table.Head>거래 ID</Table.Head>
                <Table.Head>사용자</Table.Head>
                <Table.Head>금액</Table.Head>
                <Table.Head>상태</Table.Head>
                <Table.Head>요청 시간</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {visibleTransactions.length > 0 ? (
                visibleTransactions.map((transaction) => {
                  const badge = STATUS_BADGES[transaction.status];

                  return (
                    <Table.Row key={transaction.id}>
                      <Table.Cell>{transaction.id}</Table.Cell>
                      <Table.Cell>{transaction.user}</Table.Cell>
                      <Table.Cell>{transaction.amount}</Table.Cell>
                      <Table.Cell>
                        <Badge appearance="subtle" size="sm" tone={badge.tone}>
                          {badge.label}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>{transaction.requestedAt}</Table.Cell>
                    </Table.Row>
                  );
                })
              ) : (
                <Table.StateRow colSpan={5}>조건에 맞는 거래가 없습니다.</Table.StateRow>
              )}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>

        <footer className="city-docs-home-preview-footer">
          <span>
            {visibleTransactions.length} / {TRANSACTIONS.length}건
          </span>
          <span>페이지 1 / 1</span>
        </footer>
      </div>
    </section>
  );
}

function FoundationStrip() {
  return (
    <div aria-label="city-ds 기초 토큰" className="city-docs-home-token-strip" role="group">
      <div>
        <span>Color</span>
        <div aria-label="색상 토큰" className="city-docs-home-token-colors" role="img">
          <i data-tone="foreground" />
          <i data-tone="muted" />
          <i data-tone="border" />
          <i data-tone="surface" />
          <i data-tone="success" />
        </div>
      </div>
      <div>
        <span>Typography</span>
        <strong>Aa</strong>
      </div>
      <div>
        <span>Spacing</span>
        <div
          aria-label="간격 토큰 4, 8, 12, 16, 24, 32"
          className="city-docs-home-token-spacing"
          role="img"
        >
          {[4, 8, 12, 16, 24, 32].map((space) => (
            <i key={space} style={{ '--city-docs-space-sample': `${space}px` } as CSSProperties} />
          ))}
        </div>
      </div>
      <div>
        <span>Radius</span>
        <div aria-label="모서리 토큰 0, 2, 4" className="city-docs-home-token-radius" role="img">
          <i />
          <i />
          <i />
        </div>
      </div>
      <div>
        <span>Shadow</span>
        <i aria-label="그림자 토큰" className="city-docs-home-token-shadow" role="img" />
      </div>
    </div>
  );
}

function WorkflowPreview() {
  return (
    <div className="city-docs-home-workflow">
      <ol>
        {WORKFLOW_STAGES.map(({ description, icon: Icon, title }) => (
          <li key={title}>
            <Icon aria-hidden="true" />
            <span>
              <strong>{title}</strong>
              <small>{description}</small>
            </span>
          </li>
        ))}
      </ol>
      <Button nativeButton={false} render={<Link to="/patterns" />} role="link" variant="primary">
        검토 시작
        <ArrowRight aria-hidden="true" size={16} />
      </Button>
    </div>
  );
}

function ComponentStrip() {
  return (
    <div aria-label="대표 컴포넌트" className="city-docs-home-component-strip" role="group">
      <Button type="button" variant="primary">
        버튼
      </Button>
      <Button type="button" variant="outline">
        버튼
      </Button>
      <Input aria-label="예시 입력" placeholder="입력하세요" />
      <Select.Root defaultValue="one" items={{ one: '선택하세요', two: '두 번째 옵션' }}>
        <Select.Trigger aria-label="예시 선택">
          <Select.Value />
          <Select.Icon />
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner>
            <Select.Popup>
              <Select.List>
                <Select.Item value="one">
                  <Select.ItemIndicator />
                  <Select.ItemText>선택하세요</Select.ItemText>
                </Select.Item>
                <Select.Item value="two">
                  <Select.ItemIndicator />
                  <Select.ItemText>두 번째 옵션</Select.ItemText>
                </Select.Item>
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
      <label>
        <Checkbox defaultChecked />
        체크박스
      </label>
      <label>
        <Switch defaultChecked />
        Toggle
      </label>
    </div>
  );
}

export function HomePage() {
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const installCommand = 'pnpm add @opnay/city-ds-react';

  const copyInstallCommand = async () => {
    try {
      if (!navigator.clipboard) throw new Error('Clipboard API is unavailable');
      await navigator.clipboard.writeText(installCommand);
      setCopyState('success');
    } catch {
      setCopyState('error');
    }
  };

  return (
    <article className="city-docs-home">
      <header className="city-docs-home-hero">
        <div className="city-docs-home-hero-copy">
          <p className="city-docs-home-kicker city-text-caption">
            <span aria-hidden="true" />
            city design system · react
          </p>
          <h1 className="city-text-display">
            운영 제품을 위한 <span>React 디자인 시스템</span>
          </h1>
          <p className="city-docs-home-lead city-text-lead">
            복잡한 운영 도구와 데이터 화면을 빠르고 일관되게 만드는 컴포넌트와 디자인 기준을
            제공합니다.
          </p>
          <div className="city-docs-home-actions">
            <Button
              nativeButton={false}
              render={<Link to="/getting-started" />}
              role="link"
              size="lg"
              variant="primary"
            >
              시작하기
              <ArrowRight aria-hidden="true" size={17} />
            </Button>
          </div>
        </div>
        <ProductPreview />
      </header>

      <section
        aria-labelledby="product-foundation-title"
        className="city-docs-home-section city-docs-home-foundation"
        id="product-foundation"
      >
        <div className="city-docs-home-section-copy">
          <p className="city-text-caption">Foundation</p>
          <h2 className="city-text-section-title" id="product-foundation-title">
            일관된 선택을 위한 기준을 제공합니다.
          </h2>
          <p className="city-text-body">
            색상, 타입, 간격, 반경까지 디자인 판단의 근거를 토큰으로 정의합니다.
          </p>
        </div>
        <FoundationStrip />
      </section>

      <section
        aria-labelledby="product-contexts-title"
        className="city-docs-home-section city-docs-home-context-section"
        id="product-contexts"
      >
        <div className="city-docs-home-section-copy">
          <p className="city-text-caption">Interaction contexts</p>
          <h2 className="city-text-section-title" id="product-contexts-title">
            실제 운영 흐름에 맞춘 상호작용을 지원합니다.
          </h2>
          <p className="city-text-body">
            검토가 필요한 거래를 확인하고 조치하는 전체 흐름을 제공합니다.
          </p>
        </div>
        <WorkflowPreview />
      </section>

      <section
        aria-labelledby="product-components-title"
        className="city-docs-home-section city-docs-home-components-section"
        id="product-components"
      >
        <div className="city-docs-home-section-copy">
          <p className="city-text-caption">Components</p>
          <h2 className="city-text-section-title" id="product-components-title">
            즉시 사용할 수 있는 컴포넌트를 제공합니다.
          </h2>
          <p className="city-text-body">
            기본 요소가 같은 규칙과 상태로 연결되어 제품 화면을 빠르게 구성합니다.
          </p>
        </div>
        <ComponentStrip />
      </section>

      <section
        aria-labelledby="product-start-title"
        className="city-docs-home-section city-docs-home-start"
        id="product-start"
      >
        <div className="city-docs-home-section-copy">
          <p className="city-text-caption">Getting started</p>
          <h2 className="city-text-section-title" id="product-start-title">
            지금 바로 시작하십시오.
          </h2>
          <p className="city-text-body">
            패키지를 설치하고 CSS를 불러오면 공개 컴포넌트와 토큰을 사용할 수 있습니다.
          </p>
        </div>
        <div className="city-docs-home-install-row">
          <div className="city-docs-home-install-command">
            <code>{installCommand}</code>
            <Button onClick={() => void copyInstallCommand()} type="button" variant="ghost">
              {copyState === 'success' ? (
                <Check aria-hidden="true" size={16} />
              ) : copyState === 'error' ? (
                <X aria-hidden="true" size={16} />
              ) : (
                <Clipboard aria-hidden="true" size={16} />
              )}
              {copyState === 'success' ? '복사됨' : copyState === 'error' ? '복사 실패' : '복사'}
            </Button>
          </div>
          <Button
            nativeButton={false}
            render={<Link to="/getting-started" />}
            role="link"
            variant="primary"
          >
            설치 가이드 보기
            <ArrowRight aria-hidden="true" size={16} />
          </Button>
          <span aria-live="polite" className="city-docs-sr-only">
            {copyState === 'success'
              ? '설치 명령어를 복사했습니다.'
              : copyState === 'error'
                ? '설치 명령어를 복사할 수 없습니다.'
                : ''}
          </span>
        </div>
      </section>
    </article>
  );
}
