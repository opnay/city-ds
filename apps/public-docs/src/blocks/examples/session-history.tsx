import { useState } from 'react';
import { Laptop, Smartphone } from 'lucide-react';
import { Badge } from '@opnay/city-ds-react/badge';
import { Button } from '@opnay/city-ds-react/button';
import { SegmentedControl } from '@opnay/city-ds-react/segmented-control';
import { AccountActionDialog } from './user-management-shared';
import { BlockCard } from './block-card';
import './blocks.css';

export interface SessionRecord {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  current: boolean;
  mobile: boolean;
  status: 'active' | 'ended';
}

export const exampleSessions: SessionRecord[] = [
  {
    id: 'current',
    device: 'MacBook Pro',
    browser: 'Chrome · macOS',
    location: '서울, 대한민국',
    ip: '192.0.2.10',
    lastActive: '현재 활동 중',
    current: true,
    mobile: false,
    status: 'active',
  },
  {
    id: 'phone',
    device: 'iPhone',
    browser: 'Safari · iOS',
    location: '서울, 대한민국',
    ip: '198.51.100.24',
    lastActive: '20분 전',
    current: false,
    mobile: true,
    status: 'active',
  },
  {
    id: 'desktop',
    device: 'Windows PC',
    browser: 'Edge · Windows',
    location: '성남, 대한민국',
    ip: '203.0.113.32',
    lastActive: '어제 오후 3:20',
    current: false,
    mobile: false,
    status: 'active',
  },
  {
    id: 'old',
    device: 'iPad',
    browser: 'Safari · iPadOS',
    location: '서울, 대한민국',
    ip: '192.0.2.48',
    lastActive: '9월 1일 오전 10:15',
    current: false,
    mobile: true,
    status: 'ended',
  },
];

export function SessionHistory({
  initialSessions,
  onRevoke,
}: {
  initialSessions: SessionRecord[];
  onRevoke: (ids: string[]) => Promise<void>;
}) {
  const [sessions, setSessions] = useState(initialSessions);
  const [filter, setFilter] = useState<'active' | 'all'>('active');
  const [targets, setTargets] = useState<string[]>([]);
  const [notice, setNotice] = useState('');
  const otherActive = sessions.filter((session) => !session.current && session.status === 'active');
  const visible = sessions.filter((session) => filter === 'all' || session.status === 'active');
  return (
    <BlockCard
      title="세션 기록"
      description="로그인한 기기를 확인하고 사용하지 않는 세션을 종료합니다."
    >
      <div className="city-block-split">
        <SegmentedControl size="lg" aria-label="세션 보기" value={filter} onValueChange={setFilter}>
          <SegmentedControl.Item value="active">로그인 중</SegmentedControl.Item>
          <SegmentedControl.Item value="all">전체 기록</SegmentedControl.Item>
        </SegmentedControl>
        <span className="city-block-status" role="status">
          {visible.length}개 세션
        </span>
      </div>
      <ul className="city-block-list">
        {visible.map((session) => (
          <li className="city-block-session" key={session.id}>
            <div className="city-block-session-icon">
              {session.mobile ? (
                <Smartphone aria-hidden="true" size={22} />
              ) : (
                <Laptop aria-hidden="true" size={22} />
              )}
            </div>
            <div className="city-block-session-info">
              <div className="city-block-actions">
                <strong className="city-block-section-title">{session.device}</strong>
                {session.current && <Badge>현재 세션</Badge>}
                {session.status === 'ended' && <Badge>종료됨</Badge>}
              </div>
              <p className="city-block-description">{session.browser}</p>
              <p className="city-block-description">
                {session.location} · {session.ip}
              </p>
              <p className="city-block-description">{session.lastActive}</p>
            </div>
            {!session.current && session.status === 'active' && (
              <Button
                size="lg"
                variant="outline"
                aria-label={`${session.device} 세션 종료`}
                onClick={() => setTargets([session.id])}
              >
                종료
              </Button>
            )}
          </li>
        ))}
      </ul>
      <div className="city-block-actions city-block-actions--separated">
        <Button
          size="lg"
          variant="outline"
          disabled={!otherActive.length}
          onClick={() => setTargets(otherActive.map((session) => session.id))}
        >
          다른 세션 모두 종료
        </Button>
      </div>
      <output className="city-block-status" aria-live="polite">
        {notice}
      </output>
      <AccountActionDialog
        open={targets.length > 0}
        onOpenChange={(open) => {
          if (!open) setTargets([]);
        }}
        title={
          targets.length > 1 ? '다른 세션을 모두 종료하시겠습니까?' : '이 세션을 종료하시겠습니까?'
        }
        description="선택한 기기는 다시 로그인해야 합니다. 현재 사용 중인 세션은 유지합니다."
        confirmLabel="세션 종료"
        destructive
        onConfirm={async () => {
          const ids = otherActive
            .filter((session) => targets.includes(session.id))
            .map((session) => session.id);
          if (!ids.length) return;
          await onRevoke(ids);
          setSessions((current) =>
            current.map((session) =>
              ids.includes(session.id) && !session.current
                ? { ...session, status: 'ended' }
                : session,
            ),
          );
          setNotice(`${ids.length}개 세션을 종료했습니다.`);
        }}
      />
    </BlockCard>
  );
}

export default function SessionHistoryExample() {
  return <SessionHistory initialSessions={exampleSessions} onRevoke={async () => {}} />;
}
