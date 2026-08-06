import { ArrowRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@opnay/city-ds-react/button';

import { HomeShowcase } from './home-showcase';

export function HomePage() {
  return (
    <article className="city-docs-home">
      <header className="city-docs-home-hero city-docs-home-intro" id="product-foundation">
        <div className="city-docs-home-hero-copy">
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
              문서 보기
              <ArrowRight aria-hidden="true" size={17} />
            </Button>
          </div>
        </div>
      </header>

      <div className="city-showcase-viewport">
        <HomeShowcase />
      </div>
    </article>
  );
}
