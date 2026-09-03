import { useState } from 'react';
import { SegmentedControl } from '@opnay/city-ds-react/segmented-control';

const viewLabels = {
  grid: '격자',
  list: '목록',
  map: '지도',
};

export default function SegmentedControlSelectionExample() {
  const [view, setView] = useState<keyof typeof viewLabels>('grid');

  return (
    <div className="city-docs-example-stack">
      <section className="city-docs-example-item">
        <strong>제어된 보기 방식</strong>
        <p>외부 상태가 현재 선택을 소유합니다.</p>
        <SegmentedControl aria-label="보기 방식" onValueChange={setView} value={view}>
          <SegmentedControl.Item value="grid">격자</SegmentedControl.Item>
          <SegmentedControl.Item value="list">목록</SegmentedControl.Item>
          <SegmentedControl.Item disabled value="map">
            지도
          </SegmentedControl.Item>
        </SegmentedControl>
        <span aria-live="polite" className="text-xs text-city-muted-foreground">
          현재 보기: {viewLabels[view]}
        </span>
      </section>
      <section className="city-docs-example-item">
        <strong>비제어 기간</strong>
        <p>초기 선택 이후에는 컴포넌트가 값을 관리합니다.</p>
        <SegmentedControl aria-label="조회 기간" defaultValue="week">
          <SegmentedControl.Item value="day">오늘</SegmentedControl.Item>
          <SegmentedControl.Item value="week">7일</SegmentedControl.Item>
          <SegmentedControl.Item value="month">30일</SegmentedControl.Item>
        </SegmentedControl>
      </section>
    </div>
  );
}
