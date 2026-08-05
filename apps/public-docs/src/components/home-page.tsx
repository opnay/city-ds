import {
  Accessibility,
  ArrowRight,
  Blocks,
  BookOpenCheck,
  LayoutDashboard,
  ListChecks,
  Settings2,
} from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Badge } from '@opnay/city-ds-react/badge';
import { Button } from '@opnay/city-ds-react/button';
import { Progress } from '@opnay/city-ds-react/progress';

import { COMPONENT_DOCS } from '../docs/doc-catalog';

const PRODUCT_CONTEXTS = [
  {
    components: 'Toolbar · Menu · Dialog · Toast',
    description: '반복 작업과 상태 전환, 실패 비용이 큰 액션의 위계를 명확하게 구성합니다.',
    icon: ListChecks,
    title: '운영 도구',
  },
  {
    components: 'FilterBar · Table · Pagination',
    description: '필터, 비교, 선택, 탐색이 이어지는 밀도 높은 데이터 화면을 설계합니다.',
    icon: LayoutDashboard,
    title: '데이터 화면',
  },
  {
    components: 'Field · Combobox · DatePicker · FileUpload',
    description: '입력부터 검증, 오류 복구, 완료까지 예측 가능한 폼 흐름을 만듭니다.',
    icon: Settings2,
    title: '입력 흐름',
  },
] as const;

