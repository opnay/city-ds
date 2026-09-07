import { useState } from 'react';
import { Button } from '@opnay/city-ds-react/button';
import { DataTableRegion } from '@opnay/city-ds-react/data-table-region';
import { EmptyState } from '@opnay/city-ds-react/empty-state';
import { FilterBar } from '@opnay/city-ds-react/filter-bar';
import { SearchInput } from '@opnay/city-ds-react/search-input';
import { Select } from '@opnay/city-ds-react/select';
import { Table } from '@opnay/city-ds-react/table';
import './blocks.css';

const members = [
  { name: '김서연', email: 'seoyeon@example.com', role: '관리자', status: 'active' },
  { name: '이도윤', email: 'doyun@example.com', role: '편집자', status: 'active' },
  { name: '박지우', email: 'jiwoo@example.com', role: '뷰어', status: 'invited' },
];
const statuses = { all: '모든 상태', active: '활성', invited: '초대 중' };

export default function MemberDirectory() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const filtered = members.filter(
    (member) =>
      (status === 'all' || member.status === status) &&
      `${member.name} ${member.email}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const reset = () => {
    setQuery('');
    setStatus('all');
  };

  return (
    <section aria-label="팀원 관리" className="city-block-section">
      <div>
        <h3 className="city-block-title">팀원</h3>
        <p className="city-block-description">함께 일하는 팀원과 참여 상태를 확인합니다.</p>
      </div>
      <FilterBar
        aria-label="팀원 필터"
        appearance="band"
        actions={
          <Button type="button" variant="outline" onClick={reset}>
            초기화
          </Button>
        }
      >
        <SearchInput.Root value={query} onValueChange={setQuery}>
          <SearchInput.Group>
            <SearchInput.Input aria-label="팀원 검색" placeholder="이름 또는 이메일 검색" />
            <SearchInput.Clear aria-label="검색어 지우기" />
          </SearchInput.Group>
        </SearchInput.Root>
        <Select.Root
          items={statuses}
          value={status}
          onValueChange={(value) => setStatus(value ?? 'all')}
        >
          <Select.Label className="city-block-sr-only">팀원 상태</Select.Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner>
              <Select.Popup>
                <Select.List aria-label="팀원 상태">
                  {Object.entries(statuses).map(([value, label]) => (
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
      <p role="status" className="city-block-status">
        팀원 {filtered.length}명
      </p>
      {filtered.length ? (
        <DataTableRegion label="팀원 목록" appearance="outline">
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head>이름</Table.Head>
                <Table.Head>이메일</Table.Head>
                <Table.Head>역할</Table.Head>
                <Table.Head>상태</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filtered.map((member) => (
                <Table.Row key={member.email}>
                  <Table.Cell>{member.name}</Table.Cell>
                  <Table.Cell>{member.email}</Table.Cell>
                  <Table.Cell>{member.role}</Table.Cell>
                  <Table.Cell>{member.status === 'active' ? '활성' : '초대 중'}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </DataTableRegion>
      ) : (
        <EmptyState.Root>
          <EmptyState.Title>일치하는 팀원이 없습니다</EmptyState.Title>
          <EmptyState.Description>검색어나 상태 필터를 변경하십시오.</EmptyState.Description>
          <EmptyState.Actions>
            <Button type="button" variant="outline" onClick={reset}>
              필터 초기화
            </Button>
          </EmptyState.Actions>
        </EmptyState.Root>
      )}
    </section>
  );
}
