import type { ComponentType, ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';

import { CATEGORY_LABELS, getComponentDoc } from '../docs/doc-catalog';
import type { ComponentDocEntry } from '../docs/types';
import { CodeBlock } from './code-block';

interface ComponentDocPageProps {
  Content: ComponentType;
  entry: ComponentDocEntry;
}

interface GuidePageProps {
  children: ReactNode;
  description: string;
  eyebrow: string;
  title: string;
}

export function GuidePage({ children, description, eyebrow, title }: GuidePageProps) {
  return (
    <article className="city-docs-article">
      <header className="city-docs-page-heading">
        <p className="city-docs-page-eyebrow city-text-caption">{eyebrow}</p>
        <h1 className="city-text-page-title">{title}</h1>
        <p className="city-docs-page-description city-text-lead">{description}</p>
      </header>
      <div className="city-docs-prose city-prose">{children}</div>
    </article>
  );
}

export function ComponentDocPage({ Content, entry }: ComponentDocPageProps) {
  const related = entry.related.flatMap((slug) => {
    const relatedEntry = getComponentDoc(slug);
    return relatedEntry ? [relatedEntry] : [];
  });

  return (
    <article className="city-docs-article">
      <header className="city-docs-page-heading">
        <p className="city-docs-page-eyebrow city-text-caption">
          컴포넌트 · {CATEGORY_LABELS[entry.category]}
        </p>
        <h1 className="city-text-page-title">{entry.title}</h1>
        <p className="city-docs-page-description city-text-lead">{entry.description}</p>
        <div
          aria-label={`${entry.title} 가져오기`}
          className="city-docs-import-block"
          role="region"
        >
          <CodeBlock
            aria-label={`${entry.title} 가져오기 코드`}
            code={`import { ${entry.title} } from '${entry.importPath}';`}
            language="tsx"
            tabIndex={0}
          />
        </div>
      </header>
      <div className="city-docs-prose city-prose">
        <Content />
      </div>
      <div className="city-docs-selection-guidance">
        <p className="city-docs-selection-guidance-label city-text-caption">선택 가이드</p>
        <p className="city-text-supporting">{entry.selectionGuidance}</p>
      </div>
      {related.length > 0 ? (
        <section aria-labelledby="related-components" className="city-docs-related">
          <h2 className="city-text-section-title" id="related-components">
            관련 컴포넌트
          </h2>
          <div className="city-docs-related-grid">
            {related.map((item) => (
              <Link key={item.slug} params={{ slug: item.slug }} to="/components/$slug">
                <span>
                  <strong>{item.title}</strong>
                  <span className="city-text-supporting">{item.description}</span>
                </span>
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
