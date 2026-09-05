import { ScrollArea } from '@opnay/city-ds-react/scroll-area';

import type { PreviewOptionProps } from './types';

const EVENTS = [
  '빌드 큐에 변경 사항을 추가했습니다.',
  '타입 검사를 시작했습니다.',
  '컴포넌트 패키지를 빌드했습니다.',
  'Public Docs 번들을 생성했습니다.',
  '접근성 검사를 완료했습니다.',
  '미리보기 배포를 준비했습니다.',
  '배포 이벤트를 기록했습니다.',
  '릴리스 노트를 갱신했습니다.',
] as const;

function ScrollAreaContent({ bothAxes }: { bothAxes: boolean }) {
  return (
    <ScrollArea.Content
      className={
        bothAxes
          ? 'city-docs-scroll-area-content city-docs-scroll-area-wide-content'
          : 'city-docs-scroll-area-content'
      }
    >
      {bothAxes ? (
        <div className="city-docs-scroll-area-grid">
          {EVENTS.map((event, index) => (
            <span className="city-docs-scroll-area-item" key={event}>
              {index + 1}. {event}
            </span>
          ))}
        </div>
      ) : (
        EVENTS.map((event, index) => (
          <span className="city-docs-scroll-area-item" key={event}>
            {index + 1}. {event}
          </span>
        ))
      )}
    </ScrollArea.Content>
  );
}

export function ScrollAreaPreview({ axes }: PreviewOptionProps) {
  const bothAxes = axes === 'both';

  return (
    <ScrollArea.Root className="city-docs-scroll-area">
      <ScrollArea.Viewport aria-label="배포 이벤트">
        <ScrollAreaContent bothAxes={bothAxes} />
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar keepMounted orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      {bothAxes ? (
        <ScrollArea.Scrollbar keepMounted orientation="horizontal">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      ) : null}
      {bothAxes ? <ScrollArea.Corner /> : null}
    </ScrollArea.Root>
  );
}
