import type { BlockDocEntry } from '../docs/types';

export const BLOCK_DOCS = [
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

export function getBlockDoc(slug: string): BlockDocEntry | undefined {
  return BLOCK_DOCS.find((entry) => entry.slug === slug);
}
