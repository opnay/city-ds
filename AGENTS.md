# city-ds 에이전트 가이드

## 목표

- `@opnay/city-ds-react`는 Base UI 기반의 접근성 높은 React 디자인 시스템입니다.
- 시각 언어는 모노크롬 도구형이며 라이트·다크·시스템 테마를 지원합니다.
- 소비 환경은 React 18·19, Vite, Next.js입니다.

## 구조

- `packages/react`: 공개 컴포넌트와 테마
- `apps/public-docs`: 문서·상호작용 예제와 jsdom·Chromium 검증
- `examples/vite-react`: Vite 소비 예제와 검증

## 규칙

- 패키지 매니저는 pnpm, 태스크 러너는 Turborepo를 사용합니다.
- Base UI가 제공하는 상태·접근성 동작은 다시 구현하지 않습니다.
- 합성 API는 `render`를 사용하고 `asChild`는 추가하지 않습니다.
- 공개 CSS 변수와 전역 선택자는 `city` 접두사를 사용합니다.
- UI 아이콘은 `lucide-react`를 사용하며 문자·직접 SVG로 대체하지 않습니다. 콘텐츠 기호·데이터 그래픽 예외는 `packages/react/DESIGN.md`를 따릅니다.
- 네트워크 업로드, 데이터 패칭 등 제품 영역의 부수 효과는 컴포넌트에 넣지 않습니다.
- 변경 후 `pnpm check`와 `pnpm build`를 실행합니다.
