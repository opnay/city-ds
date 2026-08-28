import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { renderDocs } from '../test/render-docs';

function expectHighlighted(codeBlock: HTMLElement, language: string) {
  expect(codeBlock.querySelector('code')).toHaveAttribute('data-language', language);
  expect(codeBlock.querySelectorAll('.city-docs-code-token').length).toBeGreaterThan(1);
  expect(codeBlock.querySelector('.city-docs-code-line-number')).toHaveTextContent('1');
}

describe('document syntax highlighting', () => {
  it('highlights MDX fences and raw component example sources', async () => {
    const user = userEvent.setup();
    const guide = await renderDocs(['/getting-started']);
    const mdxCodeBlock = screen
      .getAllByLabelText('문서 코드 예제')
      .find((element) => element.querySelector('code[data-language="tsx"]'));
    const fileTabs = screen.getByRole('tablist', { name: '코드 파일' });

    expect(mdxCodeBlock).toBeDefined();
    expectHighlighted(mdxCodeBlock as HTMLElement, 'tsx');
    expect(within(fileTabs).getByRole('tab', { name: 'src/main.tsx' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await user.click(within(fileTabs).getByRole('tab', { name: 'app/layout.tsx' }));
    expect(within(fileTabs).getByRole('tab', { name: 'app/layout.tsx' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    guide.unmount();
    await renderDocs(['/components/button']);
    const featuredExample = screen.getByRole('region', { name: 'Button' });
    await user.click(within(featuredExample).getByRole('button', { name: '코드 보기' }));
    const exampleCode = screen.getByLabelText('액션 위계 예제 소스 코드');
    const importCode = screen.getByLabelText('Button 가져오기 코드');

    expectHighlighted(exampleCode, 'tsx');
    expect(exampleCode.closest('.city-docs-code-frame')).toHaveTextContent('variants.tsx');
    expectHighlighted(importCode, 'tsx');
    expect(importCode.closest('.city-docs-code-frame')).toHaveTextContent('TypeScript JSX');
  });
});
