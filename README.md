# city-ds

Base UI, Tailwind CSS, Storybook으로 만드는 개인용 React 디자인 시스템입니다.

## 기술 구성

- React 18.3 또는 19
- Base UI 1
- Tailwind CSS 4
- Storybook 10
- Oxlint + Oxfmt
- pnpm 11 + Turborepo

## 요구 사항

- Node.js 24 이상
- pnpm 11

## 시작하기

```bash
pnpm install
pnpm storybook
pnpm public-docs
```

Storybook은 디자인 시스템을 개발하면서 컴포넌트의 상태, 상호작용, 시각 회귀를 확인하는
작업 공간입니다. `public-docs`는 디자인 시스템을 사용하는 제품 개발자를 위한 별도 문서로,
설치 방법, 컴포넌트 선택 기준, 공개 옵션과 조합 예제를 제공합니다.

## 패키지 사용

GitHub Packages에서 설치하려면 GitHub personal access token(classic)의 `read:packages`
권한으로 먼저 로그인하십시오.

```bash
npm login --scope=@opnay --auth-type=legacy --registry=https://npm.pkg.github.com
pnpm add @opnay/city-ds-react
```

모노레포 안에서는 workspace 의존성으로 연결하십시오.

```json
{
  "dependencies": {
    "@opnay/city-ds-react": "workspace:*"
  }
}
```

애플리케이션 진입점에서 CSS를 한 번 가져온 뒤, 루트 또는 컴포넌트 subpath를 사용하십시오.

```tsx
import '@opnay/city-ds-react/styles.css';
import { Button } from '@opnay/city-ds-react/button';

export function SaveButton() {
  return <Button>Save changes</Button>;
}
```

`styles.css`는 Tailwind Preflight, 디자인 토큰과 컴포넌트 유틸리티를 포함하는 앱 기반
스타일입니다. 애플리케이션 루트에서 한 번만 가져오십시오. 전역 리셋이나 컴포넌트 스타일
없이 CSS 변수만 필요한 경우에는 `@opnay/city-ds-react/theme.css`를 가져올 수 있습니다.

## 디자인 가이드

설치된 패키지의 디자인 가이드를 프로젝트 루트에 심볼릭 링크로 연결하십시오.

```bash
ln -s node_modules/@opnay/city-ds-react/DESIGN.md ./DESIGN.md
```

이 가이드는 컴포넌트 선택, 액션 위계, 크기·밀도, 표면, 상태, 접근성, 반응형 기준을 제공합니다. 프로젝트에 이미 `DESIGN.md`가 있다면 덮어쓰지 말고 기존 지침에서 패키지 가이드를 참조하십시오.

city-ds를 사용하는 프로젝트는 반복되는 업무 흐름에 맞는 프로젝트 패턴을 별도로 구축하십시오. `사용자 목표 > 프로젝트 패턴 선택·정의 > 컴포넌트 구성 > 레이아웃 구성 > 페이지 구현` 순서로 작업하고, 컴포넌트와 토큰만 나열한 화면을 프로젝트 패턴으로 취급하지 마십시오. 패턴의 사용자 목표, 적용 조건, 상태, spacing·density·반응형 계약은 프로젝트의 `DESIGN.md` 또는 패턴 문서가 소유합니다.

## 테마

기본 상태에서는 운영체제 색상 설정을 따릅니다. 명시적인 테마가 필요하면 문서 루트의
`data-theme`을 변경하십시오.

```ts
document.documentElement.dataset.theme = 'dark';
document.documentElement.dataset.theme = 'light';
delete document.documentElement.dataset.theme; // system
```

## 디자인 토큰

공개 토큰은 모두 `--city-` 접두사의 CSS 변수입니다. 색상과 그림자는 테마에 반응하며,
간격은 4px 단위의 `--city-space-unit`을 기준으로 합니다.

