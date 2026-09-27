'use client';

import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { cn } from '../../lib/cn';

type ArticleContent =
  | { markdown: string; children?: never }
  | { markdown?: never; children?: React.ReactNode };

export type ArticleProps = Omit<
  useRender.ComponentProps<'article'>,
  'children' | 'className' | 'dangerouslySetInnerHTML'
> &
  ArticleContent & {
    className?: string;
  };

function getMarkdownComponents(footnoteLabelId: string): Components {
  return {
    a: ({ node, ...props }) => (
      <a
        {...props}
        aria-describedby={
          node?.properties.dataFootnoteRef ? footnoteLabelId : props['aria-describedby']
        }
      />
    ),
    h2: ({ node: _node, ...props }) => (
      <h2 {...props} id={props.id === 'footnote-label' ? footnoteLabelId : props.id} />
    ),
    img: ({ alt }) => (alt ? <span>{alt}</span> : null),
    input: ({ checked }) => (
      <span
        aria-label={checked ? '완료' : '미완료'}
        data-city-article-task-state={checked ? 'complete' : 'pending'}
        role="img"
      >
        {checked ? '✓' : null}
      </span>
    ),
    pre: ({ children }) => (
      <pre aria-label="코드 블록" tabIndex={0}>
        {children}
      </pre>
    ),
    table: ({ children }) => (
      <div aria-label="본문 표" data-city-article-table="" role="region" tabIndex={0}>
        <table>{children}</table>
      </div>
    ),
    section: ({ node, ...props }) => (
      <section
        {...props}
        aria-labelledby={
          node?.properties.dataFootnotes ? footnoteLabelId : props['aria-labelledby']
        }
      />
    ),
  };
}

export const Article = React.forwardRef<HTMLElement, ArticleProps>(function Article(
  { children, className, markdown, render, ...props },
  ref,
) {
  const footnotePrefix = `city-article-${React.useId().replace(/:/g, '')}-`;
  const footnoteLabelId = `${footnotePrefix}footnote-label`;
  const content =
    markdown === undefined ? (
      children
    ) : (
      <ReactMarkdown
        components={getMarkdownComponents(footnoteLabelId)}
        remarkPlugins={[remarkGfm]}
        remarkRehypeOptions={{
          clobberPrefix: footnotePrefix,
          footnoteBackContent: (_, rereferenceIndex) =>
            rereferenceIndex > 1 ? `본문 ${rereferenceIndex}로 돌아가기` : '본문으로 돌아가기',
          footnoteBackLabel: (referenceIndex, rereferenceIndex) =>
            `각주 ${referenceIndex + 1}의 본문 참조 ${rereferenceIndex}로 돌아가기`,
          footnoteLabel: '각주',
          footnoteLabelProperties: {},
        }}
        skipHtml
      >
        {markdown}
      </ReactMarkdown>
    );

  return useRender({
    defaultTagName: 'article',
    ref,
    render,
    props: {
      ...props,
      'data-city-article': '',
      className: cn('min-w-0', className),
      children: content,
    },
  });
});
