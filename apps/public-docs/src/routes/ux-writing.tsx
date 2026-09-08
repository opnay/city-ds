import { createFileRoute } from '@tanstack/react-router';

import { GuidePage } from '../components/doc-page';
import Content from '../docs/guides/ux-writing.mdx';

export const Route = createFileRoute('/ux-writing')({ component: UxWritingPage });

function UxWritingPage() {
  return (
    <GuidePage
      description="사용자 맥락에 맞게 중복을 줄이고 명확하고 자연스러운 UX 문구를 작성합니다."
      eyebrow="UX Writing"
      title="UX Writing"
    >
      <Content />
    </GuidePage>
  );
}
