import { createFileRoute } from '@tanstack/react-router';

import { GuidePage } from '../components/doc-page';
import Content from '../docs/guides/getting-started.mdx';

export const Route = createFileRoute('/getting-started')({ component: GettingStartedPage });

function GettingStartedPage() {
  return (
    <GuidePage
      description="패키지를 연결하고 CSS·테마를 애플리케이션 진입점에 적용합니다."
      eyebrow="Getting started"
      title="시작하기"
    >
      <Content />
    </GuidePage>
  );
}
