import bash from '@shikijs/langs/bash';
import css from '@shikijs/langs/css';
import tsx from '@shikijs/langs/tsx';
import typescript from '@shikijs/langs/typescript';
import githubDark from '@shikijs/themes/github-dark-default';
import githubLight from '@shikijs/themes/github-light-default';
import { useMemo, type ComponentPropsWithoutRef, type CSSProperties } from 'react';
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

interface CodeBlockProps extends Omit<ComponentPropsWithoutRef<'pre'>, 'children'> {
  code: string;
  language?: string | undefined;
}

interface CodeTokenStyle extends CSSProperties {
  '--city-docs-code-token-dark'?: string | undefined;
  '--city-docs-code-token-light'?: string | undefined;
}

interface CodeLinesStyle extends CSSProperties {
  '--city-docs-code-line-number-width': string;
}

function resolveLanguage(language: string | undefined): CodeLanguage {
  if (!language) return 'text';
  return LANGUAGE_ALIASES[language as keyof typeof LANGUAGE_ALIASES] ?? 'text';
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

export function CodeBlock({ className, code, language, ...props }: CodeBlockProps) {
  const resolvedLanguage = resolveLanguage(language);
  const displayedCode = trimFenceNewline(code);
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
    <pre {...props} className={preClassName}>
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
