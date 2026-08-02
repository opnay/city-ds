export const DISTRICTS = ['전체 자치구', '종로구', '중구', '용산구', '성동구', '영등포구'] as const;
export const WORK_ORDER_STATUSES = ['접수', '배정됨', '진행 중', '대기', '완료'] as const;
export const CREWS = ['도심 도로팀', '도심 시설팀', '전기 대응팀', '배수 대응팀'] as const;

export type DistrictFilter = (typeof DISTRICTS)[number];
export type District = Exclude<DistrictFilter, '전체 자치구'>;
export type WorkOrderStatus = (typeof WORK_ORDER_STATUSES)[number];
export type Crew = (typeof CREWS)[number];
export type WorkOrderRisk = 'critical' | 'high' | 'normal';
export type StatusFilter = 'all' | 'attention' | 'active' | 'complete';
export type SortDirection = 'asc' | 'desc' | false;

export interface WorkOrderActivity {
  at: string;
  description: string;
}

export interface WorkOrder {
  activities: WorkOrderActivity[];
  blocker?: string | undefined;
  crew: Crew | null;
  description: string;
  district: District;
  dueLabel: string;
  dueMinutes: number;
  id: string;
  location: string;
  risk: WorkOrderRisk;
  status: WorkOrderStatus;
  title: string;
  updatedAt: string;
}

export interface WorkOrderFilters {
  district: DistrictFilter;
  query: string;
  sortDirection: SortDirection;
  status: StatusFilter;
}

export const DISTRICT_ITEMS = Object.fromEntries(
  DISTRICTS.map((district) => [district, district]),
) as Record<DistrictFilter, string>;

export const STATUS_ITEMS: Record<StatusFilter, string> = {
  all: '전체 상태',
  attention: '조치 필요',
  active: '진행 중',
  complete: '완료',
};

export const CREW_ITEMS = Object.fromEntries(CREWS.map((crew) => [crew, crew])) as Record<
  Crew,
  string
>;

