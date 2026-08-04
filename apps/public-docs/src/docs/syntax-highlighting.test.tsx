import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderDocs } from '../test/render-docs';

function expectHighlighted(codeBlock: HTMLElement, language: string) {
  expect(codeBlock.querySelector('code')).toHaveAttribute('data-language', language);
  expect(codeBlock.querySelectorAll('.city-docs-code-token').length).toBeGreaterThan(1);
}

describe('document syntax highlighting', () => {
  it('highlights MDX fences and raw component example sources', async () => {
    const guide = await renderDocs(['/getting-started']);
    const mdxCodeBlock = screen
      .getAllByLabelText('문서 코드 예제')
      .find((element) => element.querySelector('code[data-language="tsx"]'));

    expect(mdxCodeBlock).toBeDefined();
    expectHighlighted(mdxCodeBlock as HTMLElement, 'tsx');

    guide.unmount();
    await renderDocs(['/components/button']);
    expectHighlighted(screen.getByLabelText('액션 위계 예제 소스 코드'), 'tsx');
  });
});
