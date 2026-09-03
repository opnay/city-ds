import { MDXProvider } from '@mdx-js/react';
import {
  Children,
  createContext,
  isValidElement,
  type ComponentType,
  type ComponentPropsWithoutRef,
  type ReactNode,
  useContext,
  useState,
} from 'react';
import { Accordion } from '@opnay/city-ds-react/accordion';
import { Checkbox } from '@opnay/city-ds-react/checkbox';
import { DataTableRegion } from '@opnay/city-ds-react/data-table-region';
import { Panel } from '@opnay/city-ds-react/panel';
import { Table } from '@opnay/city-ds-react/table';
import type { MDXComponents } from 'mdx/types.js';

import type {
  ApiItem,
  ComponentPageData,
  DocExample,
  OptionAxis,
  PreviewOptionValues,
} from '../docs/types';
import { CodeBlock, type CodeFile } from './code-block';
import { Preview, PreviewSidebarButton } from './preview';
import { PreviewSettingsButton, usePreviewSettings } from './preview-settings';

interface DocsMdxProviderProps {
  children: ReactNode;
}

interface ExampleSetProps {
  examples: readonly DocExample[];
  widePreviewIds?: readonly string[] | undefined;
}

interface ApiTableProps {
  items: readonly ApiItem[];
}

interface ComponentReferenceProps {
  data: ComponentPageData;
}

interface ComponentDocScopeProps {
  children: ReactNode;
  title: string;
}

interface ExampleFrameProps {
  example: DocExample;
  featuredTitle?: string | undefined;
  optionAxes?: readonly OptionAxis[] | undefined;
  previewLayout?: 'center' | 'wide' | undefined;
}

interface CodeFilesProps {
  'aria-label'?: string | undefined;
  files: readonly [CodeFile, CodeFile, ...CodeFile[]];
}

const ComponentDocContext = createContext<string | null>(null);

function addRequiredClassName(className: string | undefined, requiredClassName: string) {
  return className ? `${className} ${requiredClassName}` : requiredClassName;
}

function useComponentDocTitle() {
  const title = useContext(ComponentDocContext);
  if (!title) {
    throw new Error('컴포넌트 문서 범위에서만 ComponentReference를 사용할 수 있습니다.');
  }

  return title;
}

function createPreviewOptionValues(axes: readonly OptionAxis[]): PreviewOptionValues {
  return Object.fromEntries(
    axes.map((axis) => [axis.name, axis.defaultValue ?? axis.values[0] ?? '']),
  );
}

function createPreviewProps(axes: readonly OptionAxis[], values: PreviewOptionValues) {
  return Object.fromEntries(
    axes.map((axis) => {
      const value = values[axis.name] ?? axis.defaultValue ?? axis.values[0] ?? '';
      return [axis.name, axis.control === 'switch' ? value === 'true' : value];
    }),
  );
}

function ExampleFrame({
  example,
  featuredTitle,
  optionAxes = [],
  previewLayout = 'center',
}: ExampleFrameProps) {
  const { previewDensity, resolvedPreviewTheme } = usePreviewSettings();
  const [previewOptionsOpen, setPreviewOptionsOpen] = useState(false);
  const [previewOptionValues, setPreviewOptionValues] = useState(() =>
    createPreviewOptionValues(optionAxes),
  );
  const isFeatured = featuredTitle !== undefined;
  const isConfigurable = example.configurable === true && optionAxes.length > 0;
  const title = featuredTitle ?? example.title;
  const titleId = `example-${example.id}`;
  const previewOptionsId = `preview-options-${example.id}`;
  const Example = example.Component;
  const ConfigurableExample = Example as ComponentType<Record<string, unknown>>;
  const Heading = isFeatured ? 'h2' : 'h3';
  const CodeHeading = isFeatured ? 'h3' : 'h4';
  const previewContent = isConfigurable ? (
    <ConfigurableExample {...createPreviewProps(optionAxes, previewOptionValues)} />
  ) : (
    <Example />
  );

  return (
    <Panel.Root aria-labelledby={titleId} className="city-docs-example" render={<section />}>
      <Panel.Header
        actions={
          <>
            <PreviewSettingsButton />
            {isConfigurable ? (
              <PreviewSidebarButton
                controls={previewOptionsId}
                onOpenChange={setPreviewOptionsOpen}
                open={previewOptionsOpen}
              />
            ) : null}
          </>
        }
        className="city-docs-example-heading"
        data-has-coverage={isFeatured ? undefined : ''}
      >
        <div className="city-docs-example-heading-content">
          <div className="city-docs-example-title-row">
            <div className="city-docs-example-heading-copy">
              <Heading className="city-docs-example-title" id={titleId}>
                {title}
              </Heading>
              {isFeatured ? null : (
                <p className="city-docs-example-description">{example.description}</p>
              )}
            </div>
          </div>
          {isFeatured ? null : (
            <div aria-label="이 예제가 다루는 옵션" className="city-docs-coverage-list">
              {example.coverage.flatMap((item) =>
                item.values.map((value) => (
                  <span key={`${item.axis}-${value}`}>
                    {item.axis}: {value}
                  </span>
                )),
              )}
            </div>
          )}
        </div>
      </Panel.Header>
      <Panel.Body className="city-docs-example-body">
        <Preview
          density={previewDensity}
          layout={previewLayout}
          options={
            isConfigurable && previewOptionsOpen
              ? {
                  axes: optionAxes,
                  id: previewOptionsId,
                  onValueChange: (name, value) =>
                    setPreviewOptionValues((current) => ({ ...current, [name]: value })),
                  values: previewOptionValues,
                }
              : undefined
          }
          theme={resolvedPreviewTheme}
        >
          {previewContent}
        </Preview>
        <Accordion.Root className="city-docs-example-code divide-y-0 rounded-none border-0 bg-transparent">
          <Accordion.Item value="code">
            <Accordion.Header render={<CodeHeading />}>
              <Accordion.Trigger className="city-docs-example-code-trigger">
                코드 보기
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel className="city-docs-example-code-panel px-0 pb-0">
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
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>
      </Panel.Body>
    </Panel.Root>
  );
}

