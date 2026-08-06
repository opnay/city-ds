import { MDXProvider } from '@mdx-js/react';
import { isValidElement, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { DataTableRegion } from '@opnay/city-ds-react/data-table-region';
import { Table } from '@opnay/city-ds-react/table';
import type { MDXComponents } from 'mdx/types.js';

import type { ApiItem, DocExample } from '../docs/types';
import { CodeBlock, type CodeFile } from './code-block';
import { PreviewSettingsButton } from './preview-settings';

interface DocsMdxProviderProps {
  children: ReactNode;
}

interface ExampleSetProps {
  examples: readonly DocExample[];
}

interface ApiTableProps {
  items: readonly ApiItem[];
}

interface CodeFilesProps {
  'aria-label'?: string | undefined;
  files: readonly [CodeFile, CodeFile, ...CodeFile[]];
}

function addRequiredClassName(className: string | undefined, requiredClassName: string) {
  return className ? `${className} ${requiredClassName}` : requiredClassName;
}

function ExampleFrame({ example }: { example: DocExample }) {
  const titleId = `example-${example.id}`;
  const Example = example.Component;

  return (
    <section aria-labelledby={titleId} className="city-docs-example">
      <header className="city-docs-example-heading">
        <h3 className="city-docs-example-title" id={titleId}>
          {example.title}
        </h3>
        <p className="city-docs-sr-only">{example.description}</p>
        <div className="city-docs-example-actions">
          <div aria-label="이 예제가 다루는 옵션" className="city-docs-coverage-list">
            {example.coverage.flatMap((item) =>
              item.values.map((value) => (
                <span key={`${item.axis}-${value}`}>
                  {item.axis}: {value}
                </span>
              )),
            )}
          </div>
          <PreviewSettingsButton />
        </div>
      </header>
      <div className="city-docs-example-preview">
        <div className="city-docs-example-preview-content">
          <Example />
        </div>
      </div>
      <details className="city-docs-example-code">
        <summary>코드 보기</summary>
        {example.files ? (
          <CodeBlock
            aria-label={`${example.title} 예제 소스 코드`}
            files={example.files}
            tabIndex={0}
          />
        ) : (
          <CodeBlock
            aria-label={`${example.title} 예제 소스 코드`}
            code={example.source}
            filename={example.filename}
            language="tsx"
            tabIndex={0}
          />
        )}
      </details>
    </section>
  );
}

export function ExampleSet({ examples }: ExampleSetProps) {
  return (
    <div className="city-docs-example-set">
      {examples.map((example) => (
        <ExampleFrame example={example} key={example.id} />
      ))}
    </div>
  );
}

export function ApiTable({ items }: ApiTableProps) {
  return (
    <DataTableRegion
      className="city-docs-api-table"
      hint="표를 가로로 스크롤하면 모든 API 열을 확인할 수 있습니다."
      label="주요 API"
    >
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>이름</Table.Head>
            <Table.Head>타입</Table.Head>
            <Table.Head>기본값</Table.Head>
            <Table.Head>설명</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.map((item) => (
            <Table.Row key={item.name}>
              <Table.Cell>
                <code>{item.name}</code>
              </Table.Cell>
              <Table.Cell>
                <code>{item.type}</code>
              </Table.Cell>
              <Table.Cell>{item.defaultValue ?? '—'}</Table.Cell>
              <Table.Cell>{item.description}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </DataTableRegion>
  );
}

export function CodeFiles({ 'aria-label': ariaLabel = '문서 코드 파일', files }: CodeFilesProps) {
  return (
    <CodeBlock aria-label={ariaLabel} className="city-docs-prose-code" files={files} tabIndex={0} />
  );
}

function getMdxCodeBlock(
  children: ReactNode,
): { code: string; language?: string | undefined } | undefined {
  if (!isValidElement<ComponentPropsWithoutRef<'code'>>(children)) return undefined;

  const code = children.props.children;
  if (typeof code !== 'string') return undefined;

  const className = children.props.className;
  const language =
    typeof className === 'string' ? /(?:^|\s)language-([^\s]+)/.exec(className)?.[1] : undefined;

  return { code, language };
}

function MdxPre({ children, className, ...props }: ComponentPropsWithoutRef<'pre'>) {
  const codeBlock = getMdxCodeBlock(children);
  const preClassName = className ? `city-docs-prose-code ${className}` : 'city-docs-prose-code';

  if (codeBlock) {
    return (
      <CodeBlock
        {...props}
        aria-label={props['aria-label'] ?? '문서 코드 예제'}
        className={preClassName}
        code={codeBlock.code}
        language={codeBlock.language}
        tabIndex={0}
      />
    );
  }

  return (
    <pre
      {...props}
      aria-label={props['aria-label'] ?? '문서 코드 예제'}
      className={preClassName}
      tabIndex={0}
    >
      {children}
    </pre>
  );
}

function MdxTable(props: ComponentPropsWithoutRef<'table'>) {
  return (
    <div
      aria-label="문서 데이터 표"
      className="city-docs-prose-table-wrap"
      role="region"
      tabIndex={0}
    >
      <table {...props} />
    </div>
  );
}

function MdxHeading2({ className, ...props }: ComponentPropsWithoutRef<'h2'>) {
  return <h2 {...props} className={addRequiredClassName(className, 'city-text-section-title')} />;
}

function MdxHeading3({ className, ...props }: ComponentPropsWithoutRef<'h3'>) {
  return (
    <h3 {...props} className={addRequiredClassName(className, 'city-text-subsection-title')} />
  );
}

function MdxParagraph({ className, ...props }: ComponentPropsWithoutRef<'p'>) {
  return <p {...props} className={addRequiredClassName(className, 'city-text-body')} />;
}

function MdxListItem({ className, ...props }: ComponentPropsWithoutRef<'li'>) {
  return <li {...props} className={addRequiredClassName(className, 'city-text-body')} />;
}

function MdxBlockquote({ className, ...props }: ComponentPropsWithoutRef<'blockquote'>) {
  return <blockquote {...props} className={addRequiredClassName(className, 'city-text-body')} />;
}

const MDX_COMPONENTS = {
  ApiTable,
  CodeFiles,
  ExampleSet,
  blockquote: MdxBlockquote,
  h2: MdxHeading2,
  h3: MdxHeading3,
  li: MdxListItem,
  p: MdxParagraph,
  pre: MdxPre,
  table: MdxTable,
} satisfies MDXComponents;

export function DocsMdxProvider({ children }: DocsMdxProviderProps) {
  return <MDXProvider components={MDX_COMPONENTS}>{children}</MDXProvider>;
}
