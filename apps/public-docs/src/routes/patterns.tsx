import { createFileRoute } from '@tanstack/react-router';

import { GuidePage } from '../components/doc-page';
import Content from '../docs/guides/patterns.mdx';

export const Route = createFileRoute('/patterns')({ component: PatternsPage });

function PatternsPage() {
  return (
    <GuidePage
      description="폼, 데이터 목록, 피드백과 오버레이를 사용자 작업 단위로 조합합니다."
      eyebrow="Patterns"
      title="패턴"
    >
      <Content />
    </GuidePage>
  );
}
