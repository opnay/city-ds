import bash from '@shikijs/langs/bash';
import css from '@shikijs/langs/css';
import tsx from '@shikijs/langs/tsx';
import typescript from '@shikijs/langs/typescript';
import githubDark from '@shikijs/themes/github-dark-default';
import githubLight from '@shikijs/themes/github-light-default';
import {
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { Check, Clipboard, X } from 'lucide-react';
import { Badge } from '@opnay/city-ds-react/badge';
import { Button } from '@opnay/city-ds-react/button';
import { Tabs } from '@opnay/city-ds-react/tabs';
import { createHighlighterCoreSync, type ThemedTokenWithVariants } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

const CODE_THEMES = {
  dark: 'github-dark-default',
  light: 'github-light-default',
} as const;

const LANGUAGE_ALIASES = {
  bash: 'bash',
  css: 'css',
  sh: 'bash',
  shell: 'bash',
  ts: 'typescript',
  tsx: 'tsx',
  typescript: 'typescript',
} as const;

const highlighter = createHighlighterCoreSync({
  engine: createJavaScriptRegexEngine(),
  langs: [bash, css, tsx, typescript],
  themes: [githubDark, githubLight],
});

type CodeLanguage = (typeof LANGUAGE_ALIASES)[keyof typeof LANGUAGE_ALIASES] | 'text';
type CopyState = 'error' | 'idle' | 'success';
type PreProps = Omit<ComponentPropsWithoutRef<'pre'>, 'children'>;

export interface CodeFile {
  filename: string;
  language?: string | undefined;
  source: string;
}

interface SingleCodeBlockProps extends PreProps {
  code: string;
  filename?: string | undefined;
  files?: never;
  language?: string | undefined;
}

interface MultiCodeBlockProps extends PreProps {
  code?: never;
  filename?: never;
  files: readonly [CodeFile, CodeFile, ...CodeFile[]];
  language?: never;
}

type CodeBlockProps = MultiCodeBlockProps | SingleCodeBlockProps;

interface InternalCodeFile {
  filename?: string | undefined;
  language?: string | undefined;
  source: string;
}

interface CodeTokenStyle extends CSSProperties {
  '--city-docs-code-token-dark'?: string | undefined;
  '--city-docs-code-token-light'?: string | undefined;
}

interface CodeLinesStyle extends CSSProperties {
  '--city-docs-code-line-number-width': string;
}

interface CodeHeaderProps {
  copyState: CopyState;
  file: InternalCodeFile;
  fileNavigation?: ReactNode;
  onCopy: () => void;
}

async function writeClipboard(value: string): Promise<void> {
  if (!navigator.clipboard) throw new Error('Clipboard API is unavailable');
  await navigator.clipboard.writeText(value);
}

function resolveLanguage(language: string | undefined): CodeLanguage {
  if (!language) return 'text';
  return LANGUAGE_ALIASES[language as keyof typeof LANGUAGE_ALIASES] ?? 'text';
}

function getLanguageLabel(language: string | undefined): string {
  const labels: Record<CodeLanguage, string> = {
    bash: 'Shell',
    css: 'CSS',
    text: 'Plain text',
    tsx: 'TypeScript JSX',
    typescript: 'TypeScript',
  };

  return labels[resolveLanguage(language)];
}

function getTokenStyle(token: ThemedTokenWithVariants): CodeTokenStyle {
  return {
    '--city-docs-code-token-dark': token.variants.dark?.color,
    '--city-docs-code-token-light': token.variants.light?.color,
  };
}

function trimFenceNewline(code: string): string {
  return code.endsWith('\n') ? code.slice(0, -1) : code;
}

function getCodeBlockFiles(props: CodeBlockProps): {
  className: string | undefined;
  files: readonly InternalCodeFile[];
  preProps: PreProps;
} {
  if (props.files) {
    const { className, files, ...preProps } = props;
    return { className, files, preProps };
  }

  const { className, code, filename, language, ...preProps } = props;
  return {
    className,
    files: [{ filename, language, source: code }],
    preProps,
  };
}

function CodeHeader({ copyState, file, fileNavigation, onCopy }: CodeHeaderProps) {
  const languageBadge = (
    <Badge appearance="outline" size="sm" tone="neutral">
      {getLanguageLabel(file.language)}
    </Badge>
  );
  const copySubject = file.filename ? `${file.filename} 코드` : '코드';

  return (
    <header className="city-docs-code-header">
      <div className="city-docs-code-context">
        {fileNavigation ??
          (file.filename ? (
            <span className="city-docs-code-filename">{file.filename}</span>
          ) : (
            languageBadge
          ))}
      </div>
      <div className="city-docs-code-actions">
        {file.filename ? languageBadge : null}
        <Button onClick={onCopy} size="sm" type="button" variant="ghost">
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
            ? `${copySubject}를 복사했습니다.`
            : copyState === 'error'
              ? `${copySubject}를 복사할 수 없습니다. 코드를 직접 선택하십시오.`
              : ''}
        </span>
      </div>
    </header>
  );
}