export const INITIAL_WORK_ORDERS: readonly WorkOrder[] = [
  {
    activities: [
      { at: '10:02', description: '도로 침하 범위 현장 사진 3장이 등록되었습니다.' },
      { at: '09:54', description: '종로구 도로과가 긴급 작업을 요청했습니다.' },
      { at: '09:47', description: '120 다산콜 신고로 작업이 생성되었습니다.' },
    ],
    blocker: '담당팀을 배정해야 현장 조치와 완료 처리를 시작할 수 있습니다.',
    crew: null,
    description:
      '종로3가 교차로 남측 1차로에 도로 침하가 발생했습니다. 차량 통행 중 추가 파손 위험이 있어 우선 통제가 필요합니다.',
    district: '종로구',
    dueLabel: '24분 남음',
    dueMinutes: 24,
    id: 'WO-3127',
    location: '종로3가 교차로',
    risk: 'critical',
    status: '접수',
    title: '도로 침하 안전 조치',
    updatedAt: '방금 전',
  },
  {
    activities: [
      { at: '09:58', description: '현장팀이 가로등 분전함 점검을 시작했습니다.' },
      { at: '09:31', description: '야간 순찰 점검 결과가 접수되었습니다.' },
    ],
    crew: '전기 대응팀',
    description: '보행로 가로등 3기가 반복 점멸합니다. 전원 계통과 안정기 상태를 확인합니다.',
    district: '성동구',
    dueLabel: '1시간 18분 남음',
    dueMinutes: 78,
    id: 'WO-3125',
    location: '뚝섬로 보행로',
    risk: 'high',
    status: '진행 중',
    title: '보행로 가로등 점멸 점검',
    updatedAt: '4분 전',
  },
  {
    activities: [
      { at: '09:46', description: '배수 대응팀 배정이 완료되었습니다.' },
      { at: '09:20', description: '공원관리소가 배수 지연을 신고했습니다.' },
    ],
    crew: '배수 대응팀',
    description: '우천 후 산책로 배수구 2곳의 배수가 지연되어 유입구 막힘 여부를 확인합니다.',
    district: '영등포구',
    dueLabel: '1시간 42분 남음',
    dueMinutes: 102,
    id: 'WO-3124',
    location: '여의도공원 동측 산책로',
    risk: 'high',
    status: '배정됨',
    title: '산책로 배수구 막힘 확인',
    updatedAt: '16분 전',
  },
  {
    activities: [
      { at: '09:38', description: '시설관리소가 임시 안전띠를 설치했습니다.' },
      { at: '09:12', description: '파손 신고가 작업 요청으로 전환되었습니다.' },
    ],
    blocker: '교체 부품 입고 예정 시각은 11:30입니다.',
    crew: '도심 시설팀',
    description: '환승센터 2층 연결 통로의 유리 안내판 모서리가 파손되어 교체가 필요합니다.',
    district: '중구',
    dueLabel: '2시간 6분 남음',
    dueMinutes: 126,
    id: 'WO-3121',
    location: '서울역 환승센터',
    risk: 'high',
    status: '대기',
    title: '환승 안내판 파손 교체',
    updatedAt: '24분 전',
  },
  {
    activities: [
      { at: '09:27', description: '도로 순찰팀이 난간 흔들림을 확인했습니다.' },
      { at: '08:58', description: '시민 안전 신고가 접수되었습니다.' },
    ],
    crew: '도심 도로팀',
    description: '보행자 안전 난간 연결부 1곳이 느슨해져 고정 볼트와 지지부를 점검합니다.',
    district: '용산구',
    dueLabel: '2시간 38분 남음',
    dueMinutes: 158,
    id: 'WO-3119',
    location: '한강대로 북측 보도',
    risk: 'normal',
    status: '진행 중',
    title: '보행 안전 난간 고정',
    updatedAt: '35분 전',
  },
  {
    activities: [
      { at: '09:11', description: '시설 전원 차단 가능 시간을 확인했습니다.' },
      { at: '08:42', description: '정기 점검에서 펌프 소음이 확인되었습니다.' },
    ],
    crew: '배수 대응팀',
    description: '지하보도 배수 펌프에서 평소보다 큰 진동음이 발생해 베어링 상태를 확인합니다.',
    district: '중구',
    dueLabel: '3시간 12분 남음',
    dueMinutes: 192,
    id: 'WO-3116',
    location: '을지로입구 지하보도',
    risk: 'normal',
    status: '배정됨',
    title: '배수 펌프 진동음 점검',
    updatedAt: '51분 전',
  },
  {
    activities: [
      { at: '08:52', description: '현장 확인 결과 사진과 교체 수량이 등록되었습니다.' },
      { at: '08:18', description: '공원 순찰 점검이 접수되었습니다.' },
    ],
    crew: null,
    description: '공원 목재 벤치의 좌판 일부가 갈라져 교체 범위와 자재 수량을 확인합니다.',
    district: '성동구',
    dueLabel: '4시간 5분 남음',
    dueMinutes: 245,
    id: 'WO-3112',
    location: '서울숲 가족마당',
    risk: 'normal',
    status: '접수',
    title: '공원 벤치 파손 확인',
    updatedAt: '1시간 전',
  },
  {
    activities: [
      { at: '08:41', description: '교체 작업 후 조도 측정이 완료되었습니다.' },
      { at: '07:56', description: '전기 대응팀이 현장에 도착했습니다.' },
    ],
    crew: '전기 대응팀',
    description: '지하보도 출입구 비상 조명을 교체하고 정상 점등을 확인했습니다.',
    district: '종로구',
    dueLabel: '기한 내 완료',
    dueMinutes: 310,
    id: 'WO-3108',
    location: '종각역 4번 출입구',
    risk: 'normal',
    status: '완료',
    title: '비상 조명 교체',
    updatedAt: '1시간 21분 전',
  },
  {
    activities: [
      { at: '08:23', description: '신호 제어함 통신 상태가 정상으로 확인되었습니다.' },
      { at: '07:48', description: '교통관제센터 점검 요청이 접수되었습니다.' },
    ],
    crew: '전기 대응팀',
    description: '보행 신호 제어함의 원격 통신 지연을 확인하고 연결 상태를 점검합니다.',
    district: '영등포구',
    dueLabel: '5시간 20분 남음',
    dueMinutes: 320,
    id: 'WO-3105',
    location: '영등포로 교차로',
    risk: 'normal',
    status: '진행 중',
    title: '보행 신호 제어함 통신 점검',
    updatedAt: '1시간 39분 전',
  },
  {
    activities: [
      { at: '08:10', description: '도심 시설팀이 교체 작업을 완료했습니다.' },
      { at: '07:32', description: '현장 사진과 파손 위치가 등록되었습니다.' },
    ],
    crew: '도심 시설팀',
    description: '공원 동측 진입로의 방향 안내판 지지대를 교체했습니다.',
    district: '용산구',
    dueLabel: '기한 내 완료',
    dueMinutes: 360,
    id: 'WO-3101',
    location: '용산가족공원 동문',
    risk: 'normal',
    status: '완료',
    title: '공원 안내판 지지대 교체',
    updatedAt: '1시간 52분 전',
  },
  {
    activities: [
      { at: '07:58', description: '도로 보수 자재 수량을 확인했습니다.' },
      { at: '07:21', description: '아침 순찰에서 보도블록 들뜸이 확인되었습니다.' },
    ],
    crew: '도심 도로팀',
    description: '버스정류장 앞 보도블록 6장이 들떠 보행 안전 조치 후 재시공합니다.',
    district: '중구',
    dueLabel: '6시간 18분 남음',
    dueMinutes: 378,
    id: 'WO-3098',
    location: '퇴계로 버스정류장',
    risk: 'normal',
    status: '배정됨',
    title: '보도블록 들뜸 보수',
    updatedAt: '2시간 4분 전',
  },
  {
    activities: [
      { at: '07:42', description: '청소 작업 후 배수 상태가 정상으로 확인되었습니다.' },
      { at: '07:03', description: '새벽 순찰 결과가 등록되었습니다.' },
    ],
    crew: '배수 대응팀',
    description: '빗물받이 주변 낙엽과 이물질을 제거하고 배수 상태를 확인했습니다.',
    district: '성동구',
    dueLabel: '기한 내 완료',
    dueMinutes: 420,
    id: 'WO-3093',
    location: '왕십리로 남측',
    risk: 'normal',
    status: '완료',
    title: '빗물받이 이물질 제거',
    updatedAt: '2시간 20분 전',
  },
];

