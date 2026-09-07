import type { BlockDocEntry } from '../docs/types';

async function sharedSource() {
  return {
    filename: 'user-management-shared.tsx',
    source: (await import('./examples/user-management-shared.tsx?raw')).default,
    language: 'tsx',
  };
}

async function cardSource() {
  return {
    filename: 'block-card.tsx',
    source: (await import('./examples/block-card.tsx?raw')).default,
    language: 'tsx',
  };
}

export const BLOCK_DOCS = [
  {
    slug: 'profile-management',
    title: '프로필 관리',
    description: '프로필 이미지, 표시 이름과 자기소개를 수정하고 저장·취소합니다.',
    category: '사용자 관리',
    keywords: ['사용자', '프로필', '이미지', '자기소개', '저장', '취소'],
    components: ['panel', 'avatar', 'field', 'input', 'button'],
    guidance:
      'ProfileManagement의 onSave에 이미지 업로드와 프로필 저장 요청을 연결하십시오. 미리보기의 변경 사항은 현재 화면에만 반영됩니다.',
    load: async () => ({
      Component: (await import('./examples/profile-management')).default,
      source: (await import('./examples/profile-management.tsx?raw')).default,
      extraFiles: [await cardSource()],
    }),
  },
  {
    slug: 'account-management',
    title: '계정 관리',
    description: '로그인 이메일을 변경하고 연결 계정과 계정 탈퇴를 관리합니다.',
    category: '사용자 관리',
    keywords: ['계정', '이메일', '연결 계정', '탈퇴'],
    components: ['panel', 'field', 'input', 'otp-input', 'badge', 'button', 'dialog'],
    guidance:
      'actions에 이메일 변경 요청·코드 검증·외부 계정 연결·탈퇴 API를 연결하십시오. 연결 해제 시 남은 로그인 수단을 서버에서 검증해야 합니다. 미리보기의 기본 콜백은 통신 없이 화면 상태만 변경합니다.',
    load: async () => ({
      Component: (await import('./examples/account-management')).default,
      source: (await import('./examples/account-management.tsx?raw')).default,
      extraFiles: [await cardSource(), await sharedSource()],
    }),
  },
  {
    slug: 'change-password',
    title: '비밀번호 변경',
    description: '현재 비밀번호 확인과 새 비밀번호 입력, 다른 기기 로그아웃을 구성합니다.',
    category: '사용자 관리',
    keywords: ['비밀번호', '변경', '확인', '로그아웃'],
    components: ['panel', 'field', 'input', 'checkbox', 'button'],
    guidance:
      'onChangePassword에 재인증·비밀번호 변경·다른 세션 종료를 연결하십시오. minLength는 서비스 정책에 맞게 설정하고 서버에서도 검증하십시오. 미리보기의 기본 콜백은 비밀번호를 저장하거나 전송하지 않습니다.',
    load: async () => ({
      Component: (await import('./examples/change-password')).default,
      source: (await import('./examples/change-password.tsx?raw')).default,
      extraFiles: [await cardSource(), await sharedSource()],
    }),
  },
  {
    slug: 'two-factor-management',
    title: '2차 인증',
    description: '인증 앱 관리와 네 단계 등록 폼, 복구 코드 보관·재발급을 구성합니다.',
    category: '사용자 관리',
    keywords: ['2FA', '인증 앱', '등록', '스텝 폼', '복구 코드', 'QR'],
    components: ['panel', 'field', 'input', 'otp-input', 'checkbox', 'badge', 'button', 'dialog'],
    guidance:
      'TwoFactorRegistration은 독립적으로 사용할 수 있는 등록 스텝 폼입니다. 실제 설정 키·QR·복구 코드는 서버에서 제공하고 코드 검증 성공 시 2FA를 활성화하십시오. 이후 보관을 중단해도 활성 상태를 유지합니다. 미리보기 QR은 공개 예제 키이며 기본 콜백은 실제 재인증·TOTP 검증을 수행하지 않습니다.',
    load: async () => ({
      Component: (await import('./examples/two-factor-management')).default,
      source: (await import('./examples/two-factor-management.tsx?raw')).default,
      extraFiles: [
        await cardSource(),
        await sharedSource(),
        {
          filename: 'two-factor-registration.tsx',
          source: (await import('./examples/two-factor-registration.tsx?raw')).default,
          language: 'tsx',
        },
        {
          filename: 'authenticator-qr.svg',
          source: (await import('./examples/authenticator-qr.svg?raw')).default,
          language: 'html',
        },
      ],
    }),
  },
  {
    slug: 'session-history',
    title: '세션 기록',
    description: '로그인 기기와 최근 활동을 확인하고 다른 세션을 개별 또는 일괄 종료합니다.',
    category: '사용자 관리',
    keywords: ['세션', '기기', '접속', '기록', '로그아웃'],
    components: ['panel', 'segmented-control', 'badge', 'button', 'dialog'],
    guidance:
      'initialSessions에 서버에서 조회한 세션을 전달하고 onRevoke에 종료 요청을 연결하십시오. 현재 세션을 제외한 ID만 전달하며 성공한 뒤 목록을 갱신합니다. 서버는 계정 소유권과 세션 유효성을 검증해야 합니다. 미리보기 데이터는 샘플입니다.',
    load: async () => ({
      Component: (await import('./examples/session-history')).default,
      source: (await import('./examples/session-history.tsx?raw')).default,
      extraFiles: [await cardSource(), await sharedSource()],
    }),
  },
  {
    slug: 'account-settings',
    title: '계정 설정',
    description: '프로필 입력과 알림 설정을 한 폼에 묶고 변경 사항을 저장하거나 되돌립니다.',
    category: '설정',
    keywords: ['프로필', '계정', '설정', '저장', '취소'],
    components: ['field', 'input', 'switch', 'button'],
    guidance:
      '저장 버튼은 변경이 있을 때만 활성화됩니다. 예제는 현재 화면의 상태만 저장합니다. 서비스에서는 저장 요청의 대기·실패 상태를 연결하십시오.',
    load: async () => ({
      Component: (await import('./examples/account-settings')).default,
      source: (await import('./examples/account-settings.tsx?raw')).default,
    }),
  },
  {
    slug: 'verification-code',
    title: '인증 코드 확인',
    description: '코드 입력, 확인 버튼, 오류와 재입력 흐름을 하나의 인증 화면으로 구성합니다.',
    category: '인증',
    keywords: ['인증', 'OTP', '코드', '오류', '확인'],
    components: ['otp-input', 'field', 'alert', 'button'],
    guidance:
      '예제 코드 123456으로 일치 상태를 확인할 수 있습니다. 실제 인증은 서버에서 검증하고 만료·시도 제한을 적용하십시오. 이 예제는 인증이나 메시지 발송을 수행하지 않습니다.',
    load: async () => ({
      Component: (await import('./examples/verification-code')).default,
      source: (await import('./examples/verification-code.tsx?raw')).default,
    }),
  },
  {
    slug: 'member-directory',
    title: '팀원 목록',
    description: '검색과 상태 필터, 결과 개수, 테이블과 빈 결과를 연결한 관리 화면입니다.',
    category: '데이터 관리',
    keywords: ['팀원', '목록', '검색', '필터', '테이블', '빈 상태'],
    components: [
      'filter-bar',
      'search-input',
      'select',
      'table',
      'data-table-region',
      'empty-state',
    ],
    guidance:
      '이름·이메일 검색과 상태 필터를 함께 적용합니다. 예제는 메모리의 샘플 데이터를 사용합니다. 원격 목록에서는 데이터 조회와 페이지 이동을 소비 앱에 연결하십시오.',
    load: async () => ({
      Component: (await import('./examples/member-directory')).default,
      source: (await import('./examples/member-directory.tsx?raw')).default,
    }),
  },
] as const satisfies readonly BlockDocEntry[];

export const USER_MANAGEMENT_MENU = [
  { title: '프로필 관리', slug: 'profile-management' },
  { title: '계정 관리', slug: 'account-management' },
  { title: '비밀번호 변경', slug: 'change-password' },
  { title: '2차 인증', slug: 'two-factor-management' },
  { title: '세션 기록', slug: 'session-history' },
] as const;

export function getBlockDoc(slug: string): BlockDocEntry | undefined {
  return BLOCK_DOCS.find((entry) => entry.slug === slug);
}
