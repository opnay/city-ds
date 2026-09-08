import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { BLOCK_DOCS } from '../blocks/block-catalog';
import { getComponentDoc } from '../docs/doc-catalog';
import type { BlockDocEntry } from '../docs/types';
import { GuidePage } from './doc-page';
import { ExampleFrame } from './docs-mdx';
import blockStyles from '../blocks/examples/blocks.css?raw';

export function BlockCatalog() {
  return (
    <GuidePage
      title="블록"
      eyebrow="Blocks"
      description="여러 컴포넌트를 조합한 실사용 화면입니다. 동작을 확인하고 코드를 가져가 프로젝트에 맞게 수정하십시오."
    >
      {['사용자 관리', '구독·결제', '인증', '데이터 관리'].map((category) => (
        <section key={category}>
          <h2 className="city-text-section-title">{category}</h2>
          <div className="city-docs-component-grid">
            {BLOCK_DOCS.filter((entry) => entry.category === category).map((entry) => (
              <Link key={entry.slug} to="/blocks/$slug" params={{ slug: entry.slug }}>
                <span>
                  <span className="city-text-caption">{entry.category}</span>
                  <strong>{entry.title}</strong>
                  <span className="city-text-supporting">{entry.description}</span>
                </span>
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            ))}
          </div>
        </section>
      ))}
    </GuidePage>
  );
}

export function BlockPage({
  entry,
  Component,
  source,
  extraFiles = [],
}: { entry: BlockDocEntry } & Awaited<ReturnType<BlockDocEntry['load']>>) {
  return (
    <GuidePage
      title={entry.title}
      eyebrow={`Blocks · ${entry.category}`}
      description={entry.description}
    >
      <ExampleFrame
        key={entry.slug}
        optionAxes={entry.optionAxes}
        featuredTitle="미리보기"
        previewLayout="wide"
        example={{
          id: entry.slug,
          title: '미리보기',
          description: '화면에서 동작을 확인하고 아래 구현 코드를 복사하십시오.',
          Component,
          configurable: !!entry.optionAxes?.length,
          files: [
            { filename: `${entry.slug}.tsx`, source, language: 'tsx' },
            { filename: 'blocks.css', source: blockStyles, language: 'css' },
            ...extraFiles,
          ],
          coverage: [],
        }}
      />
      <section className="city-docs-related" aria-label="사용한 컴포넌트">
        <h2 className="city-text-section-title">사용한 컴포넌트</h2>
        <div className="city-docs-related-grid">
          {entry.components.map((slug) => (
            <Link key={slug} to="/components/$slug" params={{ slug }}>
              <span>{getComponentDoc(slug)?.title ?? slug}</span>
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          ))}
        </div>
      </section>
      <details>
        <summary>구현 참고</summary>
        <p>{entry.guidance}</p>
        {entry.components.includes('toast') && (
          <p>완료 알림을 표시하려면 앱 루트에 Toaster를 한 번 배치하십시오.</p>
        )}
      </details>
    </GuidePage>
  );
}
