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
    slug: 'project-settings',
    optionAxes: [
      { name: 'mode', control: 'segmented', defaultValue: 'edit', values: ['edit', 'read-only'] },
    ],
    title: '프로젝트 설정',
    description: '이름과 설명을 수정하고 프로젝트 ID를 복사합니다.',
    category: '프로젝트',
    scope: '팀',
    keywords: ['프로젝트', '설정', '이름', '설명'],
    components: ['panel', 'field', 'input', 'data-list', 'button'],
    guidance:
      'initialProject는 편집 시작 시의 값입니다. 프로젝트 전환 시 key에 프로젝트 ID를 지정하십시오. onSave 성공 후에만 저장 기준을 갱신하며 실패 시 입력을 보존합니다. canManage는 UI 권한이며 서버에서 프로젝트 소유권과 변경 권한을 검증하십시오.',
    load: async () => ({
      Component: (await import('./examples/project-settings')).default,
      source: (await import('./examples/project-settings.tsx?raw')).default,
      extraFiles: [await cardSource()],
    }),
  },
  {
    slug: 'environment-variables',
    optionAxes: [
      { name: 'mode', control: 'segmented', defaultValue: 'edit', values: ['edit', 'read-only'] },
    ],
    title: '환경 변수 관리',
    description: '환경별 설정 값을 추가·교체·삭제하고 민감 값을 마스킹합니다.',
    category: '프로젝트',
    scope: '팀',
    keywords: ['프로젝트', '환경', '변수', '설정'],
    components: [
      'panel',
      'field',
      'input',
      'segmented-control',
      'checkbox',
      'dialog',
      'badge',
      'button',
    ],
    guidance:
      'variables의 민감 값 레코드에는 원문 value가 없습니다. 편집 시 교체할 값을 입력하고 onSave에만 전달합니다. onSave·onRemove 성공 후 소비자가 variables를 갱신하십시오. 서버에서 같은 환경의 이름 중복과 권한을 검증하고 민감 값을 암호화하며 로그·조회 응답에 포함하지 마십시오. 이 예제는 빈 값과 소문자 이름을 허용하지 않는 정책입니다. 실제 적용 시점은 소비 서비스의 배포 정책에 맞추십시오.',
    load: async () => ({
      Component: (await import('./examples/environment-variables')).default,
      source: (await import('./examples/environment-variables.tsx?raw')).default,
      extraFiles: [await cardSource()],
    }),
  },
  {
    slug: 'deployment-history',
    title: '배포 기록',
    description: '환경·상태·검색어로 기록을 찾고 배포 상세로 이동합니다.',
    category: '프로젝트',
    scope: '팀',
    keywords: ['프로젝트', '배포', '기록', '필터'],
    components: [
      'panel',
      'filter-bar',
      'field',
      'search-input',
      'select',
      'data-table-region',
      'table',
      'badge',
      'button',
      'skeleton',
      'stepper',
      'data-list',
    ],
    guidance:
      'records는 표시 순서대로 렌더링하며 예제는 최신순입니다. 필터는 전달받은 목록에만 적용됩니다. 서버 검색과 페이지 이동은 소비자가 연결하십시오. onView(id)는 상세 페이지나 패널로 연결합니다. 미리보기에서는 선택한 배포 상세를 아래에 표시합니다. 시각은 Asia/Seoul 기준입니다.',
    load: async () => ({
      Component: (await import('./examples/deployment-history')).default,
      source: (await import('./examples/deployment-history.tsx?raw')).default,
      extraFiles: [
        await cardSource(),
        {
          filename: 'deployment-data.ts',
          source: (await import('./examples/deployment-data.ts?raw')).default,
          language: 'ts',
        },
        {
          filename: 'deployment-details.tsx',
          source: (await import('./examples/deployment-details.tsx?raw')).default,
          language: 'tsx',
        },
      ],
    }),
  },
  {
    slug: 'deployment-details',
    title: '배포 상세',
    description: '단계별 상태·소요 시간·실패 원인과 실행 로그를 확인합니다.',
    category: '프로젝트',
    scope: '팀',
    keywords: ['프로젝트', '배포', '상세', '로그'],
    components: ['panel', 'stepper', 'data-list', 'badge', 'button', 'skeleton'],
    guidance:
      'deployment의 단계·소요 시간·로그는 서버에서 확인한 값입니다. 실행 상태와 선택한 로그 단계는 독립적입니다. 서버에서 로그의 민감 값을 제거하고 조회 권한을 확인하십시오. 로그 스트리밍·폴링·대용량 로그 페이지 처리는 소비자가 연결합니다. 미리보기는 고정 샘플이며 실제 배포를 조회하지 않습니다.',
    load: async () => ({
      Component: (await import('./examples/deployment-details')).default,
      source: (await import('./examples/deployment-details.tsx?raw')).default,
      extraFiles: [
        await cardSource(),
        {
          filename: 'deployment-data.ts',
          source: (await import('./examples/deployment-data.ts?raw')).default,
          language: 'ts',
        },
      ],
    }),
  },
  {
    slug: 'project-creation',
    title: '프로젝트 생성',
    description: '프로젝트 이름과 초대할 팀원을 입력하고 확인한 뒤 생성합니다.',
    category: '프로젝트',
    scope: '팀',
    keywords: ['프로젝트', '생성', '팀원', '초대', '단계'],
    components: ['stepper', 'panel', 'field', 'input', 'data-list', 'button'],
    guidance:
      'onCreate에 정리된 프로젝트 이름과 선택 입력인 초대 이메일을 전달합니다. 성공 시에만 완료로 전환하고 실패 시 입력을 보존합니다. 권한, 이름 중복, 초대 정책은 서버에서 검증하고 중복 생성 방지 키를 요청에 연결하십시오. 미리보기는 컴포넌트 조합과 단계별 배치를 보여주는 예제입니다.',
    load: async () => ({
      Component: (await import('./examples/project-creation')).default,
      source: (await import('./examples/project-creation.tsx?raw')).default,
      extraFiles: [
        await cardSource(),
        {
          filename: 'project-flow.tsx',
          source: (await import('./examples/project-flow.tsx?raw')).default,
          language: 'tsx',
        },
      ],
    }),
  },
  {
    slug: 'deployment-preparation',
    title: '배포 준비',
    description: '환경을 선택하고 설정과 변경 사항을 검증한 뒤 배포합니다.',
    category: '프로젝트',
    scope: '팀',
    keywords: ['프로젝트', '배포', '환경', '운영', '검증'],
    components: ['stepper', 'panel', 'radio-group', 'checkbox', 'data-list', 'button'],
    guidance:
      'revision은 배포할 버전 식별자입니다. onValidate는 환경·버전의 설정과 권한 검증에 성공할 때 resolve하며, onDeploy는 배포 완료를 확인한 뒤 resolve합니다. 환경 또는 버전 변경 시 이전 검증은 사용할 수 없습니다. 실제 실행 직전 권한·검증 유효성을 서버에서 재확인하고, 같은 실행을 중복 생성하지 않도록 idempotency key와 상태 조회를 연결하십시오. 미리보기는 콜백만 모의 실행하며 실제 배포를 하지 않습니다.',
    load: async () => ({
      Component: (await import('./examples/deployment-preparation')).default,
      source: (await import('./examples/deployment-preparation.tsx?raw')).default,
      extraFiles: [
        await cardSource(),
        {
          filename: 'project-flow.tsx',
          source: (await import('./examples/project-flow.tsx?raw')).default,
          language: 'tsx',
        },
      ],
    }),
  },

  {
    slug: 'payment-methods',
    optionAxes: [
      { name: 'mode', control: 'segmented', defaultValue: 'edit', values: ['edit', 'read-only'] },
    ],
    title: '결제 수단 관리',
    description: '카드를 추가하고 기본 결제 수단을 변경하거나 등록한 카드를 삭제합니다.',
    category: '구독·결제',
    scope: '사용자·팀',
    keywords: ['결제', '카드', '수단', '기본', '등록', '삭제'],
    components: [
      'panel',
      'badge',
      'button',
      'dialog',
      'field',
      'input',
      'alert',
      'empty-state',
      'skeleton',
      'toast',
      'tooltip',
    ],
    guidance:
      'methods에는 마스킹된 결제 수단만 전달합니다. 등록 폼 제출 시 onAdd에 입력값을 전달하고, onSetDefault와 onRemove는 서버 요청 성공 후 methods를 갱신합니다. 기본 카드는 다른 카드를 기본으로 설정한 뒤 삭제하는 예제 정책입니다. 실제 삭제 가능 여부와 소유권은 서버에서 검증합니다. loading은 초기 조회, canManage는 관리 권한입니다. 등록 폼은 흐름을 확인하는 예제입니다. 서비스에서는 결제 제공사의 보안 입력 및 토큰화 흐름으로 교체합니다. 미리보기에서는 테스트 번호 4242 4242 4242 4242를 사용할 수 있으며 입력값 중 이름·마지막 네 자리·유효기간만 목록에 남습니다.',
    load: async () => ({
      Component: (await import('./examples/payment-methods')).default,
      source: (await import('./examples/payment-methods.tsx?raw')).default,
      extraFiles: [await cardSource()],
    }),
  },
  {
    slug: 'payment-history',
    title: '결제 기록',
    description: '결제일, 내역, 금액, 결제 수단과 처리 상태를 확인합니다.',
    category: '구독·결제',
    scope: '사용자·팀',
    keywords: ['결제', '기록', '청구', '환불', '실패'],
    components: [
      'panel',
      'data-table-region',
      'table',
      'badge',
      'empty-state',
      'skeleton',
      'alert',
      'button',
    ],
    guidance:
      'records에 서버에서 조회한 기록을 최신순으로 전달합니다. 금액은 각 결제 시도의 금액이며 상태와 함께 읽습니다. loading은 초기 조회, error와 onRetry는 조회 실패와 재시도를 표현합니다. 조회 권한, 기간별 조회와 페이지 이동은 소비 프로젝트가 담당합니다. 미리보기 데이터는 샘플입니다.',
    load: async () => ({
      Component: (await import('./examples/payment-history')).default,
      source: (await import('./examples/payment-history.tsx?raw')).default,
      extraFiles: [await cardSource()],
    }),
  },
  {
    slug: 'plan-selection',
    title: '플랜 선택',
    description: '월간·연간 가격과 기능을 비교하고 다음 단계로 진행합니다.',
    category: '구독·결제',
    scope: '사용자·팀',
    keywords: ['구독', '결제', '플랜', '요금', '해지'],
    components: [
      'panel',
      'selection-card',
      'radio-group',
      'segmented-control',
      'badge',
      'button',
      'alert',
      'empty-state',
      'skeleton',
      'toast',
    ],
    guidance:
      'plans에 서버에서 확인한 가격·기능·적용 조건을 전달하고 onContinue에 결제 또는 변경 확인 화면을 연결합니다. current에는 현재 플랜과 결제 주기를 전달합니다. 무료처럼 주기가 없는 플랜은 hasBillingCycle을 false로 전달합니다. loading은 초기 조회, canManage는 관리 권한을 표현합니다. yearlySavings는 월간 대비 절약액, notices는 블록 하단 공통 안내를 제공합니다. 가격 계산과 실제 청구는 소비 프로젝트가 담당합니다. 미리보기는 결제를 진행하지 않습니다.',
    load: async () => ({
      Component: (await import('./examples/plan-selection')).default,
      source: (await import('./examples/plan-selection.tsx?raw')).default,
      extraFiles: [await cardSource()],
    }),
  },
  {
    slug: 'subscription-management',
    optionAxes: [
      {
        name: 'subscription',
        control: 'select',
        defaultValue: 'active',
        values: ['free', 'active', 'trial', 'past-due', 'canceling'],
      },
    ],
    title: '구독 관리',
    description: '무료·구독·체험·결제 실패·해지 예약 상태와 다음 행동을 구성합니다.',
    category: '구독·결제',
    scope: '사용자·팀',
    keywords: ['구독', '결제', '플랜', '요금', '해지'],
    components: ['data-list', 'panel', 'badge', 'button', 'dialog', 'alert', 'skeleton', 'toast'],
    guidance:
      'subscription에 서버의 최신 구독 상태·청구 금액·결제일·이용 종료일을 전달합니다. 미리보기의 플랜 선택·변경 버튼은 onPlanSelection 더미 콜백으로 처리합니다. 소비 앱은 planSelectionHref로 이동 경로를 연결하고 onAction은 해지 예약·예약 취소·결제 재시도를 처리합니다. loading과 canManage로 조회 및 권한 상태를 표현합니다. 요청 성공 후 서버가 반환한 상태로 subscription을 갱신합니다. 재청구는 서버에서 중복 요청을 방지합니다. 예제의 무료 전환·자동 결제 정책과 날짜는 샘플이므로 실제 정책에 맞게 안내를 수정합니다.',
    load: async () => ({
      Component: (await import('./examples/subscription-management')).default,
      source: (await import('./examples/subscription-management.tsx?raw')).default,
      extraFiles: [await cardSource()],
    }),
  },
  {
    slug: 'profile-management',
    title: '프로필 관리',
    description: '프로필 이미지, 표시 이름과 자기소개를 수정하고 저장·취소합니다.',
    category: '계정 관리',
    scope: '사용자',
    keywords: ['사용자', '프로필', '이미지', '자기소개', '저장', '취소'],
    components: ['panel', 'avatar', 'field', 'input', 'button', 'toast'],
    guidance:
      'ProfileManagement의 onSave에 이미지 업로드와 프로필 저장 요청을 연결하십시오. 이미지 선택은 InputGroup 안의 변경 버튼과 iconOnly 제거 버튼으로 합성하며, Avatar는 행의 반대편에 배치합니다. 미리보기의 변경 사항은 현재 화면에만 반영됩니다.',
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
    category: '계정 관리',
    scope: '사용자',
    keywords: ['계정', '이메일', '연결 계정', '탈퇴'],
    components: [
      'panel',
      'field',
      'input',
      'otp-input',
      'badge',
      'button',
      'alert-dialog',
      'toast',
    ],
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
    category: '계정 보안',
    scope: '사용자',
    keywords: ['비밀번호', '변경', '확인', '로그아웃'],
    components: ['panel', 'field', 'input', 'checkbox', 'button', 'toast'],
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
    category: '계정 보안',
    scope: '사용자',
    keywords: ['2FA', '인증 앱', '등록', '스텝 폼', '복구 코드', 'QR'],
    components: [
      'panel',
      'field',
      'input',
      'otp-input',
      'checkbox',
      'badge',
      'button',
      'alert-dialog',
      'toast',
    ],
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
    category: '계정 보안',
    scope: '사용자',
    keywords: ['세션', '기기', '접속', '기록', '로그아웃'],
    components: ['panel', 'segmented-control', 'badge', 'button', 'alert-dialog', 'toast'],
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
    category: '계정 관리',
    listed: false,
    scope: '사용자',
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
    title: 'OTP 인증',
    description: '코드 입력, 확인 버튼, 오류와 재입력 흐름을 하나의 인증 화면으로 구성합니다.',
    category: '인증',
    scope: '사용자',
    keywords: ['인증', 'OTP', '코드', '오류', '확인'],
    components: ['panel', 'otp-input', 'field', 'alert', 'button'],
    guidance:
      '예제 코드 123456으로 일치 상태를 확인할 수 있습니다. 실제 인증은 서버에서 검증하고 만료·시도 제한을 적용하십시오. 이 예제는 인증이나 메시지 발송을 수행하지 않습니다.',
    load: async () => ({
      Component: (await import('./examples/verification-code')).default,
      source: (await import('./examples/verification-code.tsx?raw')).default,
      extraFiles: [await cardSource()],
    }),
  },
  {
    slug: 'member-directory',
    title: '팀원 관리',
    description: '팀원을 검색하고 초대하거나 역할을 변경하고 팀에서 내보냅니다.',
    category: '팀 관리',
    scope: '팀',
    keywords: ['팀원', '관리', '목록', '검색', '초대', '역할', '내보내기'],
    components: [
      'panel',
      'button',
      'field',
      'input',
      'dialog',
      'alert-dialog',
      'alert',
      'badge',
      'skeleton',
      'toast',
      'filter-bar',
      'search-input',
      'select',
      'table',
      'data-table-region',
      'empty-state',
    ],
    guidance:
      'members에 팀원 목록을 전달하고 onInvite·onRoleChange·onRemove에 서버 요청을 연결하십시오. 성공 후 소비자가 목록을 갱신합니다. 권한, 마지막 관리자 보호, 초대 중복 및 팀 소유권은 서버에서 검증해야 합니다. currentUserId에 해당하는 본인의 관리 액션은 숨깁니다. loading·error·onRetry로 조회 상태를, canManage로 관리 가능 여부를 전달합니다. 미리보기는 화면의 샘플 데이터만 변경하며 이메일을 발송하지 않습니다.',
    load: async () => ({
      Component: (await import('./examples/member-directory')).default,
      source: (await import('./examples/member-directory.tsx?raw')).default,
      extraFiles: [await cardSource()],
    }),
  },
  {
    slug: 'password-reset',
    title: '비밀번호 재설정',
    description: '계정 확인과 코드 검증을 거쳐 새 비밀번호를 설정하고 로그인으로 돌아갑니다.',
    category: '인증',
    scope: '사용자',
    keywords: ['비밀번호', '분실', '복구', '재설정'],
    components: ['panel', 'field', 'input', 'otp-input', 'button'],
    guidance:
      'actions.request는 계정 존재 여부와 관계없이 같은 응답 형태와 안내를 반환하십시오. 서버에서 코드 만료·재요청 및 시도 제한을 적용하고 verify가 반환한 일회용 resetToken으로만 reset을 허용하십시오. minLength와 유출 비밀번호 차단 등 비밀번호 정책은 서버에서도 검증해야 합니다. 비밀번호 재설정 후 기존 세션 폐기 정책을 적용하십시오. onSignIn은 로그인 경로에 연결합니다. 미리보기는 이메일을 발송하지 않으며 인증 코드는 123456입니다.',
    load: async () => ({
      Component: (await import('./examples/password-reset')).default,
      source: (await import('./examples/password-reset.tsx?raw')).default,
      extraFiles: [await cardSource(), await sharedSource()],
    }),
  },
  {
    slug: 'reauthentication',
    title: '재인증',
    description: '민감한 작업에서 비밀번호와 필요한 추가 인증을 확인하고 원래 작업으로 돌아갑니다.',
    category: '인증',
    scope: '사용자',
    keywords: ['재인증', '본인 확인', '비밀번호', 'OTP'],
    components: ['panel', 'field', 'input', 'otp-input', 'button'],
    guidance:
      'onPassword는 서버 판정에 따라 verified 또는 otp-required와 challengeId를 반환합니다. onCode에서 해당 챌린지를 검증하십시오. onContinue는 원래 작업으로 복귀시키며 권한을 부여하는 수단이 아닙니다. 서버는 재인증의 유효 시간과 작업 범위를 검증하고 민감한 작업 실행 시 다시 확인해야 합니다. 취소 시 onCancel로 복귀합니다. 미리보기 비밀번호는 preview-password, 인증 코드는 123456이며 실제 재인증을 수행하지 않습니다.',
    load: async () => ({
      Component: (await import('./examples/reauthentication')).default,
      source: (await import('./examples/reauthentication.tsx?raw')).default,
      extraFiles: [await cardSource(), await sharedSource()],
    }),
  },
  {
    slug: 'recovery-code-management',
    title: '복구 코드 관리',
    description: '복구 코드를 발급하고 복사·다운로드한 뒤 보관을 확인합니다.',
    category: '계정 보안',
    scope: '사용자',
    keywords: ['복구 코드', '백업', '재발급', 'MFA'],
    components: ['panel', 'button', 'checkbox', 'field', 'input', 'alert-dialog'],
    guidance:
      'remainingCount는 서버에서 확인한 사용 가능한 코드 수입니다. onGenerate에서 재인증과 기존 코드 폐기·새 코드 발급을 원자적으로 처리하고 새 코드 목록을 반환한 뒤 수량을 갱신하십시오. 코드는 서버에서 생성하고 안전하게 검증·보관하며 한 번만 사용할 수 있어야 합니다. 보관 완료 후 화면에서 원문을 제거합니다. 미리보기 비밀번호는 preview-password이며 DEMO 코드는 실제 로그인에 사용할 수 없습니다.',
    load: async () => ({
      Component: (await import('./examples/recovery-code-management')).default,
      source: (await import('./examples/recovery-code-management.tsx?raw')).default,
      extraFiles: [await cardSource(), await sharedSource()],
    }),
  },
  {
    slug: 'passkey-management',
    title: '패스키 관리',
    description: '패스키를 등록하고 이름을 변경하거나 더 이상 쓰지 않는 패스키를 삭제합니다.',
    category: '계정 보안',
    scope: '사용자',
    keywords: ['패스키', 'WebAuthn', '기기', '로그인'],
    components: ['panel', 'badge', 'button', 'dialog', 'alert-dialog', 'field', 'input'],
    guidance:
      'passkeys는 소비자가 소유합니다. onRegister에서 서버 챌린지 발급, WebAuthn 등록, 서버 검증을 처리하고 성공 후 목록을 갱신하십시오. onRename과 onRemove도 서버 성공 후 목록을 갱신합니다. 삭제 시 재인증·소유권·다른 로그인 수단 유무를 서버에서 확인하십시오. supported는 실제 소비 환경의 지원 여부, canManage는 관리 권한입니다. 브라우저 인증 창의 취소도 거절된 Promise로 전달할 수 있습니다. 미리보기는 기기 인증 창을 열거나 자격 증명을 만들지 않고 샘플 목록만 변경합니다.',
    load: async () => ({
      Component: (await import('./examples/passkey-management')).default,
      source: (await import('./examples/passkey-management.tsx?raw')).default,
      extraFiles: [await cardSource(), await sharedSource()],
    }),
  },
  {
    slug: 'connected-apps',
    title: '연결된 앱 관리',
    description: '외부 앱에 허용한 권한과 연결일을 확인하고 접근을 해제합니다.',
    category: '앱 연동',
    scope: '사용자',
    keywords: ['앱', '연결', 'OAuth', '권한', '해제'],
    components: ['data-list', 'panel', 'button', 'alert-dialog', 'skeleton'],
    guidance:
      'apps에 외부 앱의 이름, 허용한 권한과 연결일을 전달합니다. 소셜 로그인 연결과 달리 계정 데이터에 접근하는 앱을 관리합니다. onDisconnect는 서버에서 접근·갱신 토큰을 폐기하고 성공 후 소비자가 목록을 갱신합니다. 이미 전달된 데이터의 삭제를 보장하지 않으므로 해제 영향 안내를 유지하십시오. loading·error·onRetry는 조회 상태, canManage는 관리 권한입니다. 미리보기는 외부 앱에 요청하지 않습니다.',
    load: async () => ({
      Component: (await import('./examples/connected-apps')).default,
      source: (await import('./examples/connected-apps.tsx?raw')).default,
      extraFiles: [await cardSource(), await sharedSource()],
    }),
  },
  {
    slug: 'security-activity',
    title: '보안 활동 기록',
    description: '로그인과 인증 수단 변경 기록을 검색하고 성공·실패 결과로 좁힙니다.',
    category: '활동 기록',
    scope: '사용자',
    keywords: ['보안', '활동', '로그', '기록', '실패'],
    components: [
      'panel',
      'badge',
      'button',
      'field',
      'filter-bar',
      'search-input',
      'select',
      'skeleton',
    ],
    guidance:
      'events에 서버에서 조회한 활동을 최신순으로 전달하십시오. 활동 검색과 결과 조건은 AND로 적용되며 전달된 기록 안에서만 검색합니다. 기간별 조회·페이지 이동·기록 보존·조회 권한은 소비 앱이 담당합니다. occurredAt은 시간대가 포함된 ISO 날짜이며 예제는 한국 시간으로 표시합니다. IP·기기 정보 노출은 서비스 정책에 맞추십시오. loading·error·onRetry로 조회 상태를 연결합니다. 미리보기는 문서용 IP와 샘플 기록입니다.',
    load: async () => ({
      Component: (await import('./examples/security-activity')).default,
      source: (await import('./examples/security-activity.tsx?raw')).default,
      extraFiles: [await cardSource()],
    }),
  },
] as const satisfies readonly BlockDocEntry[];

export const BLOCK_CATEGORIES = [
  '프로젝트',
  '인증',
  '계정 관리',
  '계정 보안',
  '팀 관리',
  '앱 연동',
  '활동 기록',
  '구독·결제',
] as const;

export const BLOCK_GROUPS = BLOCK_CATEGORIES.map((title) => ({
  title,
  items: (BLOCK_DOCS as readonly BlockDocEntry[]).filter(
    (entry) => entry.category === title && entry.listed !== false,
  ),
}));

export const ACCOUNT_MENU = BLOCK_GROUPS.find((group) => group.title === '계정 관리')!.items;
export const SUBSCRIPTION_MENU = BLOCK_GROUPS.find((group) => group.title === '구독·결제')!.items;

export function getBlockDoc(slug: string): BlockDocEntry | undefined {
  return BLOCK_DOCS.find((entry) => entry.slug === slug);
}
