import { Timeline } from '@opnay/city-ds-react/timeline';
import { Check, X, TriangleAlert, LoaderCircle } from 'lucide-react';

const builds = [
  {
    id: '#125',
    color: undefined,
    title: '빌드 대기 중',
    description: '실행할 작업 공간을 기다리고 있습니다.',
    Icon: null,
  },
  {
    id: '#124',
    color: '#2563eb',
    title: '빌드 실행 중',
    description: '패키지를 설치하고 있습니다.',
    Icon: LoaderCircle,
  },
  {
    id: '#123',
    color: 'rgb(180, 83, 9)',
    title: '경고와 함께 완료',
    description: '빌드를 완료했지만 권장 번들 크기를 초과했습니다.',
    Icon: TriangleAlert,
  },
  {
    id: '#122',
    color: 'var(--city-palette-red-700)',
    title: '빌드 실패',
    description: '타입 오류로 빌드를 중단했습니다.',
    Icon: X,
  },
  {
    id: '#121',
    color: '#15803d',
    title: '빌드 성공',
    description: '모든 검증을 통과하고 배포 파일을 생성했습니다.',
    Icon: Check,
  },
] as const;

export default function TimelineBuildHistoryExample() {
  return (
    <Timeline.Root aria-label="빌드 이력" className="w-full">
      {builds.map(({ id, color, title, description, Icon }) => (
        <Timeline.Item key={id}>
          <Timeline.Indicator color={color}>{Icon ? <Icon /> : undefined}</Timeline.Indicator>
          <Timeline.Connector />
          <Timeline.Content>
            <Timeline.Title>
              {id} · {title}
            </Timeline.Title>
            <Timeline.Description>{description}</Timeline.Description>
          </Timeline.Content>
        </Timeline.Item>
      ))}
    </Timeline.Root>
  );
}
