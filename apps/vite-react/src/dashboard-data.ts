export const DISTRICTS = ['전체 권역', '종로구', '중구', '용산구', '성동구'] as const;
export const WORK_ORDER_DISTRICTS = ['종로구', '중구', '용산구', '성동구'] as const;
export const PRIORITIES = ['긴급', '높음', '보통'] as const;
export const WORK_ORDER_STATUSES = ['접수', '배정됨', '진행 중', '대기', '완료', '취소'] as const;
export const CREWS = ['도심 1팀', '도심 2팀', '시설 전기팀', '도로 보수팀', '미배정'] as const;
export const LOCATIONS = [
  '광화문광장',
  '서울역 환승센터',
  '남산 1호 터널',
  '용산가족공원',
  '성수 수변공원',
  '을지로 지하보도',
] as const;

export type District = (typeof WORK_ORDER_DISTRICTS)[number];
export type Priority = (typeof PRIORITIES)[number];
export type WorkOrderStatus = (typeof WORK_ORDER_STATUSES)[number];
export type Crew = (typeof CREWS)[number];
export type StatusFilter = '전체' | 'SLA 위험' | '진행 중' | '완료';
export type NotificationChannel = 'push' | 'email' | 'sms';

export interface WorkOrder {
  attachmentNames?: string[];
  id: string;
  title: string;
  district: District;
  location: string;
  notificationChannels?: NotificationChannel[];
  priority: Priority;
  responseMinutes?: number;
  status: WorkOrderStatus;
  crew: Crew;
  slaDueAt: string;
  updatedAt: string;
  progress: number;
}

export const NOTIFICATION_CHANNEL_LABELS: Record<NotificationChannel, string> = {
  push: '앱 푸시',
  email: '이메일',
  sms: '문자',
};

export function isTerminalStatus(status: WorkOrderStatus): boolean {
  return status === '완료' || status === '취소';
}

export const DISTRICT_ITEMS = Object.fromEntries(
  DISTRICTS.map((district) => [district, district]),
) as Record<(typeof DISTRICTS)[number], string>;

export const WORK_ORDER_DISTRICT_ITEMS = Object.fromEntries(
  WORK_ORDER_DISTRICTS.map((district) => [district, district]),
) as Record<District, string>;

export const CREW_ITEMS = Object.fromEntries(CREWS.map((crew) => [crew, crew])) as Record<
  Crew,
  string
>;

export const INITIAL_WORK_ORDERS: readonly WorkOrder[] = [
  {
    id: 'WO-2841',
    title: '보행 신호 제어함 전원 점검',
    district: '종로구',
    location: '광화문광장',
    priority: '긴급',
    status: '진행 중',
    crew: '시설 전기팀',
    slaDueAt: '오늘 12:30',
    updatedAt: '7분 전',
    progress: 84,
  },
  {
    id: 'WO-2838',
    title: '환승 안내 전광판 화면 복구',
    district: '중구',
    location: '서울역 환승센터',
    priority: '높음',
    status: '배정됨',
    crew: '도심 1팀',
    slaDueAt: '오늘 13:10',
    updatedAt: '12분 전',
    progress: 68,
  },
  {
    id: 'WO-2834',
    title: '터널 비상 조명 정기 점검',
    district: '용산구',
    location: '남산 1호 터널',
    priority: '높음',
    status: '대기',
    crew: '미배정',
    slaDueAt: '오늘 14:00',
    updatedAt: '18분 전',
    progress: 79,
  },
  {
    id: 'WO-2829',
    title: '공원 음수대 누수 확인',
    district: '용산구',
    location: '용산가족공원',
    priority: '보통',
    status: '접수',
    crew: '도심 2팀',
    slaDueAt: '오늘 15:40',
    updatedAt: '26분 전',
    progress: 34,
  },
  {
    id: 'WO-2825',
    title: '수변 산책로 난간 고정',
    district: '성동구',
    location: '성수 수변공원',
    priority: '높음',
    status: '진행 중',
    crew: '도로 보수팀',
    slaDueAt: '오늘 16:20',
    updatedAt: '31분 전',
    progress: 56,
  },
  {
    id: 'WO-2817',
    title: '지하보도 배수 펌프 소음 조사',
    district: '중구',
    location: '을지로 지하보도',
    priority: '보통',
    status: '배정됨',
    crew: '도심 1팀',
    slaDueAt: '오늘 17:00',
    updatedAt: '44분 전',
    progress: 41,
  },
  {
    id: 'WO-2812',
    title: '광장 벤치 파손 부품 교체',
    district: '종로구',
    location: '광화문광장',
    priority: '보통',
    status: '완료',
    crew: '도심 2팀',
    slaDueAt: '오늘 10:20',
    updatedAt: '1시간 전',
    progress: 100,
  },
  {
    id: 'WO-2808',
    title: '환승센터 승강기 호출 버튼 점검',
    district: '중구',
    location: '서울역 환승센터',
    priority: '긴급',
    status: '진행 중',
    crew: '시설 전기팀',
    slaDueAt: '오늘 11:50',
    updatedAt: '1시간 전',
    progress: 92,
  },
  {
    id: 'WO-2799',
    title: '공원 안내판 위치 조정',
    district: '성동구',
    location: '성수 수변공원',
    priority: '보통',
    status: '완료',
    crew: '도심 1팀',
    slaDueAt: '어제 17:30',
    updatedAt: '2시간 전',
    progress: 100,
  },
  {
    id: 'WO-2794',
    title: '터널 진입 차단기 센서 교정',
    district: '용산구',
    location: '남산 1호 터널',
    priority: '높음',
    status: '배정됨',
    crew: '도로 보수팀',
    slaDueAt: '오늘 18:00',
    updatedAt: '2시간 전',
    progress: 48,
  },
  {
    id: 'WO-2788',
    title: '지하보도 비상벨 통신 확인',
    district: '중구',
    location: '을지로 지하보도',
    priority: '보통',
    status: '취소',
    crew: '미배정',
    slaDueAt: '어제 16:00',
    updatedAt: '3시간 전',
    progress: 12,
  },
  {
    id: 'WO-2782',
    title: '광장 CCTV 시야 방해물 제거',
    district: '종로구',
    location: '광화문광장',
    priority: '높음',
    status: '접수',
    crew: '미배정',
    slaDueAt: '오늘 19:20',
    updatedAt: '3시간 전',
    progress: 22,
  },
];

