import type { ComponentType, ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Badge } from '@opnay/city-ds-react/badge';

import { CATEGORY_LABELS, getComponentDoc } from '../docs/doc-catalog';
import type { ComponentDocEntry } from '../docs/types';

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
        <p>{eyebrow}</p>
        <h1>{title}</h1>
        <div>{description}</div>
      </header>
      <div className="city-docs-prose">{children}</div>
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
        <Badge appearance="outline" tone="neutral">
          {CATEGORY_LABELS[entry.category]}
        </Badge>
        <h1>{entry.title}</h1>
        <div>{entry.description}</div>
      </header>
      <section aria-labelledby="component-import" className="city-docs-import-block">
        <h2 id="component-import">가져오기</h2>
        <pre aria-label={`${entry.title} 가져오기 코드`} tabIndex={0}>
          <code>{`import { ${entry.title} } from '${entry.importPath}';`}</code>
        </pre>
      </section>
      <div className="city-docs-prose">
        <Content />
      </div>
      {related.length > 0 ? (
        <section aria-labelledby="related-components" className="city-docs-related">
          <h2 id="related-components">관련 컴포넌트</h2>
          <div className="city-docs-related-grid">
            {related.map((item) => (
              <Link key={item.slug} params={{ slug: item.slug }} to="/components/$slug">
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.description}</small>
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