function ProductPreview() {
  return (
    <section aria-labelledby="product-preview-title" className="city-docs-home-preview">
      <header className="city-docs-home-preview-bar">
        <span>CITY / OPERATIONS</span>
        <Badge appearance="subtle" tone="success">
          운영 중
        </Badge>
      </header>
      <div className="city-docs-home-preview-body">
        <div className="city-docs-home-preview-heading">
          <div>
            <p>오늘의 작업 공간</p>
            <h2 id="product-preview-title">운영 현황</h2>
          </div>
          <Badge appearance="outline" tone="neutral">
            8월 3일
          </Badge>
        </div>

        <dl aria-label="운영 현황 요약" className="city-docs-home-metrics">
          <div>
            <dt>처리 완료</dt>
            <dd>128</dd>
          </div>
          <div>
            <dt>자동화</dt>
            <dd>94%</dd>
          </div>
          <div>
            <dt>검토 대기</dt>
            <dd>7</dd>
          </div>
        </dl>

        <div className="city-docs-home-progress">
          <div>
            <span>릴리스 준비도</span>
            <strong>78%</strong>
          </div>
          <Progress.Root aria-label="릴리스 준비도" size="sm" value={78}>
            <Progress.Track>
              <Progress.Indicator />
            </Progress.Track>
          </Progress.Root>
        </div>

        <div className="city-docs-home-queue">
          <div>
            <span>
              <strong>거래 검토</strong>
              <small>정책 확인 4건</small>
            </span>
            <Badge appearance="subtle" tone="warning">
              확인 필요
            </Badge>
          </div>
          <div>
            <span>
              <strong>배포 상태</strong>
              <small>프로덕션 동기화</small>
            </span>
            <Badge appearance="subtle" tone="success">
              완료
            </Badge>
          </div>
          <div>
            <span>
              <strong>접근 권한</strong>
              <small>신규 요청 3건</small>
            </span>
            <Badge appearance="outline" tone="neutral">
              검토 중
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <article className="city-docs-home">
      <header className="city-docs-home-hero">
        <div className="city-docs-home-hero-copy">
          <p className="city-docs-home-kicker city-text-caption">
            <span aria-hidden="true" />
            city design system · react
          </p>
          <h1 className="city-text-display">
            운영 제품을 위한 <span>React 디자인 시스템</span>
          </h1>
          <p className="city-docs-home-lead city-text-lead">
            city-ds는 복잡한 운영 도구, 데이터 화면, 폼을 빠르고 일관되게 만드는 컴포넌트와 디자인
            기준을 제공합니다. Base UI의 접근 가능한 동작과 절제된 모노크롬 시각 언어를 하나의 공개
            API로 사용하십시오.
          </p>
          <div className="city-docs-home-actions">
            <Button
              nativeButton={false}
              render={<Link to="/getting-started" />}
              role="link"
              size="lg"
              variant="primary"
            >
              시작하기
              <ArrowRight aria-hidden="true" size={17} />
            </Button>
            <Button
              nativeButton={false}
              render={<Link to="/components" />}
              role="link"
              size="lg"
              variant="outline"
            >
              컴포넌트 {COMPONENT_DOCS.length}개 보기
            </Button>
          </div>
          <dl aria-label="city-ds 지원 범위" className="city-docs-home-facts">
            <div>
              <dt>{COMPONENT_DOCS.length}</dt>
              <dd className="city-text-caption">공개 컴포넌트</dd>
            </div>
            <div>
              <dt>18 · 19</dt>
              <dd className="city-text-caption">React 지원</dd>
            </div>
            <div>
              <dt>3</dt>
              <dd className="city-text-caption">light · dark · system</dd>
            </div>
          </dl>
        </div>
        <ProductPreview />
      </header>

      <section aria-labelledby="product-foundation" className="city-docs-home-section">
        <div className="city-docs-home-section-heading">
          <p className="city-text-caption">제품을 위한 기반</p>
          <div>
            <h2 className="city-text-section-title" id="product-foundation">
              컴포넌트뿐 아니라 선택 기준까지 제공합니다.
            </h2>
            <p className="city-text-body">
              화면을 더 빨리 그리는 데서 멈추지 않습니다. 사용자의 목표와 상태에 맞는 선택을 반복할
              수 있도록 코드와 디자인 판단을 함께 제공합니다.
            </p>
          </div>
        </div>
        <div className="city-docs-home-principles">
          <article>
            <Accessibility aria-hidden="true" />
            <span className="city-text-caption">01</span>
            <h3 className="city-text-subsection-title">접근성을 기본값으로</h3>
            <p className="city-text-supporting">
              Base UI가 제공하는 키보드 탐색, 포커스 관리, 의미 구조를 제품의 출발점으로 삼습니다.
            </p>
          </article>
          <article>
            <BookOpenCheck aria-hidden="true" />
            <span className="city-text-caption">02</span>
            <h3 className="city-text-subsection-title">선택 기준을 함께</h3>
            <p className="city-text-supporting">
              사용·비사용 기준, 옵션 축, 의미 있는 상태와 조합 패턴을 소비자 관점에서 설명합니다.
            </p>
          </article>
          <article>
            <Blocks aria-hidden="true" />
            <span className="city-text-caption">03</span>
            <h3 className="city-text-subsection-title">제품 안에서 조합되도록</h3>
            <p className="city-text-supporting">
              공개 subpath와 render 합성 API로 Vite와 Next.js 제품 흐름에 자연스럽게 연결합니다.
            </p>
          </article>
        </div>
      </section>

      <section aria-labelledby="product-contexts" className="city-docs-home-section">
        <div className="city-docs-home-section-heading">
          <p className="city-text-caption">사용 맥락</p>
          <div>
            <h2 className="city-text-section-title" id="product-contexts">
              운영 제품의 반복되는 문제를 다룹니다.
            </h2>
            <p className="city-text-body">
              화면 유형마다 필요한 밀도와 상태, 액션 위계는 달라도 하나의 시각 언어를 유지합니다.
            </p>
          </div>
        </div>
        <div className="city-docs-home-contexts">
          {PRODUCT_CONTEXTS.map(({ components, description, icon: Icon, title }) => (
            <article key={title}>
              <div>
                <Icon aria-hidden="true" />
                <h3 className="city-text-subsection-title">{title}</h3>
              </div>
              <p className="city-text-supporting">{description}</p>
              <small className="city-text-caption">{components}</small>
            </article>
          ))}
        </div>
        <Button nativeButton={false} render={<Link to="/patterns" />} role="link" variant="outline">
          조합 패턴 살펴보기
          <ArrowRight aria-hidden="true" size={16} />
        </Button>
      </section>

      <section aria-labelledby="product-start" className="city-docs-home-start">
        <div className="city-docs-home-section-heading">
          <p className="city-text-caption">제품에 연결하기</p>
          <div>
            <h2 className="city-text-section-title" id="product-start">
              첫 화면을 city-ds로 시작하십시오.
            </h2>
            <p className="city-text-body">
              패키지를 설치하고 CSS를 한 번 불러오면 공개 컴포넌트와 토큰을 바로 사용할 수 있습니다.
            </p>
          </div>
        </div>
        <div className="city-docs-home-actions">
          <Button
            nativeButton={false}
            render={<Link to="/getting-started" />}
            role="link"
            size="lg"
            variant="primary"
          >
            설치하고 시작하기
            <ArrowRight aria-hidden="true" size={17} />
          </Button>
          <Button
            nativeButton={false}
            render={<Link to="/components" />}
            role="link"
            size="lg"
            variant="outline"
          >
            전체 컴포넌트 보기
          </Button>
        </div>
      </section>
    </article>
  );
}
