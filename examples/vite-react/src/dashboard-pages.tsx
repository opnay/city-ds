import type { MouseEvent, ReactNode } from 'react';
import {
  Activity,
  ArrowRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Gauge,
  HardHat,
  MapPin,
  Radio,
  SearchX,
  ShieldCheck,
  Siren,
  TrendingDown,
  TrendingUp,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import {
  Accordion,
  Alert,
  Badge,
  DataTableRegion,
  EmptyState,
  Meter,
  Progress,
  Table,
  type FeedbackTone,
} from '@opnay/city-ds-react';

import { countAttentionOrders, INITIAL_WORK_ORDERS } from './operations-data';

type Navigate = (path: string) => void;
type ToneFixture = Readonly<Record<string, unknown>> & { tone: FeedbackTone };

interface PageHeadingProps {
  action?: ReactNode;
  description: string;
  eyebrow: string;
  title: string;
}

interface MetricCardProps {
  detail: string;
  icon: LucideIcon;
  label: string;
  trend?: string;
  value: string;
}

interface SectionHeadingProps {
  action?: ReactNode;
  description?: string | undefined;
  id: string;
  title: string;
}

function PageHeading({ action, description, eyebrow, title }: PageHeadingProps) {
  return (
    <header className="city-page-heading">
      <div>
        <p className="city-page-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action ? <div className="city-page-heading-action">{action}</div> : null}
    </header>
  );
}

function MetricCard({ detail, icon: Icon, label, trend, value }: MetricCardProps) {
  return (
    <article className="city-metric-card">
      <div className="city-metric-card-heading">
        <span>{label}</span>
        <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
      </div>
      <strong>{value}</strong>
      <p>
        {trend ? <span>{trend}</span> : null}
        {detail}
      </p>
    </article>
  );
}

function SectionHeading({ action, description, id, title }: SectionHeadingProps) {
  return (
    <div className="city-section-heading">
      <div>
        <h2 id={id}>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

function RouteButton({
  children,
  navigate,
  to,
}: {
  children: ReactNode;
  navigate: Navigate;
  to: string;
}) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    navigate(to);
  };

  return (
    <a className="city-route-link" href={to} onClick={handleClick}>
      {children}
      <ArrowRight aria-hidden="true" size={15} strokeWidth={1.8} />
    </a>
  );
}

function StatusBadge({ children, tone }: { children: ReactNode; tone: FeedbackTone }) {
  return (
    <Badge appearance="subtle" size="sm" tone={tone}>
      {children}
    </Badge>
  );
}

function TablePanel({
  children,
  description,
  id,
  title,
}: {
  children: ReactNode;
  description?: string;
  id: string;
  title: string;
}) {
  return (
    <section aria-labelledby={id} className="city-surface-section">
      <SectionHeading description={description} id={id} title={title} />
      <DataTableRegion appearance="outline" label={title}>
        {children}
      </DataTableRegion>
    </section>
  );
}

const MAINTENANCE_ITEMS = [
  {
    asset: '성수 배수펌프장 2호기',
    crew: '수방 설비팀',
    district: '성동구',
    schedule: '오늘 13:00',
    status: '준비 완료',
    tone: 'success',
  },
  {
    asset: '을지로 지하보도 환기설비',
    crew: '도심 시설팀',
    district: '중구',
    schedule: '오늘 15:30',
    status: '부품 확인',
    tone: 'warning',
  },
  {
    asset: '청계천 수위 센서 B-12',
    crew: '하천 대응팀',
    district: '종로구',
    schedule: '8월 2일 09:00',
    status: '예정',
    tone: 'neutral',
  },
  {
    asset: '강남대로 가로등 제어반',
    crew: '도로 전기팀',
    district: '강남구',
    schedule: '8월 2일 22:00',
    status: '야간 작업',
    tone: 'info',
  },
  {
    asset: '월드컵로 우수관로 4구간',
    crew: '서북 수방팀',
    district: '마포구',
    schedule: '8월 3일 10:00',
    status: '승인 대기',
    tone: 'warning',
  },
] as const satisfies readonly ToneFixture[];

const ASSET_ITEMS = [
  {
    id: 'AST-0842',
    inspected: '오늘 08:42',
    location: '성동구 성수동2가',
    name: '배수펌프장 2호기',
    status: '정상',
    tone: 'success',
    type: '수방 설비',
  },
  {
    id: 'AST-0631',
    inspected: '어제 17:20',
    location: '중구 을지로3가',
    name: '지하보도 환기설비',
    status: '점검 필요',
    tone: 'warning',
    type: '보행 시설',
  },
  {
    id: 'AST-1180',
    inspected: '7월 31일',
    location: '종로구 청계천로',
    name: '수위 센서 B-12',
    status: '정상',
    tone: 'success',
    type: '관측 장비',
  },
  {
    id: 'AST-0417',
    inspected: '7월 29일',
    location: '강남구 역삼동',
    name: '가로등 제어반 G-07',
    status: '주의',
    tone: 'warning',
    type: '도로 전기',
  },
  {
    id: 'AST-0924',
    inspected: '7월 27일',
    location: '마포구 성산동',
    name: '우수관로 감시 장치',
    status: '긴급 점검',
    tone: 'destructive',
    type: '수방 설비',
  },
] as const satisfies readonly ToneFixture[];

const CREW_ITEMS = [
  {
    active: 3,
    capacity: 78,
    lead: '김도윤',
    name: '도심 도로팀',
    next: '을지로 안전 펜스 복구',
    status: '현장 대응',
    tone: 'info',
  },
  {
    active: 2,
    capacity: 62,
    lead: '박서진',
    name: '수방 설비팀',
    next: '성수 배수펌프장 정기 점검',
    status: '이동 중',
    tone: 'warning',
  },
  {
    active: 1,
    capacity: 34,
    lead: '이현수',
    name: '하천 대응팀',
    next: '청계천 센서 교정',
    status: '배정 가능',
    tone: 'success',
  },
  {
    active: 2,
    capacity: 71,
    lead: '최유나',
    name: '도로 전기팀',
    next: '강남대로 제어반 점검',
    status: '현장 대응',
    tone: 'info',
  },
] as const satisfies readonly ToneFixture[];

const DISTRICT_REPORTS = [
  { completion: 94, district: '성동구', orders: 38, sla: '98.1%', trend: '+2.4%' },
  { completion: 88, district: '중구', orders: 31, sla: '95.4%', trend: '+0.8%' },
  { completion: 91, district: '종로구', orders: 27, sla: '97.2%', trend: '+1.6%' },
  { completion: 82, district: '강남구', orders: 44, sla: '92.8%', trend: '-1.2%' },
  { completion: 86, district: '마포구', orders: 35, sla: '94.6%', trend: '+0.3%' },
] as const;

const ACTIVITY_ITEMS = [
  {
    actor: '김도윤 · 도심 도로팀',
    description: 'WO-3127 도로 침하 안전 조치의 현장 통제를 시작했어요.',
    label: '작업 시작',
    time: '10:08',
    tone: 'info',
  },
  {
    actor: '박서진 · 수방 설비팀',
    description: '성수 배수펌프장 2호기 정기 점검 준비를 완료했어요.',
    label: '정비 준비',
    time: '09:52',
    tone: 'success',
  },
  {
    actor: '통합 관제',
    description: '중구 환승 안내판의 교체 부품 도착이 늦어진다고 기록했어요.',
    label: '지연 사유',
    time: '09:31',
    tone: 'warning',
  },
  {
    actor: '최유나 · 도로 전기팀',
    description: '강남대로 가로등 제어반 원격 진단 결과를 첨부했어요.',
    label: '점검 기록',
    time: '09:12',
    tone: 'neutral',
  },
  {
    actor: '운영 관리자',
    description: '마포구 집중호우 대비 순찰 인력을 2명 늘렸어요.',
    label: '인력 변경',
    time: '08:44',
    tone: 'info',
  },
] as const satisfies readonly ToneFixture[];

const SERVICE_ITEMS = [
  {
    detail: '요청을 접수하고 상태 변경을 정상적으로 처리하고 있어요. 최근 24시간 오류는 0건이에요.',
    label: '작업 배차 채널',
    latency: '평균 응답 시간 182ms',
    value: 'dispatch',
  },
  {
    detail: '센서 1,284개 중 1,276개가 정상 연결 상태예요. 8개는 계획된 점검 중이에요.',
    label: '시설 관측 채널',
    latency: '수집 지연 24초',
    value: 'telemetry',
  },
  {
    detail: '현장팀 알림과 비상 연락망이 정상이에요. 마지막 전달 성공 시각은 10:06이에요.',
    label: '현장 알림 채널',
    latency: '전달 성공률 99.98%',
    value: 'notification',
  },
  {
    detail: '오늘 리포트 집계를 마쳤어요. 다음 자동 집계는 11:00에 시작해요.',
    label: '리포트 집계 채널',
    latency: '최근 집계 9분',
    value: 'reporting',
  },
] as const;

function OverviewPage({ navigate }: { navigate: Navigate }) {
  const activeOrders = INITIAL_WORK_ORDERS.filter((order) => order.status !== '완료');
  const attentionCount = countAttentionOrders(INITIAL_WORK_ORDERS);
  const priorityOrders = activeOrders.filter((order) => order.risk !== 'normal').slice(0, 4);

  return (
    <div className="city-dashboard-page">
      <PageHeading
        action={
          <RouteButton navigate={navigate} to="/work-orders">
            현장 작업 보기
          </RouteButton>
        }
        description="먼저 조치할 작업과 오늘 일정을 확인해 주세요."
        eyebrow="2026년 8월 1일 토요일 · 주간 근무"
        title="운영 현황"
      />

      <Alert.Root appearance="subtle" tone="warning">
        <Alert.Title level={2}>먼저 조치할 작업 {attentionCount}건</Alert.Title>
        <Alert.Description>
          도로 침하 1건은 담당팀 배정이 필요해요. 안내판 교체 1건은 부품을 기다리고 있어요.
        </Alert.Description>
        <Alert.Action>
          <RouteButton navigate={navigate} to="/work-orders">
            우선 작업 확인
          </RouteButton>
        </Alert.Action>
      </Alert.Root>

      <section aria-label="핵심 운영 지표" className="city-metric-grid">
        <MetricCard
          detail="접수·배정·진행·대기 중"
          icon={Wrench}
          label="미완료 작업"
          trend="+2 "
          value={`${activeOrders.length}건`}
        />
        <MetricCard
          detail="기한 초과 위험 또는 담당팀 미배정"
          icon={Siren}
          label="조치 필요"
          value={`${attentionCount}건`}
        />
        <MetricCard
          detail="목표 24건의 75%"
          icon={CheckCircle2}
          label="오늘 완료"
          trend="+12% "
          value="18건"
        />
        <MetricCard detail="전체 6개 팀" icon={Users} label="배정 가능한 팀" value="4개 팀" />
      </section>

      <div className="city-dashboard-split">
        <section aria-labelledby="overview-priority-heading" className="city-surface-section">
          <SectionHeading
            action={
              <RouteButton navigate={navigate} to="/work-orders">
                전체 보기
              </RouteButton>
            }
            id="overview-priority-heading"
            title="우선 작업"
          />
          <ul className="city-priority-list">
            {priorityOrders.map((order) => (
              <li key={order.id}>
                <div>
                  <span className="city-data-id">{order.id}</span>
                  <strong>{order.title}</strong>
                  <small>
                    <MapPin aria-hidden="true" size={13} strokeWidth={1.8} />
                    {order.district} · {order.location}
                  </small>
                </div>
                <div>
                  <StatusBadge tone={order.risk === 'critical' ? 'destructive' : 'warning'}>
                    {order.dueLabel}
                  </StatusBadge>
                  <span>{order.crew ?? '미배정'}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="overview-schedule-heading" className="city-surface-section">
          <SectionHeading
            action={
              <RouteButton navigate={navigate} to="/maintenance">
                계획 보기
              </RouteButton>
            }
            id="overview-schedule-heading"
            title="오늘 일정"
          />
          <ol className="city-schedule-list">
            <li>
              <time>13:00</time>
              <span>
                <strong>성수 배수펌프장 정기 점검</strong>
                <small>수방 설비팀 · 성동구</small>
              </span>
              <StatusBadge tone="success">준비 완료</StatusBadge>
            </li>
            <li>
              <time>15:30</time>
              <span>
                <strong>을지로 환기설비 점검</strong>
                <small>도심 시설팀 · 중구</small>
              </span>
              <StatusBadge tone="warning">부품 확인</StatusBadge>
            </li>
            <li>
              <time>18:00</time>
              <span>
                <strong>야간 대응 인계</strong>
                <small>통합 관제 · 전체 권역</small>
              </span>
              <StatusBadge tone="neutral">예정</StatusBadge>
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
}

function MaintenancePage() {
  return (
    <div className="city-dashboard-page">
      <PageHeading
        description="점검 일정과 준비 상태를 확인해 주세요."
        eyebrow="향후 7일"
        title="정비 계획"
      />
      <section aria-label="정비 계획 지표" className="city-metric-grid city-metric-grid--three">
        <MetricCard detail="준비 완료 4건" icon={CalendarClock} label="오늘 점검" value="6건" />
        <MetricCard detail="시설 19개 대상" icon={Wrench} label="7일 계획" value="24건" />
        <MetricCard detail="승인 또는 부품 대기" icon={CircleAlert} label="준비 지연" value="2건" />
      </section>
      <Alert.Root appearance="subtle" tone="warning">
        <Alert.Title level={2}>준비가 늦어진 정비 2건</Alert.Title>
        <Alert.Description>
          부품 입고와 도로 점용 승인을 각각 1건씩 기다리고 있어요.
        </Alert.Description>
      </Alert.Root>
      <TablePanel description="시작 시간순" id="maintenance-list-heading" title="예정 정비">
        <Table.Root
          className="city-dashboard-table"
          size="sm"
          variant="surface"
          aria-label="예정 정비 목록"
        >
          <Table.Header>
            <Table.Row>
              <Table.Head>일정</Table.Head>
              <Table.Head>시설</Table.Head>
              <Table.Head>권역</Table.Head>
              <Table.Head>담당팀</Table.Head>
              <Table.Head>준비 상태</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {MAINTENANCE_ITEMS.map((item) => (
              <Table.Row key={item.asset}>
                <Table.Cell>
                  <time>{item.schedule}</time>
                </Table.Cell>
                <Table.Cell>
                  <strong>{item.asset}</strong>
                </Table.Cell>
                <Table.Cell>{item.district}</Table.Cell>
                <Table.Cell>{item.crew}</Table.Cell>
                <Table.Cell>
                  <StatusBadge tone={item.tone}>{item.status}</StatusBadge>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </TablePanel>
    </div>
  );
}

function AssetsPage() {
  return (
    <div className="city-dashboard-page">
      <PageHeading
        description="이상이 있는 시설과 최근 점검 기록을 확인해 주세요."
        eyebrow="10:02 업데이트"
        title="시설 자산"
      />
      <section aria-label="시설 자산 지표" className="city-metric-grid">
        <MetricCard detail="관리 대상 시설" icon={Building2} label="전체 자산" value="1,284개" />
        <MetricCard detail="최근 점검 기준" icon={ShieldCheck} label="정상" value="1,226개" />
        <MetricCard detail="7일 이내 점검" icon={CircleAlert} label="점검 필요" value="42개" />
        <MetricCard detail="현장 확인 우선" icon={Siren} label="긴급 점검" value="16개" />
      </section>
      <TablePanel id="asset-list-heading" title="시설 상태">
        <Table.Root
          className="city-dashboard-table"
          size="sm"
          variant="surface"
          aria-label="시설 자산 목록"
        >
          <Table.Header>
            <Table.Row>
              <Table.Head>자산 번호</Table.Head>
              <Table.Head>시설</Table.Head>
              <Table.Head>유형</Table.Head>
              <Table.Head>위치</Table.Head>
              <Table.Head>최근 점검</Table.Head>
              <Table.Head>상태</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {ASSET_ITEMS.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>
                  <span className="city-data-id">{item.id}</span>
                </Table.Cell>
                <Table.Cell>
                  <strong>{item.name}</strong>
                </Table.Cell>
                <Table.Cell>{item.type}</Table.Cell>
                <Table.Cell>{item.location}</Table.Cell>
                <Table.Cell>{item.inspected}</Table.Cell>
                <Table.Cell>
                  <StatusBadge tone={item.tone}>{item.status}</StatusBadge>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </TablePanel>
    </div>
  );
}

function CrewsPage() {
  return (
    <div className="city-dashboard-page">
      <PageHeading
        description="팀별 작업량과 배정 가능한 인력을 확인해 주세요."
        eyebrow="10:02 업데이트"
        title="현장팀"
      />
      <section aria-label="현장팀 지표" className="city-metric-grid city-metric-grid--three">
        <MetricCard detail="전체 6개 팀" icon={Users} label="즉시 배정 가능" value="4개 팀" />
        <MetricCard detail="현재 출동 또는 작업 중" icon={HardHat} label="현장 대응" value="8건" />
        <MetricCard detail="전체 계획 대비" icon={Gauge} label="평균 배정률" value="61%" />
      </section>
      <section aria-labelledby="crew-capacity-heading" className="city-surface-section">
        <SectionHeading
          description="새 작업을 배정할 때 팀별 배정률과 다음 일정을 확인해 주세요."
          id="crew-capacity-heading"
          title="팀별 배정 현황"
        />
        <div className="city-crew-grid">
          {CREW_ITEMS.map((crew) => (
            <article className="city-crew-card" key={crew.name}>
              <div className="city-crew-card-heading">
                <div>
                  <HardHat aria-hidden="true" size={18} strokeWidth={1.8} />
                  <span>
                    <strong>{crew.name}</strong>
                    <small>팀장 {crew.lead}</small>
                  </span>
                </div>
                <StatusBadge tone={crew.tone}>{crew.status}</StatusBadge>
              </div>
              <Meter.Root aria-label={`${crew.name} 배정률`} size="sm" value={crew.capacity}>
                <div className="city-progress-heading">
                  <Meter.Label>배정률</Meter.Label>
                  <Meter.Value />
                </div>
                <Meter.Track>
                  <Meter.Indicator />
                </Meter.Track>
              </Meter.Root>
              <dl className="city-inline-definition">
                <div>
                  <dt>진행 작업</dt>
                  <dd>{crew.active}건</dd>
                </div>
                <div>
                  <dt>다음 일정</dt>
                  <dd>{crew.next}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function ReportsPage() {
  return (
    <div className="city-dashboard-page">
      <PageHeading
        description="이번 주 처리 결과와 자치구별 기한 준수율을 확인해 주세요."
        eyebrow="7월 27일–8월 1일"
        title="운영 리포트"
      />
      <section aria-label="주간 운영 지표" className="city-metric-grid">
        <MetricCard
          detail="전주 대비"
          icon={CheckCircle2}
          label="완료 작업"
          trend="+12% "
          value="175건"
        />
        <MetricCard
          detail="목표 96.0%"
          icon={ShieldCheck}
          label="기한 준수율"
          trend="+1.8%p "
          value="95.7%"
        />
        <MetricCard
          detail="접수부터 현장 도착"
          icon={Clock3}
          label="평균 대응 시간"
          trend="-8분 "
          value="42분"
        />
        <MetricCard
          detail="전주 11건"
          icon={CircleAlert}
          label="재작업"
          trend="-3건 "
          value="8건"
        />
      </section>
      <Alert.Root appearance="subtle" tone="info">
        <Alert.Title level={2}>강남구 기한 준수율 92.8% · 목표까지 3.2%p</Alert.Title>
        <Alert.Description>
          야간 도로 전기 작업 4건에서 부품을 기다린 시간이 주요 원인이에요.
        </Alert.Description>
      </Alert.Root>
      <TablePanel
        description="완료율은 이번 주 접수 건수에 대한 완료 건수의 비율이에요."
        id="district-report-heading"
        title="자치구별 성과"
      >
        <Table.Root
          className="city-dashboard-table"
          size="sm"
          variant="surface"
          aria-label="자치구별 운영 성과"
        >
          <Table.Header>
            <Table.Row>
              <Table.Head>자치구</Table.Head>
              <Table.Head>접수</Table.Head>
              <Table.Head>완료율</Table.Head>
              <Table.Head>기한 준수율</Table.Head>
              <Table.Head>전주 대비</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {DISTRICT_REPORTS.map((item) => (
              <Table.Row key={item.district}>
                <Table.Cell>
                  <strong>{item.district}</strong>
                </Table.Cell>
                <Table.Cell>{item.orders}건</Table.Cell>
                <Table.Cell>
                  <Progress.Root
                    aria-label={`${item.district} 완료율`}
                    className="city-table-progress"
                    size="sm"
                    value={item.completion}
                  >
                    <div className="city-progress-heading">
                      <Progress.Value>
                        {(_formattedValue, value) => `${value ?? 0}%`}
                      </Progress.Value>
                    </div>
                    <Progress.Track>
                      <Progress.Indicator />
                    </Progress.Track>
                  </Progress.Root>
                </Table.Cell>
                <Table.Cell>{item.sla}</Table.Cell>
                <Table.Cell>
                  <span
                    className="city-report-trend"
                    data-direction={item.trend.startsWith('-') ? 'down' : 'up'}
                  >
                    {item.trend.startsWith('-') ? (
                      <TrendingDown aria-hidden="true" size={14} />
                    ) : (
                      <TrendingUp aria-hidden="true" size={14} />
                    )}
                    {item.trend}
                  </span>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </TablePanel>
    </div>
  );
}

function ActivityPage() {
  return (
    <div className="city-dashboard-page">
      <PageHeading
        description="작업·정비·인력 배정의 변경 내역을 확인해 주세요."
        eyebrow="오늘"
        title="활동 기록"
      />
      <section aria-labelledby="activity-feed-heading" className="city-surface-section">
        <SectionHeading
          description="한국 시간(KST) 기준"
          id="activity-feed-heading"
          title="최근 활동"
        />
        <ol className="city-activity-feed">
          {ACTIVITY_ITEMS.map((item) => (
            <li key={`${item.time}-${item.label}`}>
              <time>{item.time}</time>
              <span className="city-activity-marker" data-tone={item.tone} aria-hidden="true">
                <Activity size={14} strokeWidth={2} />
              </span>
              <div>
                <div>
                  <StatusBadge tone={item.tone}>{item.label}</StatusBadge>
                  <span>{item.actor}</span>
                </div>
                <p>{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function ServiceStatusPage() {
  return (
    <div className="city-dashboard-page">
      <PageHeading
        description="채널별 연결 상태와 응답 시간을 확인해 주세요."
        eyebrow="10:07 업데이트"
        title="서비스 상태"
      />
      <Alert.Root appearance="subtle" tone="success">
        <Alert.Title level={2}>모든 운영 채널이 정상이에요.</Alert.Title>
        <Alert.Description>
          최근 24시간 동안 서비스 중단이나 데이터 유실을 감지하지 않았어요.
        </Alert.Description>
      </Alert.Root>
      <section aria-label="서비스 상태 지표" className="city-metric-grid city-metric-grid--three">
        <MetricCard detail="최근 30일" icon={Radio} label="서비스 가동률" value="99.98%" />
        <MetricCard detail="작업 배차 기준" icon={Gauge} label="평균 응답 시간" value="182ms" />
        <MetricCard detail="계획 점검 8개" icon={Building2} label="연결 시설" value="1,276개" />
      </section>
      <section aria-labelledby="service-channel-heading" className="city-surface-section">
        <SectionHeading
          description="채널을 선택하면 최근 측정값을 볼 수 있어요."
          id="service-channel-heading"
          title="운영 채널"
        />
        <Accordion.Root>
          {SERVICE_ITEMS.map((service) => (
            <Accordion.Item key={service.value} value={service.value}>
              <Accordion.Header>
                <Accordion.Trigger>
                  <span className="city-service-trigger">
                    <span>
                      <CheckCircle2 aria-hidden="true" size={16} strokeWidth={1.8} />
                      <strong>{service.label}</strong>
                    </span>
                    <span>
                      <StatusBadge tone="success">정상</StatusBadge>
                      <small>{service.latency}</small>
                    </span>
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel>{service.detail}</Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </section>
    </div>
  );
}

function NotFoundPage({ navigate }: { navigate: Navigate }) {
  return (
    <EmptyState.Root className="city-not-found">
      <EmptyState.Icon>
        <SearchX />
      </EmptyState.Icon>
      <EmptyState.Title level={1}>페이지를 찾을 수 없어요.</EmptyState.Title>
      <EmptyState.Description>
        주소를 확인하거나 운영 현황으로 이동해 주세요.
      </EmptyState.Description>
      <EmptyState.Actions>
        <RouteButton navigate={navigate} to="/">
          운영 현황으로
        </RouteButton>
      </EmptyState.Actions>
    </EmptyState.Root>
  );
}

export function DashboardPage({ navigate, pathname }: { navigate: Navigate; pathname: string }) {
  switch (pathname) {
    case '/':
      return <OverviewPage navigate={navigate} />;
    case '/maintenance':
      return <MaintenancePage />;
    case '/assets':
      return <AssetsPage />;
    case '/crews':
      return <CrewsPage />;
    case '/reports':
      return <ReportsPage />;
    case '/activity':
      return <ActivityPage />;
    case '/service-status':
      return <ServiceStatusPage />;
    default:
      return <NotFoundPage navigate={navigate} />;
  }
}
