import { createFileRoute } from '@tanstack/react-router';

import { GuidePage } from '../components/doc-page';
import Content from '../docs/guides/accessibility.mdx';

export const Route = createFileRoute('/accessibility')({ component: AccessibilityPage });

function AccessibilityPage() {
  return (
    <GuidePage
      description="이름, 설명, 키보드, 포커스, 상태와 작은 화면을 함께 점검합니다."
      eyebrow="Accessibility"
      title="접근성"
    >
      <Content />
    </GuidePage>
  );
}
