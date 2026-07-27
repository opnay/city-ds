import type { ReactNode } from 'react';

interface PageHeadingProps {
  actions?: ReactNode;
  description: string;
  meta?: ReactNode;
  title: string;
}

export function PageHeading({ actions, description, meta, title }: PageHeadingProps) {
  return (
    <section className="relay-page-heading">
      <div className="relay-heading-copy">
        <p className="relay-eyebrow">2026년 7월 27일 월요일</p>
        <h1 tabIndex={-1}>{title}</h1>
        <p>{description}</p>
        {meta ? <div className="relay-heading-meta">{meta}</div> : null}
      </div>
      {actions ? <div className="relay-heading-actions">{actions}</div> : null}
    </section>
  );
}
