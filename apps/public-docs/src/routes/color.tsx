import { createFileRoute } from '@tanstack/react-router';

import { GuidePage } from '../components/doc-page';
import Content from '../docs/guides/color.mdx';

export const Route = createFileRoute('/color')({ component: ColorPage });

function ColorPage() {
  return (
    <GuidePage
      description="팔레트, 의미 토큰, tone과 appearance를 Light·Dark·System에서 일관되게 적용합니다."
      eyebrow="Color"
      title="색상"
    >
      <Content />
    </GuidePage>
  );
}
