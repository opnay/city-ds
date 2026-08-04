import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CodeBlock } from './code-block';

const LANGUAGE_CASES = [
  ['bash', 'if true; then echo "ready"; fi'],
  ['css', '.button { color: red; }'],
  ['tsx', 'export function Button() { return <button>Save</button>; }'],
  ['typescript', "import { type User } from './types';"],
] as const;

function getTokenColors(codeBlock: HTMLElement, theme: 'dark' | 'light'): Set<string> {
  return new Set(
    [...codeBlock.querySelectorAll<HTMLElement>('.city-docs-code-token')]
      .map((token) => token.style.getPropertyValue(`--city-docs-code-token-${theme}`))
      .filter(Boolean),
  );
}

describe('CodeBlock', () => {
  it.each(LANGUAGE_CASES)('highlights %s with multiple token colors', (language, code) => {
    render(<CodeBlock aria-label={`${language} code`} code={code} language={language} />);
    const codeBlock = screen.getByLabelText(`${language} code`);

    expect(getTokenColors(codeBlock, 'light').size).toBeGreaterThan(1);
    expect(getTokenColors(codeBlock, 'dark').size).toBeGreaterThan(1);
    expect(codeBlock.querySelector('code')).toHaveAttribute('data-language', language);
  });

  it('assigns distinct colors to TypeScript keywords and function names', () => {
    render(
      <CodeBlock
        aria-label="TypeScript example"
        code={'import { x } from "y";\nfunction load() {}'}
        language="ts"
        tabIndex={0}
      />,
    );
    const codeBlock = screen.getByLabelText('TypeScript example');
    const tokens = [...codeBlock.querySelectorAll<HTMLElement>('.city-docs-code-token')];
    const importToken = tokens.find((token) => token.textContent === 'import');
    const functionNameToken = tokens.find((token) => token.textContent === 'load');

    expect(codeBlock).toHaveAttribute('tabindex', '0');
    expect(codeBlock.querySelector('code')).toHaveAttribute('data-language', 'typescript');
    expect(importToken?.style.getPropertyValue('--city-docs-code-token-light')).toBe('#CF222E');
    expect(functionNameToken?.style.getPropertyValue('--city-docs-code-token-light')).toBe(
      '#8250DF',
    );
    expect(importToken?.style.getPropertyValue('--city-docs-code-token-dark')).toBe('#FF7B72');
    expect(functionNameToken?.style.getPropertyValue('--city-docs-code-token-dark')).toBe(
      '#D2A8FF',
    );
  });

  it('renders unknown languages as plain text', () => {
    render(<CodeBlock aria-label="Plain example" code={'first\nsecond\n'} language="unknown" />);
    const codeBlock = screen.getByLabelText('Plain example');

    expect(codeBlock.querySelector('code')).toHaveAttribute('data-language', 'text');
    expect(
      [...codeBlock.querySelectorAll('.city-docs-code-line-content')]
        .map((line) => line.textContent)
        .join(''),
    ).toBe('first\nsecond');
  });

  it('shows one-based line numbers without exposing them to assistive technology', () => {
    render(<CodeBlock aria-label="Numbered example" code={'first\nsecond'} language="text" />);
    const codeBlock = screen.getByLabelText('Numbered example');
    const lineNumbers = [...codeBlock.querySelectorAll('.city-docs-code-line-number')];

    expect(lineNumbers.map((lineNumber) => lineNumber.textContent)).toEqual(['1', '2']);
    expect(
      lineNumbers.every((lineNumber) => lineNumber.getAttribute('aria-hidden') === 'true'),
    ).toBe(true);
  });
});