export const CREW_CAPACITY = [
  { name: '도심 1팀', assignments: 4, capacity: 6, progress: 67, status: '현장 작업 중' },
  { name: '도심 2팀', assignments: 3, capacity: 5, progress: 60, status: '배정 가능' },
  { name: '시설 전기팀', assignments: 5, capacity: 5, progress: 100, status: '가동 한계' },
  { name: '도로 보수팀', assignments: 2, capacity: 4, progress: 50, status: '배정 가능' },
] as const;

export const ASSET_STATUSES = ['정상', '점검 필요', '운영 중단'] as const;
export type AssetStatus = (typeof ASSET_STATUSES)[number];

export interface Asset {
  district: District;
  health: number;
  id: string;
  lastInspection: string;
  location: string;
  name: string;
  nextInspection: string;
  openOrders: number;
  status: AssetStatus;
  type: string;
}

export const INITIAL_ASSETS: readonly Asset[] = [
  {
    district: '종로구',
    health: 96,
    id: 'AS-1042',
    lastInspection: '2026. 7. 21.',
    location: '광화문광장',
    name: '보행 신호 제어함 A-12',
    nextInspection: '2026. 8. 21.',
    openOrders: 1,
    status: '정상',
    type: '교통 제어',
  },
  {
    district: '중구',
    health: 78,
    id: 'AS-0988',
    lastInspection: '2026. 7. 18.',
    location: '서울역 환승센터',
    name: '승강기 2호기',
    nextInspection: '2026. 7. 29.',
    openOrders: 2,
    status: '점검 필요',
    type: '이동 편의',
  },
  {
    district: '용산구',
    health: 62,
    id: 'AS-0874',
    lastInspection: '2026. 7. 10.',
    location: '남산 1호 터널',
    name: '비상 조명 제어반 B',
    nextInspection: '2026. 7. 28.',
    openOrders: 1,
    status: '점검 필요',
    type: '안전 설비',
  },
  {
    district: '용산구',
    health: 91,
    id: 'AS-0761',
    lastInspection: '2026. 7. 23.',
    location: '용산가족공원',
    name: '음수대 급수 장치 04',
    nextInspection: '2026. 9. 1.',
    openOrders: 1,
    status: '정상',
    type: '공원 편의',
  },
  {
    district: '성동구',
    health: 100,
    id: 'AS-0645',
    lastInspection: '2026. 7. 25.',
    location: '성수 수변공원',
    name: '산책로 조명 분전반 C',
    nextInspection: '2026. 8. 25.',
    openOrders: 0,
    status: '정상',
    type: '전기 설비',
  },
  {
    district: '중구',
    health: 34,
    id: 'AS-0529',
    lastInspection: '2026. 7. 27.',
    location: '을지로 지하보도',
    name: '배수 펌프 1호기',
    nextInspection: '정비 후 재점검',
    openOrders: 1,
    status: '운영 중단',
    type: '배수 설비',
  },
];

export const MAINTENANCE_STATUSES = ['예정', '준비 중', '진행 중', '완료'] as const;
export type MaintenanceStatus = (typeof MAINTENANCE_STATUSES)[number];

export interface MaintenancePlan {
  asset: string;
  crew: Crew;
  district: District;
  duration: number;
  id: string;
  location: string;
  scheduledAt: string;
  status: MaintenanceStatus;
  title: string;
  workOrderCreated: boolean;
}

