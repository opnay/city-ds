# city-ds

Base UI, Tailwind CSS, Storybook으로 만드는 개인용 React 디자인 시스템입니다.

## 기술 구성

- React 18.3 또는 19
- Base UI 1
- Tailwind CSS 4
- Storybook 10
- pnpm 11 + Turborepo

## 요구 사항

- Node.js 24 이상
- pnpm 11

## 시작하기

```bash
pnpm install
pnpm storybook
```

## 패키지 사용

외부 레지스트리에는 아직 배포하지 않습니다. 모노레포 안에서는 workspace 의존성으로 연결하십시오.

```json
{
  "dependencies": {
    "@city-ds/react": "workspace:*"
  }
}
```

애플리케이션 진입점에서 CSS를 한 번 가져온 뒤, 루트 또는 컴포넌트 subpath를 사용하십시오.

```tsx
import '@city-ds/react/styles.css';
import { Button } from '@city-ds/react/button';

export function SaveButton() {
  return <Button>Save changes</Button>;
}
```

패키지 CSS는 디자인 토큰과 컴포넌트 유틸리티를 포함하지만 Tailwind Preflight는 포함하지 않습니다.

## 테마

기본 상태에서는 운영체제 색상 설정을 따릅니다. 명시적인 테마가 필요하면 문서 루트의
`data-theme`을 변경하십시오.

```ts
document.documentElement.dataset.theme = 'dark';
document.documentElement.dataset.theme = 'light';
delete document.documentElement.dataset.theme; // system
```

## 컴포넌트

`@city-ds/react`는 다음 16개 그룹을 제공합니다.

- Actions: Button
- Status: Badge, Progress, Toast
- Forms: Field, Input·Textarea·InputGroup, Checkbox, RadioGroup, Switch, Select, FileUpload
- Navigation: Tabs, Pagination
- Overlays: Dialog, Tooltip
- Data display: Table

각 컴포넌트는 `@city-ds/react/button`과 같은 명시적인 subpath export도 제공합니다.

## 모노레포

```text
apps/
  next-react/     Next.js App Router 소비 검증
  storybook/      컴포넌트 문서와 정적 빌드
  vite-react/     Vite 소비 검증
packages/
  react/          @city-ds/react
```

## 품질 검사

```bash
pnpm check
pnpm build
pnpm --filter @city-ds/react pack:check
```

CI는 모든 타입·린트·테스트·프로덕션 빌드를 실행하고 Storybook 정적 결과를 artifact로
보관합니다. 패키지 배포와 외부 Storybook 호스팅은 아직 구성하지 않았습니다.
