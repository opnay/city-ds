import { MDXProvider } from '@mdx-js/react';
import { useState, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { Check, Clipboard, X } from 'lucide-react';
import { Button } from '@opnay/city-ds-react/button';
import { DataTableRegion } from '@opnay/city-ds-react/data-table-region';
import { Table } from '@opnay/city-ds-react/table';
import type { MDXComponents } from 'mdx/types.js';

import type { ApiItem, DocExample } from '../docs/types';

interface DocsMdxProviderProps {
  children: ReactNode;
}

interface ExampleSetProps {
  examples: readonly DocExample[];
}

interface ApiTableProps {
  items: readonly ApiItem[];
}

async function writeClipboard(value: string): Promise<void> {
  if (!navigator.clipboard) throw new Error('Clipboard API is unavailable');
  await navigator.clipboard.writeText(value);
}

function ExampleFrame({ example }: { example: DocExample }) {
  const [copyState, setCopyState] = useState<'idle' | 'success' | 'error'>('idle');
  const titleId = `example-${example.id}`;
  const Example = example.Component;

  const copySource = async () => {
    try {
      await writeClipboard(example.source);
      setCopyState('success');
    } catch {
      setCopyState('error');
    }
  };

  return (
    <section aria-labelledby={titleId} className="city-docs-example">
      <header className="city-docs-example-heading">
        <div>
          <h3 id={titleId}>{example.title}</h3>
          <p>{example.description}</p>
        </div>
        <div aria-label="이 예제가 다루는 옵션" className="city-docs-coverage-list">
          {example.coverage.flatMap((item) =>
            item.values.map((value) => (
              <span key={`${item.axis}-${value}`}>
                {item.axis}: {value}
              </span>
            )),
          )}
        </div>
      </header>
      <div className="city-docs-example-preview">
        <Example />
      </div>
      <details className="city-docs-example-code">
        <summary>코드 보기</summary>
        <div className="city-docs-code-toolbar">
          <Button onClick={() => void copySource()} size="sm" type="button" variant="ghost">
            {copyState === 'success' ? (
              <Check aria-hidden="true" size={15} />
            ) : copyState === 'error' ? (
              <X aria-hidden="true" size={15} />
            ) : (
              <Clipboard aria-hidden="true" size={15} />
            )}
            {copyState === 'success' ? '복사됨' : copyState === 'error' ? '복사 실패' : '코드 복사'}
          </Button>
          <span aria-live="polite" className="city-docs-sr-only">
            {copyState === 'success'
              ? '예제 코드를 복사했습니다.'
              : copyState === 'error'
                ? '예제 코드를 복사할 수 없습니다. 코드를 직접 선택하십시오.'
                : ''}
          </span>
        </div>
        <pre aria-label={`${example.title} 예제 소스 코드`} tabIndex={0}>
          <code>{example.source}</code>
        </pre>
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

function MdxPre(props: ComponentPropsWithoutRef<'pre'>) {
  return (
    <pre
      {...props}
      aria-label={props['aria-label'] ?? '문서 코드 예제'}
      className="city-docs-prose-code"
      tabIndex={0}
    />
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

const MDX_COMPONENTS = {
  ApiTable,
  ExampleSet,
  pre: MdxPre,
  table: MdxTable,
} satisfies MDXComponents;

export function DocsMdxProvider({ children }: DocsMdxProviderProps) {
  return <MDXProvider components={MDX_COMPONENTS}>{children}</MDXProvider>;
}
