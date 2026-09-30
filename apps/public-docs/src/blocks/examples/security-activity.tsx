import { useState } from 'react';
import { Badge } from '@opnay/city-ds-react/badge';
import { Button } from '@opnay/city-ds-react/button';
import { EmptyState } from '@opnay/city-ds-react/empty-state';
import { Field } from '@opnay/city-ds-react/field';
import { FilterBar } from '@opnay/city-ds-react/filter-bar';
import { SearchInput } from '@opnay/city-ds-react/search-input';
import { Select } from '@opnay/city-ds-react/select';
import { BlockCard } from './block-card';

export interface SecurityEvent {
  id: string;
  title: string;
  occurredAt: string;
  device: string;
  location: string;
  ipAddress: string;
  outcome: 'success' | 'failure';
}
const outcomes = { all: '모든 결과', success: '성공', failure: '실패' };

export function SecurityActivity({ events }: { events: readonly SecurityEvent[] }) {
  const [query, setQuery] = useState('');
  const [outcome, setOutcome] = useState('all');
  const filtered = events.filter(
    (event) =>
      (outcome === 'all' || event.outcome === outcome) &&
      `${event.title} ${event.device} ${event.location} ${event.ipAddress}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  function reset() {
    setQuery('');
    setOutcome('all');
  }
  return (
    <BlockCard
      title="보안 활동 기록"
      description="로그인과 인증 수단 변경 내역을 확인하십시오."
      className="city-block-members"
    >
      <FilterBar
        aria-label="보안 활동 필터"
        className="city-block-result-filters"
        actions={
          <>
            <p role="status" className="city-block-status">
              활동 {filtered.length}건
            </p>
            <Button variant="outline" disabled={!query && outcome === 'all'} onClick={reset}>
              초기화
            </Button>
          </>
        }
      >
        <Field.Root>
          <Field.Label className="sr-only">보안 활동 검색</Field.Label>
          <SearchInput.Root value={query} onValueChange={setQuery}>
            <SearchInput.Group>
              <SearchInput.Input placeholder="활동 또는 기기 검색" />
              <SearchInput.Clear />
            </SearchInput.Group>
          </SearchInput.Root>
        </Field.Root>
        <Select.Root
          items={outcomes}
          value={outcome}
          onValueChange={(value) => setOutcome(value ?? 'all')}
        >
          <Select.Label className="sr-only">활동 결과</Select.Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner>
              <Select.Popup>
                <Select.List aria-label="활동 결과">
                  {Object.entries(outcomes).map(([value, label]) => (
                    <Select.Item key={value} value={value}>
                      <Select.ItemText>{label}</Select.ItemText>
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.List>
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
      </FilterBar>
      {!filtered.length ? (
        <EmptyState.Root>
          <EmptyState.Title level={4}>
            {events.length ? '일치하는 보안 활동이 없습니다.' : '아직 보안 활동 기록이 없습니다.'}
          </EmptyState.Title>
          <EmptyState.Description>
            {events.length
              ? '검색어 또는 결과 조건을 조정하십시오.'
              : '계정에서 보안 관련 작업을 하면 여기에 표시됩니다.'}
          </EmptyState.Description>
          {events.length > 0 && (
            <Button variant="outline" onClick={reset}>
              필터 초기화
            </Button>
          )}
        </EmptyState.Root>
      ) : (
        <ul className="city-block-list">
          {filtered.map((event) => (
            <li key={event.id} className="city-block-section">
              <div className="city-block-split">
                <div className="city-block-label-row">
                  <strong>{event.title}</strong>
                  <Badge
                    appearance="subtle"
                    tone={event.outcome === 'failure' ? 'destructive' : 'neutral'}
                  >
                    {outcomes[event.outcome]}
                  </Badge>
                </div>
                <time className="city-block-status" dateTime={event.occurredAt}>
                  {new Date(event.occurredAt).toLocaleString('ko-KR', {
                    timeZone: 'Asia/Seoul',
                  })}{' '}
                  KST
                </time>
              </div>
              <p className="city-block-status break-words">
                {event.device} · {event.location} · {event.ipAddress}
              </p>
            </li>
          ))}
        </ul>
      )}
    </BlockCard>
  );
}

export const exampleSecurityEvents: readonly SecurityEvent[] = [
  {
    id: '3',
    title: '비밀번호 변경',
    occurredAt: '2026-09-08T01:30:00Z',
    device: 'Chrome · macOS',
    location: '대한민국 서울',
    ipAddress: '192.0.2.10',
    outcome: 'success',
  },
  {
    id: '2',
    title: '로그인 시도',
    occurredAt: '2026-09-08T01:25:00Z',
    device: 'Safari · iPhone',
    location: '대한민국 서울',
    ipAddress: '192.0.2.20',
    outcome: 'failure',
  },
  {
    id: '1',
    title: '인증 앱 등록',
    occurredAt: '2026-09-07T08:00:00Z',
    device: 'Chrome · macOS',
    location: '대한민국 서울',
    ipAddress: '192.0.2.10',
    outcome: 'success',
  },
];
export default function SecurityActivityExample() {
  return <SecurityActivity events={exampleSecurityEvents} />;
}
