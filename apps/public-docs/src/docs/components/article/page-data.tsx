import ContentExample from './examples/content';
import contentSource from './examples/content.tsx?raw';
import ChatExample from './examples/chat';
import chatSource from './examples/chat.tsx?raw';
import HeadingsExample from './examples/headings';
import headingsSource from './examples/headings.tsx?raw';
import type { PreviewOptionProps } from '../../preview-playgrounds/types';
import type { ComponentPageData } from '../../types';

function Preview({ format }: PreviewOptionProps) {
  return <ContentExample format={format === 'react' ? 'react' : 'markdown'} />;
}

export const pageData = {
  featuredExampleId: 'article-content',
  widePreviewIds: ['article-content', 'article-headings', 'article-chat'],
  api: [
    {
      name: 'Article',
      type: 'article props + render',
      description: '제목·문단·목록·링크·인용·코드·표에 본문 스타일을 적용합니다.',
    },
    {
      name: 'markdown',
      type: 'string',
      description: 'Markdown과 GFM 목록·체크리스트·표를 HTML 요소로 변환합니다.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description:
        '기존 HTML·React 요소를 같은 본문 스타일로 표시합니다. markdown과 함께 전달하지 않습니다.',
    },
    {
      name: 'render',
      type: 'ReactElement',
      description: '채팅 메시지처럼 중첩 article이 적합하지 않은 곳에서는 div 등으로 합성합니다.',
    },
  ],
  optionAxes: [
    {
      name: 'format',
      control: 'segmented',
      defaultValue: 'markdown',
      values: ['markdown', 'react'],
    },
  ],
  examples: [
    {
      id: 'article-content',
      title: 'Preview',
      description: '같은 본문을 Markdown 문자열과 React children으로 비교합니다.',
      Component: Preview,
      configurable: true,
      filename: 'content.tsx',
      source: contentSource,
      coverage: [{ axis: 'format', values: ['markdown', 'react'] }],
    },
    {
      id: 'article-chat',
      title: '대화 본문',
      description: 'Commentary.Content 안에서 Article을 div로 합성합니다.',
      Component: ChatExample,
      filename: 'chat.tsx',
      source: chatSource,
      coverage: [{ axis: 'render', values: ['div'] }],
    },
    {
      id: 'article-headings',
      title: '제목 수준',
      description: 'h1부터 h6까지의 제목을 같은 Article 안에서 비교합니다.',
      Component: HeadingsExample,
      filename: 'headings.tsx',
      source: headingsSource,
      coverage: [{ axis: 'heading', values: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    },
  ],
} satisfies ComponentPageData;
