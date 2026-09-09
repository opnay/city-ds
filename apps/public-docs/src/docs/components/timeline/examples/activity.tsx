import { Timeline, type TimelineRootProps } from '@opnay/city-ds-react/timeline';
import { Badge } from '@opnay/city-ds-react/badge';
import { Check, FileText } from 'lucide-react';

export default function TimelineActivityExample({
  density = 'comfortable',
}: Pick<TimelineRootProps, 'density'>) {
  return (
    <Timeline.Root density={density} aria-label="프로젝트 활동" className="w-full">
      <Timeline.Item>
        <Timeline.Indicator>
          <Check />
        </Timeline.Indicator>
        <Timeline.Connector />
        <Timeline.Content>
          <Timeline.Time dateTime="2026-09-09T10:30:00+09:00">오늘 오전 10:30</Timeline.Time>
          <Timeline.Title>
            검토를 완료했습니다 <Badge appearance="subtle">승인</Badge>
          </Timeline.Title>
          <Timeline.Description>김서연님이 변경 내용을 확인했습니다.</Timeline.Description>
        </Timeline.Content>
      </Timeline.Item>
      <Timeline.Item>
        <Timeline.Indicator>
          <FileText />
        </Timeline.Indicator>
        <Timeline.Connector />
        <Timeline.Content>
          <Timeline.Time dateTime="2026-09-09T10:00:00+09:00">오늘 오전 10:00</Timeline.Time>
          <Timeline.Title>기획서를 수정했습니다</Timeline.Title>
          <Timeline.Description>
            참여자 피드백을 반영하여 프로젝트의 목표와 작업 일정을 업데이트했습니다.
          </Timeline.Description>
        </Timeline.Content>
      </Timeline.Item>
      <Timeline.Item>
        <Timeline.Indicator />
        <Timeline.Connector />
        <Timeline.Content>
          <Timeline.Time dateTime="2026-09-08">9월 8일</Timeline.Time>
          <Timeline.Title>프로젝트를 만들었습니다</Timeline.Title>
        </Timeline.Content>
      </Timeline.Item>
    </Timeline.Root>
  );
}