| 범주         | 예시                                                          |
| ------------ | ------------------------------------------------------------- |
| 색상         | `--city-color-background`, `--city-color-primary`             |
| 간격         | `--city-space-2`, `--city-space-6`                            |
| 타이포그래피 | `--city-font-size-sm`, `--city-font-weight-medium`            |
| 형태와 효과  | `--city-radius-md`, `--city-shadow-panel`                     |
| 모션         | `--city-duration-normal`, `--city-easing-standard`            |
| 컨트롤       | `--city-control-sm`, `--city-control-md`, `--city-control-lg` |

애플리케이션 CSS를 city-ds CSS보다 나중에 불러오고 필요한 값만 재정의하십시오.

```css
:root {
  --city-radius-md: 0.5rem;
}

[data-theme='light'] {
  --city-color-primary: oklch(0.32 0.01 286);
}
```

Tailwind 숫자형 간격과 기본 타이포그래피 유틸리티도 같은 토큰을 사용합니다. 전체 목록과
테마별 미리보기는 Storybook의 `기초/디자인 토큰` 스토리에서 확인할 수 있습니다.

## 컴포넌트

`@opnay/city-ds-react`의 대표 컴포넌트는 다음과 같습니다.

- Actions: Button, ToggleGroup
- Status: Badge, Progress, Toast
- Forms: Field, Input·Textarea·InputGroup, Checkbox, RadioGroup, SegmentedControl, Switch, Select, FileUpload
- Navigation: Tabs, Pagination
- Overlays: Dialog, Tooltip
- Data display: Table

각 컴포넌트는 `@opnay/city-ds-react/button`과 같은 명시적인 subpath export도 제공합니다.

### ToggleGroup 접근성

`ToggleGroup`은 서식이나 표시 도구처럼 다시 눌러 해제할 수 있는 토글 상태를 하나의
그룹으로 묶습니다. 그룹 자체에는 `aria-label` 또는 `aria-labelledby`로 접근 가능한 이름을
제공하십시오. 아이콘만 있는 `ToggleGroup.Item`은 각 항목에도 `aria-label`을 제공해야 합니다.

보기 모드나 기간처럼 현재 값을 항상 하나 유지해야 하면 `SegmentedControl`을 사용하십시오.

### Storybook 브라우저 테스트

Storybook 스토리는 Vitest 브라우저 모드에서 Chromium으로 렌더링 검사를 실행합니다.
처음 실행하거나 CI 캐시가 비어 있으면 Playwright 브라우저를 먼저 설치하십시오.

```bash
pnpm --filter @city-ds/storybook exec playwright install chromium
pnpm --filter @city-ds/storybook test
```

실패한 상호작용을 디버깅할 때는 Storybook을 켠 뒤 동일한 스토리를 브라우저에서 열어
`play` 함수의 단계와 접근성 오류를 확인하십시오.

```bash
pnpm storybook
```

## 모노레포

```text
apps/
  public-docs/    소비자를 위한 설치·선택·조합 문서
  storybook/      컴포넌트 문서와 정적 빌드
examples/
  vite-react/     Vite 소비 검증
packages/
  react/          @opnay/city-ds-react
```

## 품질 검사

```bash
pnpm format
pnpm lint
pnpm check
pnpm build
pnpm public-docs:build
pnpm --filter @opnay/city-ds-react pack:check
```

CI는 모든 타입·린트·테스트·프로덕션 빌드를 실행하고 Storybook 정적 결과를 artifact로
보관합니다.

## 배포

`packages/react/package.json`의 버전을 올리고 같은 버전의 `v<version>` 태그로 GitHub
Release를 게시하십시오. 게시 워크플로는 전체 품질 게이트와 패키지 export 검사를 통과한
뒤 `@opnay/city-ds-react`만 비공개 GitHub Package로 배포합니다. CI 인증에는 저장소의
`GITHUB_TOKEN`을 사용하므로 별도 배포 secret은 필요하지 않습니다.
