export type DeploymentStatus = 'succeeded' | 'running' | 'failed';
export const deploymentStatusLabels = { succeeded: '성공', running: '진행 중', failed: '실패' };
export const deploymentEnvironmentLabels = { staging: '스테이징', production: '운영' };
export interface DeploymentSummary {
  id: string;
  workflow?: string;
  branch?: string;
  commit?: string;
  revision: string;
  environment: 'staging' | 'production';
  actor: string;
  startedAt: string;
  duration: string;
  status: DeploymentStatus;
}
export interface DeploymentStage {
  id: string;
  title: string;
  status: DeploymentStatus | 'pending';
  duration: string;
  logs: readonly string[];
}
export interface DeploymentRecord extends DeploymentSummary {
  stages: readonly DeploymentStage[];
  events?: readonly WorkflowEvent[];
}
export interface WorkflowEvent {
  id: string;
  title: string;
  description: string;
  occurredAt: string;
  status: 'queued' | 'running' | 'succeeded' | 'failed' | 'warning' | 'retried';
  actor?: string;
  stageId?: string | undefined;
}
export const exampleDeployments: readonly DeploymentRecord[] = [
  {
    id: 'dep_103',
    workflow: '웹 서비스 배포',
    branch: 'main',
    commit: 'b7f3a21',
    revision: 'v1.2.1',
    environment: 'production',
    actor: '김서연',
    startedAt: '2026-09-09T01:30:00Z',
    duration: '48초',
    status: 'failed',
    events: [
      {
        id: 'queued',
        title: '배포 요청',
        description: '운영 환경에 v1.2.1 배포를 요청했습니다.',
        occurredAt: '2026-09-09T01:29:58Z',
        status: 'queued',
        actor: '김서연',
      },
      {
        id: 'validated',
        title: '설정 검증 완료',
        description: '배포 환경과 실행 권한을 확인했습니다.',
        occurredAt: '2026-09-09T01:30:08Z',
        status: 'succeeded',
        stageId: 'validate',
      },
      {
        id: 'failed',
        title: '빌드 실패',
        description: 'PUBLIC_API_URL 환경 변수가 없어 실행을 중단했습니다.',
        occurredAt: '2026-09-09T01:30:48Z',
        status: 'failed',
        stageId: 'build',
      },
    ],
    stages: [
      {
        id: 'validate',
        title: '설정 검증',
        status: 'succeeded',
        duration: '8초',
        logs: ['[10:30:00] 환경 설정 확인', '[10:30:08] 검증 완료'],
      },
      {
        id: 'build',
        title: '빌드',
        status: 'failed',
        duration: '40초',
        logs: [
          '[10:30:08] 의존성 설치 완료',
          '[10:30:48] 오류: PUBLIC_API_URL 환경 변수가 없습니다.',
          '[10:30:48] 빌드 종료 (exit 1)',
        ],
      },
      { id: 'deploy', title: '배포', status: 'pending', duration: '실행 전', logs: [] },
    ],
  },
  {
    id: 'dep_102',
    workflow: '웹 서비스 배포',
    branch: 'release/1.2.1',
    commit: 'b7f3a21',
    revision: 'v1.2.1',
    environment: 'staging',
    actor: '박민수',
    startedAt: '2026-09-09T01:20:00Z',
    duration: '진행 중',
    status: 'running',
    events: [
      {
        id: 'queued',
        title: '실행 대기',
        description: '스테이징 배포 작업이 대기열에 등록됐습니다.',
        occurredAt: '2026-09-09T01:19:58Z',
        status: 'queued',
        actor: '박민수',
      },
      {
        id: 'validated',
        title: '설정 검증 완료',
        description: '환경 설정과 실행 권한을 확인했습니다.',
        occurredAt: '2026-09-09T01:20:06Z',
        status: 'succeeded',
        stageId: 'validate',
      },
      {
        id: 'warning',
        title: '패키지 캐시 만료',
        description: '캐시를 사용하지 않고 패키지를 내려받습니다.',
        occurredAt: '2026-09-09T01:20:07Z',
        status: 'warning',
        stageId: 'build',
      },
      {
        id: 'failed',
        title: '패키지 다운로드 실패',
        description: '패키지 저장소 연결 시간이 초과됐습니다.',
        occurredAt: '2026-09-09T01:20:12Z',
        status: 'failed',
        stageId: 'build',
      },
      {
        id: 'retried',
        title: '빌드 재시도 요청',
        description: '같은 커밋으로 빌드를 다시 시작합니다. 두 번째 시도입니다.',
        occurredAt: '2026-09-09T01:20:20Z',
        status: 'retried',
        actor: '박민수',
        stageId: 'build',
      },
      {
        id: 'running',
        title: '빌드 실행 중',
        description: '패키지 설치를 완료하고 소스 파일을 빌드하고 있습니다.',
        occurredAt: '2026-09-09T01:20:27Z',
        status: 'running',
        stageId: 'build',
      },
    ],
    stages: [
      {
        id: 'validate',
        title: '설정 검증',
        status: 'succeeded',
        duration: '6초',
        logs: ['[10:20:06] 설정 검증 완료'],
      },
      {
        id: 'build',
        title: '빌드',
        status: 'running',
        duration: '진행 중',
        logs: [
          '[10:20:07] 패키지 캐시 만료',
          '[10:20:12] 패키지 저장소 연결 시간 초과',
          '[10:20:20] 빌드 재시도 (attempt 2)',
          '[10:20:26] 의존성 설치 완료',
          '[10:20:27] 소스 파일을 빌드하고 있습니다.',
        ],
      },
      { id: 'deploy', title: '배포', status: 'pending', duration: '실행 전', logs: [] },
    ],
  },
  {
    id: 'dep_101',
    workflow: '웹 서비스 배포',
    branch: 'main',
    commit: '8c12e90',
    revision: 'v1.2.0',
    environment: 'production',
    actor: '김서연',
    startedAt: '2026-09-08T08:00:00Z',
    duration: '1분 12초',
    status: 'succeeded',
    events: [
      {
        id: 'queued',
        title: '배포 요청',
        description: '운영 환경에 v1.2.0 배포를 요청했습니다.',
        occurredAt: '2026-09-08T07:59:58Z',
        status: 'queued',
        actor: '김서연',
      },
      {
        id: 'validated',
        title: '설정 검증 완료',
        description: '배포 환경과 실행 권한을 확인했습니다.',
        occurredAt: '2026-09-08T08:00:07Z',
        status: 'succeeded',
        stageId: 'validate',
      },
      {
        id: 'built',
        title: '빌드 완료',
        description: '배포 파일을 생성했습니다.',
        occurredAt: '2026-09-08T08:00:52Z',
        status: 'succeeded',
        stageId: 'build',
      },
      {
        id: 'deployed',
        title: '배포 완료',
        description: '새 버전을 적용하고 상태 확인을 마쳤습니다.',
        occurredAt: '2026-09-08T08:01:12Z',
        status: 'succeeded',
        stageId: 'deploy',
      },
    ],
    stages: [
      {
        id: 'validate',
        title: '설정 검증',
        status: 'succeeded',
        duration: '7초',
        logs: ['[17:00:07] 검증 완료'],
      },
      {
        id: 'build',
        title: '빌드',
        status: 'succeeded',
        duration: '45초',
        logs: ['[17:00:52] 빌드 완료'],
      },
      {
        id: 'deploy',
        title: '배포',
        status: 'succeeded',
        duration: '20초',
        logs: ['[17:01:00] 새 버전 적용', '[17:01:12] 상태 확인 완료'],
      },
    ],
  },
];
