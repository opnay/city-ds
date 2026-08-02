import { createFileRoute } from '@tanstack/react-router';

import { GuidePage } from '../components/doc-page';
import Content from '../docs/guides/foundations.mdx';

export const Route = createFileRoute('/foundations')({ component: FoundationsPage });

function FoundationsPage() {
  return (
    <GuidePage
      description="토큰, 크기, 밀도, 표면과 테마를 같은 시각 언어로 적용합니다."
      eyebrow="Foundations"
      title="기초"
    >
      <Content />
    </GuidePage>
  );
}
