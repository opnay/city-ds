import { ScrollArea } from '@opnay/city-ds-react/scroll-area';

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

export default function ScrollAreaVerticalExample() {
  return (
    <ScrollArea.Root className="city-docs-scroll-area">
      <ScrollArea.Viewport aria-label="배포 이벤트">
        <ScrollArea.Content className="city-docs-scroll-area-content">
          {EVENTS.map((event, index) => (
            <span className="city-docs-scroll-area-item" key={event}>
              {index + 1}. {event}
            </span>
          ))}
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}