function HighlightedCode({
  className,
  file,
  preProps,
}: {
  className: string | undefined;
  file: InternalCodeFile;
  preProps: PreProps;
}) {
  const resolvedLanguage = resolveLanguage(file.language);
  const displayedCode = trimFenceNewline(file.source);
  const tokens = useMemo(
    () =>
      highlighter.codeToTokensWithThemes(displayedCode, {
        lang: resolvedLanguage,
        themes: CODE_THEMES,
      }),
    [displayedCode, resolvedLanguage],
  );
  const codeStyle: CodeLinesStyle = {
    '--city-docs-code-line-number-width': `${Math.max(String(tokens.length).length, 2)}ch`,
  };
  const preClassName = className ? `city-docs-code-block ${className}` : 'city-docs-code-block';

  return (
    <pre {...preProps} className={preClassName}>
      <code data-language={resolvedLanguage} style={codeStyle}>
        {tokens.map((line, lineIndex) => (
          <span data-code-line="" key={lineIndex}>
            <span aria-hidden="true" className="city-docs-code-line-number">
              {lineIndex + 1}
            </span>
            <span className="city-docs-code-line-content">
              {line.map((token) => (
                <span
                  className="city-docs-code-token"
                  key={token.offset}
                  style={getTokenStyle(token)}
                >
                  {token.content}
                </span>
              ))}
              {lineIndex < tokens.length - 1 ? '\n' : null}
            </span>
          </span>
        ))}
      </code>
    </pre>
  );
}

export function CodeBlock(props: CodeBlockProps) {
  const { className, files, preProps } = getCodeBlockFiles(props);
  const [activeIndex, setActiveIndex] = useState(0);
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const copyRequest = useRef(0);
  const activeFile = files[activeIndex] ?? files[0]!;

  const copySource = async () => {
    const request = ++copyRequest.current;

    try {
      await writeClipboard(activeFile.source);
      if (request === copyRequest.current) setCopyState('success');
    } catch {
      if (request === copyRequest.current) setCopyState('error');
    }
  };

  if (files.length === 1) {
    return (
      <div className="city-docs-code-frame">
        <CodeHeader copyState={copyState} file={activeFile} onCopy={() => void copySource()} />
        <HighlightedCode className={className} file={activeFile} preProps={preProps} />
      </div>
    );
  }

  const selectFile = (value: string | number | null) => {
    const nextIndex = Number(value);
    if (!Number.isInteger(nextIndex) || !files[nextIndex]) return;

    copyRequest.current += 1;
    setActiveIndex(nextIndex);
    setCopyState('idle');
  };

  const fileNavigation = (
    <Tabs.List aria-label="코드 파일" className="city-docs-code-tabs">
      {files.map((file, index) => (
        <Tabs.Tab key={`${file.filename}-${index}`} value={String(index)}>
          {file.filename}
        </Tabs.Tab>
      ))}
    </Tabs.List>
  );

  return (
    <Tabs.Root
      className="city-docs-code-frame"
      density="compact"
      onValueChange={selectFile}
      value={String(activeIndex)}
    >
      <CodeHeader
        copyState={copyState}
        file={activeFile}
        fileNavigation={fileNavigation}
        onCopy={() => void copySource()}
      />
      {files.map((file, index) => (
        <Tabs.Panel
          className="city-docs-code-panel"
          key={`${file.filename}-${index}`}
          value={String(index)}
        >
          {index === activeIndex ? (
            <HighlightedCode className={className} file={file} preProps={preProps} />
          ) : null}
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  );
}