export const INITIAL_MAINTENANCE_PLANS: readonly MaintenancePlan[] = [
  {
    asset: '비상 조명 제어반 B',
    crew: '시설 전기팀',
    district: '용산구',
    duration: 90,
    id: 'MP-0718',
    location: '남산 1호 터널',
    scheduledAt: '7월 28일 · 09:00',
    status: '준비 중',
    title: '터널 비상 조명 회로 정기 점검',
    workOrderCreated: true,
  },
  {
    asset: '승강기 2호기',
    crew: '도심 1팀',
    district: '중구',
    duration: 120,
    id: 'MP-0719',
    location: '서울역 환승센터',
    scheduledAt: '7월 29일 · 01:00',
    status: '예정',
    title: '승강기 제어반 월간 점검',
    workOrderCreated: false,
  },
  {
    asset: '보행 신호 제어함 A-12',
    crew: '시설 전기팀',
    district: '종로구',
    duration: 60,
    id: 'MP-0720',
    location: '광화문광장',
    scheduledAt: '7월 30일 · 10:30',
    status: '예정',
    title: '보행 신호 제어함 배터리 교체',
    workOrderCreated: false,
  },
  {
    asset: '산책로 조명 분전반 C',
    crew: '도심 2팀',
    district: '성동구',
    duration: 45,
    id: 'MP-0715',
    location: '성수 수변공원',
    scheduledAt: '7월 27일 · 08:30',
    status: '진행 중',
    title: '수변 산책로 조명 점등 시험',
    workOrderCreated: true,
  },
  {
    asset: '음수대 급수 장치 04',
    crew: '도로 보수팀',
    district: '용산구',
    duration: 40,
    id: 'MP-0709',
    location: '용산가족공원',
    scheduledAt: '7월 26일 · 14:00',
    status: '완료',
    title: '음수대 필터 및 밸브 점검',
    workOrderCreated: true,
  },
];

export const REPORT_PERIODS = ['오늘', '7일', '30일'] as const;
export type ReportPeriod = (typeof REPORT_PERIODS)[number];

export interface ReportRow {
  assetAvailability: number;
  district: District;
  openOrders: number;
  period: ReportPeriod;
  plannedMaintenance: number;
  slaCompliance: number;
}

export const REPORT_ROWS: readonly ReportRow[] = REPORT_PERIODS.flatMap((period, periodIndex) =>
  WORK_ORDER_DISTRICTS.map((district, districtIndex) => ({
    assetAvailability: 99.4 - districtIndex * 0.6 - periodIndex * 0.15,
    district,
    openOrders: 7 + districtIndex * 2 + periodIndex * 8,
    period,
    plannedMaintenance: 96 - districtIndex * 4 + periodIndex,
    slaCompliance: 96.2 - districtIndex * 1.3 + periodIndex * 0.4,
  })),
);

export const ACTIVITY_CATEGORIES = ['전체', '작업', '자산', '배정', '시스템'] as const;
export type ActivityCategory = (typeof ACTIVITY_CATEGORIES)[number];

export interface ActivityLog {
  actor: string;
  after: string;
  before: string;
  category: Exclude<ActivityCategory, '전체'>;
  id: string;
  summary: string;
  system: boolean;
  target: string;
  timestamp: string;
}

export const ACTIVITY_LOGS: readonly ActivityLog[] = [
  {
    actor: '김민준 · 운영 관리자',
    after: '시설 전기팀',
    before: '미배정',
    category: '배정',
    id: 'EV-8421',
    summary: '작업 담당팀을 변경했습니다.',
    system: false,
    target: 'WO-2841',
    timestamp: '오늘 11:42',
  },
  {
    actor: 'Relay 자동화',
    after: 'SLA 위험',
    before: '주의',
    category: '시스템',
    id: 'EV-8418',
    summary: '응답 시간 임계값을 초과해 위험 알림을 생성했습니다.',
    system: true,
    target: 'WO-2808',
    timestamp: '오늘 11:36',
  },
  {
    actor: '박서연 · 시설 전기팀',
    after: '진행 중',
    before: '배정됨',
    category: '작업',
    id: 'EV-8412',
    summary: '현장 도착 후 작업을 시작했습니다.',
    system: false,
    target: 'WO-2841',
    timestamp: '오늘 11:29',
  },
  {
    actor: '이도윤 · 자산 담당자',
    after: '운영 중단',
    before: '점검 필요',
    category: '자산',
    id: 'EV-8407',
    summary: '안전 점검 결과에 따라 자산 상태를 변경했습니다.',
    system: false,
    target: 'AS-0529',
    timestamp: '오늘 11:10',
  },
  {
    actor: 'Relay 자동화',
    after: '도심 1팀',
    before: '미배정',
    category: '시스템',
    id: 'EV-8399',
    summary: '권역과 가용 용량을 기준으로 담당팀을 추천했습니다.',
    system: true,
    target: 'WO-2838',
    timestamp: '오늘 10:54',
  },
  {
    actor: '최지우 · 운영 관리자',
    after: '완료',
    before: '진행 중',
    category: '작업',
    id: 'EV-8385',
    summary: '현장 사진을 확인하고 작업을 완료 처리했습니다.',
    system: false,
    target: 'WO-2812',
    timestamp: '오늘 10:20',
  },
];