export function ExampleSet({ examples, widePreviewIds = [] }: ExampleSetProps) {
  return (
    <div className="city-docs-example-set">
      {examples.map((example) => (
        <ExampleFrame
          example={example}
          key={example.id}
          previewLayout={widePreviewIds.includes(example.id) ? 'wide' : 'center'}
        />
      ))}
    </div>
  );
}

export function ComponentReference({ data }: ComponentReferenceProps) {
  const componentTitle = useComponentDocTitle();
  const featuredExample = data.examples.find((example) => example.id === data.featuredExampleId);
  if (!featuredExample) {
    throw new Error(`대표 예제를 찾을 수 없습니다: ${data.featuredExampleId}`);
  }

  const optionExamples = data.examples.filter((example) => example.id !== featuredExample.id);

  return (
    <div className="city-docs-component-reference">
      <ExampleFrame
        example={featuredExample}
        featuredTitle={componentTitle}
        optionAxes={featuredExample.configurable ? data.optionAxes : undefined}
        previewLayout={data.widePreviewIds?.includes(featuredExample.id) ? 'wide' : 'center'}
      />
      <ApiTable items={data.api} />
      {optionExamples.length > 0 ? (
        <section className="city-docs-component-reference-section">
          <h2 className="city-text-section-title" id="component-options">
            옵션과 사용법
          </h2>
          <ExampleSet examples={optionExamples} widePreviewIds={data.widePreviewIds} />
        </section>
      ) : null}
    </div>
  );
}

export function ComponentDocScope({ children, title }: ComponentDocScopeProps) {
  return <ComponentDocContext.Provider value={title}>{children}</ComponentDocContext.Provider>;
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
    <div className="city-docs-prose-code-wrap">
      <CodeBlock
        aria-label={ariaLabel}
        className="city-docs-prose-code"
        files={files}
        tabIndex={0}
      />
    </div>
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
      <div className="city-docs-prose-code-wrap">
        <CodeBlock
          {...props}
          aria-label={props['aria-label'] ?? '문서 코드 예제'}
          className={preClassName}
          code={codeBlock.code}
          language={codeBlock.language}
          tabIndex={0}
        />
      </div>
    );
  }

  return (
    <div className="city-docs-prose-code-wrap">
      <pre
        {...props}
        aria-label={props['aria-label'] ?? '문서 코드 예제'}
        className={preClassName}
        tabIndex={0}
      >
        {children}
      </pre>
    </div>
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

function getTaskListItem(children: ReactNode) {
  const childItems = Children.toArray(children);
  const checkboxIndex = childItems.findIndex(
    (child) =>
      isValidElement<ComponentPropsWithoutRef<'input'>>(child) &&
      child.type === 'input' &&
      child.props.type === 'checkbox',
  );

  if (checkboxIndex < 0) return undefined;

  const checkbox = childItems[checkboxIndex];
  if (!isValidElement<ComponentPropsWithoutRef<'input'>>(checkbox)) return undefined;

  return {
    checked: Boolean(checkbox.props.checked ?? checkbox.props.defaultChecked),
    content: childItems.filter((_, index) => index !== checkboxIndex),
  };
}

function MdxUnorderedList({ className, ...props }: ComponentPropsWithoutRef<'ul'>) {
  const isTaskList = className?.split(/\s+/).includes('contains-task-list') ?? false;

  return (
    <ul
      {...props}
      className={isTaskList ? addRequiredClassName(className, 'city-docs-checklist') : className}
    />
  );
}

function MdxListItem({ children, className, ...props }: ComponentPropsWithoutRef<'li'>) {
  const isTaskListItem = className?.split(/\s+/).includes('task-list-item') ?? false;
  const taskItem = isTaskListItem ? getTaskListItem(children) : undefined;

  if (!taskItem) {
    return (
      <li {...props} className={addRequiredClassName(className, 'city-text-body')}>
        {children}
      </li>
    );
  }

  return (
    <li
      {...props}
      className={addRequiredClassName(className, 'city-text-body city-docs-checklist-item')}
    >
      <label className="city-docs-checklist-row">
        <Checkbox
          className="city-docs-checklist-control"
          defaultChecked={taskItem.checked}
          size="md"
        />
        <span className="city-docs-checklist-label">{taskItem.content}</span>
      </label>
    </li>
  );
}

function MdxBlockquote({ className, ...props }: ComponentPropsWithoutRef<'blockquote'>) {
  return <blockquote {...props} className={addRequiredClassName(className, 'city-text-body')} />;
}

const MDX_COMPONENTS = {
  ApiTable,
  CodeFiles,
  ComponentReference,
  ExampleSet,
  blockquote: MdxBlockquote,
  h2: MdxHeading2,
  h3: MdxHeading3,
  li: MdxListItem,
  p: MdxParagraph,
  pre: MdxPre,
  table: MdxTable,
  ul: MdxUnorderedList,
} satisfies MDXComponents;

export function DocsMdxProvider({ children }: DocsMdxProviderProps) {
  return <MDXProvider components={MDX_COMPONENTS}>{children}</MDXProvider>;
}