const riskRank: Record<WorkOrderRisk, number> = {
  critical: 0,
  high: 1,
  normal: 2,
};

function isAttentionRequired(order: WorkOrder): boolean {
  return order.status !== '완료' && (order.risk !== 'normal' || order.crew === null);
}

function matchesStatus(order: WorkOrder, status: StatusFilter): boolean {
  if (status === 'attention') return isAttentionRequired(order);
  if (status === 'active') return order.status === '배정됨' || order.status === '진행 중';
  if (status === 'complete') return order.status === '완료';
  return true;
}

function compareByOperationalPriority(left: WorkOrder, right: WorkOrder): number {
  const completionDifference = Number(left.status === '완료') - Number(right.status === '완료');
  if (completionDifference !== 0) return completionDifference;

  const attentionDifference =
    Number(!isAttentionRequired(left)) - Number(!isAttentionRequired(right));
  if (attentionDifference !== 0) return attentionDifference;

  return riskRank[left.risk] - riskRank[right.risk] || left.dueMinutes - right.dueMinutes;
}

export function selectWorkOrders(
  orders: readonly WorkOrder[],
  filters: WorkOrderFilters,
): WorkOrder[] {
  const normalizedQuery = filters.query.trim().toLocaleLowerCase('ko-KR');

  return orders
    .filter((order) => filters.district === '전체 자치구' || order.district === filters.district)
    .filter((order) => matchesStatus(order, filters.status))
    .filter((order) => {
      if (normalizedQuery.length === 0) return true;

      return [order.id, order.title, order.district, order.location, order.crew ?? '미배정']
        .join(' ')
        .toLocaleLowerCase('ko-KR')
        .includes(normalizedQuery);
    })
    .sort((left, right) => {
      if (filters.sortDirection === 'asc') return left.dueMinutes - right.dueMinutes;
      if (filters.sortDirection === 'desc') return right.dueMinutes - left.dueMinutes;
      return compareByOperationalPriority(left, right);
    });
}

export function countAttentionOrders(orders: readonly WorkOrder[]): number {
  return orders.filter(isAttentionRequired).length;
}

export function assignCrew(
  orders: readonly WorkOrder[],
  workOrderId: string,
  crew: Crew,
): WorkOrder[] {
  return orders.map((order) =>
    order.id === workOrderId
      ? {
          ...order,
          activities: [
            { at: '10:07', description: `${crew} 배정이 완료되었습니다.` },
            ...order.activities,
          ],
          blocker: undefined,
          crew,
          status: order.status === '접수' ? '배정됨' : order.status,
          updatedAt: '방금 전',
        }
      : order,
  );
}
