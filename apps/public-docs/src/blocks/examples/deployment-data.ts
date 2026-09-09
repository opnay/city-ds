export type DeploymentStatus = 'succeeded' | 'running' | 'failed';
export const deploymentStatusLabels = { succeeded: '성공', running: '진행 중', failed: '실패' };
export const deploymentEnvironmentLabels = { staging: '스테이징', production: '운영' };
export interface DeploymentSummary {
  id: string;
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
}
export const exampleDeployments: readonly DeploymentRecord[] = [
  {
    id: 'dep_103',
    revision: 'v1.2.1',
    environment: 'production',
    actor: '김서연',
    startedAt: '2026-09-09T01:30:00Z',
    duration: '48초',
    status: 'failed',
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
    revision: 'v1.2.1',
    environment: 'staging',
    actor: '박민수',
    startedAt: '2026-09-09T01:20:00Z',
    duration: '진행 중',
    status: 'running',
    stages: [
      {
        id: 'validate',
        title: '설정 검증',
        status: 'succeeded',
        duration: '6초',
        logs: ['[10:20:00] 설정 검증 완료'],
      },
      {
        id: 'build',
        title: '빌드',
        status: 'running',
        duration: '진행 중',
        logs: ['[10:20:06] 의존성 설치 완료', '[10:20:07] 소스 파일을 빌드하고 있습니다.'],
      },
      { id: 'deploy', title: '배포', status: 'pending', duration: '실행 전', logs: [] },
    ],
  },
  {
    id: 'dep_101',
    revision: 'v1.2.0',
    environment: 'production',
    actor: '김서연',
    startedAt: '2026-09-08T08:00:00Z',
    duration: '1분 12초',
    status: 'succeeded',
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
