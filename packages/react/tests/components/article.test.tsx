import * as React from 'react';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Article } from '../../src/components/article';

describe('Article', () => {
  it('renders Markdown as semantic content with GFM and scoped scroll regions', () => {
    const source = [
      '## 변경 내용',
      '',
      '- 첫 번째 항목',
      '- 두 번째 항목',
      '',
      '1. 확인',
      '2. 완료',
      '',
      '- [x] 검토함',
      '',
      '| 파일 | 상태 |',
      '| --- | --- |',
      '| page.tsx | 완료 |',
      '',
      '```ts',
      'const ready = true;',
      '```',
    ].join('\n');
    const { container } = render(<Article markdown={source} />);

    const article = container.querySelector('article');
    expect(article).toHaveAttribute('data-city-article');
    expect(within(article!).getByRole('heading', { name: '변경 내용', level: 2 })).toBeVisible();
    expect(article?.querySelectorAll('ul li')).toHaveLength(3);
    expect(article?.querySelectorAll('ol li')).toHaveLength(2);
    expect(article?.querySelector('input[type="checkbox"]')).toBeNull();
    expect(within(article!).getByRole('img', { name: '완료' })).toHaveAttribute(
      'data-city-article-task-state',
      'complete',
    );
    expect(within(article!).getByText('검토함').closest('li')).toHaveClass('task-list-item');
    expect(within(article!).getByRole('region', { name: '본문 표' })).toContainElement(
      within(article!).getByRole('table'),
    );
    expect(within(article!).getByRole('region', { name: '본문 표' })).toHaveAttribute(
      'tabindex',
      '0',
    );
    expect(within(article!).getByLabelText('코드 블록')).toHaveAttribute('tabindex', '0');
    expect(within(article!).getByText('const ready = true;')).toBeVisible();
  });

  it('labels footnotes in Korean and keeps links inside each Article', () => {
    const source = '설명[^note]과 재참조[^note]\n\n[^note]: 각주 내용';
    const { container } = render(
      <>
        <Article markdown={source} />
        <Article markdown={source} />
      </>,
    );
    const articles = [...container.querySelectorAll('[data-city-article]')];
    const ids = [...container.querySelectorAll('[id]')].map((element) => element.id);

    expect(new Set(ids).size).toBe(ids.length);
    for (const article of articles) {
      const footnotes = article.querySelector('section[data-footnotes]');
      const heading = within(article as HTMLElement).getByRole('heading', {
        level: 2,
        name: '각주',
      });
      const references = [...article.querySelectorAll('a[data-footnote-ref]')];
      const backLinks = [...article.querySelectorAll('a[data-footnote-backref]')];

      expect(footnotes).toHaveAttribute('aria-labelledby', heading.id);
      expect(references).toHaveLength(2);
      expect(backLinks).toHaveLength(2);
      for (const reference of references) {
        expect(reference).toHaveAttribute('aria-describedby', heading.id);
        expect(article.querySelector(reference.getAttribute('href')!)).toBeInTheDocument();
      }
      for (const backLink of backLinks) {
        expect(backLink).toHaveTextContent('본문');
        expect(backLink).toHaveAccessibleName(/각주 1의 본문 참조/);
        expect(article.querySelector(backLink.getAttribute('href')!)).toBeInTheDocument();
      }
    }
  });

  it('omits raw HTML and remote images and does not expose unsafe link URLs', () => {
    const { container } = render(
      <Article
        markdown={
          '<script>alert(1)</script>\n\n![원격 이미지](https://example.com/pixel.png)\n\n[위험한 링크](javascript:alert(1))'
        }
      />,
    );

    expect(container.querySelector('script, img')).toBeNull();
    expect(screen.getByText('원격 이미지')).toBeVisible();
    expect(screen.getByText('위험한 링크').closest('a')?.getAttribute('href')).toBe('');
  });

  it('uses the same content boundary for React children and supports render composition', () => {
    const ref = React.createRef<HTMLElement>();
    const { container } = render(
      <Article aria-label="본문" ref={ref} render={<div />}>
        <p>설명</p>
        <ul>
          <li>항목</li>
        </ul>
      </Article>,
    );

    const root = screen.getByLabelText('본문');
    expect(root.tagName).toBe('DIV');
    expect(ref.current).toBe(root);
    expect(root).toHaveAttribute('data-city-article');
    expect(container.querySelector('ul > li')).toHaveTextContent('항목');
  });
});
